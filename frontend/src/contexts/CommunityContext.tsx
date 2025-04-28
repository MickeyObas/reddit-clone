import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { fetchWithAuth } from "../utils";
import { BACKEND_URL } from "../config";

import { Community, CommunityContextType } from "../types/community";


const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export function CommunityProvider({children}: {children: ReactNode}){
  const [communities, setCommunities] = useState<Community[]>([]);
  const [allCommunities, setAllCommunities] = useState<Community[]>([]);
  const [isCommunitiesLoading, setIsCommunitiesLoading] = useState(false);
  const [isAllCommunitiesLoading, setIsAllCommunitiesLoading] = useState(false);

  useEffect(() => {
    const fetchCommunities = async () => {
      try{
        setIsCommunitiesLoading(true);
        const response = await fetchWithAuth(`${BACKEND_URL}/communities/user/`, {
          method: 'GET'
        })
        if(!response?.ok){
          console.error("Whoops, problem with response.")
        }else{
          const data = await response.json();
          setCommunities(data);
        }
      }catch(err){
        console.error(err);
      }finally{
        setIsCommunitiesLoading(false);
      }
    };
    fetchCommunities();
  }, [])

  useEffect(() => {
    const fetchAllCommunities = async () => {
      try{
        setIsAllCommunitiesLoading(true);
        const response = await fetchWithAuth(`${BACKEND_URL}/communities/`, {
          method: 'GET'
        })
        if(!response?.ok){
          console.error("Whoops, problem with response.")
        }else{
          const data = await response.json();
          setAllCommunities(data);
        }
      }catch(err){
        console.error(err);
      }finally{
        setIsAllCommunitiesLoading(false);
      }
    };
    fetchAllCommunities();
  }, [])

  return (
    <CommunityContext.Provider value={{communities, setCommunities, allCommunities, setAllCommunities, isCommunitiesLoading, isAllCommunitiesLoading}}>
      {children}
    </CommunityContext.Provider>
  )
}

export const useCommunities = () => {
  const context = useContext(CommunityContext);
  if(!context){
    throw new Error("useCommunity must be used within a provider.")
  }
  return context;
};