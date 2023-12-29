import { InfiniteData } from "react-query"

export type RecipeSummary = {
    imageURL: string,
    recipeName: string,
    category?: string,
}

export type ResponsePages = {
    pages: RecipeSummary[],
    pageData: {
        prevPage: number,
        nextPage: number,
        firstPage: boolean,
        lastPage: boolean
    }
}

export type RecipesPlaceholderData = InfiniteData<ResponsePages>

export type LoginData = {
    username: string,
    password: string,
}

export type RegistrationData = {
    username: string,
    password: string,
    email: string,
    repeatPassword: string,
}

export type User = {
    id: number,
    username: string,
    avatarURL: string,
    coverPhotoURL: string | null,
    email: string,
    sessionToken: string,
    refreshToken: string,
    isAdministrator: boolean,
    isModerator: boolean,
    avatar: string,
}

export type VerificationCodeResponse = {
    email: string,
    username: string,
    code: string,
}

export type ResetPasswordParams = {
    id: string,
    password: string,
}

export type RecipeDetails = {
    recipeName: string,
    products: string[],
    steps: string[],
    imageURL: string,
    category: string,
    difficulty: 'MEDIUM' | 'HARD' | 'EASY'
    preparationTime: number,
    calories: number,
    protein: number,
    owner: {
        username: string,
        id: string,
    }
}

export type UserProfileData = {
    username: string,
    avatarURL: string,
    coverPhotoURL: string,
    email: string,
    createdRecipesCount: number,
}