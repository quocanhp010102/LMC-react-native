import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useHandleResponsePagination } from "../../../hooks/useHandleResponsePagination";
import { generateApiService } from "../../../services/ApiService";
import { NewsApi } from "../../../services/api/News/NewsApi";

export const useResultCourse = () => {
  // const handleRequestNews= useCallback(
  //   (pageToken: number, pageSize: number) => {
  //     return generateApiService.get(NewsApi.getNews(pageToken, pageSize) , true );
  //   },
  //   []
  // );
  //
  // const news= useHandleResponsePagination<any>(
  //   handleRequestNews,
  //   12 , true
  //
  // );
  //
  //
  //
  // const onRefresh = useCallback(() => {
  //   news.pullToRefresh();
  // }, []);
  //
  // const onEndReached = useCallback(() => {
  //   news.handleLoadMore();
  // }, []);
  //
  // useLayoutEffect(() => {
  //   news.refresh();
  // }, []);
  //
  // const keyExtractor = useCallback((_, index) => {
  //   return index.toString();
  // }, []);
  //
  // return {
  //   keyExtractor,
  //   onEndReached,
  //   news,
  //   onRefresh,
  // };
};
