import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./../app/store";
import { v4 as uuidv4 } from "uuid";
import { LessonContentState } from "./types/types";

//Defining our initialState's type
type initialStateType = {
  LessonContentList: LessonContentState[];
};
const LessonContentList: LessonContentState[] = [];

const initialState: initialStateType = {
  LessonContentList,
};

export const LessonContent = createSlice({
  name: "LessonContent",
  initialState,
  reducers: {
    addnewLessonContent: (state, action: PayloadAction<LessonContentState>) => {
      state.LessonContentList = [action.payload];
    },
    updateLessonContent: (state, action: PayloadAction<LessonContentState>) => {
      const {
        payload: { id, LessonContentname },
      } = action;

      state.LessonContentList = state.LessonContentList.map((LessonContent) =>
        LessonContent.id === id
          ? { ...LessonContent, LessonContentname }
          : LessonContent
      );
    },
    deleteLessonContent: (state, action: PayloadAction<{ id: string }>) => {
      state.LessonContentList = state.LessonContentList.filter(
        (LessonContent) => LessonContent.id !== action.payload.id
      );
    },
  },
});

// To able to use reducers we need to export them.
export const { addnewLessonContent, updateLessonContent, deleteLessonContent } =
  LessonContent.actions;

export const selectLessonContentList = (state: RootState) =>
  state.LessonContent.LessonContentList;

export default LessonContent.reducer;
