import { User } from "./User"

export type Teacher = {
    id?: number | string,
    lecturer_code?: string,
    lecturer_birthday?:string,
    lecturer_email?: string,
    lecturer_fullname?: string,
    lecturer_gender?:string,
    lecturer_phone?: string,
    lecturer_avatar?: string,
    user?: User
}