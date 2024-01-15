import { faBookOpen, faBowlRice, faCalculator, faClock, faEgg, faExclamationTriangle, faShoePrints } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from './EditRecipe.module.scss';
import FailedValidationMessage from "../Authentication/FailedValidationMessage";
import Notification from "../common/Notification/Notification";
import { useParams } from "react-router-dom";
import { useEditRecipe } from "./useEditRecipe";
import { useRecipesService } from "../../services/recipesService";

export default function EditRecipe() {
    const { name } = useParams();
    const { getASingleRecipe } = useRecipesService();
    const { recipe } = getASingleRecipe(name as string);
    const { formik, isError, isLoading, uploadImageError, uploadImageHandler } = useEditRecipe(recipe!)
    return (
        <>
            <section className={styles.create}>
                <form
                    autoComplete="off"
                    style={{ position: "relative" }}
                    onSubmit={formik.handleSubmit}
                >
                    <fieldset>
                        <legend>Промяна рецепта</legend>
                        <div className={styles['input-container']} style={{ marginTop: 50 }}>
                            <FontAwesomeIcon className={styles.icon} icon={faBowlRice} />
                            <input
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.recipeName}
                                style={formik.touched.recipeName && formik.errors.recipeName ? { borderBottomColor: 'red' } : {}}
                                type="text"
                                name="recipeName"
                                placeholder="Име на рецепта"
                                autoComplete="off"
                            />
                            {
                                formik.touched.recipeName && formik.errors.recipeName
                                    ? <FailedValidationMessage message={formik.errors.recipeName} />
                                    : null
                            }
                        </div>
                        <div className={styles['input-container']}>
                            <FontAwesomeIcon className={styles.icon} icon={faClock} />
                            <input
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.preparationTime || ''}
                                style={formik.touched.preparationTime && formik.errors.preparationTime ? { borderBottomColor: 'red' } : {}}
                                type="number"
                                name="preparationTime"
                                placeholder="Време за приготвяне в минути"
                                autoComplete="off"
                            />
                            {
                                formik.touched.preparationTime && formik.errors.preparationTime
                                    ? <FailedValidationMessage message={formik.errors.preparationTime} />
                                    : null
                            }
                        </div>
                        <div className={styles['input-container']}>
                            <FontAwesomeIcon className={styles.icon} icon={faCalculator} />
                            <input
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.calories || ''}
                                style={formik.touched.calories && formik.errors.calories ? { borderBottomColor: 'red' } : {}}
                                type="number"
                                name="calories"
                                placeholder="Брой калории"
                                autoComplete="off"
                            />
                            {
                                formik.touched.calories && formik.errors.calories
                                    ? <FailedValidationMessage message={formik.errors.calories} />
                                    : null
                            }
                        </div>
                        <div className={styles['input-container']}>
                            <FontAwesomeIcon className={styles.icon} icon={faEgg} />
                            <input
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.protein || ''}
                                style={formik.touched.protein && formik.errors.protein ? { borderBottomColor: 'red' } : {}}
                                type="number"
                                name="protein"
                                placeholder="Брой протеини"
                                autoComplete="off"
                            />
                            {
                                formik.touched.protein && formik.errors.protein
                                    ? <FailedValidationMessage message={formik.errors.protein} />
                                    : null
                            }
                        </div>
                        <div className={styles['input-container']}>
                            <FontAwesomeIcon className={styles['area-icon']} icon={faBookOpen} />
                            <textarea
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.products}
                                style={formik.touched.products && formik.errors.products ? { borderBottomColor: 'red' } : {}}
                                name="products"
                                placeholder="Продукти и грамаж, всеки на нов ред"
                                autoComplete="off"
                            />
                            {
                                formik.touched.products && formik.errors.products
                                    ? <>
                                        <FontAwesomeIcon icon={faExclamationTriangle} className={styles['fail-icon']} />
                                        <span className={styles['fail-validation-msg']}>{formik.errors.products}</span>
                                    </>
                                    : null
                            }
                        </div>
                        <div className={styles['input-container']} style={{ marginTop: 20 }}>
                            <FontAwesomeIcon className={styles['area-icon']} icon={faShoePrints} />
                            <textarea
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.steps}
                                style={formik.touched.steps && formik.errors.steps ? { borderBottomColor: 'red' } : {}}
                                name="steps"
                                placeholder="Стъпки за приготвяне, всяка на нов ред"
                                autoComplete="off"
                            />
                            {
                                formik.touched.steps && formik.errors.steps
                                    ? <>
                                        <FontAwesomeIcon icon={faExclamationTriangle} className={styles['fail-icon']} />
                                        <span className={styles['fail-validation-msg']}>{formik.errors.steps}</span>
                                    </>
                                    : null
                            }
                        </div>
                        <div className={styles['image-upload-container']}>
                            <input
                                id={`recipe-image-${formik.values.recipeName || Date.now()}`}
                                onChange={uploadImageHandler}
                                onBlur={formik.handleBlur}
                                value={undefined}
                                type="file"
                                name="imageURL"
                                className={styles["custom-file-input"]}
                            />
                            {
                                formik.touched.imageURL && formik.errors.imageURL
                                    ? <span className={styles['fail-validation-image-msg']}>{formik.errors.imageURL}</span>
                                    : null
                            }
                        </div>
                        <div className={styles['input-container']} style={{ marginBottom: 20 }}>
                            <select
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.category}
                                style={formik.touched.category && formik.errors.category ? { borderBottomColor: 'red' } : {}}
                                id="type"
                                name="category"
                                className={styles.select}
                            >
                                <option value="" selected hidden>Изберете категория...</option>
                                <option value="Пилешко">Пилешко</option>
                                <option value="Свинско">Свинско</option>
                                <option value="Телешко">Телешко</option>
                                <option value="Телешко-свинско">Телешко-свинско</option>
                                <option value="Други месни">Други месни</option>
                                <option value="Вегитариански">Вегитариански</option>
                                <option value="Риба">Риба</option>
                                <option value="Салати">Салати</option>
                                <option value="Тестени">Тестени</option>
                                <option value="Десерти">Десерти</option>
                                <option value="Други">Други</option>
                            </select>
                            {
                                formik.touched.category && formik.errors.category
                                    ? <>
                                        <FontAwesomeIcon icon={faExclamationTriangle} className={styles['fail-icon']} />
                                        <span className={styles['fail-validation-msg']}>{formik.errors.category}</span>
                                    </>
                                    : null
                            }
                        </div>
                        <div className={styles['input-container']} style={{ marginBottom: 20 }}>
                            <select
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.difficulty}
                                style={formik.touched.difficulty && formik.errors.difficulty ? { borderBottomColor: 'red' } : {}}
                                id="type"
                                name="difficulty"
                                className={styles.select}
                            >
                                <option value="" selected hidden>Изберете трудност...</option>
                                <option value="EASY">Лесна</option>
                                <option value="MEDIUM">Средна</option>
                                <option value="HARD">За напреднали</option>
                            </select>
                            {
                                formik.touched.difficulty && formik.errors.difficulty
                                    ? <>
                                        <FontAwesomeIcon icon={faExclamationTriangle} className={styles['fail-icon']} />
                                        <span className={styles['fail-validation-msg']}>{formik.errors.difficulty}</span>
                                    </>
                                    : null
                            }
                        </div>
                        <input
                            className={styles.button}
                            type="submit"
                            value="Редактирай"
                            onSubmit={formik.handleReset}
                            disabled={isLoading}
                            style={isLoading ? { marginTop: 5, backgroundColor: 'gray' } : { marginTop: 5 }}
                        />
                    </fieldset>
                </form>
            </section >
            <Notification
                type={'fail'}
                isVisible={isError}
                message={'Нещо се обърка при редактирането на рецептата. Моля опитайте по-късно.'}
            />
            <Notification
                type={'fail'}
                isVisible={uploadImageError}
                message={'Не успяхме да прикачим картинката, моля опитайте отново.'}
            />
        </>
    );
}