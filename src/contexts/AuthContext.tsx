import { createContext } from "react";
import { useUserLocalStorage } from "../hooks/useLocalStorage";
import { User } from "../services/types";

type ContainerProps = {
    children: React.ReactNode;
}

type AuthContextType = {
    isAuthenticated: boolean,
    isModerator: boolean,
    isAdministrator: boolean,
    isResourceOwner: (resourceOwnerId: number) => boolean,
    token: string,
    userLogin: (loginData: User) => void,
    userLogout: () => void,
}

const defaultUserValues: User = {
    username: "",
    avatarURL: null,
    coverPhotoURL: null,
    email: "",
    sessionToken: "",
    refreshToken: "",
    id: 0,
    isAdministrator: false,
    isModerator: false
}

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    isModerator: false,
    isAdministrator: false,
    isResourceOwner: () => false,
    token: '',
    userLogin: (_loginData: User) => console.info('nothing here yet.'),
    userLogout: () => console.info('nothing here yet.'),
});

export const AuthProvider = ({ children }: ContainerProps) => {
    const { user, setUserLocalStorageValue, clearLocalStorage } = useUserLocalStorage({
        key: 'user',
        defaultValue: defaultUserValues
    });

    const userLogin = (userData: User) => setUserLocalStorageValue(userData);

    const userLogout = () => {
        clearLocalStorage();
        setUserLocalStorageValue(defaultUserValues);
    };

    const isAuthenticated = user.sessionToken !== '';

    const isResourceOwner = (resourceOwnerId: number) => resourceOwnerId === user.id;

    const isAdministrator = Boolean(user.isAdministrator);

    const isModerator = Boolean(user.isModerator);

    const token = user.sessionToken;

    return (
        <AuthContext.Provider value={{
            userLogin,
            userLogout,
            isAuthenticated,
            isAdministrator,
            isModerator,
            isResourceOwner,
            token,
        }}>
            {children}
        </AuthContext.Provider>
    );
};
