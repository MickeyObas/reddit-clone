import { useState } from "react"
import { FormInput } from "../ui/FormInput"

const DisplayNameModal = ({hideModal, updateProfile, currentDisplayName}) => {
  const [displayName, setDisplayName] = useState(currentDisplayName);

  const handleChangeDisplayName = (e) => {
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