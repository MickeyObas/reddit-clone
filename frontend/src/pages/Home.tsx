// Assets
import ellipsisIcon from '../assets/icons/ellipsis.png';
import dotIcon from '../assets/icons/dot.png';
import caretDownIcon from '../assets/icons/caret-down.png';
import columnsIcon from '../assets/icons/columns.png';

import { useEffect, useState } from 'react';
import { fetchWithAuth, formatCommunity, getImage, timeAgo } from '../utils';
import { BACKEND_URL } from '../config';

import UpArrow from '../assets/svgs/UpArrow';
import DownArrow from '../assets/svgs/DownArrow';

import { Post } from '../types/post';
import { useAuth } from '../contexts/AuthContext';


type hoverState = {
  id: number,
  hovered: string
}

type PostVotes = {
  [id: number]: {
    count: number,
    userVote: string | null
  }
}

const Home: React.FC = () => {

  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isHovered, setIsHovered] = useState<hoverState | null>(null);
  const [votes, setVotes] = useState<PostVotes>({})

  useEffect(() => {
    const fetchPosts = async () => {
      try{
        const response = await fetchWithAuth(`${BACKEND_URL}/posts/`, {
          method: 'GET'
        });
        if(!response?.ok){
          console.log("Whoops, bad response.");
        }else{
          const data = await response.json();
          setPosts(data);
          setVotes(
            data.reduce((acc: PostVotes, post: Post) => {
              acc[post.id] = {count: post.vote_count, userVote: post.user_vote};
              return acc;
            }, {})
          )
        }
      }catch(err){
        console.error(err);
      }
    };
    fetchPosts();
  }, [])

  // Handlers
  const handleVote = (postId: number, type: string) => {
    
    const postVote = async () => {
      const dir = type === 'upvote' ? 1 : -1; 

      const response = await fetchWithAuth(`${BACKEND_URL}/votes/vote?user_id=${user?.id}&obj_id=${postId}&dir=${dir}&obj=p`, {
        method: 'POST'
      });
      if(!response?.ok){
        console.log("Whoops, something went wrong during voting.");
      }else{
        const data = response?.json();
        console.log(data);

        setVotes((prevVotes) => {
          const { count, userVote: prevVote } = prevVotes[postId];
    
          let newCount = count;
          let newVote: string | null = type;
    
          if(type === 'upvote'){
            if(prevVote === 'upvote'){
              newCount -= 1;
              newVote = null;
            }else if(prevVote === 'downvote'){
              newCount += 2;
            }else{
              newCount += 1;
            }
          }else if(type === 'downvote'){
            if(prevVote === 'downvote'){
              newCount += 1;
              newVote = null;
            }else if(prevVote === 'upvote'){
              newCount -= 2;
            }else{
              newCount -= 1;
            }
          }
          console.log(newCount);
          console.log(votes)
          return {...prevVotes, [postId]: {count: newCount, userVote: newVote}}
        })
      }
    };
    postVote();
  }

  return (
    <>
      <header className='flex text-[13px] px-5 py-3 border-b border-b-slate-200'>
        <div className='flex items-center'>
          <span>Best</span>
          <img src={caretDownIcon} className='w-4 h-4 ms-0.5' />
        </div>
        <div className='flex items-center ms-4'>
          <img src={columnsIcon} className='w-6 h-6 ms-0.5' />
          <img src={caretDownIcon} className='w-4 h-4' />
        </div>
      </header>

      <main className="homepage grid grid-cols-1">
        {posts && posts.map((post, idx) => (
          <article key={idx} className="feed grid grid-cols-1 px-5 py-3 border-b border-b-slate-200">
            <div className='flex'>
              <div className='left-of-panel flex text-xs items-center'>
                <div className='w-4 h-4 rounded-full bg-green-700'></div>
                <span className='ms-2 font-medium'>{formatCommunity(post?.community)}</span>
                <img src={dotIcon} alt="" className='w-2.5 h-2.5 mx-1'/>
                <span>{timeAgo(post?.created_at)}</span>
              </div>
              <a 
                className='ms-auto bg-blue-900 text-white px-3 py-0.5 rounded-full self-center'
              >Join</a>
            </div>
            <div className='flex justify-between py-1.5 min-h-16'>
              <div className='w-[75%] font-semibold text-slate-800'>{post.title}</div>
              {post.thumbnail && (
                  <div className='w-20 h-16 rounded-xl overflow-hidden'>
                  <img 
                    src={getImage(post.thumbnail)} 
                    alt="" 
                    className='w-full h-full object-cover border-0 outline-0'
                    />
                </div>
              )}
            </div>
            <div className='flex justify-between text-xs items-center select-none'>
              <div className={`items-center rounded-full flex justify-between text-black mt-1 overflow-hidden
              ${votes[post.id].userVote === 'upvote' ? 'bg-deep-red text-white' :
                votes[post.id].userVote === 'downvote' ? 'bg-blue-600 text-white' : 'bg-slate-200' }
                `}>
                <div className={`rounded-full h-full py-2 px-2 cursor-pointer ${!votes[post.id].userVote ? 'hover:bg-slate-300' : 'hover:bg-[rgba(0,0,0,0.2)]'}`}>
                  <UpArrow
                    height="16px"
                    width="16px"
                    color={`${votes[post.id].userVote === 'upvote' ? 'white' : ''}`}
                    onClick={() => handleVote(post.id, "upvote")}
                    onMouseEnter={() => setIsHovered({
                      id: post.id,
                      hovered: "up"
                    })}
                    onMouseLeave={() => setIsHovered(null)}
                    outlineColor={
                      (isHovered?.hovered === "up" && isHovered.id == post.id) 
                        ? 'red' 
                        : `${votes[post.id].userVote === null ? 'black' : 'white'}`
                      }
                    />
                </div>
                <span className='flex justify-center min-w-3'>{votes[post.id].count}</span>
                <div className={`rounded-full h-full py-2 px-2 cursor-pointer  ${!votes[post.id].userVote ? 'hover:bg-slate-300' : 'hover:bg-[rgba(0,0,0,0.2)]'}`}>
                  <DownArrow
                    height={"16px"}
                    width={"16px"}
                    color={`${votes[post.id].userVote === 'downvote' ? 'white' : ''}`}
                    onClick={() => handleVote(post.id, "downvote")}
                    onMouseEnter={() => setIsHovered({
                      id: post.id,
                      hovered: "down"
                    })}
                    onMouseLeave={() => setIsHovered(null)}
                    outlineColor={
                      (isHovered?.hovered === "down" && isHovered.id == post.id) 
                        ? 'blue' 
                        : `${votes[post.id].userVote === null ? 'black' : 'white'}`
                      }
                  />
                </div>
              </div>
              <div>{post.comment_count} comments</div>
              <div>Share</div>
              <div>Report</div>
              <img src={ellipsisIcon} className='w-6 h-6'/>
            </div>
          </article>
        ))}
      </main>
    </>
  )
}

export default Home