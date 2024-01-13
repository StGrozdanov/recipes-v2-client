/* eslint react-func/max-lines-per-function:0 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useAuthContext } from "../../hooks/useAuthContext";
import { validationSchemas } from "../../configs/yupConfig";
import { RecipeDetails } from "../../services/types";
import { useQueryClient } from "react-query";
import { CreateRecipeProps } from "../CreateRecipe/types";
import { useRecipesService } from "../../services/recipesService";
import { useMobilePushNotification } from "../../services/mobilePushNotificationService";
import { NotificationActions } from "../../constants/notificationActions";
import { useNotificationsWebsocket } from "../../hooks/useNotificationsWebsocket";

/**
 * Extracted all of the upload image, submit form and handle errors and states in this hook because the main
 * component got too fat of a component.
 * @returns everything that the edit recipe component needs
 */
export function useEditRecipe(initialRecipe: RecipeDetails) {
    const { token, username, userId, avatar } = useAuthContext();
    const { useEditRecipeRequest, useUploadRecipeImage } = useRecipesService();
    const { edit, isLoading, isError } = useEditRecipeRequest();
    const { uploadImage } = useUploadRecipeImage();
    const navigate = useNavigate();
    const [uploadImageError, setUploadImageError] = useState(false);
    const queryClient = useQueryClient();
    const { useCreatePushNotification } = useMobilePushNotification();
    const { createPushNotification } = useCreatePushNotification();
    const { sendJsonMessage } = useNotificationsWebsocket();

    const createMobilePushNotificationHandler = async () => {
        const { pushNotificationResponse } = await createPushNotification({
            subject: NotificationActions.NEW_RECIPE,
            content: `${username} ${NotificationActions.EDITED_RECIPE}`,
        });
        await pushNotificationResponse;
    }

    const submitHandler = async (values: CreateRecipeProps) => {
        try {
            const recipe: RecipeDetails = {
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
            const { recipeEditResponse } = await edit(recipe, initialRecipe.recipeName);
            const editedRecipe = await recipeEditResponse;

            navigate(`/details/${editedRecipe?.recipeName}`);

            await Promise.all([
                queryClient.invalidateQueries(['recipe', editedRecipe?.recipeName.toLowerCase()]),
                queryClient.invalidateQueries(['recipes']),
                queryClient.invalidateQueries(['favouriteRecipes', username]),
                queryClient.invalidateQueries(['recipesByUser', username]),
            ]);
            await Promise.all([
                createMobilePushNotificationHandler(),
                sendJsonMessage({
                    action: 'EDITED_RECIPE',
                    locationName: recipe ? recipe.recipeName : '',
                    senderAvatar: avatar,
                    senderId: userId,
                    senderUsername: username,
                })
            ]);
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

    const initialData: CreateRecipeProps = {
        recipeName: initialRecipe.recipeName,
        products: initialRecipe.products.join(',').replaceAll(',', '\n'),
        steps: initialRecipe.steps.join(',').replaceAll(',', '\n'),
        imageURL: initialRecipe.imageURL,
        category: initialRecipe.category,
        difficulty: initialRecipe.difficulty,
        preparationTime: initialRecipe.preparationTime,
        calories: initialRecipe.calories === 0 ? null : initialRecipe.calories,
        protein: initialRecipe.protein === 0 ? null : initialRecipe.protein,
        owner: {
            username: initialRecipe.owner.username,
            id: initialRecipe.owner.id
        }
    }

    const formik = useFormik({
        initialValues: initialData,
        validationSchema: validationSchemas.recipeValidationSchema(initialRecipe.recipeName),
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
        isError,
        uploadImageError,
        isLoading,
        submitHandler,
        uploadImageHandler,
    };
}
