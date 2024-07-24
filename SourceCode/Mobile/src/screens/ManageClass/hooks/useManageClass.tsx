import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useHandleResponsePagination } from "../../../hooks/useHandleResponsePagination";
import { generateApiService } from "../../../services/ApiService";
import { NewsApi } from "../../../services/api/News/NewsApi";
import { ClassApi } from "../../../services/api/Class/ClassApi";

export const useManageClass = () => {
  const [queryInput, setQueryInput] = useState<string>("");
  const handleRequestNews= useCallback(
    async (pageToken: number, pageSize: number) => {
      const res = await  generateApiService.get(ClassApi.getAllClass(pageToken, pageSize) , true );
      return {
        success: true,
        data: res.data,
      }},
    []
  );

  const classList= useHandleResponsePagination<any>(
    handleRequestNews,
    20 , true
  );

  const onRefresh = useCallback(() => {
    classList.pullToRefresh();
  }, []);

  const onEndReached = useCallback(() => {
    classList.handleLoadMore();
  }, []);


  const checkValidate = (inputValue: any) => {
    if (inputValue.length <= 255) {
        setQueryInput(inputValue);
    } else {
        setQueryInput("");
    }
};


useEffect(() => {
    try {
        if (queryInput) {
            const timeout = setTimeout(async () => {
                setQueryInput(queryInput);
                const dataClass = await generateApiService.get(
                    ClassApi.searchClassroom(queryInput)
                );
                if (dataClass) {
                  classList.setData(dataClass.content);
                }
            }, 800);
            return () => {
                clearTimeout(timeout);
            };
        } else {
          
            classList.refresh();
        }
    } catch (error) {
    }
}, [queryInput]);


  const keyExtractor = useCallback((_ : any, index : number) => {
    return index.toString();
  }, []);

  return {
    keyExtractor,
    onEndReached,
    classList,
    onRefresh,
    queryInput,
    setQueryInput,
    checkValidate
  };
};
