import { useState } from "react";
import { User } from "../services/types";

type UserLocalStorageProps = {
    key: string,
    defaultValue: User,
}

/**
 * Hook that gives acces to the user local storage
 */
export function useUserLocalStorage({ key, defaultValue }: UserLocalStorageProps) {
    const [value, setValue] = useState(() => {
        const userData = localStorage.getItem(key);
        const storedData: User = userData !== null ? JSON.parse(userData) : defaultValue;

        return storedData;
    });

    const setUserLocalStorageValue = (newValue: User) => {
        if (newValue) {
            localStorage.setItem(key, JSON.stringify(newValue));
            setValue(newValue);
        }
    }

    const clearLocalStorage = () => localStorage.removeItem(key);

    const updateLocalStorageValues = (username: string, email: string) => {
        const oldData = localStorage.getItem(key);

        if (oldData) {
            const parsedData = JSON.parse(oldData);
            const updatedData = { ...parsedData, username, email }
            localStorage.setItem(key, JSON.stringify(updatedData));
        }
    }

    return {
        user: value,
        setUserLocalStorageValue,
        clearLocalStorage,
        updateLocalStorageValues,
    }
}