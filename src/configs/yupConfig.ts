/* eslint react-func/max-lines-per-function: 0 */
import * as Yup from 'yup';
import * as authService from '../services/authService';
import { debounce } from 'lodash';
import { recipeIsAvailableRequest } from '../services/recipesService';

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

const recipeNameValidationFunction = async (
    value: string,
    resolve: (result: boolean) => void,
    recipeName: string,
) => {    
    try {
        const isAvailable = await recipeIsAvailableRequest(value.toLowerCase());
        console.log(isAvailable)
        if (isAvailable && value.toLowerCase() === recipeName) {
            resolve(true);
        } else {
            resolve(!isAvailable);
        }
    } catch (error) {
        resolve(false);
    }
};

const debouncedEmailValidation = debounce(emailValidationFunction, 700);
const debouncedUsernameValidation = debounce(usernameValidationFunction, 700);
const debouncedRecipeNameValidation = debounce(recipeNameValidationFunction, 700);

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

const recipeValidationSchema = (currentRecipeRecipeName: string) => Yup.object({
    recipeName: Yup
        .string()
        .required('Дължина от минимум 4 символа')
        .min(4, 'Дължина от минимум 4 символа')
        .matches(/^[а-яА-Я\s]+$/, 'Името трябва да е на български и да не съдържа символи')
        .test(
            'is-recipe-name-available',
            'Името е заето',
            value => new Promise(resolve => debouncedRecipeNameValidation(value, resolve, currentRecipeRecipeName))
        ),
    preparationTime: Yup
        .number()
        .required('Времето за приготвяне е число, изразено в минути')
        .min(2, 'Минималното време за приготвяне е 2 минути'),
    products: Yup
        .string()
        .required('Минимум 2 продукта')
        .test(
            'is-in-expected-format-and-length',
            'Продуктите трябва да са минимум 2, всеки на нов ред',
            value => value
                .split('\n')
                .map(content => content.trim())
                .filter(content => content.trim() !== '')
                .length >= 2
        ),
    steps: Yup
        .string()
        .required('Минимум 2 стъпки')
        .test(
            'is-in-expected-format-and-length',
            'Стъпките трябва да са минимум 2, всяка на нов ред',
            value => value
                .split('\n')
                .map(content => content.trim())
                .filter(content => content.trim() !== '')
                .length >= 2
        ),
    imageURL: Yup
        .mixed()
        .required('Картинката е задължителна')
        .test('recipe-name-should-be-populated', 'Името на рецептата трябва да е попълнено', function (value) {
            const imgURL = value ? value as string : '';
            const recipeName = imgURL.split('recipe-image-')[1];
            return recipeName !== ''
        }),
    category: Yup
        .string()
        .required('Моля изберете категория'),
    difficulty: Yup
        .string()
        .required('Моля изберете трудност'),
    protein: Yup
        .number()
        .nullable()
        .notRequired()
        .min(10, 'Протейна не може да е по-малко от 10'),
    calories: Yup
        .number()
        .nullable()
        .notRequired()
        .min(10, 'Калориите не могат да са по-малко от 10'),
});

const commentValidationSchema = Yup.object({
    comment: Yup.string().required('Коментарът не може да е празен').min(1, 'Дължина от минимум 1 символ'),
});

export const validationSchemas = {
    loginValidationSchema,
    registrationValidationSchema,
    resetPasswordValidationSchema,
    profileValidationSchema,
    recipeValidationSchema,
    commentValidationSchema,
}