export type TopicCategory = {
    name: string,
    emoji: string,
    topics: Topic[]
} 

export type Topic = {
    id: number,
    name: string,
    category: number
}