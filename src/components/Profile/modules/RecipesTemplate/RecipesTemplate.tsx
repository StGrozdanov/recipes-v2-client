import { useEffect, useState } from 'react';
import { RecipeSummary } from '../../../../services/types';
import RecipeCard from '../../../RecipeCard/RecipeCard';
import styles from './RecipesTemplate.module.scss';

type RecipesTemplateProps = {
    heading: string,
    recipes: RecipeSummary[],
}

export default function RecipesTemplate({ heading, recipes }: RecipesTemplateProps) {
    const [recipesData, setRecipesData] = useState(recipes);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (search.trim() !== '') {
            setRecipesData(() => {
                return recipes ? recipes.filter(recipe => recipe.recipeName.includes(search)) : recipes
            });
        } else {
            setRecipesData(recipes);
        }
    }, [recipes, search]);

    return (
        <section className={styles["recipes-section"]}>
            <form>
                <img
                    className={styles['find-img']}
                    src="/images/istockphoto-1068237878-170667a-removebg-preview.png"
                />
                <input
                    type="search"
                    className={styles.input}
                    placeholder="Търсете по име на рецептата..."
                    autoComplete="off"
                    autoFocus
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                />
            </form>
            <h2 className={styles["recipes-heading"]}>{heading}:</h2>
            <ul className={styles["recipe-card-list"]} >
                {
                    recipesData && recipesData.length > 0
                        ? recipesData.map((recipe, index) =>
                            <RecipeCard key={recipe.recipeName + index} {...recipe} />
                        )
                        : search !== ''
                            ? <h4>Все още не сте добавили такива рецепти.</h4>
                            : <h4>Все още не сте добавили {heading}.</h4>
                }
            </ul>
        </section >
    )
}