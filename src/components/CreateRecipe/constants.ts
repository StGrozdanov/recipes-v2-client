import { CreateRecipeProps } from "./types";

export const initialValues: CreateRecipeProps = {
    recipeName: "",
    products: "",
    steps: "",
    imageURL: "",
    category: "",
    difficulty: "",
    preparationTime: null,
    calories: null,
    protein: null,
    owner: {
        username: "",
        id: 0
    }
}