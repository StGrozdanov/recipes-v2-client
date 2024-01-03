import * as Yup from 'yup';
import * as authService from '../services/authService';
import { debounce } from 'lodash';

const emailValidationFunction = async (
    value: string,
    resolve: (result: boolean) => void,
    email: string
) => {
    try {
        const isAvailable = await authService.emailIsAvailableRequest(value);
        if (!isAvailable && value === email) {
            resolve(true);
        } else {
            resolve(isAvailable);
        }
    } catch (error) {
        resolve(false);
    }
};

const usernameValidationFunction = async (
    value: string,
    resolve: (result: boolean) => void,
    username: string,
) => {
    try {
        const isAvailable = await authService.usernameIsAvailableRequest(value);
        if (!isAvailable && value === username) {
            resolve(true);
        } else {
            resolve(isAvailable);
        }
    } catch (error) {
        resolve(false);
    }
};

const debouncedEmailValidation = debounce(emailValidationFunction, 500);
const debouncedUsernameValidation = debounce(usernameValidationFunction, 500);

const loginValidationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
});

const registrationValidationSchema = Yup.object({
    username: Yup
        .string()
        .required('Дължина между 3 и 10 символа')
        .min(3, 'Дължина между 3 и 10 символа')
        .max(10, 'Дължина между 3 и 10 символа')
        .test('is-username-available', 'Потребителското име е заето',
            value => new Promise(resolve => debouncedUsernameValidation(value, resolve, 'none'))
        ),
    password: Yup.string().required('Дължина от минимум 4 символа').min(4, 'Дължина от минимум 4 символа'),
    email: Yup
        .string()
        .required('Имейлът e невалиден')
        .email('Имейлът e невалиден')
        .test('is-email-available', 'Имейлът е зает',
            value => new Promise(resolve => debouncedEmailValidation(value, resolve, 'none'))
        ),
    repeatPassword: Yup.string().test('passwords-match', 'Паролите трябва да съвпадат', function (value) {
        return this.parent.password === value;
    }),
});

const profileValidationSchema = (currentUserUsername: string, currentUserEmail: string) => Yup.object({
    username: Yup
        .string()
        .required('Дължина между 3 и 10 символа')
        .min(3, 'Дължина между 3 и 10 символа')
        .max(10, 'Дължина между 3 и 10 символа')
        .test('is-username-available', 'Потребителското име е заето',
            value => new Promise(resolve => debouncedUsernameValidation(value, resolve, currentUserUsername))
        ),

    email: Yup
        .string()
        .required('Имейлът e невалиден')
        .email('Имейлът e невалиден')
        .test('is-email-available', 'Имейлът е зает',
            value => new Promise(resolve => debouncedEmailValidation(value, resolve, currentUserEmail))
        ),
});

const resetPasswordValidationSchema = Yup.object({
    password: Yup.string().required('Дължина от минимум 4 символа').min(4, 'Дължина от минимум 4 символа'),
    repeatPassword: Yup.string().test('passwords-match', 'Паролите трябва да съвпадат', function (value) {
        return this.parent.password === value;
    }),
});

export const validationSchemas = {
    loginValidationSchema,
    registrationValidationSchema,
    resetPasswordValidationSchema,
    profileValidationSchema,
}