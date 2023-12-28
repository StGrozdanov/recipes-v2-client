import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRepeat, faKey, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import style from './Authenticate.module.scss';
import FailedValidationMessage from './FailedValidationMessage';
import * as authService from '../../services/authService';
import { useFormik } from 'formik';
import { validationSchemas } from '../../configs/yupConfig';
import Notification from '../common/Notification/Notification';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const initialResetPasswordValues = {
    password: '',
    repeatPassword: '',
}

export default function PasswordReset() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { requestVerificationCode } = authService.useVerifyResetPasswordCode();
    const { resetPassword } = authService.useResetPassword();
    const [codeIsValid, setCodeIsValid] = useState(true);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const verify = async () => {
            try {
                const { verificationCodeResponse } = await requestVerificationCode(id as string);
                const isValid = await verificationCodeResponse;
                if (!isValid) {
                    setCodeIsValid(false);
                    setTimeout(() => {
                        navigate('/login');
                    }, 2500);
                }
            } catch (err) {
                setCodeIsValid(false);
                console.error(err);
                setTimeout(() => {
                    navigate('/login');
                }, 2500);
            }
        }
        verify();
    }, [])

    const submitHandler = async (values: typeof initialResetPasswordValues) => {
        try {
            const { resetPasswordResponse } = await resetPassword({ password: values.password, id: id as string });
            const isSuccessfull = await resetPasswordResponse;

            if (isSuccessfull) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/login');
                }, 2500);
            }
        } catch (err) {
            setCodeIsValid(false);
            console.error(err);
            setTimeout(() => {
                navigate('/login');
            }, 2500);
        }

        formik.setTouched({ password: false, repeatPassword: false });
    }

    const formik = useFormik({
        initialValues: initialResetPasswordValues,
        validationSchema: validationSchemas.resetPasswordValidationSchema,
        onSubmit: submitHandler,
    });

    return (
        <>
            <div className={style.background}>
                <article className={style.container}>
                    <header className={style['form-header']}><h2>Промяна на парола</h2></header>
                    {
                        formik.isSubmitting
                            ? <h4 className={style['form-validation-msg']}>Обработваме заявката ви...</h4>
                            : null
                    }
                    <form
                        className={style.form}
                        autoComplete="off"
                        onSubmit={formik.handleSubmit}
                    >
                        <div className={style['input-container']}>
                            <FontAwesomeIcon className={style.icon} icon={faKey} />
                            <input
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                                style={formik.touched.password && formik.errors.password ? { borderBottomColor: 'red' } : {}}
                                type="password"
                                placeholder={'Парола'}
                                name="password"
                            />
                            {
                                formik.touched.password && formik.errors.password
                                    ? <FailedValidationMessage message={formik.errors.password} />
                                    : null
                            }
                        </div>
                        <div className={style['input-container']}>
                            <FontAwesomeIcon className={style.icon} icon={faRepeat} />
                            <input
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.repeatPassword}
                                style={formik.touched.repeatPassword && formik.errors.repeatPassword ? { borderBottomColor: 'red' } : {}}
                                type="password"
                                placeholder={'Повтори паролата'}
                                name="repeatPassword"
                            />
                            {
                                formik.touched.repeatPassword && formik.errors.repeatPassword
                                    ? <FailedValidationMessage message={formik.errors.repeatPassword} />
                                    : null
                            }
                        </div>
                        <div className={style['button-container']}>
                            <FontAwesomeIcon className={style['continue-icon']} icon={faRightToBracket} />
                            <input
                                style={formik.isSubmitting ? { marginTop: 5, backgroundColor: 'gray' } : { marginTop: 5 }}
                                className={style['submit-btn']}
                                type="submit"
                                value="Продължи"
                                onSubmit={formik.handleReset}
                                disabled={formik.isSubmitting}
                            />
                        </div>
                    </form>
                    <footer className={style['form-footer']} />
                </article>
            </div>
            <Notification
                type={'success'}
                isVisible={success}
                message={'Успешно променихте паролата си!'}
            />
            <Notification
                type={'fail'}
                isVisible={!codeIsValid}
                message={'Линкът за промяна на парола е грешен или непълен.'}
            />
        </>
    )
}