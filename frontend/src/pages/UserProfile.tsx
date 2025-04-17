import { useEffect, useState } from 'react';
import { fetchWithAuth, formatCommunity, getImage, timeAgo } from '../utils';
import { BACKEND_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import { Post } from '../types/post';
import PostItem from '../components/ui/PostItem';
import CommentItem from '../components/ui/CommentItem';


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
  const [feed, setFeed] = useState([]);
  const { user } = useAuth();


  useEffect(() => {
    const fetchOverview = async () => {
      try{
        const response = await fetchWithAuth(`${BACKEND_URL}/profiles/${user?.id}/overview/`, {
          method: 'GET'
        });
        if(!response?.ok){
          console.log("Whoops, bad response.");
        }else{
          const data = await response.json();
          console.log(data);
          setFeed(data);
        }
      }catch(err){
        console.error(err);
      }
    };
    fetchOverview();
  }, [user?.id])

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

  const handleCommentVote = async (commentId: number, type: string) => {
    const dir = type === "upvote" ? 1 : -1;
    const response = await fetchWithAuth(`${BACKEND_URL}/votes/vote?user_id=${user?.id}&obj_id=${commentId}&dir=${dir}&obj=c`, {
      method: 'POST'
    });

    if(!response?.ok){
      console.error("Whoops, something went wrong.");
    }else{
      /* 
      setCommentVote((prev) => {
        const { count, userVote: prevVote } = prev;
        let newCount = count;
        let newVote: string | null = type;
        
        if(type === "upvote"){
          if(prevVote === "upvote"){
            newCount -= 1;
            newVote = null;
          }else if(prevVote === "downvote"){
            newCount += 2
          }else{
            newCount += 1;
          }

        }else if(type === "downvote"){
          if(prevVote === "downvote"){
            newCount += 1;
            newVote = null;
          }else if(prevVote === "upvote"){
            newCount -= 2
          }else{
            newCount -= 1
          }
        };
        return {...prev, count: newCount, userVote: newVote};
      })
      */
    }
  }

  return (
    <div className="grid grid-cols-1">
      {feed && feed.map((feedItem, idx) => {
        if(feedItem.type === 'post'){
          return <PostItem key={idx} post={feedItem} onVote={handleVote}/>
        }else if(feedItem.type === 'comment'){
          return <CommentItem comment={feedItem}/>
        }
      })}
    </div>
  )
}

export default UserProfile;