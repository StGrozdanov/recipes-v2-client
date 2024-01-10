import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useAuthContext } from "../../hooks/useAuthContext";
import { validationSchemas } from "../../configs/yupConfig";
import { initialValues } from "./constants";
import { CreateRecipeProps } from "./types";
import { RecipeDetails } from "../../services/types";
import { useQueryClient } from "react-query";
import { useRecipesService } from "../../services/recipesService";

/**
 * Extracted all of the upload image, submit form and handle errors and states in this hook because the main
 * component got too fat of a component.
 * @returns everything that the create recipe component needs
 */
export function useCreateRecipe() {
    const { token, username, userId, isAdministrator, isModerator } = useAuthContext();
    const { useAddRecipe, useUploadRecipeImage } = useRecipesService();
    const { create, isLoading, isError } = useAddRecipe();
    const { uploadImage } = useUploadRecipeImage();
    const navigate = useNavigate();
    const [isSuccess, setIsSuccess] = useState(false);
    const [uploadImageError, setUploadImageError] = useState(false);
    const queryClient = useQueryClient();

    const submitHandler = async (values: CreateRecipeProps) => {
        try {
            const newRecipe: RecipeDetails = {
                recipeName: values.recipeName.toLowerCase(),
                products: values.products.split('\n').map(content => content.trim()).filter(content => content.trim() !== ''),
                steps: values.steps.split('\n').map(content => content.trim()).filter(content => content.trim() !== ''),
                imageURL: values.imageURL,
                category: values.category,
                difficulty: values.difficulty === '' ? 'MEDIUM' : values.difficulty,
                preparationTime: values.preparationTime ? values.preparationTime : 0,
                calories: values.calories ? values.calories : 0,
                protein: values.protein ? values.protein : 0,
                owner: {
                    username: username,
                    id: userId
                }
            }

            const { recipeCreateResponse } = await create(newRecipe);
            const recipe = await recipeCreateResponse;

            if (!isAdministrator && !isModerator) {
                setIsSuccess(true);
            }

            if (!isAdministrator && !isModerator) {
                setTimeout(() => {
                    navigate(`/details/${recipe?.recipeName}`);
                }, 4000)
            } else {
                navigate(`/details/${recipe?.recipeName}`);
            }

            await queryClient.invalidateQueries(['recipes']);

        } catch (err) {
            console.error(err);
        }

        formik.setTouched({
            recipeName: false,
            products: false,
            steps: false,
            imageURL: false,
            category: false,
            difficulty: false,
            preparationTime: false,
            calories: false,
            protein: false,
        });
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchemas.recipeValidationSchema,
        onSubmit: submitHandler,
    });

    const uploadImageHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setUploadImageError(false);
        const element = e.target;

        if (element.files) {
            const file = element.files[0];
            const recipeKey = formik.values.recipeName.split(' ').join('-')
            const fileName = `recipe-image-${recipeKey}`
            const formData = new FormData();
            formData.append(fileName, file);
            formData.append("recipeName", recipeKey);

            try {
                const { uploadResponse, error } = await uploadImage({ formData, token });
                if (error) {
                    setUploadImageError(true);
                }

                const imageURL = uploadResponse?.imageURL;
                formik.setFieldValue('imageURL', imageURL);
            } catch (err) {
                console.error(err);
            }
        }
    }

    return {
        formik,
        isSuccess,
        isError,
        uploadImageError,
        isLoading,
        submitHandler,
        uploadImageHandler,
    };
}
