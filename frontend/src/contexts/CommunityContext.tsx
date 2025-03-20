import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { fetchWithAuth } from "../utils";
import { BACKEND_URL } from "../config";

import { Community, CommunityContextType } from "../types/community";


const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export function CommunityProvider({children}: {children: ReactNode}){
  const [communities, setCommunities] = useState<Community[]>([]);

  useEffect(() => {
    const fetchCommunities = async () => {
      try{
        const response = await fetchWithAuth(`${BACKEND_URL}/communities/`, {
          method: 'GET'
        })
        if(!response?.ok){
          console.error("Whoops, problem with response.")
        }else{
          const data = await response.json();
          setCommunities(data);
          console.log(data)
        }
      }catch(err){
        console.error(err);
      }
    };
    fetchCommunities();
  }, [])

  return (
    <CommunityContext.Provider value={{communities}}>
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