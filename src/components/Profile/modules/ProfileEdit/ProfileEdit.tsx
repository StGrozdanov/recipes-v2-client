import { useAuthContext } from '../../../../hooks/useAuthContext';
import FallbackImage from '../../../common/FallbackImage/FallbackImage';
import * as userService from '../../../../services/userService';
import * as authService from '../../../../services/authService';
import styles from './ProfileEdit.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBowlRice, faEnvelope, faExclamationTriangle, faGears, faKey, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { useQueryClient } from 'react-query';
import LoadingPan from '../../../common/LoadingPan/LoadingPan';
import { useFormik } from 'formik';
import { validationSchemas } from '../../../../configs/yupConfig';
import { useModalContext } from '../../../../hooks/useModalContext';
import { useSendEmail } from '../../../Authentication/hooks/useSendEmail';
import { useState } from 'react';
import Notification from '../../../common/Notification/Notification';

export type ProfileData = {
    username: string,
    email: string,
}

export default function ProfileEdit() {
    const { token, username, updateUserData, email } = useAuthContext();
    const { uploadCover, isLoading: coverIsLoading } = userService.useUploadCoverImage();
    const { uploadAvatar, isLoading: avatarIsLoading } = userService.useUploadAvatarImage();
    const { userIsLoading, user } = userService.getUser(username);
    const { editProfile, isLoading } = userService.useUserDataEdit();
    const { requestVerificationCode } = authService.useRequestVerificationCode();
    const queryClient = useQueryClient();
    const confirmModal = useModalContext();
    const { sendEmailHandler } = useSendEmail();
    const [showErrorNotification, setShowErrorNotification] = useState(false);
    const [showRequestPasswordSuccessNotification, setShowRequestPasswordSuccessNotification] = useState(false);
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [showSettingsNotification, setShowSettingsNotification] = useState(false);

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
                setShowErrorNotification(true);
            }
        }
    }

    const submitHandler = async (values: ProfileData) => {
        try {
            const { editResponse } = await editProfile({ ...values, token, oldUsername: username });

            if (editResponse) {
                updateUserData(editResponse.email, editResponse.username);
            }
            setShowSuccessNotification(true);
        } catch (err) {
            console.error(err);
            setShowErrorNotification(true);
        }

        formik.setTouched({ username: false, email: false });
    }

    const editPasswordHandler = async () => {
        try {
            const { verificationCodeResponse } = await requestVerificationCode(email);
            const data = await verificationCodeResponse;

            if (data) {
                sendEmailHandler(data);
                setShowRequestPasswordSuccessNotification(true);
            }

        } catch (err) {
            console.error(err);
            setShowErrorNotification(true);
        }
    }

    const formik = useFormik({
        initialValues: { username, email: user?.email || '' },
        validationSchema: () => validationSchemas.profileValidationSchema(username, user?.email || ''),
        onSubmit: submitHandler,
    });

    return (
        userIsLoading
            ? <LoadingPan />
            : <>
                <form
                    autoComplete="off"
                    onSubmit={formik.handleSubmit}
                >
                    <article className={styles["user-profile-article"]}>
                        <label htmlFor={`cover-image-${username}`}>
                            <input
                                id={`cover-image-${username}`}
                                type={'file'}
                                style={{ display: 'none' }}
                                onChange={(e) => uploadImageHandler(e, 'cover')}
                                onSubmit={formik.handleReset}
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
                                onSubmit={formik.handleReset}
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
                        <article className={styles["user-profile-article-info"]}>
                            <input
                                className={styles["username-input"]}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.username}
                                style={formik.touched.username && formik.errors.username ? { borderBottomColor: 'red' } : {}}
                                type="text"
                                placeholder={'Потребителско име'}
                                name="username"
                            />
                            {
                                formik.touched.username && formik.errors.username
                                    ? <>
                                        <FontAwesomeIcon icon={faExclamationTriangle} className={styles['warning-icon']} />
                                        <span className={styles['fail-validation-msg']}>{formik.errors.username}</span>
                                    </>
                                    : null
                            }
                            <FontAwesomeIcon
                                className={styles['edit-icon']}
                                icon={faKey}
                                onClick={() => {
                                    confirmModal({ title: 'Сигурни ли сте, че искате да промените паролата си?' })
                                        .then(() => {
                                            editPasswordHandler();
                                        })
                                        .catch(() => console.info('action canceled.'))
                                }}
                            />
                            <FontAwesomeIcon
                                className={styles['settings-icon']}
                                icon={faGears}
                                onClick={() => setShowSettingsNotification(true)}
                            />
                            <p>
                                <FontAwesomeIcon icon={faBowlRice} />
                                {user?.createdRecipesCount} рецепти
                            </p>
                            <p style={{ position: 'relative' }}>
                                <FontAwesomeIcon icon={faEnvelope} />
                                <input
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                    style={formik.touched.email && formik.errors.email ? { borderBottomColor: 'red' } : {}}
                                    type="text"
                                    placeholder={'Имейл'}
                                    name="email"
                                />
                                {
                                    formik.touched.email && formik.errors.email
                                        ? <>
                                            <FontAwesomeIcon icon={faExclamationTriangle} className={styles['warning-icon-email']} />
                                            <span className={styles['fail-validation-msg-email']}>{formik.errors.email}</span>
                                        </>
                                        : null
                                }
                            </p>
                        </article>
                    </article>
                    <div className={styles['button-container']}>
                        <FontAwesomeIcon className={styles['continue-icon']} icon={faRightToBracket} />
                        <input
                            style={isLoading ? { marginTop: 5, backgroundColor: 'gray' } : { marginTop: 5 }}
                            className={styles['submit-btn']}
                            type="submit"
                            value="Редактирай Данните"
                            onSubmit={formik.handleReset}
                            disabled={isLoading}
                        />
                    </div>
                </form>
                <Notification
                    type={'fail'}
                    isVisible={showErrorNotification}
                    message={'Нещо се обърка. Моля опитайте по-късно.'}
                />
                <Notification
                    type={'success'}
                    isVisible={showRequestPasswordSuccessNotification}
                    message={'Успешно заявихте промяна на паролата си. Очаквайте имейл с последващи инструкции'}
                />
                <Notification
                    type={'success'}
                    isVisible={showSuccessNotification}
                    message={'Успешно редактирахте данните си.'}
                />
                <Notification
                    type={'info'}
                    isVisible={showSettingsNotification}
                    message={'Потребителските настройки са в процес на разработка.'}
                />
            </>
    );
}