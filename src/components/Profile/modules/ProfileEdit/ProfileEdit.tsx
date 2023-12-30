import { useAuthContext } from '../../../../hooks/useAuthContext';
import FallbackImage from '../../../common/FallbackImage/FallbackImage';
import * as userService from '../../../../services/userService';
import styles from './ProfileEdit.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBowlRice, faEnvelope, faGears, faKey } from '@fortawesome/free-solid-svg-icons';
import { useQueryClient } from 'react-query';
import LoadingPan from '../../../common/LoadingPan/LoadingPan';

export default function ProfileEdit() {
    const { token, username } = useAuthContext()
    const { uploadCover, isLoading: coverIsLoading } = userService.useUploadCoverImage();
    const { uploadAvatar, isLoading: avatarIsLoading } = userService.useUploadAvatarImage();
    const { user } = userService.getUser(username);
    const queryClient = useQueryClient();

    const uploadImageHandler = async (e: React.ChangeEvent<HTMLInputElement>, uploadType: string) => {
        const element = e.target;

        if (element.files && user) {
            const file = element.files[0];
            const fileName = `${username}-${uploadType}-image`;
            const formData = new FormData();
            formData.append(fileName, file);
            formData.append('username', username);

            try {
                uploadType === 'cover'
                    ? await uploadCover({ formData, token, username })
                    : await uploadAvatar({ formData, token, username });

                await queryClient.invalidateQueries(['user', username]);
            } catch (err) {
                console.error(err);
                // ... show fail notification
            }
        }
    }

    return (
        <article className={styles["user-profile-article"]}>
            <label htmlFor={`cover-image-${username}`}>
                <input
                    id={`cover-image-${username}`}
                    type={'file'}
                    style={{ display: 'none' }}
                    onChange={(e) => uploadImageHandler(e, 'cover')}
                />
                <header className={styles["user-profile-header"]}>
                    {
                        coverIsLoading
                            ? <LoadingPan />
                            : <FallbackImage
                                src={`${user?.coverPhotoURL}?timestamp=${Date.now()}` || null}
                                alt="/images/user-profile-header.jpeg"
                            />
                    }
                </header>
            </label>
            <label htmlFor={`profile-image-${username}`}>
                <input
                    id={`profile-image-${username}`}
                    type={'file'}
                    style={{ display: 'none' }}
                    onChange={(e) => uploadImageHandler(e, 'avatar')}
                />
                <div className={styles["user-profile-avatar-container"]}>
                    {
                        avatarIsLoading
                            ? <LoadingPan />
                            : <FallbackImage
                                src={`${user?.avatarURL}?timestamp=${Date.now()}` || null}
                                alt="/images/avatar.png"
                            />
                    }
                </div>
            </label>
            <main className={styles["user-profile-article-info"]}>
                <input className={styles["username-input"]} defaultValue={username} />
                <FontAwesomeIcon className={styles['edit-icon']} icon={faKey} />
                <FontAwesomeIcon className={styles['settings-icon']} icon={faGears} />
                <p>
                    <FontAwesomeIcon icon={faBowlRice} />
                    {user?.createdRecipesCount} рецепти
                </p>
                <p>
                    <FontAwesomeIcon icon={faEnvelope} />
                    <input defaultValue={user?.email} />
                </p>
            </main>
        </article>
    );
}