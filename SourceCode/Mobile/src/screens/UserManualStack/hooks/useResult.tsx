import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { KEYS } from "../../../constants/key";
import { useHandleResponsePagination } from "../../../hooks/useHandleResponsePagination";
import { useNavigationLink } from "../../../platform/links";
import { API } from "../../../services";
import { generateApiService } from "../../../services/ApiService";
import { TutourialsApi } from "../../../services/api/Tutuorials/TutourialsApi";

export interface IDecodedUser {
  exp: number;
  iat: number;
  jti: string;
  iss: string;
  aud: string;
  sub: string;
  typ: string;
  azp: string;
  session_state: string;
  acr: string;
  realm_access: {
    roles: string[];
  };
  resource_access: {
    account: {
      roles: string[];
    };
  };
  scope: string;
  email_verified: boolean;
  roles: string[];
  name: string;
  preferred_username: string;
  given_name: string;
  email: string;
  // Kiểu của mảng group có thể thay đổi
}

interface ITutourials {
  id: number;
  tutorial_createdDate: string;
  tutorial_image: string;
  tutorial_isDisplay: string;
  tutorial_title: string;
  tutorial_video: string;
}

interface stateQuestion {
  modalVisible?: boolean;
  type?: string;
  titleNotifi?: string;
  queryInput?: string;
  feedBack?: string;
  title?: string;
  dataUser?: IDecodedUser | undefined;
  size?: number;
  refreshing?: boolean;
  check?: boolean;
  tutourials?: ITutourials[];
  choose?: any;
}

export const useResultQuestion = () => {
  const [state, _setState] = useState<stateQuestion>({
    modalVisible: false,
    type: "",
    titleNotifi: "",
    queryInput: "",
    feedBack: "",
    title: "",
    dataUser: undefined,
    size: 5,
    refreshing: false,
    check: true,
    tutourials: [],
    choose: null,
  });

  const setState = (data: stateQuestion) => {
    _setState({
      ...state,
      ...data,
    });
  };

  const handleRequestQuenstion = useCallback(
    (pageToken: number, pageSize: number) => {
      if (state.queryInput) {
        return generateApiService.get(
          TutourialsApi.searchTutourials(state.queryInput, pageToken, pageSize),
          true
        );
      }
      return generateApiService.get(
        TutourialsApi.getTutourialsAuthen(pageToken, pageSize),
        true
      );
    },
    [state.queryInput]
  );

  const quenstion = useHandleResponsePagination<any>(
    handleRequestQuenstion,
    12,
    true
  );

  const onRefresh = useCallback(() => {
    setState({ queryInput: "" });
    removeText()
  }, []);

  const onEndReached = useCallback(() => {
    quenstion.handleLoadMore();
  }, []);

  useEffect(() => {
    try {
      if (state.queryInput) {
        const timeout = setTimeout(async () => {
          setState({
            queryInput: state.queryInput,
          });
          quenstion.refresh();
        }, 800);
        return () => {
          clearTimeout(timeout);
        };
      } else {
        quenstion.refresh();
      }
    } catch (error) {}
  }, [state.queryInput]);

  const keyExtractor = useCallback((_: any, index: number) => {
    return index.toString();
  }, []);

  const checkVadidate = (inputValue: any) => {
    if (inputValue.length <= 255) {
      setState({
        queryInput: inputValue,
      });
    } else {
      setState({
        queryInput: "",
      });
    }
  };

  const updateQuestion = async () => {
    try {
      if (state.feedBack && state.title) {
        const dataUpload = {
          title: state.title,
          content: state.feedBack,
          user: {
            email: state.dataUser?.email,
          },
        };
        await generateApiService
          .post(
            `${API.PUBLIC}services/lmsbackendtest/api/question-and-answers`,
            dataUpload
          )
          .then(() => {
            setState({
              modalVisible: true,
              feedBack: "",
              title: "",
              type: "success",
              titleNotifi: "Thắc mắc đã được gửi thành công!",
            });
          });
      } else {
        setState({
          modalVisible: true,
          type: "warning",
          titleNotifi: "Không được để trống textbox!",
        });
      }
    } catch (error) {
      setState({
        modalVisible: true,
        type: "error",
        titleNotifi: "Gửi thắc mắc thất bại",
      });
    }
  };

  const getDataUser = async () => {
    const token = await AsyncStorage.getItem(KEYS.TOKEN);
    var jwtDecode = require("jwt-decode");

    var decoded = await jwtDecode(token);

    setState({
      dataUser: decoded,
    });
  };
  useEffect(() => {
    getDataUser();
  }, []);

  const removeText = () => {
    setState({
      feedBack: "",
      title: "",
    });
  };
  const changeModalVisibility = (value: boolean) => {
    setState({
      modalVisible: value,
    });
  };

  const navigate = useNavigationLink("xem-phan-hoi");

  return {
    keyExtractor,
    onEndReached,
    quenstion,
    onRefresh,
    state,
    setState,
    navigate,
    removeText,
    updateQuestion,
    checkVadidate,
    changeModalVisibility,
  };
};
