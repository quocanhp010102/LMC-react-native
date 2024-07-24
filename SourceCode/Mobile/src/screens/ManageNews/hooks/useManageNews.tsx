import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useHandleResponsePagination } from "../../../hooks/useHandleResponsePagination";
import { generateApiService } from "../../../services/ApiService";
import { NewsApi } from "../../../services/api/News/NewsApi";
import { ActivityHistoriesApi } from "../../../services/api/ActivityHistories/ActivityHistoriesApi";

export const useManageNews = () => {
    const [modalVisibleNoti, setModalVisibleNoti] = useState(false);
    const [type, setType] = useState<string>("");
    const [modalVisible, setModalVisible] = useState(false);
    const [queryInput, setQueryInput] = useState<string>();
    const refQueryInput = useRef<string>("")
    const [selected, setSelected] = useState<any>([]);
    const [all, setAll] = useState<boolean>(false);
    const [typeModal, setTypeModal] = useState<string>();
    const [newsChoose, setNewsChoose] = useState<any>();
  
    const handleRequestNews = useCallback(
    (pageToken: number, pageSize: number) => {
      if (!refQueryInput.current) {
        return generateApiService.get(
          NewsApi.getAllNewSortDateAndDisplay(pageToken, pageSize),
          true
        );
      } else {
        return generateApiService.get(
          NewsApi.searchNews(refQueryInput.current.trim(), pageToken, pageSize),
          true
        );
      }
    },
     []
    );

  const newsDataList = useHandleResponsePagination<any>(handleRequestNews, 20, true);

  const onRefresh = useCallback(() => {
    newsDataList.pullToRefresh();
  }, []);

  const onEndReached = useCallback(() => {
    newsDataList.handleLoadMore();
  }, []);

  useLayoutEffect(() => {
    newsDataList.refresh();
  }, []);

  const keyExtractor = useCallback((_: any, index: number) => {
    return index.toString();
  }, []);

  const checkVadidate = (inputValue: any) => {
    if (inputValue.length <= 255) {
      setQueryInput(inputValue);
      refQueryInput.current = inputValue
    } else {
      setQueryInput("");
      refQueryInput.current = ""
    }
  };
  useEffect(() => {
    if (queryInput) {

      const timeout = setTimeout(async () => {
        setQueryInput(queryInput);
        refQueryInput.current = queryInput
        onRefresh();
    
  
      }, 800);
      return () => {
        clearTimeout(timeout);
      };
    } else {
  
      onRefresh();
    }
  }, [queryInput]);

 
  
  const deleteNews = async () => {
    try {
      const result = await generateApiService.delete(
        NewsApi.deleteNews(selected.toString()),
        selected
      );
      setType("success");
      setModalVisibleNoti(true);
      let titleDelete = "";
      for (let i = 0; i < selected.length; i++) {
        var listDelete = newsDataList.data;
        var index = newsDataList.data
          .map((x: any) => {
            return x.id;
          })
          .indexOf(selected[i]);
        titleDelete = titleDelete + listDelete[index].news_title + " , ";
        listDelete.splice(index, 1);
      }
      const bodyHistory = {
        name: " tin tức " + titleDelete,
        method: "DELETE",
      };
      const history = await generateApiService.post(
        ActivityHistoriesApi.postHistories(),
        bodyHistory
      );
      setSelected([]);
    } catch (error) {
      setType("error");
      setModalVisibleNoti(true);
    }
  };
  const choose = useCallback(
    (id: number) => {
      let newData = [...selected];
      if (selected.includes(id)) {
        newData = newData.filter((x) => x !== id);
      } else {
        newData.push(id);
      }
      setSelected(newData);
    },
    [selected]
  );
  const chooseAll = () => {
    if (!all) {
      const allId = newsDataList.data.map((news: any) => news.id);
      setSelected(allId);
    } else {
      setSelected([]);
    }
    setAll(!all);
  };

  

  return {
    keyExtractor,
    onEndReached,
    newsDataList,
    onRefresh,
    queryInput,
    checkVadidate,
    setQueryInput,
    setTypeModal,
    setModalVisible,
    setAll,
    all,
    chooseAll,
    selected,
    choose,
    setNewsChoose,
    modalVisible,
    typeModal,
    deleteNews,
    newsChoose,
    modalVisibleNoti,
    setModalVisibleNoti,
    type,
  };
};
