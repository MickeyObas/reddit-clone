import { X } from "lucide-react";
import { ReactNode, useState } from "react";
import { createPortal } from "react-dom"

interface ModalOverlayProps {
  children: ReactNode,
  onClose: () => void
}

const ModalOverlay = ({ children, onClose }: ModalOverlayProps) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 185)
  }

  return createPortal(
    <div
      onClick={handleClose} 
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs">
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-white w-full max-w-md p-4 rounded-t-2xl shadow-lg ${isClosing ? 'animate-slide-down' : 'animate-slide-up'}`}>
        <button onClick={handleClose} className="absolute top-4 right-4 text-lg flex justify-center items-center bg-gray-white rounded-full p-1">
          <X strokeWidth={1.5}/>
        </button>
        {children}
      </div>
    </div>,
    document.body
  )
}

export default ModalOverlay;