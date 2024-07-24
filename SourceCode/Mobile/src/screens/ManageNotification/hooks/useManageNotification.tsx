import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useHandleResponsePagination } from "../../../hooks/useHandleResponsePagination";
import { generateApiService } from "../../../services/ApiService";
import { NotificationApi } from "../../../services/api/Notification/NotificationApi";


export const useManageNotification = () => {
    const [modalVisibleNotifi, setModalVisibleNotifi] = useState(false);
    const [type, setType] = useState<string>("");
    const [titleEdit, setTitleEdit] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [queryInput, setQueryInput] = useState<string>("");
    const refQueryInput = useRef<string>("");
    const [selected, setSelected] = useState<any>([]);
    const [all, setAll] = useState<boolean>(false);
    const [typeModal, setTypeModal] = useState<string>();
    const [userChoose, setNotificationChoose] = useState<any>();

  const handleRequestNotifications = useCallback(
    (pageToken: number, pageSize: number) => {
      if (!refQueryInput.current) {
        return generateApiService.get(
          NotificationApi.getAllNotifications(pageToken, pageSize),
          true
        );
      } else {
        return generateApiService.get(
          NotificationApi.searchNotifications(
            refQueryInput.current,
            pageToken,
            pageSize
          ),
          true
        );
      }
    },
    []
  );

  const notifications= useHandleResponsePagination<any>(
    handleRequestNotifications,
    20 , true

  );


  const onRefresh = useCallback(() => {
    notifications.refresh();
  }, []);

  const onEndReached = useCallback(() => {
    notifications.handleLoadMore();
  }, []);

  useLayoutEffect(() => {
    notifications.refresh();
  }, []);

  const keyExtractor = useCallback((_ : any, index : number) => {
    return index.toString();
  }, []);
  const checkValidate = (inputValue: any) => {
    if (inputValue.length <= 255) {
      setQueryInput(inputValue);
      refQueryInput.current = inputValue;
    } else {
      setQueryInput("");
      refQueryInput.current = ""
    }
  };

  useEffect(() => {
    try {
      if (queryInput) {
        const timeout = setTimeout(async () => {
          setQueryInput(queryInput);
          refQueryInput.current = queryInput
          onRefresh()
        }, 800);
        return () => {
          clearTimeout(timeout);
        };
      } else {
      onRefresh()
      }
    } catch (error) {
      onRefresh()
    }
  }, [queryInput]);

  const deleteNotification = async () => {
    await generateApiService.delete(
      NotificationApi.deleteNotification(),
      selected
    );

    let newNoti = [...notifications.data];
    for (let i = 0; i < selected.length; i++) {
      var index = notifications.data.findIndex(
        (pNoti: any) => pNoti.id == selected[i]
      );
      if (index >= 0) {
        newNoti.splice(index, 1);
      }
    }
    notifications.setData(newNoti);
    setModalVisible(false);
    setTitleEdit("Xóa thông báo thành công !");
    setType("success");
    setModalVisibleNotifi(true);
    setSelected([]);
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
      const allId = notifications.data.map(
        (notification: any) => notification.id
      );
      setSelected(allId);
    } else {
      setSelected([]);
    }
    setAll(!all);
  };


  return {
    keyExtractor,
    onEndReached,
    notifications,
    onRefresh,
    setTypeModal,
    queryInput,
    setQueryInput,
    checkValidate ,
    setModalVisible ,
    setAll , 
    all , 
    chooseAll ,
    choose ,
    setNotificationChoose ,
    modalVisible ,
    selected ,
    typeModal ,
    setTitleEdit ,
    deleteNotification ,
    setType ,
    type , 
    titleEdit ,
    setModalVisibleNotifi ,
    modalVisibleNotifi ,
    userChoose
  };
};
