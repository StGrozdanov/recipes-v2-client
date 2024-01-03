import { createContext, useRef, useState } from "react";
import { ContainerProps } from "./types";
import ConfirmModal from "../components/common/Modals/ConfirmModal/ConfirmModal";

interface Options {
    title: string,
}

interface ModalContextType {
    openModal: (options: { title: string }) => Promise<void>,
}

export const ModalContext = createContext<ModalContextType>({
    openModal: () => Promise.reject('modal context is not initialized'),
});

export const ModalProvider = ({ children }: ContainerProps) => {
    const [options, setOptions] = useState<Options | null>(null);
    const awaitingPromiseRef = useRef<{ resolve: () => void, reject: () => void } | null>(null);

    const openModal = (options: Options): Promise<void> => {
        setOptions(options);
        return new Promise<void>((resolve: () => void, reject: () => void) => {
            awaitingPromiseRef.current = { resolve, reject };
        });
    }; 

    const handleClose = () => {
        if (awaitingPromiseRef.current) {
            awaitingPromiseRef.current.reject();
        }
        setOptions(null);
    };

    const handleConfirm = () => {
        if (awaitingPromiseRef.current) {
            awaitingPromiseRef.current.resolve();
        }
        setOptions(null);
    };

    return (
        <ModalContext.Provider value={{ openModal }}>
            {children}
            <ConfirmModal
                onConfirm={handleConfirm}
                onCancel={handleClose}
                content={options && options.title ? options.title : ""}
            />
        </ModalContext.Provider>
    );
}