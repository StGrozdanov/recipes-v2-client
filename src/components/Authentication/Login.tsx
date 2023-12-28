import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket, faUser, faKey, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import style from './Authenticate.module.scss';
import { useFormik } from 'formik';
import * as authService from '../../services/authService';
import { LoginData } from '../../services/types';
import { validationSchemas } from '../../configs/yupConfig';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useInputModalContext } from '../../hooks/useInputModalContext';
import { useSendEmail } from './hooks/useSendEmail';
import Notification from '../common/Notification/Notification';
import { useState } from 'react';

const initialLoginValues: LoginData = {
    username: '',
    password: '',
}

export default function Login() {
    const { userLogin } = useAuthContext();
    const navigate = useNavigate();
    const { login, isLoading } = authService.useLogin();
    const inputModal = useInputModalContext();
    const { sendEmailHandler } = useSendEmail();
    const { requestVerificationCode } = authService.useRequestVerificationCode();
    const [verificationEmailError, setVerificationEmailError] = useState(false);
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [authError, setAuthError] = useState(false);

    const updateEmailHandler = async (emailInput: string) => {
        verificationEmailError && setVerificationEmailError(false);

        try {
            const { verificationCodeResponse } = await requestVerificationCode(emailInput);
            const data = await verificationCodeResponse;

            if (data) {
                sendEmailHandler(data);
                setShowSuccessNotification(true);
            }

        } catch (err) {
            setVerificationEmailError(true);
            console.error(err);
        }
    }

    const submitHandler = async (values: LoginData) => {
        try {
            const { loginResponse } = await login(values);
            const user = await loginResponse;

            if (user) {
                userLogin(user);
                navigate('/catalogue');
            }
        } catch (err) {
            setAuthError(true);
        }

        formik.setTouched({ username: false, password: false });
    }

    const formik = useFormik({
        initialValues: initialLoginValues,
        validationSchema: validationSchemas.loginValidationSchema,
        onSubmit: submitHandler,
    });

    return (
        <>
            <div className={style.background}>
                <article className={style.container}>
                    <header className={style['form-header']}><h2>Вход</h2></header>
                    {
                        authError && !formik.touched.username && !formik.touched.password
                            ? <>
                                <FontAwesomeIcon
                                    icon={faExclamationTriangle}
                                    className={style['login-warning-icon']}
                                />
                                <h4 className={style['form-validation-msg']}>Невалидно потребителско име или парола</h4>
                            </>
                            : isLoading
                                ? <h4 className={style['form-validation-msg']}>Обработваме заявката ви...</h4>
                                : null
                    }
                    <form className={style.form} autoComplete="off" onSubmit={formik.handleSubmit}>
                        <div className={style['input-container']}>
                            <FontAwesomeIcon className={style.icon} icon={faUser} />
                            <input
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.username}
                                style={formik.touched.username && formik.errors.username ? { borderBottomColor: 'red' } : {}}
                                type="text"
                                placeholder={'Потребителско име'}
                                name='username'
                                id='username'
                            />
                        </div>
                        <div className={style['input-container']}>
                            <FontAwesomeIcon className={style.icon} icon={faKey} />
                            <input
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                                style={formik.touched.password && formik.errors.password ? { borderBottomColor: 'red' } : {}}
                                type="password"
                                placeholder={'Парола'}
                                name='password'
                                id='password'
                            />
                        </div>
                        <div className={style['button-container']}>
                            <FontAwesomeIcon className={style['continue-icon']} icon={faRightToBracket} />
                            <input
                                style={isLoading ? { marginTop: 5, backgroundColor: 'gray' } : { marginTop: 5 }}
                                className={style['submit-btn']}
                                type="submit"
                                value="Продължи"
                                onSubmit={formik.handleReset}
                                disabled={isLoading}
                            />
                        </div>
                    </form>
                    <Link
                        to={'#'}
                        className={style['forgotten-password']}
                        onClick={() => {
                            inputModal({
                                title: 'Забравена парола',
                                updateStateHandler: updateEmailHandler as (...args: any[]) => void,
                            })
                                .then(() => console.info('confirmed'))
                                .catch(() => console.info('canceled'))
                        }}
                    >
                        Забравена парола
                    </Link>
                    <footer className={style['form-footer']}>
                        <Link to={'/register'}>
                            Все още нямате акаунт? Кликнете тук.
                        </Link>
                    </footer>
                </article>
            </div >
            <Notification
                type={'fail'}
                isVisible={verificationEmailError}
                message={'Въведохте несъществуващ имейл адрес.'}
            />
            <Notification
                type={'success'}
                isVisible={showSuccessNotification}
                message={'Успешно заявихте промяна на паролата си. Очаквайте имейл с последващи инструкции'}
            />
        </>
    )
}
