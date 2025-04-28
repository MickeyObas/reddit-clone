import { SetStateAction } from "react"

export interface CommunityContextType {
  communities: Community[],
  setCommunities: React.Dispatch<SetStateAction<Community[]>>,
  allCommunities: Community[],
  setAllCommunities: React.Dispatch<SetStateAction<Community[]>>,
  isCommunitiesLoading: boolean,
  isAllCommunitiesLoading: boolean,
}

export type Community = {
  id: number,
  name: string,
  type: string,
  description: string,
  avatar: string | null,
  banner: string | null,
  member_count: number,
  moderators: {
    id: number,
    email: string,
    username: string
  }[],
  rules: CommunityRule[],
  created_at: string,
  is_member: boolean,
  subtitle: string | null
}

export type CommunityFormData = {
  name: string,
  description: string,
  bannerFile: File | null,
  iconFile: File | null,
  topics: number[],
  bannerPreview: string,
  iconPreview: string,
  type: 'public' | 'private' | 'restricted',
  isForMature: boolean
}

export type CommunityFormError = {
  name: string,
  description: string
}

export type CommunityRule = {
    title: string,
    description: string
}
