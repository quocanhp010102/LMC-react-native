import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./../app/store";
import { NewsContentState } from "./types/types";

//Defining our initialState's type
type initialStateType = {
  NewsContentList: NewsContentState[];/**/
};
const NewsContentList: NewsContentState[] = [];
const initialState: initialStateType = {
  NewsContentList,
};
export const NewsContent = createSlice({
  name: "NewsContent",
  initialState,
  reducers: {
    addNewsContent: (state, action: PayloadAction<NewsContentState>) => {
      state.NewsContentList = [action.payload];
    },
    updateNewsContent: (state, action: PayloadAction<NewsContentState>) => {
      const {
        payload: { id, newsContentName },
      } = action;

      state.NewsContentList = state.NewsContentList.map((NewsContent) =>
        NewsContent.id === id
          ? { ...NewsContent, newsContentName }
          : NewsContent
      );
    },
    deleteNewsContent: (state, action: PayloadAction<{ id: string }>) => {
      state.NewsContentList = state.NewsContentList.filter(
        (NewsContent) => NewsContent.id !== action.payload.id
      );
    },
  },
});

// To able to use reducers we need to export them.
export const { addNewsContent, updateNewsContent, deleteNewsContent } =
  NewsContent.actions;

export const selectNewsContentList = (state: RootState) =>
  state.NewsContent.NewsContentList;

export default NewsContent.reducer;
