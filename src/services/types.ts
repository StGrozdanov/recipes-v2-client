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
