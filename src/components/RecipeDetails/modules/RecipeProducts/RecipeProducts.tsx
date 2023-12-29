import { faBoltLightning, faClock, faDumbbell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './RecipeProducts.module.scss';

export type RecipeProductsProps = {
    preparationTime?: number,
    calories?: number,
    protein?: number,
    products?: string[],
}

export default function RecipeProducts({ preparationTime, calories, protein, products }: RecipeProductsProps) {
    return (
        <article className={styles.products}>
            <ul className={styles.ul}>
                <li className={styles.list}>
                    <FontAwesomeIcon color="#57595f" icon={faClock} className={styles.icon} />
                    {preparationTime} минути
                </li>
                <li className={styles.list}>
                    <FontAwesomeIcon color="#57595f" icon={faBoltLightning} className={styles.icon} />
                    {calories || 1200} калории
                </li>
                <li className={styles.list}>
                    <FontAwesomeIcon color="#57595f" icon={faDumbbell} className={styles.icon} />
                    {protein || 180} гр. протеин
                </li>
            </ul>
            <h3>Продукти</h3>
            <ul className={styles.ul}>
                {
                    products && products.map(product => {
                        return (
                            <label key={product}>
                                <input
                                    style={{ marginTop: 2 }}
                                    type="checkbox"
                                />
                                <span></span>
                                {product}
                            </label>
                        )
                    })
                }
            </ul>
        </article>
    );
}