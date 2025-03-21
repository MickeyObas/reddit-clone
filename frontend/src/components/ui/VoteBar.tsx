import { useState } from "react";
import UpArrow from '../../assets/svgs/UpArrow';
import DownArrow from '../../assets/svgs/DownArrow';

interface VoteBarProps {
  vote: string | null | undefined,
  onVote: (type: string) => void,
  initialCount: number | undefined
}
const VoteBar = ({
  vote,
  onVote,
  initialCount
}: VoteBarProps) => {

  const [isHovered, setIsHovered] = useState<string | null>(null);

  return (
    <div className={`items-center rounded-full flex justify-between text-black overflow-hidden
      ${vote === 'upvote' ? 'bg-deep-red text-white' :
        vote === 'downvote' ? 'bg-blue-600 text-white' : 'bg-slate-200' }
        `}>
        <div className={`rounded-full h-full px-2 py-2 cursor-pointer ${!vote ? 'hover:bg-slate-300' : 'hover:bg-[rgba(0,0,0,0.2)]'}`}>
          <UpArrow
            height={"18px"}
            width={"18px"}
            color={`${vote === 'upvote' ? 'white' : ''}`}
            onClick={() => onVote("upvote")}
            onMouseEnter={() => setIsHovered("up")}
            onMouseLeave={() => setIsHovered(null)}
            outlineColor={
              (isHovered === "up") 
                ? 'red' 
                : `${vote === null ? 'black' : 'white'}`
              }
            />
        </div>
        <span className='flex justify-center min-w-3'>{initialCount}</span>
        <div className={`rounded-full h-full py-2 px-2 cursor-pointer  ${!vote ? 'hover:bg-slate-300' : 'hover:bg-[rgba(0,0,0,0.2)]'}`}>
          <DownArrow
            height={"18px"}
            width={"18px"}
            color={`${vote === 'downvote' ? 'white' : ''}`}
            onClick={() => onVote("downvote")}
            onMouseEnter={() => setIsHovered("down")}
            onMouseLeave={() => setIsHovered(null)}
            outlineColor={
              (isHovered === "down") 
                ? 'blue' 
                : `${vote === null ? 'black' : 'white'}`
              }
          />
        </div>
      </div>
  )
}

export default VoteBar;