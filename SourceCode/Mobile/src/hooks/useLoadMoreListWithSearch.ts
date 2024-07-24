import { useCallback, useState } from "react";
import { useHandleResponsePagination } from "./useHandleResponsePagination";
import { Response } from "./useHandleResponsePagination";

interface ILoadMoreListWithSearch<T> {
  onGetAllData: (
    pageToken: number,
    pageSize: number
  ) => Promise<Response> ;

  searchDataCheck: (
    inputValue: string,
    pageToken: number,
    pageSize: number
  ) => Promise<Response> ;
  pageSize?: number;
}

export const useLoadMoreListWithSearch = <T>({
  onGetAllData,
  searchDataCheck,
  pageSize = 20,
}: ILoadMoreListWithSearch<T>) => {
  const [queryInput, setQueryInput] = useState<string>("");
  const handleRequestData = useCallback(
    (pageToken: number, pageSize: number) => {
      if (!queryInput) {
        return onGetAllData(pageToken, pageSize);
      } else {
        return searchDataCheck(queryInput, pageToken, pageSize);
      }
    },
    [onGetAllData, queryInput]
  );

  const data = useHandleResponsePagination<T>(handleRequestData, pageSize, false);

  const checkValidateSearch = async (inputValue: any) => {
    if (inputValue.length <= 255) {
      setQueryInput(inputValue);
    } else {
      setQueryInput("");
    }
  };

  const keyExtractor = useCallback((_: any, index: number) => {
    return index.toString();
  }, []);

  const onRefresh = useCallback(() => {
    setQueryInput("");
    data.refresh();
  }, [queryInput]);

  const onEndReached = useCallback(() => {
    data.handleLoadMore();
  }, [queryInput]);

  

  

  return {
    onEndReached,
    onRefresh,
    keyExtractor,
    checkValidateSearch,
    queryInput,
    setQueryInput,
    data,
  };
};
