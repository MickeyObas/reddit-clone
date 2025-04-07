import { CircleAlert, Dot, DotIcon, X } from "lucide-react";
import { FormInput } from "./FormInput";
import { useState } from "react";

const CreateCommunityModal = () => {
  
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  const [error, setError] = useState({});

  // Handlers
  const handleFormInputChange = (e) => {
    if(e.target.name === "name" && e.target.value.length > 15){
      return;
    };
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full flex flex-col p-6 mx-2">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold leading-7">Tell us about your community</h1>
          <div className="bg-gray-white rounded-full p-1.5">
            <X size={20}/>
          </div>
        </div>
        <p className="mt-8 leading-5">A name and description help people understand what your community is all about.</p>
        <div className="flex justify-center my-8">
          <div className="flex flex-col shadow-[2px_2px_4px_2px_rgba(0,0,0,0.1)] py-4 px-6 w-3/4">
            <h3 className="font-semibold text-xl">{formData.name ? "r/" + formData.name : "r/communityname"}</h3>
            <div className="flex items-center text-xs">
              <span>1 member</span>
              <Dot />
              <span>1 online</span>
            </div>
            <p className="mt-2">{formData.description ? formData.description : "Your community description"}</p>
          </div>
        </div>
        <FormInput
          name="name" 
          placeholder="Community name *"
          value={formData.name}
          isValid={!!formData.name}
          onChange={handleFormInputChange}
        />
        <div className="mt-5"> 
          <textarea
          name="description" 
          value={formData.description}
          onChange={handleFormInputChange}
          className='bg-gray-white w-full border border-gray-300 px-3 py-3 rounded-2xl resize-none overflow-hidden focus:outline-slate-400'
          placeholder='Description*'
          rows={3}></textarea>
          <div className='flex justify-between text-xs px-3 mt-1 min-h-5'>
            {error.content && (
              <div className='error flex items-center'>
                <CircleAlert 
                  size={18}
                  color='red'
                />
                <span className='ms-1'>Please fill out this field. Content is required.</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-row-reverse">
          <div className="flex gap-x-3">
            <button className="bg-gray-white py-3 px-3.5 rounded-full font-semibold">Cancel</button>
            <button className="py-3 px-3.5 rounded-full font-semibold bg-blue-800 text-white">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateCommunityModal;