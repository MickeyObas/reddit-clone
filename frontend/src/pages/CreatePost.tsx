import communityIcon from '../assets/icons/community.png';
import { ChevronDown } from 'lucide-react';
import { CircleAlert } from 'lucide-react';
import React from 'react';
import { useRef } from 'react';


const CreatePost = () => {

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(e);
    if(textAreaRef.current){
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }

  return (
    <div className="grid grid-cols-1 py-5 px-4 gap-y-5">
      <div className="flex justify-between">
        <h1 className='text-2xl font-bold'>Create Post</h1>
        <span className='font-medium'>Drafts</span>
      </div>
      <div className="flex items-center bg-gray-white font-medium w-fit ps-0.5 pe-2.5 rounded-full gap-x-1.5">
        <img src={communityIcon} alt="" className='w-10 h-10'/>
        <span>Select a community</span>
        <ChevronDown size={17} strokeWidth={2.5}/>
      </div>
      <div className='flex gap-x-8 font-medium'>
        <span>Text</span>
        <span>Images & Video</span>
        <span>Link</span>
      </div>
      <div>
        <input 
          type="text" 
          className='w-full border border-gray-300 py-3.5 px-3 rounded-2xl'
          placeholder='Title *'
          />
        <div className='flex justify-between text-xs px-3 mt-1'>
          <div className='error flex items-center'>
            <CircleAlert 
              size={18}
              color='red'
            />
            <span className='ms-1'>Please fill out this field.</span>
          </div>
          <span className='helper'>0/300</span>
        </div>
      </div>
      <button
        className='text-xs font-medium w-fit bg-gray-white py-2 px-3 rounded-full'
      >Add flairs and tags</button>
      <textarea 
        ref={textAreaRef}
        name="" 
        id=""
        onChange={handleChange}
        className='border border-gray-300 px-3 py-3 rounded-2xl resize-none overflow-hidden'
        placeholder='Body'
        rows={3}></textarea>
        <div className="flex flex-row-reverse gap-4">
          <button
          className='text-xs font-medium w-fit bg-gray-white py-3 px-3 rounded-full'
          >Post</button>
          <button
          className='text-xs font-medium w-fit bg-gray-white py-3 px-3 rounded-full'
          >Save Draft</button>
        </div>
    </div>
  )
}

export default CreatePost;