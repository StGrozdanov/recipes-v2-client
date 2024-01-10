import { useMutation } from "react-query";
import { LoginData, RegistrationData, ResetPasswordParams, User, VerificationCodeResponse } from "./types";
import { useCallback } from "react";
import { BASE_URL } from "./recipesService";
import { useRequestHandler } from "../hooks/useRequestHandler";

/**
 * hook to handle all auth related requests
 * @returns handler functions
 */
export const useAuthService = () => {
    const { POST } = useRequestHandler();

    const useLogin = () => {
        const {
            mutateAsync: loginMutation,
            isLoading,
            isError,
        } = useMutation((data: LoginData) => {
            const response: Promise<User> = POST(`${BASE_URL}/auth/login`, data);
            return response;
        });

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

    const useRegistration = () => {
        const {
            mutateAsync: registrationMutation,
            isLoading,
            isError
        } = useMutation((data: RegistrationData) => {
            const response: Promise<User> = POST(`${BASE_URL}/auth/register`, data);
            return response;
        }, { retry: 3 });

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

    const useRequestVerificationCode = () => {
        const {
            mutateAsync: requestVerificationMutation,
            isLoading,
            isError
        } = useMutation((email: string) => {
            const response: Promise<VerificationCodeResponse> =
                POST(`${BASE_URL}/auth/generate-verification-code`, { email })
            return response;
        });

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

    const useVerifyResetPasswordCode = () => {
        const {
            mutateAsync: requestVerificationMutation,
        } = useMutation((code: string) => {
            const response: Promise<boolean> = POST(`${BASE_URL}/auth/verify-code`, { code });
            return response;
        });

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

    const useResetPassword = () => {
        const {
            mutateAsync: resetPasswordMutation,
        } = useMutation((params: ResetPasswordParams) => {
            const response: Promise<boolean> = POST(`${BASE_URL}/auth/reset-password`, params);
            return response;
        });

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

    return {
        useLogin,
        useRegistration,
        useRequestVerificationCode,
        useVerifyResetPasswordCode,
        useResetPassword,
    }

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