export interface CommentType {
    body: string,
    created_at: string,
    id: number,
    owner: number,
    parent?: null | number,
    user_vote: string,
    post: number,
    replies: CommentType[],
    vote_count: number
}