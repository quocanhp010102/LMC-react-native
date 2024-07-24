import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "../Redux/counterSlice";
import { LessonContent } from "../Redux/LessonContent";
import { NewsContent } from "../Redux/NewsContent";
import { NoteRealTime } from "../Redux/NoteRealTime";
export const store = configureStore({
  reducer: {
    users: counterSlice.reducer,
    LessonContent: LessonContent.reducer,
    NewsContent: NewsContent.reducer,
    NoteRealTime: NoteRealTime.reducer,
  },
});
export type RootState = ReturnType<typeof store.getState>; // A global type to access reducers types
export type AppDispatch = typeof store.dispatch; // Type to access dispatch
