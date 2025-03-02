import React, { useState, useRef} from 'react';

import communityIcon from '../assets/icons/community.png';
import { ChevronDown } from 'lucide-react';
import { CircleAlert } from 'lucide-react';
import { CloudUpload } from 'lucide-react';
import exclamationIcon from '../assets/icons/exclamation-mark.png';
import checkIcon from '../assets/icons/check.png';

const CreatePost = () => {

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedLink, setSelectedLink] = useState<'TEXT' | 'IMAGE' | 'LINK'>('TEXT')
  const [error, setError] = useState({
    title: ''
  })

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }

  const handleTitleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setError((prev) => ({...prev, title: ''}))
  }

  const handleTitleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if(!title){
      setError((prev) => ({...prev, title: 'Please fill out this field.'}))
    }else{
      setError((prev) => ({...prev, title: ''}))
    }
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(e);
    setContent(e.target.value);
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
      <div className='flex gap-x-8 font-medium mb-2'>
        <span 
          onClick={() => setSelectedLink('TEXT')}
          className={`relative ${selectedLink === 'TEXT' ? 'pb-1.5 border-b-blue-700 border-b-3 r' : ''}`}
        >Text</span>
        <span
          onClick={() => setSelectedLink('IMAGE')}
          className={`relative ${selectedLink === 'IMAGE' ? 'pb-1.5 border-b-blue-700 border-b-3 r' : ''}`}
        >Images & Video</span>
        <span
          onClick={() => setSelectedLink('LINK')}
          className={`relative ${selectedLink === 'LINK' ? 'pb-1.5 border-b-blue-700 border-b-3 r' : ''}`}
        >Link</span>
      </div>
      <div>
        <div className='relative'>
          <input 
            type="text" 
            value={title}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            onFocus={handleTitleFocus}
            className={`peer w-full mb-1 border border-gray-300 py-3.5 px-3 rounded-2xl focus:outline-2 focus:outline-blue-500 ${error.title && 'outline-deep-red outline-2'}`}
            placeholder='Title *'
            />
            {error.title ? (<img 
            src={exclamationIcon}
            alt="Error icon"
            className="absolute w-5 top-1/2 -translate-y-1/2 right-[1rem]"
            />) : (
              (title) && (
                <img 
                  src={checkIcon}
                  alt="Check icon"
                  className="peer-focus:hidden absolute w-5 top-1/2 -translate-y-1/2 right-[1rem] opacity-60"
                />
              )
            )}
        </div>
        <div className='flex justify-between text-xs px-3 mt-1 min-h-5'>
          {error.title && (
            <div className='error flex items-center'>
            <CircleAlert 
              size={18}
              color='red'
            />
            <span className='ms-1'>Please fill out this field.</span>
          </div>
          )}
          <span className='helper ms-auto'>{title.length}/300</span>
        </div>
      </div>
      <button
        className='text-xs font-medium w-fit bg-gray-white py-2 px-3 rounded-full'
      >Add flairs and tags</button>

      {selectedLink === 'TEXT' && (
        <textarea 
        ref={textAreaRef}
        value={content}
        onChange={handleContentChange}
        className='border border-gray-300 px-3 py-3 rounded-2xl resize-none overflow-hidden'
        placeholder='Body'
        rows={3}></textarea>
      )}

      {selectedLink === 'IMAGE' && (
        <div className='border border-dashed border-gray-300 flex items-center justify-center py-6 rounded-2xl'>
          <div className='flex items-center justify-center gap-2'>
            <span>Drag and Drop or upload media</span>
            <span className='bg-gray-white p-1.5 rounded-full flex items-center justify-center'>
              <CloudUpload size={18}/>
            </span>
          </div>
        </div>
      )}

      {selectedLink === 'LINK' && (
        <div>
          <input 
            type="text" 
            className='w-full border border-gray-300 py-3.5 px-3 rounded-2xl'
            placeholder='Link URL *'
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
      )}
      
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