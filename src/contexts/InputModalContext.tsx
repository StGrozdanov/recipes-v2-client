import { createContext, useRef, useState } from "react";
import { ContainerProps } from "./types";
import InputModal from "../components/common/Modals/InputModal";

interface Options {
    title: string,
    updateStateHandler: (...args: any[]) => void,
}

interface InputModalContextType {
    openModal: (options: Options) => Promise<void>,
}

export const InputModalContext = createContext<InputModalContextType>({
    openModal: () => Promise.reject('modal context is not initialized'),
});

export const InputModalProvider = ({ children }: ContainerProps) => {
    const [options, setOptions] = useState<Options | null>(null);
    const [data, setData] = useState('');

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
        setData('');
    };

    const handleConfirm = () => {
        if (awaitingPromiseRef.current) {
            if (data !== '') {
                options?.updateStateHandler(data);
            }
            awaitingPromiseRef.current.resolve();
        }
        setOptions(null);
        setData('');
    };

    return (
        <InputModalContext.Provider value={{ openModal }}>
            {children}
            <InputModal
                data={data}
                content={options ? options.title : ''}
                onCancel={handleClose}
                onConfirm={handleConfirm}
                setData={setData}
            />
        </InputModalContext.Provider>
    );
}