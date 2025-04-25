import { User } from "./user"

export type Profile = {
    id: number,
    user: User,
    display_name: string,
    about_description: string,
    avatar: string | null, // Not sure why I'm adding this 2x in Response, but I'll fix references later, then remove this
    banner: string | null,
    is_mature: boolean,
    created_at: string
}