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
    avatarURL: string | null,
    coverPhotoURL: string | null,
    email: string,
    sessionToken: string,
    refreshToken: string,
    isAdministrator: boolean,
    isModerator: boolean,
}