import React, { useState, useRef, useEffect} from 'react';

import redditIcon from '../assets/icons/reddit.png';
import dotIcon from '../assets/icons/dot.png';
import communityIcon from '../assets/icons/community.png';
import exclamationIcon from '../assets/icons/exclamation-mark.png';
import checkIcon from '../assets/icons/check.png';
import { ChevronDown, CircleAlert, CloudUpload } from 'lucide-react';

type Post = {
  title: string,
  link: string,
  content: string,
  community: string
}

type ErrorState = {
  title: string,
  link: string,
  content: string
}

const communities = ["React", "Django", "Next.js", "Node.js", "Python", "JavaScript", "React", "Django", "Next.js", "Node.js", "Python", "JavaScript"];

const CreatePost = () => {
  const [post, setPost] = useState<Post>({
    title: '',
    link: '',
    content: '',
    community: ''
  }) 

  const [selectedLink, setSelectedLink] = useState<'TEXT' | 'IMAGE' | 'LINK'>('TEXT')
  const [error, setError] = useState<ErrorState>({
    title: '',
    link: '',
    content: ''
  })
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const filteredCommunities = communities.filter((community) => community.toLowerCase().includes(search.toLowerCase()))


  // Handlers
  const handlePostInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if(e.target.name === 'title' && e.target.value.length > 300){
      return
    };
    setPost((prev) => ({...prev, [e.target.name]: e.target.value}))
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  const handleFocus = (field: keyof Post) => {
    setError((prev) => ({...prev, [field] : ''}))
  }

  const handleBlur = (field: keyof Post, value: string) => {
    setError((prev) => ({...prev, [field]: value ? '' : 'Please enter a value for this field. It is required.'}))
  }

  const handleCommunityClick = () => {

  }

  const handleCreatePostClick = () => {
    console.log(post);
  }

  // Effects
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if(dropdownRef.current && !dropdownRef.current.contains(e.target)){
        setIsSearchDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);

    return () => document.removeEventListener('mousedown', handleOutsideClick);

  }, [])

  const isValid = post.title && post.content;

  return (
    <div className="grid grid-cols-1 py-5 px-4 gap-y-5">
      <div className="flex justify-between">
        <h1 className='text-2xl font-bold'>Create Post</h1>
        <span className='font-medium'>Drafts</span>
      </div>

      {/* Searchable Dropdown */}
      {!isSearchDropdownOpen ? (
        <div 
          className="flex items-center bg-gray-white font-medium w-fit ps-0.5 pe-2.5 rounded-full gap-x-1.5"
          onClick={() => setIsSearchDropdownOpen(true)}
          >
          <img src={communityIcon} alt="" className='w-10 h-10'/>
          <span>Select a community</span>
          <ChevronDown size={17} strokeWidth={2.5}/>
        </div>
      ) : (
        <div
          ref={dropdownRef}
          className='flex flex-col relative'
        >
          <div 
          className='flex items-center bg-gray-white rounded-full max-w-[75vw] outline-2 outline-blue-600'
          >
          <span className='w-10 h-10 flex'>
            <img 
              src={communityIcon} alt="" 
              className='w-full h-full'
              />
          </span>
          <input 
            type="text" 
            className='px-3 py-2 outline-none bg-gray-white'
            placeholder='Select a community'
            value={search}
            onChange={handleSearchChange}
            />
          {/* {false && (
            <span className='ms-auto w-10 h-10 flex '>
            <img 
              src={communityIcon} alt="" 
              className='w-full h-full'
              />
          </span>
          )} */}
          </div>
          <ul 
            className='absolute top-[50px] left-[30px] z-10 flex flex-col gap-y-4 bg-white w-[68vw] p-4 shadow-2xl max-h-[75vw] overflow-y-auto rounded-lg'
            >
            {filteredCommunities.map((community, idx) => (
              <li 
                key={idx}
                className='flex items-center py-0.5'
                >
                  <div className='w-8 h-8'>
                    <img src={redditIcon} alt="" className='w-full h-full'/>
                  </div>
                  <div className='flex flex-col ms-2'>
                    <span className='font-medium'>{community}</span>
                    <div className='flex items-center text-xs text-slate-500'>
                      <span className=''>999,999 Members</span>
                      <img className='w-2 h-2 mx-0.5 mt-0.5' src={dotIcon} alt="" />
                      <span>Subscribed</span>
                    </div>
                  </div>
                </li>
            ))}
          </ul>
        </div>
      )}

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
            name='title' 
            type="text" 
            value={post.title}
            onChange={handlePostInputChange}
            onBlur={() => handleBlur('title', post.title)}
            onFocus={() => handleFocus('title')}
            className={`peer w-full mb-1 border border-gray-300 py-3.5 px-3 rounded-2xl focus:outline-2 focus:outline-blue-500 ${error.title && 'outline-deep-red outline-2'}`}
            placeholder='Title *'
            />
            {error.title ? (<img 
            src={exclamationIcon}
            alt="Error icon"
            className="absolute w-5 top-1/2 -translate-y-1/2 right-[1rem]"
            />) : (
              (post.title) && (
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
          <span className='helper ms-auto'>{post.title.length}/300</span>
        </div>
      </div>
      <button
        className='text-xs font-medium w-fit bg-gray-white py-2 px-3 rounded-full'
      >Add flairs and tags</button>

      {selectedLink === 'TEXT' && (
        <div>
          <textarea
          name="content" 
          ref={textAreaRef}
          value={post.content}
          onChange={handlePostInputChange}
          onFocus={() => handleFocus('content')}
          onBlur={() => handleBlur('content', post.content)}
          className='w-full border border-gray-300 px-3 py-3 rounded-2xl resize-none overflow-hidden focus:outline-slate-400'
          placeholder='Body'
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
          <div className='relative'>
            <input 
              name="link"
              type="text" 
              value={post.link}
              onChange={handlePostInputChange}
              onBlur={() => handleBlur('link', post.link)}
              onFocus={() => handleFocus('link')}
              className={`peer w-full mb-1 border border-gray-300 py-3.5 px-3 rounded-2xl focus:outline-2 focus:outline-blue-500 ${error.link && 'outline-deep-red outline-2'}`}
              placeholder='Link URL *'
              />
              {error.link ? (<img 
              src={exclamationIcon}
            alt="Error icon"
            className="absolute w-5 top-1/2 -translate-y-1/2 right-[1rem]"
            />) : (
              (post.link) && (
                <img 
                  src={checkIcon}
                  alt="Check icon"
                  className="peer-focus:hidden absolute w-5 top-1/2 -translate-y-1/2 right-[1rem] opacity-60"
                />
              )
            )}
          </div>
        <div className='flex justify-between text-xs px-3 mt-1 min-h-5'>
          {error.link && (
            <div className='error flex items-center'>
            <CircleAlert 
              size={18}
              color='red'
            />
            <span className='ms-1'>Please fill out this field.</span>
          </div>
          )}
        </div>
      </div>
      )}
      
        <div className="flex flex-row-reverse gap-4">
          <button
          onClick={handleCreatePostClick}
          className={`text-[13px] font-medium w-fit py-3 px-4 rounded-full ${!isValid ? 'bg-gray-white text-gray-400' : 'bg-blue-800 text-white'}`}
          disabled={!isValid}
          >Post</button>
          <button
          className={`text-[13px] font-medium w-fit py-3 px-4 rounded-full ${!isValid ? 'bg-gray-white text-gray-400' : 'bg-blue-800 text-white'}`}
          disabled={!isValid}
          >Save Draft</button>
        </div>
    </div>
  )
}

export default CreatePost;