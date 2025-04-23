import { X } from "lucide-react";
import { createPortal } from "react-dom"

const ModalOverlay = ({ children, onClose }) => {
  return createPortal(
    <div
      onClick={onClose} 
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white w-full max-w-md p-4 rounded-t-2xl shadow-lg animate-slide-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-lg flex justify-center items-center bg-gray-white rounded-full p-1">
          <X strokeWidth={1.5}/>
        </button>
        {children}
      </div>
    </div>,
    document.body
  )
}

export default ModalOverlay;