import { useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext"
import * as recipesService from "../../services/recipesService";
import * as userService from "../../services/userService";
import RecipeCard from "../RecipeCard/RecipeCard";
import FallbackImage from "../common/FallbackImage/FallbackImage";
import { capitalizatorUtil } from "../utils/capitalizatorUtil";
import styles from './UserProfile.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBowlRice, faEnvelope } from "@fortawesome/free-solid-svg-icons";

export default function UserProfile() {
    const { username } = useParams();
    const { isAuthenticated } = useAuthContext();
    const { recipes } = recipesService.getRecipesFromUser(username as string);
    const { user } = userService.getUser(username as string);

    return (
        <section className={styles["user-section"]}>
            <section className={styles["cards-section"]}>
                {
                    recipes && recipes.length > 0
                        ? recipes.map(recipe => {
                            recipe.recipeName = capitalizatorUtil(recipe.recipeName);
                            return (
                                <RecipeCard
                                    key={recipe.imageURL + recipe.recipeName}
                                    {...recipe}
                                    animate
                                />
                            );
                        })
                        : <h4 className={styles['cards-heading']}>Потребителят не е добавил рецепти.</h4>
                }
            </section>
            <section className={styles["user-section-profile"]}>
                <article className={styles["user-profile-article"]}>
                    <header className={styles["user-profile-header"]}>
                        <FallbackImage src={user?.coverPhotoURL || null} alt="/images/user-profile-header.jpeg" />
                    </header>
                    <div className={styles["user-profile-avatar-container"]}>
                        <FallbackImage src={user?.avatarURL || null} alt="/images/avatar.png" />
                    </div>
                    <main className={styles["user-profile-article-info"]}>
                        <h3 className={styles["username-header"]}>{user?.username}</h3>
                        <p>
                            <FontAwesomeIcon icon={faBowlRice} />
                            {user?.createdRecipesCount} рецепти
                        </p>
                        <p>
                            {
                                isAuthenticated
                                    ? <a href={`mailto:${user?.email}`}>
                                        <FontAwesomeIcon icon={faEnvelope} />
                                        {user?.email}
                                    </a>
                                    : <>
                                        <FontAwesomeIcon icon={faEnvelope} />
                                        (видим за потребители)
                                    </>
                            }
                        </p>
                    </main>
                </article>
            </section>
        </section>
    )
}