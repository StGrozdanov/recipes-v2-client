import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import FeaturesCard from './modules/FeaturesCard';
import styles from './LandingFeatures.module.scss';
import features from './constants/featureCards';
import { useRef } from 'react';
import { useElementIsInViewport } from '../../../../hooks/useElementIsInViewport';

export default function LandingDescriptionFeatures() {
    const featuresRef = useRef(null);
    const isInViewport = useElementIsInViewport(featuresRef, '-50px');

    return (
        <section className={styles.features}>
            <span ref={featuresRef} />
            <div className={styles['features-image-container']}>
                <img className={styles["features-image"]} src="images/welcome-3.jpg" alt="welcome" />
            </div>
            <FeaturesCard
                {...features.profile}
                icon={faUser}
                position='10%'
                animationDelay={'300ms'}
                animate={isInViewport}
            />
            <FeaturesCard
                {...features.favourites}
                icon={faStar}
                position='30%'
                animationDelay={'600ms'}
                animate={isInViewport}
            />
            <FeaturesCard
                {...features.createdRecipes}
                icon={faBookOpen}
                position='50%'
                animationDelay={'900ms'}
                animate={isInViewport}
            />
            <FeaturesCard
                {...features.comments}
                icon={faCommentDots}
                position='70%'
                animationDelay={'1200ms'}
                animate={isInViewport}
            />
        </section>
    );
}