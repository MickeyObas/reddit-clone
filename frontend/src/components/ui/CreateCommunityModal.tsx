import redditIcon from '../../assets/icons/reddit.png';
import { AwardIcon, CircleAlert, Dot, DotIcon, Image, LucideXCircle, Search, X, XCircle } from "lucide-react";
import { FormInput } from "./FormInput";
import { useEffect, useRef, useState } from "react";
import { fetchWithAuth } from "../../utils";
import { BACKEND_URL } from "../../config";

const CreateCommunityModal = ({setIsCommunityModalOpen}) => {
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    bannerFile: null,
    iconFile: null,
    topics: []
  })
  const [error, setError] = useState({
    name:'',
    description: ''
  });
  const steps = ["basic", "style", "topics", "settings"];
  const [step, setStep] = useState(0);

  const nextStep = () => {
    if(step < steps.length - 1) setStep((prev) => prev + 1);
  }

  const previousStep = () => {
    if(step > 0) setStep((prev) => prev - 1);
  }

  const isStepValid = formData.name.length >= 3 && !error.name && !error.description;

  return (
    <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50 px-3">
      <div className="bg-white rounded-xl w-full flex flex-col p-6">
        {step === 0 && (
          <StepBasic 
            formData={formData}
            setFormData={setFormData}
            error={error}
            setError={setError}
          />
        )}
        {step === 1 && (
          <StepStyle 
            formData={formData}
            setFormData={setFormData}
          />
        )}
        {step === 2 && (
          <StepTopics 
            formData={formData}
            setFormData={setFormData}
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
              
              <button
                onClick={nextStep} 
                className={`py-3 px-3.5 rounded-full font-semibold ${isStepValid ? 'bg-blue-700 text-white' : 'bg-gray-white text-gray-400'}`}
                disabled={!isStepValid}
                >Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const StepBasic = ({formData, setFormData, error, setError}) => {

   // Handlers
   const handleFormInputChange = (e) => {
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
        const data = await response?.json();
        console.log(data);
        return true;
      }

    }catch(err){
      console.error(err);
      return false;
    }
  }

  const handleNameBlur = async (e) => {
    const name = e.target.value.trim();
    console.log(name);
    if(name.length < 3){
      setError((prev) => ({...prev, name: "Please lengthen the text to 3 characters or more"}));
      return;
    }else if(!await isCommunityNameLegal(name)){
      return;
    }else{
      setError((prev) => ({...prev, name: ''}))
    }
  }

  return (
    <>
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold leading-7 tracking-tight">Tell us about your community</h1>
        <div className="bg-gray-white rounded-full p-1.5">
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
    </>
  )
};

const StepStyle = ({formData, setFormData}) => {

  const bannerFileRef = useRef(null);
  const iconFileRef = useRef(null);
  const [bannerPreview, setBannerPreview] = useState('');
  const [iconPreview, setIconPreview] = useState('');

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

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if(file && file.type.startsWith("image/")){
      setBannerPreview(URL.createObjectURL(file));
      setFormData((prev) => ({...prev, bannerFile: file}));
    }
  }

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if(file && file.type.startsWith("image/")){
      setIconPreview(URL.createObjectURL(file));
      setFormData((prev) => ({...prev, iconFile: file}));
    }
  }

  return (
    <>
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold leading-7 tracking-tight">Style your community</h1>
        <div className="bg-gray-white rounded-full p-1.5">
          <X size={20}/>
        </div>
      </div>
      <p className="mt-8 leading-5">Adding visual flair will catch new members attention and help establish your community's culture! You can update this at any time.</p>
      <div className="flex flex-col my-8 items-center">
        <div className="flex flex-col shadow-[2px_2px_4px_2px_rgba(0,0,0,0.1)] w-3/4">
        {bannerPreview ? (
          <div className="bg-red-100 w-full h-9 ">
            <img src={bannerPreview} alt="" className="w-full h-full object-cover"/>
          </div>
        ) : (
          <div className="bg-red-100 w-full h-9 "></div>
        )}
          
          <div className="py-5 px-6">
            <div className="flex items-center gap-x-3">
              {iconPreview ? (
                <div className="w-10 h-10 rounded-full bg-red-500 overflow-hidden">
                  <img src={iconPreview} alt="" className="w-full h-full object-cover" />
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

const StepTopics = ({formData, setFormData}) => {

  const [topicCategories, setTopicCategories] = useState(null);

  const getEmojiFromCodePoint = (codePoint) => {
    return String.fromCodePoint(parseInt(codePoint, 10));
  };

  const handleTopicClick = (topicId) => {
    if(formData.topics.length >= 3) return;
    if(formData.topics.includes(topicId)) return;
    setFormData((prev) => ({...prev, topics: [...prev.topics, topicId]}));
  }

  const findTopicById = (topicId) => {
    console.log(topicId);
    if(!topicCategories) return;
    for(const cat of topicCategories){
      const match = cat.topics.find((t) => t.id === topicId);
      if(match) return match;
    }
    return null;
  }

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
        <div className="bg-gray-white rounded-full p-1.5">
          <X size={20}/>
        </div>
      </div>
      <p className="mt-8 leading-5">Add up to 3 topics to help interested redditors find your community.</p>
      <div className='bg-gray-white flex py-2 rounded-full px-3 gap-x-2 mt-8'>
        <Search size={20}/>
        <input type="text" placeholder='Filter topics' className='w-full border-0 outline-0' />
      </div>
      <h2 className='font-bold text-[16px] mt-2'>Topics {formData.topics.length}/3</h2>
      <div className='flex gap-x-1.5 mt-2 w-full flex-wrap gap-y-2'>
        {formData.topics.map((topicId, idx) => {
          const topic = findTopicById(topicId);
          return (
            <div className='border-2 border-gray-200 py-1 px-2 text-xs font-semibold flex gap-x-1.5 rounded-md'>
              <span>{topic.name}</span>
              <LucideXCircle fill='black' stroke='#efebee' size={18}/>
            </div>
          )
        })}
      </div>
      <div className='mt-8 mb-5 flex flex-col gap-y-5 h-50 overflow-y-auto px-1'>
        {topicCategories && topicCategories.map((category, idx) => (
          category.topics.length > 0 && (
            <div className='flex flex-col'>
              <div className='flex gap-x-2 mb-1.5'>
                <span>{getEmojiFromCodePoint(category.emoji)}</span>
                <span className='font-bold'>{category.name}</span>
              </div>
              <div className='flex flex-wrap gap-2 text-xs'>
                {category.topics.length > 0 && category.topics.map((topic, idx) => (
                  <div
                    onClick={() => handleTopicClick(topic.id)} 
                    className={`p-2 rounded-full font-medium flex items-center gap-x-1 ${formData.topics.includes(topic.id) ? 'bg-slate-300' : 'bg-gray-white '}`}>
                      <span>{topic.name}</span>
                      {formData.topics.includes(topic.id) && (
                        <LucideXCircle fill='black' stroke='#cad5e2' size={18}/>
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

export default CreateCommunityModal;