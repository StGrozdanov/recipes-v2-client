import { useMutation } from "react-query";
import { LoginData, RegistrationData, ResetPasswordParams, User, VerificationCodeResponse } from "./types";
import { useCallback } from "react";
import { BASE_URL } from "./recipesService";

/**
 * Used to send login request to the server
 */
export const useLogin = () => {
    const {
        mutateAsync: loginMutation,
        isLoading,
        isError,
    } = useMutation((data: LoginData) => loginRequest(data));

    const login = useCallback(async (data: LoginData) => {
        try {
            const loginResponse = loginMutation(data);
            return { loginResponse };
        } catch (error) {
            return { error };
        }
    }, [loginMutation]);

    return { login, isLoading, isError };
};

/**
 * Used to send register request to the server
 */
export const useRegistration = () => {
    const {
        mutateAsync: registrationMutation,
        isLoading,
        isError
    } = useMutation((data: RegistrationData) => registerRequest(data), { retry: 3 });

    const register = useCallback(async (data: RegistrationData) => {
        try {
            const registrationResponse = registrationMutation(data);
            return { registrationResponse };
        } catch (error) {
            return { error };
        }
    }, [registrationMutation]);

    return { register, isLoading, isError };
};

/**
 * Request verification code from the server for the password reset flow
 */
export const useRequestVerificationCode = () => {
    const {
        mutateAsync: requestVerificationMutation,
        isLoading,
        isError
    } = useMutation((email: string) => requestVerficiationCodeFunc(email));

    const requestVerificationCode = useCallback(async (email: string) => {
        try {
            const verificationCodeResponse = requestVerificationMutation(email);
            return { verificationCodeResponse };
        } catch (error) {
            return { error };
        }
    }, [requestVerificationMutation]);

    return { requestVerificationCode, isLoading, isError };
};

/**
 * Used to verify the code as part of the password reset flow
 */
export const useVerifyResetPasswordCode = () => {
    const {
        mutateAsync: requestVerificationMutation,
    } = useMutation((code: string) => verifyResetPasswordCodeFunc(code));

    const requestVerificationCode = useCallback(async (code: string) => {
        try {
            const verificationCodeResponse = requestVerificationMutation(code);
            return { verificationCodeResponse };
        } catch (error) {
            return { error };
        }
    }, [requestVerificationMutation]);

    return { requestVerificationCode };
};

/**
 * Used to reset the password of the user
 */
export const useResetPassword = () => {
    const {
        mutateAsync: resetPasswordMutation,
    } = useMutation((params: ResetPasswordParams) => resetPasswordFunc(params));

    const resetPassword = useCallback(async (params: ResetPasswordParams) => {
        try {
            const resetPasswordResponse = resetPasswordMutation(params);
            return { resetPasswordResponse };
        } catch (error) {
            return { error };
        }
    }, [resetPasswordMutation]);

    return { resetPassword };
};

const loginRequest = async (loginData: LoginData): Promise<User> => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${data.error}`);
    }
    return data;
}

const registerRequest = async (registrationData: RegistrationData): Promise<User> => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registrationData),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${data.error}`);
    }
    return data;
}

/**
 * Checks if the provided username is already registered in the server
 */
export const usernameIsAvailableRequest = async (username: string): Promise<boolean> => {
    const response = await fetch(`${BASE_URL}/auth/check-username`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${data.error}`);
    }
    return data;
}

/**
 * Checks if the provided email is already registered in the server
 */
export const emailIsAvailableRequest = async (email: string): Promise<boolean> => {
    const response = await fetch(`${BASE_URL}/auth/check-email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${data.error}`);
    }
    return data;
}

const requestVerficiationCodeFunc = async (email: string): Promise<VerificationCodeResponse> => {
    const response = await fetch(`${BASE_URL}/auth/generate-verification-code`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${data.error}`);
    }
    return data;
}

const verifyResetPasswordCodeFunc = async (code: string): Promise<boolean> => {
    const response = await fetch(`${BASE_URL}/auth/verify-code`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${data.error}`);
    }
    return data;
}

const resetPasswordFunc = async ({ id, password }: ResetPasswordParams): Promise<boolean> => {
    const response = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, password }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${data.error}`);
    }
    return data;
}