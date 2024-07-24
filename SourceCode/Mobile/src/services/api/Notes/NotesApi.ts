import { API } from "../..";

export const NotesApi = {
  getAllNotes: (page: number): string =>
    `${API.PUBLIC}services/lmstrainingmanagementtest/api/notes?size=${page}`,
  getNotesById: (noteId: number): string =>
    `${API.PUBLIC}services/lmstrainingmanagementtest/api/notes/${noteId}`,
  getAllByCurrentUserLogin: (): string =>
    `${API.PUBLIC}services/lmstrainingmanagementtest/api/notes/currentUserLogin`,
  saveNotes: (): string =>
    `${API.PUBLIC}services/lmstrainingmanagementtest/api/notes`,
  deleteNote: (id: number | undefined): string =>
    `${API.PUBLIC}services/lmstrainingmanagementtest/api/note-contents/${id}`,
  getAllNoteByUserAndMonth: (date: string): string =>
    `${API.PUBLIC}services/lmstrainingmanagementtest/api/notes/currentLoginAndMonth?date=${date}`,
};
