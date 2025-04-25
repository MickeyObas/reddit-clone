import { useState } from "react"
import { FormInput } from "../ui/FormInput"

interface DisplayNameModalProps {
  hideModal: () => void,
  updateProfile: (field: string, newValue: string | File) => void,
  currentDisplayName: string
}

const DisplayNameModal = ({hideModal, updateProfile, currentDisplayName}: DisplayNameModalProps) => {
  const [displayName, setDisplayName] = useState(currentDisplayName);

  const handleChangeDisplayName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value);
  } 

  return (
    <>
      <h2 className="text-lg font-bold">Display name</h2>
      <p className="text-sm mt-6">Changing your display name won't change your username</p>
      <FormInput
        onChange={handleChangeDisplayName}
        containerClassName="mt-3.5" 
        value={displayName}
        placeholder="Display name"
        isValid={true}
      />
      <button
        onClick={hideModal} 
        className="bg-gray-white w-full py-2.5 rounded-full font-semibold mt-6">Cancel</button>
      <button 
        onClick={() => {
          updateProfile('display_name', displayName);
          hideModal();
        }}
        className="text-white w-full py-2.5 rounded-full font-semibold mt-3 bg-blue-900">Save</button>
    </>
  )
}

export default DisplayNameModal;