import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  AppState,
  Modal,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native";
import { CardNavigationQA } from "../../components/CardNavigationQA";
import { CardQuestion } from "../../components/CardQuestion";
import { Devider } from "../../components/Devider";
import { Header, NotificationIcon } from "../../components/Header";
import PopupCloseAutomatically from "../../components/PopupCloseAutomatically";
import { Icon } from "../../components/svg-icon";
import { KEYS } from "../../constants/key";
import { useGoBack } from "../../platform/go-back";
import { Box, Flex, Text } from "../../rebass";
import { generateApiService } from "../../services/ApiService";
import { ExamsApi } from "../../services/api/Exams/ExamsApi";
import { ProfileApi } from "../../services/api/Profile/ProfileApi";
import { useIsFocused, useNavigation } from "@react-navigation/native";
const TestStartScreen = (props: {
  route: any; id_exams?: string; title?: string 
}) => {
  const goBack = useGoBack();
  const [state, _setState] = useState<any>({
    allData: [],
    data: [],
    page: 0,
    size: 5,
    tl: [],
    CardPosition: null,
    dataExam: null,
    setQuestion: null,
    question: null,
  });
  const setState = (data : any) => {
    _setState({
      ...state,
      ...data,
    });
  };

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [modalVisibleNoti, setModalVisibleNoti] = useState(false);
  const [type, setType] = useState<string>("");
  const [time, setTime] = useState<number>(-1);
  const [timeExam, setTimeExam] = useState<string>();
  const [idSubmit, setIdSubmit] = useState()
  const idUser = useRef<number>();
  const loading = useRef<boolean>(false)
  const toastShow = useRef<boolean>(true)
  const [timeStart , setTimeStart] = useState<number>(0)
  const navigation = useNavigation()

  const showToastMessage = (checkBack: boolean) => {
    if (toastShow) {
      toastShow.current === false;
      Alert.alert("Hết giờ làm bài", "", [
        {
          text: "Đóng",
        },
      ]);
      if (checkBack) {
        navigation.navigate("/thong-tin-bai-thi");
      }
    }
  };

  const getData = async () => {
    const dataExam = await generateApiService.get(
      ExamsApi.getExamById(props.route.params.id_exams)
    );
    const responseUser = await generateApiService.get(
      ProfileApi.getInfoStudent()
    );

    const questionCheck = await AsyncStorage.getItem(KEYS.QUESTION_QUIZ);
    let questionHistory = [];
    if (questionCheck !== null) {
      const data = JSON.parse(questionCheck);
      if (
        data.idUser === responseUser.id &&
        data.id_exams === props.route.params.id_exams &&
        data.question
      ) {
        questionHistory = data.question;
      }
    }
    setState({
      dataExam: dataExam,
      question: dataExam.questions,
      tl: questionHistory,
    });

    const dataPostHistory = {
      examsId: props.route.params.id_exams,
      studentId: responseUser.id,
    };
    idUser.current = responseUser.id;
    const res = await generateApiService.post(
      ExamsApi.postExamHistory(),
      dataPostHistory
    );

    const getRealTime = new Date().getTime();
    const timeExam =
      +dataExam.examLimittedWorkingTime * 60 -
      (getRealTime / 1000 - dayjs(res.examsHistoryStartTime).unix());
      if(timeExam < 1) {
      showToastMessage(true)
      }
    setTimeStart(dayjs(res.examsHistoryStartTime).unix())
    setTime(timeExam);
    setIdSubmit(res.id);
    loading.current = true
  };

  useEffect(() => {
    getData();
  }, []);

  const isFocused = useIsFocused()

  useEffect(() => {
    if (appStateVisible == "active") {
      if (state?.dataExam?.examLimittedWorkingTime) {
        const getRealTime = new Date().getTime();
        const timeExam =
          +state.dataExam.examLimittedWorkingTime * 60 -
          (getRealTime / 1000 - timeStart);
        setTime(timeExam);
      }
    }
  }, [appStateVisible]);

  useEffect(() => {
    console.log(appStateVisible);
    const subscription = AppState.addEventListener("change", nextAppState => {
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);



  useEffect(() => {
    let timeOut: any;
    if (time >= 0) {
      timeOut = setInterval(function () {
        let t = time;
        let minutes: any = parseInt(String(t / 60), 10);
        let seconds: any = parseInt(String(t % 60), 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        var display = minutes + ":" + seconds;
        setTimeExam(display);
        setTime(t - 1);
        if (t <= 1) {
          showToastMessage(false);
          submit();
        }
      }, 1000);
    }
    return () => {
      clearInterval(timeOut);
    };
  }, [time]);
  const [modalVisible, setModalVisible] = useState(false);
  const setCardPosition = (value : any) => {
    setState({ CardPosition: value });
  };
  const scrollRef = useRef<ScrollView>(null);
  const onPressTouch = async (e : any) => {
    const newPage = Math.ceil((e + 1) / state.size - 1);
    let position = 0;
    for (let i = newPage * 5; i < e; i++) {
      position = position + state.CardPosition[i - newPage*5];
    }
    if (e - newPage * 5 == 0) {
      position = 0;
    }
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: position,
        animated: true,
      });
    } , 300)
   
    handleSelectPage(newPage);
  };
  const onTopScroll = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: false,
    });
  };
  
  useEffect(() => {
    setState({
      data: (state.question || []).slice(0, 5),
      allData: state.question,
    });
  }, [state.question]);

  const handleNext = () => {
    const newPage = state.page + 1;
    setState({
      page: newPage,
      data: [...state.allData].slice(
        newPage * state.size,
        newPage * state.size + state.size
      ),
    });
    onTopScroll();
  };
  const handleSelectPage = (e : any) => {
    const newPage = e;
    setState({
      page: newPage,
      data: [...state.allData].slice(
        newPage * state.size,
        newPage * state.size + state.size
      ),
    });
  };
  const handlePrev = () => {
    const newPage = state.page - 1;
    setState({
      page: newPage,
      data: [...state.allData].slice(
        newPage * state.size,
        newPage * state.size + state.size
      ),
    });
    onTopScroll();
  };

  const handleDa = (id: number, value: any) => {
    let a = [...state.tl];
    const b = a.filter((item) => item.idQuestion === id);
    if (!b.length) {
      a.push({
        idQuestion: id,
        value,
      });
    } else {
      const index = a.findIndex((item) => item.idQuestion === id);
      a[index] = {
        idQuestion: id,
        value,
      };
    }
    setState({
      tl: a,
    });

    const valueSubmit = {
      question: a,
      idUser: idUser.current,
      id_exams: props?.route?.params?.id_exams,
    };
    AsyncStorage.setItem(KEYS.QUESTION_QUIZ, JSON.stringify(valueSubmit));
  };

  const submit = async () => {
    if (loading.current === false) {
      return;
    }
    try {
      let newQuestion = state.question;
      for (let i = 0; i < state.tl.length; i++) {
        let objIndex = newQuestion.findIndex(
          (obj: any) => obj.id == state.tl[i].idQuestion
        );
        let objIndexAnswers = newQuestion[objIndex].answers.findIndex(
          (obj: any) => obj.id == state.tl[i].value
        );
        newQuestion[objIndex].answers[objIndexAnswers].answersStatus = 1;
      }
      const dataSubmit = {
        id: idSubmit,
        questions: newQuestion,
        typeOfExams: { id: 1 },
      };
      await generateApiService.put(
        ExamsApi.putSubmitStudent(idSubmit),
        dataSubmit
      );
      setType("success");
      setModalVisibleNoti(true);
      goBack();
    } catch (err) {
      setType("error");
      setModalVisibleNoti(true);
    }
  };

  return (
    <Box bg="defaultBackground" position="relative">
      <Box height="100%" mt={2}>
        <Header title="Bài thi trắc nghiệm" search leftButton="back">
          <NotificationIcon />
        </Header>
        <Box height={1} bg="#636363" opacity={0.3} mt={2} />
        <Box flexDirection="row" flex={1}>
          <ScrollView ref={scrollRef}>
            <Flex px={2}>
              <Flex
                flexDirection="row"
                alignItems="flex-start"
                justifyContent="center"
              >
                <Flex flex={1}>
                  <Text
                    color="#1C7988"
                    fontWeight="bold"
                    fontSize={17}
                    mt={17}
                    style={{ textTransform: "uppercase" }}
                  >
                    {props.route?.params?.title}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            <Box alignItems="center">
              <Box
                width="95%"
                borderRadius={10}
                borderWidth={1}
                borderColor="rgba(125, 125, 125, 0.3)"
                mt={2}
                flexDirection="row"
                justifyContent="space-between"
              >
                <Text
                  fontWeight={500}
                  fontSize={16}
                  color="#00A8B5"
                  padding={2}
                  width={"80%"}
                  style={{ textTransform: 'uppercase'}}
                >
                  TRẮC NGHIỆM: {state.dataExam ? state?.dataExam?.examName : ""}
                </Text>
                <Box alignItems="center" justifyContent="flex-start" >
                  <Text color="seen" fontSize={16} padding={2}>
                    {timeExam}
                  </Text>
                </Box>
              </Box>
              {state.question && (
                <Box
                  width="95%"
                  borderRadius={10}
                  borderWidth={1}
                  borderColor="rgba(125, 125, 125, 0.3)"
                  mt={2}
                >
                  {state.question ? (
                    <CardQuestion
                      dataQuestions={state.data}
                      handleDa={handleDa}
                      idQuestion={state.question.id}
                      da={
                        state.tl.find(
                          (item : any) => item.idQuestion == state.question.id
                        )?.value
                      }
                      tl={state.tl}
                      setCardPosition={setCardPosition}
                      page={state.page}
                    ></CardQuestion>
                  ) : null}
                </Box>
              )}
            </Box>
            <Flex
              flex={1}
              flexDirection="row"
              justifyContent="center"
              px={2}
              pt={5}
            >
              {state.page + 1 > 1 && (
                <Flex flex={1}>
                  <TouchableOpacity
                    onPress={state.page == 0 ? undefined : handlePrev}
                  >
                    <Flex
                      borderRadius={10}
                      borderWidth={1}
                      borderColor="buttonColor"
                      height={50}
                      mt={2}
                      mr={2}
                      justifyContent={"center"}
                    >
                      <Text
                        textAlign="center"
                        color="#059DCE"
                        fontSize={18}
                      >
                        Quay lại
                      </Text>
                    </Flex>
                  </TouchableOpacity>
                </Flex>
              )}

              <Flex flex={1}>
                <TouchableOpacity
                  onPress={() =>
                    state.allData &&
                      Math.ceil(state.allData.length / 5) == state.page + 1
                      ? submit()
                      : handleNext()
                  }
                >
                  <Box
                    borderRadius={10}
                    borderWidth={1}
                    borderColor="rgba(125, 125, 125, 0.3)"
                    mt={2}
                    height={50}
                    backgroundColor="buttonColor"
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <Text
                      style={{ color: "#ffffff", right: 0, fontSize: 18 }}
                      textAlign="center"
                      lineHeight={23}
                    >
                      {state.allData &&
                        Math.ceil(state.allData.length / 5) == state.page + 1
                        ? "Nộp bài"
                        : "Tiếp Theo"}
                    </Text>
                  </Box>
                </TouchableOpacity>
              </Flex>
            </Flex>

            <Box height={80} />
            <Modal
              animationType="slide"
              transparent
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(false);
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 22,
                }}
                activeOpacity={1}
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <TouchableWithoutFeedback>
                  <Box
                    style={{
                      height: "90%",
                      width: "90%",
                      backgroundColor: "white",
                      borderRadius: 20,
                      padding: 10,
                      alignItems: "center",
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 4,
                      elevation: 5,
                    }}
                    justifyContent="center"
                  >
                    <Text
                      ml={"5%"}
                      fontSize={20}
                      color="textColor"
                      fontWeight="bold"
                      mt={4}
                      lineHeight={30}
                      width={250}
                    >
                      ĐIỀU HƯỚNG CÂU HỎI
                    </Text>
                    <Box ml={"5%"}>
                      <CardNavigationQA
                        question={state.question}
                        tl={state.tl}
                        setModalVisible={setModalVisible}
                        onPressTouch={onPressTouch}
                      />
                    </Box>
                  </Box>
                </TouchableWithoutFeedback>
              </TouchableOpacity>
            </Modal>
          </ScrollView>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleNoti}
            onRequestClose={() => {
              setModalVisibleNoti(!modalVisibleNoti);
            }}
          >
            <PopupCloseAutomatically
              title="Nộp bài "
              type={type}
              isOpen={modalVisibleNoti}
              setIsOpen={setModalVisibleNoti}
            />
            {/* <PopupNotification
              title="Nộp bài "
              type={type}
              setModalVisible={setModalVisibleNoti}
            ></PopupNotification> */}
          </Modal>
          <TouchableOpacity
            style={{ position: "absolute", right: 0, top: "40%" }}
            onPress={() => setModalVisible(true)}
          >
            <Icon name="tabQuestion"></Icon>
          </TouchableOpacity>
        </Box>
      </Box>
    </Box>
  );
};
export default TestStartScreen;
