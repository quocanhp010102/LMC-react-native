import { User } from "./User"

export type Questions = {
    title:string|null,
    id:number,
    status:string | number,
    content:string |null,
    answerContent:string|null,
    typeUser:boolean | string,
    user: User
}
export type InputQuestion = {
    title:string|null,
    status:boolean | null,
    content:string,
    answerContent:string|null,
    typeUser:boolean | null,
    user: User
}