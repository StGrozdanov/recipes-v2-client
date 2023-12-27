import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRepeat, faKey, faEnvelope, faRightToBracket, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import style from './Authenticate.module.scss';
import { useAuthContext } from '../../hooks/useAuthContext';
import FailedValidationMessage from './FailedValidationMessage';
import * as recipesAPI from '../../services/recipesService';
import { RegistrationData } from '../../services/types';
import { useFormik } from 'formik';
import { validationSchemas } from '../../configs/yupConfig';

const initialRegistrationValues: RegistrationData = {
    username: '',
    password: '',
    email: '',
    repeatPassword: '',
}

export default function Register() {
    const { userLogin } = useAuthContext();
    const navigate = useNavigate();
    const { register, isLoading, isError } = recipesAPI.useRegistration();

    const submitHandler = async (values: RegistrationData) => {
        const { registrationResponse } = await register(values);
        const user = await registrationResponse;

        if (user) {
            userLogin(user);
            navigate('/catalogue');
        }

        formik.setTouched({ username: false, password: false, email: false, repeatPassword: false });
    }

    const formik = useFormik({
        initialValues: initialRegistrationValues,
        validationSchema: validationSchemas.registrationValidationSchema,
        onSubmit: submitHandler,
    });

    return (
        <div className={style.background}>
            <article className={style.container}>
                <header className={style['form-header']}><h2>Регистрация</h2></header>
                {
                    isError && !formik.touched.username && !formik.touched.password && !formik.touched.repeatPassword && !formik.touched.email
                        ? <>
                            <FontAwesomeIcon
                                icon={faExclamationTriangle}
                                className={style['login-warning-icon']}
                            />
                            <h4 className={style['form-validation-msg']}>В момента имаме проблем със изпращането на данни, моля опитайте по-късно</h4>
                        </>
                        : isLoading
                            ? <h4 className={style['form-validation-msg']}>Обработваме заявката ви...</h4>
                            : null
                }
                <form
                    style={{ marginTop: 100 }}
                    className={style.form}
                    autoComplete="off"
                    onSubmit={formik.handleSubmit}
                >
                    <div className={style['input-container']}>
                        <FontAwesomeIcon className={style.icon} icon={faEnvelope} />
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
                                ? <FailedValidationMessage message={formik.errors.email} />
                                : null
                        }
                    </div>
                    <div className={style['input-container']}>
                        <FontAwesomeIcon className={style.icon} icon={faUser} />
                        <input
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
                                ? <FailedValidationMessage message={formik.errors.username} />
                                : null
                        }
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
                            style={isLoading ? { marginTop: 5, backgroundColor: 'gray' } : { marginTop: 5 }}
                            className={style['submit-btn']}
                            type="submit"
                            value="Продължи"
                            onSubmit={formik.handleReset}
                            disabled={isLoading}
                        />
                    </div>
                </form>
                <footer className={style['form-footer']}>
                    <Link to={'/login'}>Вече имате акаунт? Кликнете тук.</Link>
                </footer>
            </article>
        </div>
    )
}