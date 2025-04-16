// Assets
import ellipsisIcon from '../assets/icons/ellipsis.png';
import dotIcon from '../assets/icons/dot.png';
import UpArrow from '../assets/svgs/UpArrow';
import DownArrow from '../assets/svgs/DownArrow';

import { useEffect, useState } from 'react';
import { fetchWithAuth, formatCommunity, getImage, timeAgo } from '../utils';
import { BACKEND_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import { Post } from '../types/post';
import PostItem from '../components/ui/PostItem';


type PostVotes = {
  [id: number]: {
    count: number,
    userVote: string | null
  }
}

type hoverState = {
  id: number,
  hovered: string
}


const UserProfile = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { user } = useAuth();

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
        }
      }catch(err){
        console.error(err);
      }
    };
    fetchPosts();
  }, [])

  const handleVote = async (postId: number, voteType: "upvote" | "downvote" | null) => {
    const dir = voteType === 'upvote' ? 1 : -1;
    const updatedPosts = [...posts];
    const post = updatedPosts.find((p) => p.id === postId);

    if(!post) return;

    const previousVoteType = post?.user_vote;
    const previousVoteCount = post?.vote_count;

    const { newVoteType, newVoteCount } = getOptimisticVoteUpdate(post, voteType);
    post.user_vote = newVoteType;
    post.vote_count = newVoteCount;
    setPosts(updatedPosts);

    try{
      const response = await fetchWithAuth(`${BACKEND_URL}/votes/vote?user_id=${user?.id}&obj_id=${post.id}&dir=${dir}&obj=p`, {
        method: 'POST'
      });

      if(!response?.ok){
        post.user_vote = previousVoteType;
        post.vote_count = previousVoteCount;
        setPosts([...updatedPosts]);
        console.log("Something went wrong during voting.");
      }else{
        const data = await response?.json();
        console.log(data);
        post.vote_count = data.count;
        setPosts([...updatedPosts]);
      }
    }catch(err){
      console.error(err);
    }
  }

  const getOptimisticVoteUpdate = (post: Post, voteType: "upvote" | "downvote" | null) => {
    const previousVoteType = post.user_vote;
    let newVoteType = voteType;
    let newVoteCount = post.vote_count;

    if(voteType === 'upvote'){
      if(previousVoteType === 'upvote'){
        newVoteCount -= 1;
        newVoteType = null;
      }else if(previousVoteType === 'downvote'){
        newVoteCount += 2;
      }else{
        newVoteCount += 1;
      }
    }else if(voteType === 'downvote'){
      if(previousVoteType === 'downvote'){
        newVoteCount += 1;
        newVoteType = null;
      }else if(previousVoteType === 'upvote'){
        newVoteCount -= 2;
      }else{
        newVoteCount -= 1;
      }
    };

    return {newVoteType, newVoteCount};

  }

  return (
    <div className="grid grid-cols-1">
      {posts && posts.map((post) => (
        <PostItem key={post.id} post={post} onVote={handleVote}/>
      ))}
    </div>
  )
}

export default UserProfile;