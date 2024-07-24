export type userState = {
  id: string;
  username: string | undefined;
  role: string | undefined;
};
export type LessonContentState = {
  id: string;
  LessonContentname: string | undefined;
  title: string | undefined;
  notification: string | undefined;
  attachments: string | undefined;
  attendance: boolean | undefined;
  subgroup: boolean | undefined;
};
export type NewsContentState = {
  id: string;
  newsContentName: string | undefined;
  content?: string | undefined;
  title: string | undefined;
  notification: string | undefined;
  attachments: string | undefined;
  attendance: boolean | undefined;
  subgroup: boolean | undefined;
};
export type NoteRealTimeState = {
  noteId:string ;
  noteContentId: string | undefined; 
  noteContentTitle:  string | undefined;
  noteContentContent:  string | undefined;
  noteContentDate:  string | undefined;
  noteDate:  string | undefined;
};