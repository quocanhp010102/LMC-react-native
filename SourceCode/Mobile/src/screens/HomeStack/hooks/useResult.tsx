import {useCallback, useLayoutEffect, useState} from "react";
import { useHandleResponsePagination } from "../../../hooks/useHandleResponsePagination";
import { generateApiService } from "../../../services/ApiService";
import { NewsApi } from "../../../services/api/News/NewsApi";

export const useResultNews = () => {
  const [displayNews, setDisplayNews] = useState<any>([1, 2, 3, 4, 5]);

  const getDisplayNews = useCallback(async () => {
    const dataDisplayNews = await generateApiService.get(
        NewsApi.getNewsDisplay()
    );
    setDisplayNews(dataDisplayNews);
  }, []);
  const handleRequestNews= useCallback(
    (pageToken: number, pageSize: number) => {
      return generateApiService.get(NewsApi.getNews(pageToken, pageSize) , true );
    },
    []
  );

  const news= useHandleResponsePagination<any>(
    handleRequestNews,
    12 , true

  );

  const onRefresh = useCallback(() => {
    news.pullToRefresh();
  }, []);

  const onEndReached = useCallback(() => {
    news.handleLoadMore();
  }, []);

  useLayoutEffect(() => {
    news.refresh();
    getDisplayNews()
  }, []);

  const keyExtractor = useCallback((_ : any, index : number) => {
    return index.toString();
  }, []);

  return {
    keyExtractor,
    onEndReached,
    news,
    onRefresh,
    displayNews
  };
};
