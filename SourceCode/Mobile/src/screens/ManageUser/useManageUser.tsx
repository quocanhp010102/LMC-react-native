import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { generateApiService } from "../../services/ApiService";
import { ManageUserManualApi } from "../../services/api/ManageUserManual/ManageUserManualApi";
import { useHandleResponsePagination } from "../../hooks/useHandleResponsePagination";


export const useManageUser = () => {
  const [queryInput, setQueryInput] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const selected = useRef<number[]>([])
  const [typeModal, setTypeModal] = useState<string>();
  const [userChoose, setUserChoose] = useState<any[]>([]);
  const [modalVisibleNotifi, setModalVisibleNotifi] = useState(false);
  const [type, setType] = useState<string>("error");
  const [allNew, setAllNew] = useState<boolean>(false);
  const [titleNoti, setTitleNoti] = useState("Thêm người dùng");
  const [disabled, setDisabled] = useState<boolean>(true)

  const choose = useCallback(
    (id?: number) => {
      if (id) {
        let newData = [...selected.current];
        setDisabled(false);
        if (selected.current.includes(id)) {
          newData = newData.filter((x) => x !== id);
        } else {
          newData.push(id);
        }

        if (newData.length == 0) {
          setDisabled(true);
        }
        selected.current = newData;
      }
    },
    [selected, setDisabled]
  );

  const chooseAllNewStudent = () => {
    if (!allNew) {
      if (users.data.length > 0) {
        const allId = users.data.map((user) => user.id);
        selected.current = allId;
        setDisabled(false);
      }
    } else {
      selected.current = [];
      setDisabled(true);
    }
    setAllNew(!allNew);
  };

  const checkVadidate = async (inputValue: any) => {
    if (inputValue.length <= 255) {
      setQueryInput(inputValue);
    } else {
      setQueryInput("");
    }
  };

  const onGetAllUser = async (pageToken: number, pageSize: number) => {
    const response = await generateApiService.get(
      ManageUserManualApi.getAllUser(pageToken, pageSize)
    );
    if (response.UserRole) {
      return {
        data: response.UserRole,
        success: true,
      };
    }
    return response;
  };

  const searchUserCheck = async (inputValue: any, pageToken: number, pageSize: number) => {
    if (inputValue.length <= 255) {
      if (inputValue.length !== 0) {
        const response = await generateApiService.get(
          ManageUserManualApi.searchUser(inputValue, pageToken, pageSize)
        );
        if (response) {
          return {
            data: response.UserRole,
            success: true,
          };
        }
      }
    };
  }

  const handleRequestNews = useCallback(
    (pageToken: number, pageSize: number) => {
      if (!queryInput) {
        return onGetAllUser(pageToken, pageSize);
      } else {
        return searchUserCheck(queryInput, pageToken, pageSize);
      }
    },
    [onGetAllUser, queryInput]
  );

  const users = useHandleResponsePagination<any>(
    handleRequestNews,
    25 , false
  );

  const onRefresh = useCallback(() => {
    setQueryInput("")
    users.refresh()
  }, [queryInput]);

  const onEndReached = useCallback(() => {
    users.handleLoadMore();
  }, [queryInput]);


  useEffect(() => {
    selected.current = []
    setAllNew(false)
    if (queryInput) {
      const timeout = setTimeout(async () => {
        users.refresh();
      }, 800);
      return () => {
        clearTimeout(timeout);
      };
    } else {
      users.refresh();
    }
  }, [queryInput]);

  const keyExtractor = useCallback((_: any, index: number) => {
    return index.toString();
  }, []);

  return {
    keyExtractor,
    onEndReached,
    listUser: users.data,
    onRefresh,
    users,
    checkVadidate,
    queryInput,
    setQueryInput,
    modalVisible,
    setModalVisible,
    selected,
    typeModal,
    setTypeModal,
    userChoose,
    setUserChoose,
    modalVisibleNotifi,
    setModalVisibleNotifi,
    type,
    setType,
    titleNoti,
    setTitleNoti,
    choose,
    allNew,
    chooseAllNewStudent,
    setAllNew,
    disabled, 
    setDisabled
  };
};
