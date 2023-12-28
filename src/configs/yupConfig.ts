import * as Yup from 'yup';
import * as recipesAPI from '../services/recipesService';

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
        .test('is-username-available', 'Потребителското име е заето', async function (value) {
            if (value) {
                try {
                    const isAvailable = await recipesAPI.usernameIsAvailableRequest(value);
                    return isAvailable;
                } catch (err) {
                    console.error(err);
                    return false;
                }
            }
            return true;
        }),
    password: Yup.string().required('Дължина от минимум 4 символа').min(4, 'Дължина от минимум 4 символа'),
    email: Yup
        .string()
        .required('Имейлът e невалиден')
        .email('Имейлът e невалиден')
        .test('is-email-available', 'Имейлът е зает', async function (value) {
            if (value) {
                try {
                    const isAvailable = await recipesAPI.emailIsAvailableRequest(value);
                    return isAvailable;
                } catch (err) {
                    console.error(err);
                    return false;
                }
            }
            return true;
        }),
    repeatPassword: Yup.string().test('passwords-match', 'Паролите трябва да съвпадат', function (value) {
        return this.parent.password === value;
    }),
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
}