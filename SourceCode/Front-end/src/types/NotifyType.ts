export type NotifyType = {
    id: number,
    notificationTitle: string,
    notificationContent: string,
    notificationTime: string,
    notificationStatus: string | number,
    user: string | null,
    receiverImg: string | null
    noteId?: number,
    noteContentId?: string,
    noteContentTitle?: string,
    noteContentContent?:string

}

export type authori = {
        name: "ROLE_STUDENT" | "ROLE_LECTURER"
}