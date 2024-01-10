import { createContext, useState } from "react";
import { ContainerProps } from "./types";
import Notification from "../components/common/Notification/Notification";

type BlockedContextType = {
    reason: string,
    addReason: (blockedFor: string) => void
}

export const BlockedContext = createContext<BlockedContextType>({
    reason: '',
    addReason: (blockedFor: string) => console.info(blockedFor),
});

export const BlockedContextProvider = ({ children }: ContainerProps) => {
    const [reason, setReason] = useState('');
    const [showNotification, setShowNotification] = useState(false);

    const addReason = (blockedFor: string) => {
        setReason(blockedFor);
        setShowNotification(!showNotification);
    };

    return (
        <BlockedContext.Provider value={{
            reason,
            addReason,
        }}>
            <Notification
                isVisible={showNotification}
                message={reason}
                type="fail"
            />
            {children}
        </BlockedContext.Provider>
    );
};
