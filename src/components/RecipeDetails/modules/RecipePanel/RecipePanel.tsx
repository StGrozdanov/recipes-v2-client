import RecipeProducts, { RecipeProductsProps } from "../RecipeProducts/RecipeProducts";
import { useLocation } from "react-router-dom";
import RecipeComments from "../RecipeComments/RecipeComments";

export default function RecipePanel({ calories, preparationTime, products, protein }: RecipeProductsProps) {
    const location = useLocation();
    const currentSection = location.pathname.split('/')[3] == undefined ? '/' : location.pathname.split('/')[3];

    return (
        <>
            {
                currentSection == '/'
                    ? <RecipeProducts
                        calories={calories}
                        preparationTime={preparationTime}
                        products={products}
                        protein={protein}
                    />
                    : <RecipeComments />
            }
        </>
    );
}