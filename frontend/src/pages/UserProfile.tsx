import { useEffect, useState } from 'react';
import { fetchWithAuth, formatCommunity, getImage, timeAgo } from '../utils';
import { BACKEND_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import { Post } from '../types/post';
import PostItem from '../components/ui/PostItem';
import CommentItem from '../components/ui/CommentItem';
import { useOutletContext, useParams } from 'react-router-dom';


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
  const { userId } = useParams();
  const profile = useOutletContext();


  useEffect(() => {
    const fetchOverview = async () => {
      try{
        const response = await fetchWithAuth(`${BACKEND_URL}/profiles/${userId}/overview/`, {
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
  }, [userId])

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

  const handlePostVote = async (postId: number, voteType: "upvote" | "downvote" | null) => {
    const dir = voteType === 'upvote' ? 1 : -1;
    const updatedFeedItems = [...feed];
    const post = updatedFeedItems.find((p) => p.id === postId);

    if(!post) return;

    const previousVoteType = post?.user_vote;
    const previousVoteCount = post?.vote_count;

    const { newVoteType, newVoteCount } = getOptimisticVoteUpdate(post, voteType);
    post.user_vote = newVoteType;
    post.vote_count = newVoteCount;
    setPosts(updatedFeedItems);

    try{
      const response = await fetchWithAuth(`${BACKEND_URL}/votes/vote?user_id=${user?.id}&obj_id=${post.id}&dir=${dir}&obj=p`, {
        method: 'POST'
      });

      if(!response?.ok){
        post.user_vote = previousVoteType;
        post.vote_count = previousVoteCount;
        setPosts([...updatedFeedItems]);
        console.log("Something went wrong during voting.");
      }else{
        const data = await response?.json();
        console.log(data);
        post.vote_count = data.count;
        setPosts([...updatedFeedItems]);
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

  const getOptimisticCommentVoteUpdate = (comment: Comment, voteType: "upvote" | "downvote" | null) => {
    const previousVoteType = comment.user_vote;
    let newVoteType = voteType;
    let newVoteCount = comment.vote_count;

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

  const handleCommentVote = async (commentId: number, type: "upvote" | "downvote" | null) => {
    const dir = type === "upvote" ? 1 : -1;
    const updatedFeedItems = [...feed];
    const comment = updatedFeedItems.find((c) => c.id === commentId);
    
    if(!comment) return;

    const previousVoteType = comment?.user_vote;
    const previousVoteCount = comment?.vote_count;

    const { newVoteType, newVoteCount } = getOptimisticCommentVoteUpdate(comment, type);
    comment.user_vote = newVoteType;
    comment.vote_count = newVoteCount;
    setFeed(updatedFeedItems);

    const response = await fetchWithAuth(`${BACKEND_URL}/votes/vote?user_id=${user?.id}&obj_id=${commentId}&dir=${dir}&obj=c`, {
      method: 'POST'
    });

    if(!response.ok){
      comment.user_vote = previousVoteType;
      comment.vote_count = previousVoteCount;
      setFeed([...updatedFeedItems]);
      console.log("Something went wrong during voting");
    }else{
      const data = await response?.json();
      console.log(data);
      comment.vote_count = data.count;
      setFeed([...updatedFeedItems]);
    }

  }

  return (
    <div className="grid grid-cols-1">
      {feed && feed.map((feedItem, idx) => {
        if(feedItem.type === 'post'){
          return (
            <PostItem 
              key={idx} 
              post={feedItem} 
              onVote={handlePostVote}
              profile={profile}
              />
            )
        }else if(feedItem.type === 'comment'){
          return (
            <CommentItem 
              key={idx} 
              comment={feedItem} 
              onVote={handleCommentVote}
              profile={profile}
              />
            )
        }
      })}
    </div>
  )
}

export default UserProfile;