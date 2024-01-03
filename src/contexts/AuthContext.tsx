import { createContext } from "react";
import { useUserLocalStorage } from "../hooks/useLocalStorage";
import { User } from "../services/types";
import { ContainerProps } from "./types";

type AuthContextType = {
    isAuthenticated: boolean,
    isModerator: boolean,
    isAdministrator: boolean,
    isResourceOwner: (resourceOwnerId: number) => boolean,
    token: string,
    userLogin: (loginData: User) => void,
    userLogout: () => void,
    avatar: string,
    username: string,
    updateUserData: (email: string, username: string) => void,
    email: string,
}

const defaultUserValues: User = {
    username: "",
    avatarURL: '',
    coverPhotoURL: null,
    email: "",
    sessionToken: "",
    refreshToken: "",
    id: 0,
    isAdministrator: false,
    isModerator: false,
    avatar: '',
}

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    isModerator: false,
    isAdministrator: false,
    isResourceOwner: () => false,
    token: '',
    userLogin: (_loginData: User) => console.info('nothing here yet.'),
    userLogout: () => console.info('nothing here yet.'),
    avatar: '',
    username: '',
    updateUserData: (_email: string, _username: string) => console.info('nothing here yet.'),
    email: '',
});

export const AuthProvider = ({ children }: ContainerProps) => {
    const {
        user,
        setUserLocalStorageValue,
        clearLocalStorage,
        updateLocalStorageValues
    } = useUserLocalStorage({
        key: 'user',
        defaultValue: defaultUserValues
    });

    const userLogin = (userData: User) => setUserLocalStorageValue(userData);

    const updateUserData = (email: string, username: string) => updateLocalStorageValues(username, email);

    const userLogout = () => {
        clearLocalStorage();
        setUserLocalStorageValue(defaultUserValues);
    };

    const isAuthenticated = user.sessionToken !== '';

    const isResourceOwner = (resourceOwnerId: number) => resourceOwnerId === user.id;

    const isAdministrator = Boolean(user.isAdministrator);

    const isModerator = Boolean(user.isModerator);

    const token = user.sessionToken;

    const avatar = user.avatarURL;

    const username = user.username;

    const email = user.email;

    return (
        <AuthContext.Provider value={{
            userLogin,
            userLogout,
            isAuthenticated,
            isAdministrator,
            isModerator,
            isResourceOwner,
            token,
            avatar,
            username,
            updateUserData,
            email,
        }}>
            {children}
        </AuthContext.Provider>
    );
};
