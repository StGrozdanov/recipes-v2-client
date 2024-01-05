export type CreateRecipeProps = {
    recipeName: string,
    products: string,
    steps: string,
    imageURL: string,
    category: string,
    difficulty: 'MEDIUM' | 'HARD' | 'EASY' | '',
    preparationTime: number | null,
    calories: number | null,
    protein: number | null,
    owner: {
        username: string,
        id: number
    }
}