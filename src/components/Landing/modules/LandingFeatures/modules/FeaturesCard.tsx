import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './FeaturesCard.module.scss';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

type FeaturesCardProps = {
    heading: string,
    text: string,
    icon: IconProp,
    position: string,
    animationDelay: string,
    animate: boolean,
}

export default function FeaturesCard({
    heading,
    text,
    icon,
    position,
    animationDelay,
    animate,
}: FeaturesCardProps) {
    return (
        animate ?
            <div className={styles.outter} style={{ left: position, animationDelay: animationDelay }}>
                <article className={styles.content}>
                    <FontAwesomeIcon className={styles.icon} icon={icon} />
                    <h5 className={styles['text-heading']}>{heading}</h5>
                    <p className={styles.text}>{text}</p>
                </article>
                <div className={styles.inner}></div>
            </div>
            : null
    )
}