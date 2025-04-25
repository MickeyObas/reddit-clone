import { createContext, ReactNode, useContext, useState } from "react";
import ModalOverlay from "../components/ui/ModalOverlay";

const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = () => {
  const context = useContext(ModalContext);
  if(!context){
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

type ModalContextType = {
  showModal: (content: ReactNode) => void;
  hideModal: () => void;
}

type ModalProviderProps = {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const showModal = (content: ReactNode) => setModalContent(content);
  const hideModal = () => setModalContent(null);

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {modalContent && (
        <ModalOverlay onClose={hideModal}>
          {modalContent}
        </ModalOverlay>
      )}
    </ModalContext.Provider>
  )
}

