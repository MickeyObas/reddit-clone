import { createContext, useContext, useState } from "react";
import ModalOverlay from "../components/ui/ModalOverlay";

const ModalContext = createContext(null);

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [modalContent, setModalContent] = useState(null);
  const showModal = (content) => setModalContent(content);
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

