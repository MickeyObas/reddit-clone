// Assets
import redditIcon from '../../assets/icons/reddit.png';
import { Check, Dot, Eye, Globe, Image, Lock, LucideXCircle, Search, X } from "lucide-react";

import { FormInput } from "./FormInput";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { fetchWithAuth } from "../../utils";
import { BACKEND_URL } from "../../config";
import { CommunityFormData, CommunityFormError } from '../../types/community';
import { TopicCategory } from '../../types/topic';


interface CreateCommunityModalProps {
  setIsCommunityModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  formData: CommunityFormData,
  setFormData: React.Dispatch<React.SetStateAction<CommunityFormData>>
}

interface StepSettingsProps extends CreateCommunityModalProps {
  updateStepValidity: (stepIndex: number, isValid: boolean) => void
}

interface StepBasicProps extends StepSettingsProps {
  error: CommunityFormError,
  setError: React.Dispatch<React.SetStateAction<CommunityFormError>>
}

const CreateCommunityModal = ({
  setIsCommunityModalOpen,
  formData,
  setFormData
}: CreateCommunityModalProps) => {
  
  const steps = ["basic", "style", "topics", "settings"];
  const [step, setStep] = useState(0);
  const [stepValidity, setStepValidity] = useState<{[key: number]: boolean}>({
    0: false,
    1: true,
    2: false,
    3: true
  });
  const [error, setError] = useState<CommunityFormError>({
    name:'',
    description: ''
  });
  
  const nextStep = () => {
    if((step < steps.length - 1) && stepValidity[step]) setStep((prev) => prev + 1);
  }

  const previousStep = () => {
    if(step > 0) setStep((prev) => prev - 1);
  }

  const updateStepValidity = useCallback((stepIndex: number, isValid: boolean) => {
    setStepValidity((prev) => ({
      ...prev,
      [stepIndex]: isValid
    }))
  }, []
  )

  const handleCreateCommunity = async () => {
    const communityFormData = new FormData();

    if(formData.iconFile) communityFormData.append('avatar', formData.iconFile);
    if(formData.bannerFile) communityFormData.append('banner', formData.bannerFile);
    formData.topics.forEach((topic) => communityFormData.append('topic_ids', String(topic)));

    communityFormData.append('name', formData.name);
    communityFormData.append('type', formData.type);
    communityFormData.append('description', formData.description);
    communityFormData.append('is_mature', String(formData.isForMature));

    const response = await fetchWithAuth(`${BACKEND_URL}/communities/`, {
      method: 'POST',
      body: communityFormData
    });

    if(!response?.ok){
      console.log("Whoops, something went wrong");
      const data = await response?.json();
      console.log(data);
    }else{
      const data = await response?.json();
      console.log(data);
    }

    setFormData({
      name: '',
      description: '',
      bannerFile: null,
      iconFile: null,
      topics: [],
      bannerPreview: '',
      iconPreview: '',
      type: 'public',
      isForMature: false
    });
    setIsCommunityModalOpen(false);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50 px-2">
      <div className="bg-white rounded-xl w-full flex flex-col py-6 px-3.5">
        {step === 0 && (
          <StepBasic 
            formData={formData}
            setFormData={setFormData}
            error={error}
            setError={setError}
            setIsCommunityModalOpen={setIsCommunityModalOpen}
            updateStepValidity={updateStepValidity}
          />
        )}
        {step === 1 && (
          <StepStyle 
            formData={formData}
            setFormData={setFormData}
            setIsCommunityModalOpen={setIsCommunityModalOpen}
          />
        )}
        {step === 2 && (
          <StepTopics 
            formData={formData}
            setFormData={setFormData}
            setIsCommunityModalOpen={setIsCommunityModalOpen}
            updateStepValidity={updateStepValidity}
          />
        )}
        {step === 3 && (
          <StepSettings 
            formData={formData}
            setFormData={setFormData}
            setIsCommunityModalOpen={setIsCommunityModalOpen}
            updateStepValidity={updateStepValidity}
          />
        )}

        <div className="flex justify-between items-center">
          <div className="flex justify-center items-center gap-x-1">
            {steps.map((_, idx) => (
              <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${step === idx ? 'bg-slate-600' : 'bg-gray-white'}`}></div>
            ))}
          </div>
          <div className="flex">
            <div className="flex gap-x-3">
              {step === 0 ? (
                <button 
                onClick={() => setIsCommunityModalOpen(false)}
                className="bg-gray-white py-3 px-3.5 rounded-full font-semibold">Cancel</button>
              ) : (
                <button
                onClick={previousStep} 
                className="bg-gray-white py-3 px-3.5 rounded-full font-semibold">Back</button>
              )}
              
              {step === 3 ? (
                <button
                onClick={handleCreateCommunity} 
                className={`py-3 px-3.5 rounded-full font-semibold ${stepValidity[step] ? 'bg-blue-700 text-white' : 'bg-gray-white text-gray-400'}`}
                disabled={!stepValidity[step]}
                >Create Community</button>
              ) : (
                <button
                onClick={nextStep} 
                className={`py-3 px-3.5 rounded-full font-semibold ${stepValidity[step] ? 'bg-blue-700 text-white' : 'bg-gray-white text-gray-400'}`}
                disabled={!stepValidity[step]}
                >Next</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const StepBasic = ({
  formData, 
  setFormData, 
  error, 
  setError, 
  setIsCommunityModalOpen,
  updateStepValidity
}: StepBasicProps) => {

   // Handlers
  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if(e.target.name === "name" && e.target.value.length > 15){
      return;
    };
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const isCommunityNameLegal = async (communityName: string) => {
    try{
      const response = await fetchWithAuth(`${BACKEND_URL}/communities/check-community-name/`, {
        method: 'POST',
        body: JSON.stringify({'community_name': communityName}),
        headers: {
          'Content-Type': 'application/json'
        }
      });
     
      if(!response?.ok){
        const error = await response?.json();
        setError((prev) => ({...prev, name: error.error}));
        return false;
      }else{
        return true;
      }

    }catch(err){
      console.error(err);
      return false;
    }
  }

  const handleNameBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const name = e.target.value.trim();
    if(name.length < 3){
      setError((prev) => ({...prev, name: "Please lengthen the text to 3 characters or more"}));
      return;
    }else if(!await isCommunityNameLegal(name)){
      return;
    }else{
      setError((prev) => ({...prev, name: ''}))
    }
  }

  useEffect(() => {
    const isValid = formData?.name.length >= 3 && !error.name && !error.description;
    updateStepValidity(0, isValid);
  }, [formData.name, formData.description, error.name, error.description, updateStepValidity])

  return (
    <>
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold leading-7 tracking-tight">Tell us about your community</h1>
        <div
          onClick={() => setIsCommunityModalOpen(false)} 
          className="bg-gray-white rounded-full p-1.5 cursor-pointer">
          <X size={20}/>
        </div>
      </div>
      <p className="mt-8 leading-5">A name and description help people understand what your community is all about.</p>
      <div className="flex justify-center my-8">
        <div className="flex flex-col shadow-[2px_2px_4px_2px_rgba(0,0,0,0.1)] py-5 px-6 w-3/4">
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
        onBlur={handleNameBlur}
        error={error.name}
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
          {/* {error.content && (
            <div className='error flex items-center'>
              <CircleAlert 
                size={18}
                color='red'
              />
              <span className='ms-1'>Please fill out this field. Content is required.</span>
            </div>
          )} */}
        </div>
      </div>
    </>
  )
};

const StepStyle = ({
  formData, 
  setFormData, 
  setIsCommunityModalOpen
}: CreateCommunityModalProps) => {

  const bannerFileRef = useRef<HTMLInputElement>(null);
  const iconFileRef = useRef<HTMLInputElement>(null);

  // Handlers
  const handleBannerAddClick = () => {
    if(bannerFileRef.current){
      bannerFileRef.current.click()
    }
  }

  const handleIconAddClick = () => {
    if(iconFileRef.current){
      iconFileRef.current.click()
    }
  }

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file && file.type.startsWith("image/")){
      const bannerPreview = URL.createObjectURL(file);
      setFormData((prev) => ({...prev, bannerFile: file, bannerPreview: bannerPreview}));
    }
  }

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file && file.type.startsWith("image/")){
      const iconPreview = URL.createObjectURL(file);
      setFormData((prev) => ({...prev, iconFile: file, iconPreview: iconPreview}));
    }
  }

  return (
    <>
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold leading-7 tracking-tight">Style your community</h1>
        <div 
          onClick={() => setIsCommunityModalOpen(false)} 
          className="bg-gray-white rounded-full p-1.5 cursor-pointer">
          <X size={20}/>
        </div>
      </div>
      <p className="mt-8 leading-5">Adding visual flair will catch new members attention and help establish your community's culture! You can update this at any time.</p>
      <div className="flex flex-col my-8 items-center">
        <div className="flex flex-col shadow-[2px_2px_4px_2px_rgba(0,0,0,0.1)] w-3/4">
        {formData.bannerPreview ? (
          <div className="bg-red-100 w-full h-9 ">
            <img src={formData.bannerPreview} alt="" className="w-full h-full object-cover"/>
          </div>
        ) : (
          <div className="bg-red-100 w-full h-9 "></div>
        )}
          
          <div className="py-5 px-6">
            <div className="flex items-center gap-x-3">
              {formData.iconPreview ? (
                <div className="w-10 h-10 rounded-full bg-red-500 overflow-hidden">
                  <img src={formData.iconPreview} alt="" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-red-500 overflow-hidden">
                  <img src={redditIcon} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              
              <div className="flex flex-col">
                <h3 className="font-semibold text-xl leading-4">{formData.name ? "r/" + formData.name : "r/communityname"}</h3>
                <div className="flex items-center text-xs">
                  <span>1 member</span>
                  <Dot />
                  <span>1 online</span>
                </div>
              </div>
            </div>
            <p className="mt-2">{formData.description ? formData.description : "Your community description"}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-2 mb-8">
        <div className="flex items-center justify-between py-1.5 cursor-pointer">
          <span>Banner</span>
          <div 
            onClick={handleBannerAddClick}
            className="bg-gray-white flex items-center justify-center px-2.5 py-1.5 gap-x-1.5 rounded-full text-xs font-medium">
            <Image size={18}/>
            <span>{formData.bannerFile ? "Change" : 'Add'}</span>
          </div>
        </div>
        <div 
          onClick={handleIconAddClick}
          className="flex items-center justify-between py-1.5 cursor-pointer">
          <span>Icon</span>
          <div className="bg-gray-white flex items-center justify-center px-2.5 py-1.5 gap-x-1.5 rounded-full text-xs font-medium">
            <Image size={18}/>
            <span>{formData.iconFile ? "Change" : 'Add'}</span>
          </div>
        </div>
        <input 
          className="hidden" 
          ref={bannerFileRef} 
          type="file" 
          onChange={handleBannerChange} 
          accept="image/*"/>
        <input 
          className="hidden" 
          ref={iconFileRef} 
          type="file" 
          onChange={handleIconChange}
          accept="image/*"/>
      </div>
    </>
  )
}

const StepTopics = ({
  formData, 
  setFormData, 
  setIsCommunityModalOpen, 
  updateStepValidity
}: StepSettingsProps) => {

  const [topicCategories, setTopicCategories] = useState<TopicCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const isValid = formData?.topics.length > 0;
    updateStepValidity(2, isValid);
  }, [formData.topics, updateStepValidity])

  const filterCategoriesByTopic = (categories: TopicCategory[], searchQuery: string): TopicCategory[] => {
    if(!searchQuery.trim()) return categories;

    const lowerQuery = searchQuery.toLowerCase();

    return categories.map((category: TopicCategory) => {
      const matchingTopics = category.topics.filter((topic) => topic.name.toLowerCase().includes(lowerQuery));

      if(matchingTopics.length === 0) return null;
      
      return {
        ...category,
        topics: matchingTopics
      }
    }).filter((category): category is TopicCategory => category !== null);
  }

  const getEmojiFromCodePoint = (codePoint: string) => {
    return String.fromCodePoint(parseInt(codePoint, 10));
  };

  const handleTopicClick = (topicId: number) => {
    if(formData.topics.length >= 3) return;
    if(formData.topics.includes(topicId)) return;
    setFormData((prev) => ({...prev, topics: [...prev.topics, topicId]}));
  }

  const findTopicById = (topicId: number) => {
    if(!topicCategories) return;
    for(const cat of topicCategories){
      const match = cat.topics.find((t) => t.id === topicId);
      if(match) return match;
    }
    return null;
  }

  const handleTopicCancel = (topicId: number) => {
    setFormData((prev) => ({
      ...prev,
      topics: prev.topics.filter((selectedTopicId) => selectedTopicId !== topicId)
    }))
  }

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }

  const filteredCategories = topicCategories ? filterCategoriesByTopic(topicCategories, searchQuery) : [];

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetchWithAuth(`${BACKEND_URL}/topics/`, {
          method: 'GET'
        });
        if(!response?.ok) console.error("Whoops, something went wrong.");
        else{
          const data = await response?.json();
          setTopicCategories(data);
        }
      }catch(err){
        console.error(err);
      }
    };
    fetchTopics();
  }, [])

  return (
    <>
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold leading-7 tracking-tight">Add topics</h1>
        <div 
          onClick={() => setIsCommunityModalOpen(false)} 
          className="bg-gray-white rounded-full p-1.5 cursor-pointer">
          <X size={20}/>
        </div>
      </div>
      <p className="mt-8 leading-5">Add up to 3 topics to help interested redditors find your community.</p>
      <div className='bg-gray-white flex py-2 rounded-full px-3 gap-x-2 mt-8'>
        <Search size={20}/>
        <input 
          value={searchQuery}
          onChange={handleSearchQueryChange}
          type="text" 
          placeholder='Filter topics' 
          className='w-full border-0 outline-0' />
      </div>
      <h2 className='font-bold text-[16px] mt-2'>Topics {formData.topics.length}/3</h2>
      <div className='flex gap-x-1.5 mt-2 w-full flex-wrap gap-y-2'>
        {formData?.topics.map((topicId, idx) => {
          const topic = findTopicById(topicId);
          return (
            topic && (
              <div key={idx} className='border-2 border-gray-200 py-1 px-2 text-xs font-semibold flex gap-x-1.5 rounded-md'>
                <span>{topic?.name}</span>
                <LucideXCircle 
                  onClick={() => handleTopicCancel(topic.id)}
                  fill='black' stroke='#efebee' size={18}/>
             </div>
            )
          )
        })}
      </div>
      <div className='mt-8 mb-5 flex flex-col gap-y-5 h-50 overflow-y-auto px-1'>
        {filteredCategories && filteredCategories.map((category, idx) => (
          category.topics.length > 0 && (
            <div key={idx} className='flex flex-col'>
              <div className='flex gap-x-2 mb-1.5'>
                <span>{getEmojiFromCodePoint(category.emoji)}</span>
                <span className='font-bold'>{category.name}</span>
              </div>
              <div className='flex flex-wrap gap-2 text-xs'>
                {category.topics.length > 0 && category.topics.map((topic, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleTopicClick(topic.id)} 
                    className={`p-2 rounded-full font-medium flex items-center gap-x-1 ${formData.topics.includes(topic.id) ? 'bg-slate-300' : 'bg-gray-white '}`}>
                      <span>{topic.name}</span>
                      {formData.topics.includes(topic.id) && (
                        <LucideXCircle 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTopicCancel(topic.id);
                          }}
                          fill='black' stroke='#cad5e2' size={18}/>
                      )}
                    </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </>
  )
}

const StepSettings = ({
  setIsCommunityModalOpen, 
  formData, 
  setFormData
}: StepSettingsProps) => {

  const changeCommunityType = (newCommunityType: 'public' | 'private' | 'restricted') => {
    if(newCommunityType === formData.type) return;
    setFormData((prev) => ({...prev, type: newCommunityType}));
  }

  return (
    <>
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold leading-7 tracking-tight">What kind of community is this?</h1>
        <div 
          onClick={() => setIsCommunityModalOpen(false)} 
          className="bg-gray-white rounded-full p-1.5 cursor-pointer">
          <X size={20}/>
        </div>
      </div>
      <p className="mt-8 leading-5">Decide who can view and contribute in your community. Only public communities show up in search. <span className='font-bold'>Important: </span>Once set, you will need to submit a request to change your community type.</p>
      <div className='flex flex-col mt-7'>
        <div
          onClick={() => changeCommunityType('public')} 
          className={`flex px-4 py-3 items-center ${formData.type === 'public' && 'bg-gray-white'}`}>
          <Globe fill='black' stroke='#efebee'/>
          <div className='flex flex-col ms-3.5'>
            <span className='font-medium'>Public</span>
            <p className='text-xs mt-0.5 text-gray-500'>Anyone can view, post, and comment to this commuity</p>
          </div>
          <input
            readOnly={true}
            type="radio" 
            name="" id="" 
            className='ms-auto' 
            checked={formData.type === 'public'}
            // onClick={() => changeCommunityType('public')} 
            />
        </div>
        <div
          onClick={() => changeCommunityType('restricted')}  
          className={`flex px-4 py-3 items-center ${formData.type === 'restricted' && 'bg-gray-white'}`}>
          <Eye />
          <div className='flex flex-col ms-3.5'>
            <span className='font-medium'>Restricted</span>
            <p className='text-xs mt-0.5 text-gray-500'>Anyone can view, but only approved users can contribute</p>
          </div>
          <input
            readOnly={true} 
            type="radio" 
            name="" 
            id="" 
            className='ms-auto'
            checked={formData.type === 'restricted'}
            // onClick={() => changeCommunityType('restricted')}  
            />
        </div>
        <div
          onClick={() => changeCommunityType('private')}  
          className={`flex px-4 py-3 items-center ${formData.type === 'private' && 'bg-gray-white'}`}>
          <Lock size={20}/>
          <div className='flex flex-col ms-3.5'>
            <span className='font-medium'>Private</span>
            <p className='text-xs mt-0.5 text-gray-500'>Only approved users can view and contribute</p>
          </div>
          <input
            readOnly={true}
            type="radio" 
            name="" 
            id="" 
            className='ms-auto'
            checked={formData.type === 'private'}
            // onClick={() => changeCommunityType('private')}  
            />
        </div>
      </div>
      <hr className='my-4 border-gray-300 border-[1px]'/>
        <div
          onClick={() => setFormData((prev) => ({...prev,  isForMature: !formData.isForMature}))} 
          className='flex px-4 py-3 items-center'>
          <div>
            <div className='w-4 h-4 bg-black rotate-45 rounded-sm flex justify-center items-center'>
                <span className='-rotate-45 text-[11px] text-white font-medium'>18</span>
            </div>
          </div>
          <div className='flex flex-col ms-3.5'>
            <span className='font-medium'>Mature (18+)</span>
            <p className='text-xs mt-0.5 text-gray-500'>Users must be over 18 to view and contribute</p>
          </div>
          <div className={`transition-all delay-300 h-8 w-12 border-2 overflow-hidden rounded-full ms-auto ${formData.isForMature ? 'bg-blue-800 border-blue-800' : 'bg-gray-white border-gray-300'}`}>
            <div 
              className={`flex justify-center items-center transition-all delay-300 w-7 h-full rounded-full border-l-0 border-gray-300 bg-white ${formData.isForMature ? 'translate-x-4' : 'translate-x-0'}`}>
                <span className={`transition-opacity delay-300 ${formData.isForMature ? 'opacity-100' : 'opacity-0'}`}><Check size={12}/></span>
              </div>
          </div>
        </div>
      <p className='text-gray-600 mt-1 pe-3 mb-5'>By continuing, you agree to our <span className='underline'>Mod Code of Conduct&nbsp;</span>and acknowledge that you understand the <span className='underline'>Reddit Rules</span>.</p>
    </>
  )
}

export default CreateCommunityModal;