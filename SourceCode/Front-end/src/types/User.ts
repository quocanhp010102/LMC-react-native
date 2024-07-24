export type User = {
    id?: number | string,
    login?: string,
    firstName: string,
    lastName: string,
    email?: string,
    activated: boolean,
    langKey?: string,
    imageUrl?: string | null,
    authorities?: null
}


export type Admin = {
    id?: number | string,
    admin_code?: string,
    admin_birthday?:string,
    admin_email?: string,
    admin_fullname?: string,
    admin_gender?:string,
    admin_phone?: string,
    admin_avatar?: string,
    user?: User
}