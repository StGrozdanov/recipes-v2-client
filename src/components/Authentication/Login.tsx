import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket, faUser, faKey, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import style from './Authenticate.module.scss';
import { useFormik } from 'formik';
import * as recipesAPI from '../../services/recipesService';
import { LoginData, User } from '../../services/types';
import { validationSchemas } from '../../configs/yupConfig';
import { useAuthContext } from '../../hooks/useAuthContext';

const initialLoginValues: LoginData = {
    username: '',
    password: '',
}

export default function Login() {
    const { userLogin } = useAuthContext();
    const navigate = useNavigate();
    const { login, isSuccess, isLoading, isError } = recipesAPI.useLogin();

    const submitHandler = async (values: LoginData) => {
        const { loginResponse } = await login(values);

        if (isSuccess) {
            userLogin(loginResponse as unknown as User);
            navigate('/catalogue');
        }
        
        formik.setTouched({ username: false, password: false });
    }

    const formik = useFormik({
        initialValues: initialLoginValues,
        validationSchema: validationSchemas.loginValidationSchema,
        onSubmit: submitHandler,
    });

    return (
        <div className={style.background}>
            <article className={style.container}>
                <header className={style['form-header']}><h2>Вход</h2></header>
                {
                    isError && !formik.touched.username && !formik.touched.password
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
                    to={'/forgotten-password'}
                    className={style['forgotten-password']}
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
    )
}
