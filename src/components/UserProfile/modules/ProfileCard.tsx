import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FallbackImage from '../../common/FallbackImage/FallbackImage';
import styles from './ProfileCard.module.scss';
import { faBowlRice, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { UserProfileData } from '../../../services/types';

type ProfileCardProps = {
    user: UserProfileData | undefined,
    isAuthenticated: boolean,
}

export default function ProfileCard({ isAuthenticated, user }: ProfileCardProps) {
    return (
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
    )
}