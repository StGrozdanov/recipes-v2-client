import { useContext } from "react";
import { ModalContext } from "../contexts/ModalContext";

/**
 * Hook that provides acces to the confirm modal. It opens it upon invoke
 */
export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context.openModal;
};