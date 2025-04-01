import { CakeSlice, Globe, ChevronUp, ChevronDown, Mail, PlusIcon, Ellipsis} from "lucide-react"
import { fetchWithAuth, formatDate, formatUsername } from "../utils"
import { useMemo, useState, useEffect} from "react"
import { Link, useLocation, useParams } from "react-router-dom";
import defaultRedditProfileIcon from '../assets/icons/reddit-profile.png';
import { useAuth } from "../contexts/AuthContext";
import redditIcon from '../assets/icons/reddit.png';
import columnsIcon from '../assets/icons/columns.png';
import { BACKEND_URL } from "../config";


const RuleItem = ({rule, idx}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <li
      onClick={() => setIsExpanded(!isExpanded)} 
      className='flex flex-col cursor-pointer py-3'>
      <div className='flex justify-between'>
        <div className='flex gap-x-4'>
          <span>{idx+1}</span>
          <span>{rule.title}</span>
        </div>
        {isExpanded ? (
          <span><ChevronUp size={18} /></span>
        ) : (
          <span><ChevronDown size={18} /></span>
        )}
      </div>
      <div className={`ms-4 mt-2 overflow-hidden transition-max-height duration-200 ease-in-out ${isExpanded ? 'max-h-40' : 'max-h-0'}`}>{rule.description}</div>
    </li> 
  )

}

