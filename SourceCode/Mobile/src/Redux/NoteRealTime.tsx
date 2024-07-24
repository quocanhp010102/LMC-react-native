import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./../app/store";
import { v4 as uuidv4 } from "uuid";
import { NoteRealTimeState } from "./types/types";

//Defining our initialState's type
type initialStateType = {
  NoteRealTimeList: NoteRealTimeState[];
  numberNotification: number;
};
const NoteRealTimeList: NoteRealTimeState[] = [];
const initialState: initialStateType = {
  NoteRealTimeList,
  numberNotification: 0,
};
export const NoteRealTime = createSlice({
  name: "NoteRealTime",
  initialState,
  reducers: {
    addNoteRealTime: (state, action: PayloadAction<NoteRealTimeState>) => {
      state.NoteRealTimeList = [action.payload];
    },
    addNumberNotification: (state, action: PayloadAction<number>) => {
      state.numberNotification = action.payload;
    },
    decreaseNumberNotification: (state, action: PayloadAction<boolean>) => {
      state.numberNotification = state.numberNotification - 1;
    },
    updateNoteRealTime: (state, action: PayloadAction<NoteRealTimeState>) => {
      const {
        payload: {
          noteId,
          noteContentId,
          noteContentTitle,
          noteContentContent,
          noteContentDate,
          noteDate,
        },
      } = action;

      state.NoteRealTimeList = state.NoteRealTimeList.map((NoteRealTime) =>
        NoteRealTime.noteId === noteId
          ? {
              ...NoteRealTime,
              noteId,
              noteContentId,
              noteContentTitle,
              noteContentContent,
              noteContentDate,
              noteDate,
            }
          : NoteRealTime
      );
    },
    deleteNoteRealTime: (state, action: PayloadAction<{ noteId: string }>) => {
      state.NoteRealTimeList = state.NoteRealTimeList.filter(
        (NoteRealTime) => NoteRealTime.noteId !== action.payload.noteId
      );
    },
  },
});
// To able to use reducers we need to export them.
export const {
  addNoteRealTime,
  updateNoteRealTime,
  deleteNoteRealTime,
  addNumberNotification,
  decreaseNumberNotification,
} = NoteRealTime.actions;

export const selectNoteRealTimeList = (state: RootState) =>
  state.NoteRealTime.NoteRealTimeList;
export default NoteRealTime.reducer;
