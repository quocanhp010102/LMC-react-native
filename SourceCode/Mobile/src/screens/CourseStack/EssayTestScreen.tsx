import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import {useEffect, useRef, useState} from "react";
import {
    Alert,
    AppState,
    Dimensions,
    Linking,
    Modal,
    Platform,
    RefreshControl,
    TextInput,
    TouchableOpacity
} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import RenderHtml from "react-native-render-html";
import Swipeout from "react-native-swipeout";
import {CardAttachments} from "../../components/CardAttachments";
import {CardAttachmentsUpload} from "../../components/CardAttachmentsUpload";
import {Devider} from "../../components/Devider";
import {Header, NotificationIcon} from "../../components/Header";
import PopupCloseAutomatically from "../../components/PopupCloseAutomatically";
import {KEYS} from "../../constants/key";
import {useGoBack} from "../../platform/go-back";
import {Box, Flex, Text} from "../../rebass";
import {generateApiService} from "../../services/ApiService";
import {ExamsApi} from "../../services/api/Exams/ExamsApi";
import {ProfileApi} from "../../services/api/Profile/ProfileApi";
import {UploadFileApi} from "../../services/api/UploadFile/UploadFileApi";

const {width, height} = Dimensions.get("screen");
const EssayTestScreen = (props: {
    id?: string;
    title?: string
}) => {
    const [modalVisibleNoti, setModalVisibleNoti] = useState(false);
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    const [type, setType] = useState<string>("");
    //@ts-ignore
    const {title, id_exams} = props.route.params;
    const [dataExam, setDataExam] = useState<any>();
    const [modalVisible, setModalVisible] = useState(false);
    const [answer, setAnswer] = useState("");
    const [typeQuestion, setTypeQuestion] = useState(true);
    const [attachments, setAttachments] = useState<any>([]);
    const [getFile, setGetFile] = useState<any>();
    const goBack = useGoBack();
    const [time, setTime] = useState<number>(-1);
    const [timeExam, setTimeExam] = useState<string>();
    const [checkTime, setCheckTime] = useState<boolean>(false);
    const [idSubmit, setIdSubmit] = useState();
    const idUser = useRef<number>();
    const loading = useRef<boolean>(false);
    const toastShow = useRef<boolean>(true);
    const [timeStart, setTimeStart] = useState<number>(0)

    const showToastMessage = (checkBack: boolean) => {
        if (toastShow) {
            toastShow.current === false;
            Alert.alert("Hết giờ làm bài", "", [
                {
                    text: "Đóng",
                },
            ]);
            if (checkBack) {
                goBack();
            }
        }
    };

    const getData = async () => {
        const dataExam = await generateApiService.get(
            ExamsApi.getExamById(id_exams)
        );
        setDataExam(dataExam);
        const responseUser = await generateApiService.get(
            ProfileApi.getInfoStudent()
        );
        idUser.current = responseUser.id;
        const dataPostHistory = {
            examsId: id_exams,
            studentId: responseUser.id,
        };
        const questionCheck = await AsyncStorage.getItem(KEYS.QUESTION_ESSAY);
        if (questionCheck !== null) {
            const data = JSON.parse(questionCheck);
            if (data.idUser === responseUser.id && data.id_exams === id_exams) {
                setAnswer(data.question);
            }
        }
        const res = await generateApiService.post(
            ExamsApi.postExamHistory(),
            dataPostHistory
        );

        const getRealTime = new Date().getTime();
        const timeExam =
            +dataExam.examLimittedWorkingTime * 60 -
            (getRealTime / 1000 - dayjs(res.examsHistoryStartTime).unix());
        if (timeExam < 0) {
            console.log("call in get Data ");
            showToastMessage(true);
        }
        setTimeStart(dayjs(res.examsHistoryStartTime).unix());
        setTime(timeExam);
        setIdSubmit(res.id);
        loading.current = true;
    };


    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        if (appStateVisible == "active") {
            if (dataExam?.examLimittedWorkingTime) {
                const getRealTime = new Date().getTime();
                const timeExam =
                    +dataExam.examLimittedWorkingTime * 60 -
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
                    console.log("call in get timeout ");
                    showToastMessage(false);
                    submit();
                }
            }, 1000);
        }
        return () => {
            clearInterval(timeOut);
        };
    }, [time]);
    const submit = async () => {
        if (loading.current === false) {
            return;
        }
        try {
            if (typeQuestion) {
                const dataSubmit = {
                    id: idSubmit,
                    examsHistoryAnswer: answer,
                    examsHistoryFileAnswer: null,
                    typeOfExams: {
                        id: 2,
                    },
                    examName: dataExam?.examName,
                    questions: [
                        {
                            id: dataExam?.questions[0]?.id,
                            questionsName: dataExam?.questions[0]?.questionsName,
                            questionsFile: dataExam?.questions[0]?.questionsFile,
                        },
                    ],
                };

                const testSubmit = await generateApiService.put(
                    ExamsApi.putSubmitStudent(idSubmit),
                    dataSubmit
                );

                setType("success");
                setModalVisibleNoti(true);
                goBack();
            } else {
                const data = new FormData();

                for await (const file of attachments) {
                    data.append("files", {
                        ...file.file,
                        uri:
                            Platform.OS === "android"
                                ? file.file.uri
                                : file.file.uri?.replace("file://", ""),
                        type: file.file.mimeType, // it may be necessary in Android.
                    });
                }
                let res = await generateApiService.postImage(
                    UploadFileApi.UploadMultiFile(),
                    data
                );
                const arrayUrl = JSON.parse(res);
                const dataSubmit = {
                    id: idSubmit,
                    examsHistoryAnswer: null,
                    examsHistoryFileAnswer: arrayUrl[0],
                    typeOfExams: {
                        id: 2,
                    },
                    examName: dataExam?.examName,
                    questions: [
                        {
                            id: dataExam?.questions[0]?.id,
                            questionsName: dataExam?.questions[0]?.questionsName,
                            questionsFile: dataExam?.questions[0]?.questionsFile,
                        },
                    ],
                };

                const testSubmit = await generateApiService.put(
                    ExamsApi.putSubmitStudent(idSubmit),
                    dataSubmit
                );

                setType("success");
                setModalVisibleNoti(true);
                goBack();
            }
        } catch (err) {
            setType("error");
            setModalVisibleNoti(true);
        }
    };
    const addFile = (file: any, filename: any) => {
        const newAttachment: any = attachments;
        if (file.type === "success") {
            newAttachment[attachments.length] = {file, filename};
            setAttachments([{file, filename}]);
        }
        setModalVisible(false);
    };
    const deleteAttachments = (index: any) => {
        const newAttachment = attachments;
        newAttachment.splice(index, 1);
        setAttachments(newAttachment);
    };

    const updateAnswer = (value: string) => {
        setAnswer(value);
        const valueSubmit = {
            question: value,
            idUser: idUser.current,
            id_exams: id_exams,
        };
        AsyncStorage.setItem(KEYS.QUESTION_ESSAY, JSON.stringify(valueSubmit));
    };

    return (
        <Box bg="defaultBackground" position="relative" height="100%">
            <Box height="100%" mt={2}>
                <Header title="Bài thi tự luận" search leftButton="back">
                    <NotificationIcon/>
                </Header>
                <Box height={1} bg="#636363" opacity={0.3} mt={2}/>
                <Box flexDirection="row" flex={1}>
                    <KeyboardAwareScrollView
                        showsVerticalScrollIndicator={false}
                        enableAutomaticScroll
                        refreshControl={
                            <RefreshControl
                                refreshing={false}
                                onRefresh={() => {
                                    getData();
                                }}
                            ></RefreshControl>
                        }
                        // enableResetScrollToCoords
                        extraHeight={150}
                    >
                        <Flex flex={1} px={2}>
                            <Flex
                                flexDirection="row"
                                alignItems="flex-start"
                                justifyContent="center"
                            >
                                <Flex flex={1}>
                                    <Text
                                        color="textColor"
                                        fontWeight="bold"
                                        fontSize={17}
                                        mt={17}
                                        style={{textTransform: "uppercase"}}
                                    >
                                        {title}
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
                                justifyContent="space-between"
                                flexDirection="row"
                            >
                                <Text
                                    fontWeight={500}
                                    fontSize={16}
                                    color="#00A8B5"
                                    padding={2}
                                    width={"80%"}
                                    style={{textTransform: "uppercase"}}
                                >
                                    TỰ LUẬN: {dataExam ? dataExam.examName : null}
                                </Text>
                                <Text color="seen" fontSize={16} padding={2}>
                                    {timeExam}
                                </Text>
                            </Box>
                            <Box
                                width="95%"
                                borderRadius={10}
                                borderWidth={1}
                                borderColor="rgba(125, 125, 125, 0.3)"
                                mt={2}
                            >
                                {dataExam && dataExam.questions[0] ? (
                                    dataExam.questions[0].questionsName ? (
                                        <Box p={3}>
                                            <RenderHtml
                                                contentWidth={width}
                                                //@ts-ignore
                                                imagesMaxWidth={width}
                                                source={{
                                                    html: dataExam.questions[0].questionsName,
                                                }}
                                            />
                                        </Box>
                                    ) : (
                                        <Box>
                                            <Text
                                                mt={2}
                                                ml={2}
                                                color="seen"
                                                fontSize={15}
                                                fontWeight="bold"
                                            >
                                                Đề bài
                                            </Text>
                                            <TouchableOpacity
                                                style={{marginTop: 10, marginLeft: 10}}
                                                onPress={() =>
                                                    Linking.openURL(dataExam.questions[0].questionsFile)
                                                }
                                            >
                                                <Text fontSize={16} color="blue" ml={1}>
                                                    Tệp đề bài
                                                </Text>
                                            </TouchableOpacity>
                                        </Box>
                                    )
                                ) : null}
                            </Box>
                            <Box>
                                <Box width={width} mt={2}>
                                    <Text fontSize={16} color="seen" ml={2} mb={2}>
                                        Chọn hình thức trả lời <Text color="red">*</Text>
                                    </Text>
                                    <Box flexDirection="row" ml={2}>
                                        <Box
                                            height={19}
                                            width={19}
                                            borderColor="#DADADA"
                                            borderRadius={50}
                                            borderWidth={1}
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <TouchableOpacity
                                                onPress={() => setTypeQuestion(true)}
                                                style={{
                                                    height: 40,
                                                    width: 40,
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <Box
                                                    height={12}
                                                    width={12}
                                                    borderColor="#DADADA"
                                                    borderRadius={50}
                                                    backgroundColor={typeQuestion ? "textColor" : "null"}
                                                ></Box>
                                            </TouchableOpacity>
                                        </Box>
                                        <Text ml={2} color="seen" fontSize={15} mb={2}>
                                            Làm ngay
                                        </Text>
                                    </Box>
                                </Box>
                                <Box flexDirection="row" ml={2}>
                                    <Box
                                        height={19}
                                        width={19}
                                        borderColor="#DADADA"
                                        borderRadius={50}
                                        borderWidth={1}
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <TouchableOpacity
                                            onPress={() => setTypeQuestion(false)}
                                            style={{
                                                height: 40,
                                                width: 40,
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <Box
                                                height={12}
                                                width={12}
                                                borderColor="#DADADA"
                                                borderRadius={50}
                                                backgroundColor={!typeQuestion ? "textColor" : "null"}
                                            ></Box>
                                        </TouchableOpacity>
                                    </Box>
                                    <Text ml={2} color="seen" fontSize={15} mb={2}>
                                        Tải file
                                    </Text>
                                </Box>
                            </Box>
                            <Box
                                width="95%"
                                borderRadius={10}
                                borderWidth={1}
                                borderColor="rgba(125, 125, 125, 0.3)"
                            >
                                {typeQuestion ? (
                                    <Box>
                                        <Text
                                            mt={2}
                                            ml={2}
                                            color="seen"
                                            fontSize={15}
                                            fontWeight="bold"
                                        >
                                            Trả lời
                                        </Text>
                                        <Box alignItems="center">
                                            <TextInput
                                                placeholder="Điền câu trả lời ..."
                                                multiline={true}
                                                textAlignVertical="top"
                                                //@ts-ignore
                                                width={"95%"}
                                                minHeight={150}
                                                maxHeight={450}
                                                borderRadius={10}
                                                borderWidth={1}
                                                borderColor="#D4D4D4"
                                                padding={4}
                                                fontSize={16}
                                                marginBottom={10}
                                                marginTop={10}
                                                value={answer}
                                                editable={true}
                                                onChangeText={(value) => updateAnswer(value)}
                                            ></TextInput>
                                        </Box>
                                    </Box>
                                ) : (
                                    <Box>
                                        <Box width="100%" mt={2}>
                                            <Text fontSize={16} color="seen" ml={2} mb={1}>
                                                Đính kèm file đáp án <Text color="red">*</Text>
                                            </Text>
                                        </Box>
                                        <Box padding={2} flexDirection="row" alignItems="center">
                                            {
                                                <Box
                                                    flexDirection="row"
                                                    alignItems="center"
                                                    width={150}
                                                >
                                                    <CardAttachmentsUpload
                                                        addFile={addFile}
                                                        title="Tải lên tài liệu"
                                                        // setModalVisible={setModalVisible}
                                                        // uploadType="multiFile"
                                                    ></CardAttachmentsUpload>
                                                </Box>
                                            }
                                        </Box>
                                        {(attachments ? attachments : []).map(
                                            (attachments: any, idx: number) => {
                                                let swipeoutBtns = [
                                                    {
                                                        component: (
                                                            <Box height={40} mr={2} mt={1}>
                                                                <TouchableOpacity
                                                                    onPress={() => deleteAttachments(idx)}
                                                                    style={{
                                                                        flex: 1,
                                                                        backgroundColor: "red",
                                                                        width: "100%",
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                        borderRadius: 8,
                                                                    }}
                                                                >
                                                                    <Text
                                                                        color="white"
                                                                        fontSize={14}
                                                                        fontWeight="bold"
                                                                    >
                                                                        Xóa
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            </Box>
                                                        ),
                                                        backgroundColor: "white",
                                                        disabled: true,
                                                    },
                                                ];
                                                return (
                                                    //@ts-ignore
                                                    <Swipeout
                                                        right={swipeoutBtns}
                                                        backgroundColor={"white"}
                                                    >
                                                        <TouchableOpacity
                                                            key={attachments.id}
                                                            onLongPress={() => deleteAttachments(idx)}
                                                        >
                                                            <Box alignItems="center" mb={2}>
                                                                <CardAttachments
                                                                    key={attachments.id}
                                                                    title={attachments.file.name}
                                                                    checkFile={attachments.file.name
                                                                        .split(".")
                                                                        .pop()}
                                                                />
                                                            </Box>
                                                        </TouchableOpacity>
                                                    </Swipeout>
                                                );
                                            }
                                        )}
                                    </Box>
                                )}
                            </Box>
                            <Box flexDirection="row" width={"95%"} mt={2}>
                                <Flex flex={1}>
                                    <TouchableOpacity onPress={goBack}>
                                        <Flex
                                            borderRadius={10}
                                            borderWidth={1}
                                            borderColor="buttonColor"
                                            height={50}
                                            mt={2}
                                            mr={2}
                                            alignItems={"center"}
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
                                <Flex flex={1}>
                                    <TouchableOpacity onPress={submit}>
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
                                                style={{color: "#ffffff", right: 0, fontSize: 18}}
                                                textAlign="center"
                                            >
                                                Nộp bài
                                            </Text>
                                        </Box>
                                    </TouchableOpacity>
                                </Flex>
                            </Box>
                        </Box>
                        <Box height={80}/>
                    </KeyboardAwareScrollView>
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
                </Box>
            </Box>
        </Box>
    );
};
export default EssayTestScreen;
