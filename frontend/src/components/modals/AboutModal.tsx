import { useState } from "react"

interface AboutModalProps {
  hideModal: () => void,
  updateProfile: (field: string, newvalue: string | File) => void,
  currentAbout: string
}

const AboutModal = ({hideModal, updateProfile, currentAbout}: AboutModalProps) => {
  const [about, setAbout] = useState(currentAbout);

  const handleChangeAbout = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if(e.target.value.length >= 201){
      return;
    }
    setAbout(e.target.value);
  } 

  return (
    <>
      <h2 className="text-lg font-bold">About Description</h2>
      <p className="text-sm mt-6">Give a brief description of yourself</p>
      <div className="flex flex-col">
        <textarea
          onChange={handleChangeAbout}
          placeholder="About"
          value={about}
          className="mt-3.5 bg-gray-white w-full px-3 py-3 rounded-2xl resize-none overflow-hidden focus:outline-blue-500" 
          name="" id=""></textarea>
      </div>
      <div className="flex justify-end">
        <span className="text-xs text-gray-500 pe-4 mt-1">{about?.length}</span>
      </div>
      <button
        onClick={hideModal} 
        className="bg-gray-white w-full py-2.5 rounded-full font-semibold mt-6 cursor-pointer">Cancel</button>
      <button 
        onClick={() => {
          updateProfile('about_description', about);
          hideModal();
        }}
        className="text-white w-full py-2.5 rounded-full font-semibold mt-3 bg-blue-900 cursor-pointer">Save</button>
    </>
  )
}

export default AboutModal;