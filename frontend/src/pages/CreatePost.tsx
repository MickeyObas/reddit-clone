// Assets
import redditIcon from '../assets/icons/reddit.png';
import dotIcon from '../assets/icons/dot.png';
import communityIcon from '../assets/icons/community.png';
import exclamationIcon from '../assets/icons/exclamation-mark.png';
import checkIcon from '../assets/icons/check.png';
import React, { useState, useRef, useEffect} from 'react';

import { BACKEND_URL } from '../config';
import { fetchWithAuth } from '../utils';
import { Community } from '../types/community';
import { ChevronDown, CircleAlert } from 'lucide-react';
import { useCommunities } from '../contexts/CommunityContext';
import DragAndDropUpload from '../components/ui/DragAndDropUpload';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

type Post = {
  title: string,
  link: string,
  content: string,
  community: number | null,
  media: File[]
}

type ErrorState = {
  title: string,
  link: string,
  content: string
}


const CreatePost = () => {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const { communities } = useCommunities();
  const [post, setPost] = useState<Post>({
    title: '',
    link: '',
    content: '',
    community: null,
    media: []
  })
  const [postLoading, setPostLoading] = useState(false); 
  const [selectedLink, setSelectedLink] = useState<'TEXT' | 'IMAGE' | 'LINK'>('TEXT')
  const [error, setError] = useState<ErrorState>({
    title: '',
    link: '',
    content: ''
  })
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCommunityId, setSelectedCommunityId] = useState<number | null>(
    communityId ? parseInt(communityId) : null
  );
  const selectedCommunity = communities?.find((community: Community) => community.id.toString() === selectedCommunityId?.toString());
  const dropdownRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const filteredCommunities = communities.filter((community: Community) => community?.name?.toLowerCase().includes(search.toLowerCase()))

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

  const handleCommunityClick = (communityId: number) => {
    setSelectedCommunityId(communityId);
    setIsSearchDropdownOpen(false);
    setPost((prev) => ({...prev, community: communityId}))
  }

  const handleCreatePostClick = async () => {
    if(!communityId && !post.community) return;

    const formData = new FormData();

    if(post.media){
      post.media.forEach((file) => formData.append('media', file));
    }
    formData.append('title', post.title);
    formData.append('body', post.content);
    if (communityId) {
      formData.append('community_id', String(communityId));
    } else if (post.community) {
      formData.append('community_id', String(post.community));
    }
    

    try{
      setPostLoading(true);
      const response = await fetchWithAuth(`${BACKEND_URL}/posts/`, {
        method: 'POST',
        body: formData
      })
      if(!response?.ok){
        const error = await response?.json();
        console.log(error);
        console.error("Bad response.");
      }else{
        navigate(from);
      }
    }catch(err){
      console.error(err);
    }finally{
      setPostLoading(false);
    }
  }

  const handleUploadComplete = (files: File[]) => {
    setPost((prev) => ({...prev, media: files}))
  }

  // Effects
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if(dropdownRef.current && !dropdownRef.current.contains(e.target as Node)){
        setIsSearchDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);

    return () => document.removeEventListener('mousedown', handleOutsideClick);

  }, [])

  const isValid = selectedCommunityId && post.title.trim() !== "" && post.content.trim() !== "";

  return (
    <div className="grid grid-cols-1 py-5 px-4 gap-y-5">
      <div className="flex justify-between">
        <h1 className='text-2xl font-bold'>Create Post</h1>
        <span className='font-medium'>Drafts</span>
      </div>

      {/* Searchable Dropdown */}
      {!isSearchDropdownOpen ? (
        <div 
          className="flex items-center bg-gray-white font-medium w-fit ps-0.5 pe-2.5 rounded-full gap-x-1.5 cursor-pointer"
          onClick={() => setIsSearchDropdownOpen(true)}
          >
          {selectedCommunity?.avatar ? (
            <div className='w-10 h-10 overflow-hidden rounded-full flex items-center justify-center'>
              <img src={selectedCommunity?.avatar} alt="" className='w-6 h-6 object-cover rounded-full'/>
            </div>
          ) : (
            <img src={communityIcon} alt="" className='w-10 h-10'/>
          )}
          
          {selectedCommunityId ? (
            <span>{"r/" + selectedCommunity?.name}</span>
          ) : (
          <span>Select a community</span>
          )}
          <ChevronDown size={17} strokeWidth={2.5}/>
        </div>
      ) : (
        <div
          ref={dropdownRef}
          className='flex flex-col relative cursor-pointer'
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
            className='absolute top-[62px] left-[30px] z-10 flex flex-col gap-y-4 bg-white w-[68vw] p-4 shadow-[0_0_10px_2px_rgba(0,0,0,0.2)] max-h-[75vw] overflow-y-auto rounded-lg'
            >
            {filteredCommunities.map((community: Community, idx: number) => (
              <li
                onClick={() => handleCommunityClick(community.id)} 
                key={idx}
                className='flex items-center py-0.5'
                >
                  <div className='w-8 h-8 rounded-full overflow-hidden'>
                    <img src={community.avatar ?? redditIcon} alt="" className='w-full h-full object-center object-cover'/>
                  </div>
                  <div className='flex flex-col ms-2'>
                    <span className='font-medium'>{"r/" + community.name}</span>
                    <div className='flex items-center text-xs text-slate-500'>
                      <span className=''>{community.member_count} Members</span>
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
        <DragAndDropUpload
          onUploadComplete={handleUploadComplete}
        />
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
          >{postLoading ? "Loading..." : "Post" }</button>
          <button
          className={`text-[13px] font-medium w-fit py-3 px-4 rounded-full ${!isValid ? 'bg-gray-white text-gray-400' : 'bg-blue-800 text-white'}`}
          disabled={!isValid}
          >Save Draft</button>
        </div>
    </div>
  )
}

export default CreatePost;