export const AboutCommunity = () => {

  const [community, setCommunity] = useState();
  const { communityId } = useParams();
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);


   useEffect(() => {
      const fetchCommunity = async () => {
        try{
          setLoading(true)
          const response = await fetchWithAuth(`${BACKEND_URL}/communities/${communityId}/`, {
            method: 'GET'
          });
          if(!response?.ok) console.error("Whoopps, something went wrong.");
          else{
            const data = await response?.json();
            console.log(data);
            setCommunity(data);
            setIsMember(data.is_member);
          }
        }catch(err){
          console.error(err);
        }finally{
          setLoading(false);
        }
      };
      fetchCommunity();
    }, [communityId])

  const { user } = useAuth();
  const formattedDate = useMemo(() => {
      const dateStr = community?.created_at;
      if(!dateStr) return "N/A";
      return formatDate(dateStr);
    }, [community?.created_at])

    const handleJoin = async () => {
      try{
        const response = await fetchWithAuth(`${BACKEND_URL}/communities/${communityId}/join/`, {
          method: 'POST'
        });
        if(!response?.ok){
          console.error("Whoops, something went wrong.");
        }else{
          const data = await response.json();
          console.log(data);
          setIsMember(true);
        }
      }catch(err){
        console.error(err);
      }
    };

  if(loading) return <h1>Loading...</h1>

  return (
    <div>
      <div
        className="bg-gray-white p-5"
      >Banner</div>
      <div className="grid grid-cols-1">
        <div className="flex gap-x-6 mx-4.5 py-5">
          <div className='h-8 w-8'>
            <img src={redditIcon} alt="" />
          </div>
          <div className='flex flex-col'>
            <h3 className='font-bold text-[16px]'>{community.name}</h3>
            <div className='flex text-xs text-slate-500 items-center gap-x-1.5'>
              <span>146k members</span>
              <div className='flex items-center gap-x-1.5'>
                <span className='bg-green-500 w-2 h-2 rounded-full'></span>
                <span>20 online</span>
              </div>
            </div>
          </div>
        </div>
        <div className='flex gap-x-2 items-center mt-1 mx-4.5'>
          <button className='flex items-center text-xs py-1 border ps-1.5 pe-2.5 gap-x-1 rounded-full'>
            <span><PlusIcon size={20}/></span>
            <span>Create Post</span>
          </button>
          {isMember ? (
            <button className='flex items-center justify-center text-xs py-2 border px-3  rounded-full cursor-pointer'>
            <span>Joined</span>
          </button>
          ): (
            <button 
              onClick={handleJoin}
              className='flex items-center justify-center text-xs py-2 border px-3  rounded-full bg-blue-700 text-white cursor-pointer'>
            <span>Join</span>
          </button>
          )}
          
          <button className='flex items-center justify-center text-xs border p-1.5 rounded-full'>
            <span className='flex items-center justify-center'><Ellipsis size={16}/></span>
          </button>
        </div>
        <div className='flex items-center text-xs font-medium mt-3 justify-between mx-4.5'>
          <div className='flex items-center gap-x-2'>
            <Link
              to={`/community/${communityId}/`}
              className={`py-2.5 px-3.5 rounded-full ${location.pathname === `/community/${communityId}/` ? 'bg-slate-300' : ''}`}>
              Feed
            </Link>
            <Link
              to={`/community/${communityId}/about/`}
              className={`py-2.5 px-3.5 rounded-full ${location.pathname.includes('about') ? 'bg-slate-300' : ''}`}>
              About
            </Link>
          </div>
          <div className='flex items-center'>
            <div className='flex items-center gap-x-1'>
              <span>Best</span>
              <span><ChevronDown size={14}/></span>
            </div>
            <div className='flex items-center ms-4'>
              <img src={columnsIcon} className='w-6 h-6 ms-0.5' />
              <span><ChevronDown size={14}/></span>
            </div>
          </div>
        </div>
        
        <div className='bg-slate-50 flex flex-col mt-10'>
          <div className='px-3 py-3 border-b border-b-slate-300'>
            <h3 className='uppercase font-semibold'>About Community</h3>
            {community?.subtitle && (
              <h3 className='font-bold mt-5'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, odit?</h3>
            )}
            <p className='mt-1 leading-6 mb-2.5'>{community?.description}</p>
            <div className='text-sm flex gap-x-1.5 mb-2'>
              <CakeSlice transform='scale(-1 1)' size={22} strokeWidth={1} />
              <span>Created {formattedDate}</span>
            </div>
            <div className='text-sm flex gap-x-1.5'>
              <Globe size={22} strokeWidth={1} />
              <span>Public</span>
            </div>
          </div>
        </div>

        <div className='bg-slate-50 flex flex-col'>
          <div className='px-3 py-6 border-b border-b-slate-300'>
            <h3 className='uppercase font-semibold mb-3'>User Flair</h3>
            <div className='flex items-center gap-x-2.5'>
              <div className='rounded-full overflow-hidden w-8 h-8'>
                <img src={defaultRedditProfileIcon} alt="" />
              </div>
              <h3>{user?.username}</h3>
            </div>            
          </div>
        </div>

        <div className='bg-slate-50 flex flex-col'>
          <div className='px-3 py-6 border-b border-b-slate-300'>
            <h3 className='uppercase font-semibold mb-3'>Community Bookmarks</h3>
            <div className='flex flex-col gap-y-2.5'>
              {Array.from({length: 5}).map((_, index) => (
                <Link key={index} to='' className='bg-gray-white rounded-full text-center p-2 font-semibold cursor-pointer hover:bg-gray-300 hover:underline'>Lorem, ipsum.</Link>
              ))}
            </div>            
          </div>
        </div>

        <div className='bg-slate-50 flex flex-col'>
          <div className='px-3 py-6 border-b border-b-slate-300'>
            <h3 className='uppercase font-semibold mb-3'>Rules</h3>
            {community?.rules && (
            <ol className='list-decimal px-7 flex flex-col'>
              {community?.rules.map((rule, idx) => (
                <RuleItem key={idx} rule={rule} idx={idx}/>
              ))}
            </ol>                
            )}
          </div>
        </div>

        <div className='bg-slate-50 flex flex-col'>
          <div className='px-3 py-6 border-b border-b-slate-300'>
            <h3 className='uppercase font-semibold mb-3'>Moderators</h3>
            <div className='bg-gray-white rounded-full text-center p-2 font-semibold cursor-pointer hover:bg-gray-300 hover:underline flex justify-center gap-x-2 items-center mb-4'>
              <Mail size={20} />
              <span>Message Mods</span>
            </div>
            {community?.moderators?.length > 0 ? (
              <div className='flex flex-col gap-y-2.5'>
                {community?.moderators && community?.moderators.map((moderator, idx) => (
                  <div key={idx} className='flex items-center gap-x-2'>
                    <div className='h-8 w-8'>
                      <img src={redditIcon} alt="" />
                    </div>
                    <div className='flex flex-col'>
                      <div className='flex gap-x-2'>
                        <h2>{formatUsername(moderator.username)}</h2>
                        <div className='bg-black text-white rounded-full px-1.5 '>
                          CREATOR
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <h1>No moderators.</h1>
            )}
          </div>
        </div>
      </div>
    </div>
    
  )
}