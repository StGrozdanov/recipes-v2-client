import { useContext } from "react";
import { InputModalContext } from "../contexts/InputModalContext";


/**
 * Hook that provides access to input modal. On use - it opens the modal
 */
export const useInputModalContext = () => {
  const context = useContext(InputModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context.openModal;
};