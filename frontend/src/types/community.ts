export interface CommunityContextType {
  communities: Community[]
}

export type Community = {
  id: number,
  name: string,
  type: string,
  description: string,
  avatar: string | null,
  banner: string | null,
  member_count: number,
  moderators: number[],
  rules: object[],
  created_at: string
}