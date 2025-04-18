import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useOutletContext, useParams } from "react-router-dom";
import { fetchWithAuth } from "../utils";
import { BACKEND_URL } from "../config";
import CommentItem from "../components/ui/CommentItem";

const UserComments = () => {
  const [comments, setComments] = useState([]);
  const { user } = useAuth()
  const { userId } = useParams();
  const profile = useOutletContext();

  useEffect(() => {
    const fetchComments = async () => {
      try{
        const response = await fetchWithAuth(`${BACKEND_URL}/profiles/${userId}/comments/`, {
          method: 'GET'
        });
        if(!response?.ok){
          console.log("Whoops, bad response.");
        }else{
          const data = await response.json();
          console.log(data);
          setComments(data);
        }
      }catch(err){
        console.error(err);
      }
    };
    fetchComments();
  }, [userId])

  return (
    <div className="grid grid-cols-1">
      {comments && comments.map((comment, idx) => (
        <CommentItem 
          key={idx}
          comment={comment}
          profile={profile}
        />
      ))}
    </div>
  )

}

export default UserComments;