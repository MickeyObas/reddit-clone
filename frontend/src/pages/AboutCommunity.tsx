import { CakeSlice, Globe, ChevronUp, ChevronDown, Mail} from "lucide-react"
import { formatDate, formatUsername } from "../utils"
import { useMemo, useState } from "react"
import { Link, useLocation } from "react-router-dom";
import defaultRedditProfileIcon from '../assets/icons/reddit-profile.png';
import { useAuth } from "../contexts/AuthContext";
import redditIcon from '../assets/icons/reddit.png';


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


const AboutCommunity = () => {

  const { user } = useAuth();
  const formattedDate = useMemo(() => {
      const dateStr = community?.created_at;
      if(!dateStr) return "N/A";
      return formatDate(dateStr);
    }, [community?.created_at])

  return (
    <div>
        <div className='bg-slate-50 flex flex-col'>
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
            {community.rules && (
            <ol className='list-decimal px-7 flex flex-col'>
              {community.rules.map((rule, idx) => (
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
            {community.moderators.length > 0 ? (
              <div className='flex flex-col gap-y-2.5'>
                {community.moderators && community.moderators.map((moderator, idx) => (
                  <div className='flex items-center gap-x-2'>
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
  )
}