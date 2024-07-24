import {useNavigation} from "@react-navigation/native";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {useEffect, useState} from "react";
import {
    Dimensions,
    KeyboardAvoidingView,
    Linking,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RenderHtml from "react-native-render-html";
import Swipeout from "react-native-swipeout";
import {CardAttachments} from "../../components/CardAttachments";
import {Devider} from "../../components/Devider";
import {Header, NotificationIcon} from "../../components/Header";
import {useGoBack} from "../../platform/go-back";
import {Box, Flex, Text, TextInput} from "../../rebass";
import {generateApiService} from "../../services/ApiService";
import {ActivityHistoriesApi} from "../../services/api/ActivityHistories/ActivityHistoriesApi";
import {ExamsApi} from "../../services/api/Exams/ExamsApi";
import {UploadFileApi} from "../../services/api/UploadFile/UploadFileApi";
import {ModalConfirm} from "./components/ModalConfirm";
import {ModalTemplate} from "./components/ModalTemplate";
import PopupCloseAutomatically from "../../components/PopupCloseAutomatically";

const {width, height} = Dimensions.get("screen");
const dataItem = [
    {label: "Tự tạo câu hỏi", value: "1"},
    {label: "Tải lên đề thi", value: "0"},
];
dayjs.extend(utc);
const CreateEssayTest = (props: {
    id: string;
    titleCourse: string;
    data: any;
    edit?: string;
    id_course: string;
    newQuestion?: string;
}) => {
    var utc = require("dayjs/plugin/utc");
    dayjs.extend(utc);

    const {id_course, id, data, edit, titleCourse, newQuestion} =
        //@ts-ignore
        props?.route?.params;
    const [attachments, setAttachments] = useState<any>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [getFile, setGetFile] = useState<any>();
    const [startDate, setStartDate] = useState(
        edit
            ? data?.examOpenTime?.length < 20
                ? new Date(data?.examOpenTime).setHours(
                    new Date(data?.examOpenTime).getHours() + 7
                )
                : data?.examOpenTime
            : ""
    );
    const [endDate, setEndDate] = useState(
        edit
            ? data?.examCloseTime?.length < 20
                ? new Date(data?.examCloseTime).setHours(
                    new Date(data?.examCloseTime).getHours() + 7
                )
                : data?.examCloseTime
            : ""
    );
    const [maxTime, setMaxTime] = useState(
        edit ? data.examLimittedWorkingTime : 0
    );
    const [title, setTitle] = useState(edit ? data.examName : "");
    const [modalVisibleNoti, setModalVisibleNoti] = useState(false);
    const [type, setType] = useState<string>("");
    const [dateType, setDateType] = useState("");
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const [typeQuestion, setTypeQuestion] = useState(true);
    const [question, setQuestion] = useState<string>("");
    const [errorTitle, setErrorTitle] = useState("");
    const [errorTime, setErrorTime] = useState("");
    const [errorMaxTime, setErrormaxTime] = useState("");
    const [errorQuestion, setErrorQuestion] = useState("");
    const [errorFile, setErrorFile] = useState("");
    const [realTime, setRealTime] = useState(true);
    const maxPoint = 100;
    const minPoint = 50;
    const [typeChoose, setTypeChoose] = useState<boolean>(false);
    const [modalVisibleTemplate, setModalVisibleTemplate] = useState(false);
    const goback = useGoBack();
    const getData = async () => {
        // const getRealTime = new Date()
        // const getRealTime = await generateApiService.get(
        //   "http://worldtimeapi.org/api/timezone/Asia/Ho_Chi_Minh"
        // );
        // if (
        //   dayjs(data.examOpenTime).unix() -
        //     new Date(getRealTime.datetime).getTime() / 1000 <
        //   0
        // ) {
        //   setRealTime(false);
        // }

        const dataExams = await generateApiService.get(ExamsApi.getExamById(id));
        if (dataExams) {

            const getRealTime = new Date().getTime();
            if (dayjs(dataExams.examOpenTime).unix() - getRealTime / 1000 < 0) {
                setRealTime(false);
            }
            setStartDate(edit
                ? dataExams?.examOpenTime?.length < 20
                    ? new Date(dataExams?.examOpenTime).setHours(
                        new Date(dataExams?.examOpenTime).getHours()
                    )
                    : dataExams?.examOpenTime
                : "")
            setEndDate(edit
                ? dataExams?.examCloseTime?.length < 20
                    ? new Date(dataExams?.examCloseTime).setHours(
                        new Date(dataExams?.examCloseTime).getHours()
                    )
                    : dataExams?.examOpenTime
                : "")
            setMaxTime(dataExams.examLimittedWorkingTime)

            setQuestion(dataExams.questions[0].questionsName);
            if (dataExams.questions[0].questionsFile) {


                setAttachments([
                    {
                        file: {name: dataExams.questions[0].questionsFile, link: "link"},
                    },
                ]);
                setTypeQuestion(false);
            }
        }
    };
    useEffect(() => {
        if (edit) {
            getData();
        }
    }, []);
    useEffect(() => {
        setQuestion(newQuestion);
    }, [newQuestion]);

    const showDatePicker = (e: any) => {
        setErrorTime("");
        setDateType(e);
        setDatePickerVisibility(true);
    };
    const showTimePicker = () => {
        setTimePickerVisibility(true);
    };
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    };
    const DatePickerCancel = () => {
        if (Platform.OS === "android") {
            if (dateType === "start") {
                setStartDate(null), hideDatePicker();
            } else if (dateType === "end") {
                setEndDate(null), hideDatePicker();
            }
        } else {
            if (dateType === "start") {
                setStartDate(null), setTypeChoose(false), hideDatePicker();
            } else if (dateType === "end") {
                setEndDate(null), setTypeChoose(false), hideDatePicker();
            }
        }
    };
    const TimePickerCancel = () => {
        if (dateType === "start") {
            setStartDate(null), hideTimePicker();
        } else if (dateType === "end") {
            setEndDate(null), hideTimePicker();
        }
    };
    const handleConfirm = async (date: any) => {
        if (Platform.OS === "android") {
            if (dateType === "start") {
                setStartDate(date);
                await hideDatePicker();
                setTimePickerVisibility(true);
            } else {
                setEndDate(date);
                await hideDatePicker();
                setTimePickerVisibility(true);
            }
        } else {
            if (dateType === "start") {
                setTypeChoose(true);
                setStartDate(date);
                // await hideDatePicker();
                // setTimePickerVisibility(true);
            } else {
                setTypeChoose(true);
                setEndDate(date);
                // await hideDatePicker();
                // setTimePickerVisibility(true);
            }
        }
    };
    const TimeHandleConfirm = (time: any) => {
        if (Platform.OS === "android") {
            if (dateType === "start") {
                let newStartDate = dayjs(startDate)
                    .utc()
                    .hour(time.getHours())
                    .minute(time.getMinutes());

                setStartDate(newStartDate);
                // hideDatePicker();
                // setTimePickerVisibility(true);
            } else {
                let newEndDate = dayjs(endDate)
                    .utc()
                    .hour(time.getHours())
                    .minute(time.getMinutes());
                setEndDate(newEndDate);
            }
            hideTimePicker();
        } else {
            if (dateType === "start") {
                let newStartDate = dayjs(startDate)
                    .utc()
                    .hour(time.getHours())
                    .minute(time.getMinutes());
                setStartDate(newStartDate);
                setTypeChoose(false);
                // hideDatePicker();
                // setTimePickerVisibility(true);
            } else {
                let newEndDate = dayjs(endDate)
                    .utc()
                    .hour(time.getHours())
                    .minute(time.getMinutes());

                setEndDate(newEndDate);
                setTypeChoose(false);
            }
            setDatePickerVisibility(false);
        }
    };
    const addFile = (file: any, filename: any) => {
        const newAttachment = attachments;

        if (file.type === "success") {
            newAttachment[attachments.length] = {file, filename};
            setAttachments([{file, filename}]);
        }
        setModalVisible(false);
    };
    const deleteAttachments = (index: number) => {
        const newAttachment = attachments;
        newAttachment.splice(index, 1);
        setAttachments(newAttachment);
    };
    const navigation = useNavigation();

    function checkValidateTitle(): boolean {
        let check = true;
        if (!title) {
            check = false;
            setErrorTitle("Tiêu đề bài thi không để trống!");
        } else {
            check = true;
            setErrorTitle("");
        }
        return check;
    }

    function checkValidateTime(): boolean {
        let check = true;
        if (!startDate || !endDate) {
            check = false;
            setErrorTime("Thời gian mở bài không để trống!");
        } else {
            check = true;
            setErrorTime("");
        }
        return check;
    }

    function checkValidateMaxTime(): boolean {
        let check = true;
        if (!maxTime) {
            check = false;
            setErrormaxTime("Giới hạn thời gian làm bài không để trống!");
        } else {
            check = true;
            setErrormaxTime("");
        }
        return check;
    }

    function checkValidateQuestion(): boolean {
        let check = true;
        if (!question) {
            check = false;
            setErrorQuestion("Câu hỏi không được để trống!");
        } else {
            check = true;
            setErrorQuestion("");
        }
        return check;
    }

    function checkValidateFile(): boolean {
        let check = true;
        if (!attachments[0]) {
            check = false;
            setErrorFile("File không được bỏ trống!");
        } else {
            check = true;
            setErrorFile("");
        }
        return check;
    }

    const uploadFile = async () => {
        if (checkValidateTitle()) {
            if (checkValidateTime()) {
                if (checkValidateMaxTime()) {
                    try {
                        if (!edit) {
                            let res;
                            let arrayUrl: any;
                            if (!typeQuestion) {
                                if (checkValidateFile()) {
                                    const data = new FormData();
                                    for await (const file of attachments) {
                                        data.append("files", {
                                            ...file.file,
                                            uri:
                                                Platform.OS === "android"
                                                    ? file.file.uri
                                                    : file.file.uri.replace("file://", ""),
                                            name: file.file.name,
                                            type: file.file.mimeType, // it may be necessary in Android.
                                        });
                                    }
                                    res = await generateApiService.postImage(
                                        UploadFileApi.UploadMultiFile(),
                                        data
                                    );

                                    arrayUrl = JSON.parse(res);
                                    const dataEssayTest = {
                                        examName: title,
                                        examCloseTime: dayjs(endDate)
                                            .utc()
                                            .format("YYYY-MM-DDTHH:mm:00.000+00:00"),
                                        examOpenTime: dayjs(startDate)
                                            .utc()
                                            .format("YYYY-MM-DDTHH:mm:00.000+00:00"),
                                        examLimittedWorkingTime: maxTime,
                                        examMaxPoint: maxPoint,
                                        examMinPoint: minPoint,
                                        course: {
                                            //@ts-ignore
                                            id: props.route.params.id_course,
                                        },
                                        questions: typeQuestion
                                            ? [
                                                {
                                                    questionsName: question,
                                                    questionsFile: "",
                                                },
                                            ]
                                            : [
                                                {
                                                    questionsName: "file",
                                                    questionsFile: arrayUrl[0],
                                                },
                                            ],
                                        typeOfExams: {
                                            id: "2",
                                        },
                                    };
                                    let updateCourse = await generateApiService.post(
                                        //@ts-ignore
                                        ExamsApi.postExam(),
                                        dataEssayTest
                                    );
                                    setType("success");
                                    setModalVisibleNoti(true);

                                    navigation.navigate("/chi-tiet-khoa-hoc-gv", {
                                        id_course: id_course,
                                        newExams: updateCourse,
                                    });
                                    const bodyHistory = {
                                        name: " Bài thi " + title,
                                        method: "POST",
                                    };
                                    const history = await generateApiService.post(
                                        ActivityHistoriesApi.postHistories(),
                                        bodyHistory
                                    );
                                }
                            } else {
                                if (checkValidateQuestion()) {
                                    const dataEssayTest = {
                                        examName: title,
                                        examCloseTime: dayjs(endDate)
                                            .utc()
                                            .format("YYYY-MM-DDTHH:mm:00.000+00:00"),
                                        examOpenTime: dayjs(startDate)
                                            .utc()
                                            .format("YYYY-MM-DDTHH:mm:00.000+00:00"),
                                        examLimittedWorkingTime: maxTime,
                                        examMaxPoint: maxPoint,
                                        examMinPoint: minPoint,
                                        course: {
                                            //@ts-ignore
                                            id: props.route.params.id_course,
                                        },
                                        questions: typeQuestion
                                            ? [
                                                {
                                                    questionsName: question,
                                                    questionsFile: "",
                                                },
                                            ]
                                            : [
                                                {
                                                    questionsName: "",
                                                    questionsFile: arrayUrl[0],
                                                },
                                            ],
                                        typeOfExams: {
                                            id: "2",
                                        },
                                    };


                                    let updateCourse = await generateApiService.post(
                                        ExamsApi.postExam(),
                                        dataEssayTest
                                    );
                                    setType("success");
                                    setModalVisibleNoti(true);

                                    navigation.navigate("/chi-tiet-khoa-hoc-gv", {
                                        id_course: id_course,
                                        newExams: updateCourse,
                                    });
                                    const bodyHistory = {
                                        name: " bài thi " + title,
                                        method: "POST",
                                    };
                                    const history = await generateApiService.post(
                                        ActivityHistoriesApi.postHistories(),
                                        bodyHistory
                                    );
                                }
                            }
                        } else {

                            if (realTime) {
                                let res;
                                if (!typeQuestion) {
                                    if (attachments.length > 0) {
                                        if (attachments[0].file.link) {
                                            res = [attachments[0].file.name];
                                        } else {
                                            const data = new FormData();
                                            for await (const file of attachments) {
                                                data.append("files", {
                                                    ...file.file,
                                                    uri:
                                                        Platform.OS === "android"
                                                            ? file.file.uri
                                                            : file.file.uri.replace("file://", ""),
                                                    name: file.file.name,
                                                    type: file.file.mimeType, // it may be necessary in Android.
                                                });
                                            }
                                            let fileLink = await generateApiService.postImage(
                                                UploadFileApi.UploadMultiFile(),
                                                data
                                            );
                                            res = JSON.parse(fileLink);
                                        }
                                    } else {
                                    }
                                }

                                const dataEssayTest = {
                                    id: data.id,
                                    examName: title,
                                    examCloseTime: dayjs(endDate)
                                        .utc()
                                        .format("YYYY-MM-DDTHH:mm:00.000+00:00"),
                                    examOpenTime: dayjs(startDate)
                                        .utc()
                                        .format("YYYY-MM-DDTHH:mm:00.000+00:00"),
                                    examLimittedWorkingTime: maxTime,

                                    course: {
                                        //@ts-ignore
                                        id: props.route.params.id_course,
                                    },
                                    questions: typeQuestion
                                        ? [
                                            {
                                                questionsName: question,
                                                questionsFile: "",
                                            },
                                        ]
                                        : [
                                            {
                                                questionsName: "",
                                                questionsFile: res ? res[0] : null,
                                            },
                                        ],
                                    typeOfExams: {
                                        id: 2,
                                    },
                                };
                                let updateCourse = await generateApiService.put(
                                    ExamsApi.getExamById(data.id),
                                    dataEssayTest
                                );
                                setType("success");
                                setModalVisibleNoti(true);
                                navigation.navigate("/chi-tiet-khoa-hoc-gv", {
                                    id_course: id_course,
                                    newExams: updateCourse,
                                });
                            } else {
                                setType("warning");
                                setModalVisibleNoti(true);
                            }
                        }
                    } catch (err) {
                        setType("error");
                        setModalVisibleNoti(true);
                    }
                }
            }
        }
    };


    const validate = () => {
    };
    return (
        <KeyboardAvoidingView
            behavior={"padding"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
            enabled={Platform.OS === "ios"}
        >
            <Box bg="defaultBackground" position="relative" height="100%">
                <Box height="100%" mt={2}>
                    <Header
                        title={edit ? "Bài thi tự luận" : "Tạo Bài Tự Luận"}
                        search
                        leftButton="back"
                    >
                        <NotificationIcon/>
                    </Header>
                    <Box height={1} bg="#636363" opacity={0.3} mt={2}/>
                    <ScrollView>
                        <Flex flex={1} px={2}>
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
                                        style={{textTransform: "uppercase"}}
                                    >
                                        {titleCourse}
                                    </Text>
                                </Flex>
                            </Flex>
                        </Flex>

                        <Box alignItems="center">
                            <Box width="95%" mt={2}>
                                <Text
                                    fontWeight={500}
                                    fontSize={16}
                                    color="textColor"
                                    padding={2}
                                    style={{textTransform: "uppercase"}}
                                >
                                    thông tin bài thi tự luận
                                </Text>
                            </Box>
                            <Box width="95%" mt={2}>
                                <Text fontSize={16} color="#1C7988" ml={2} mb={2}>
                                    Tiêu đề bài thi <Text color="red">*</Text>
                                </Text>
                                <Box alignItems="center">
                                    <TextInput
                                        multiline={true}
                                        textAlignVertical="top"
                                        width={width * 0.9}
                                        style={{
                                            padding: 4,
                                            minHeight: 50,
                                            marginBottom: 10,
                                            color: "black"
                                        }}
                                        editable={false}
                                        borderRadius={10}
                                        borderWidth={1}
                                        borderColor="rgba(125, 125, 125, 0.3)"
                                        fontSize={16}
                                        value={title}
                                        onFocus={() => setErrorTitle("")}
                                        onChangeText={(value) => setTitle(value)}
                                    ></TextInput>
                                </Box>
                                <Text fontSize={14} color="#f3a908" ml={2}>
                                    {errorTitle}
                                </Text>
                                <Text fontSize={16} color="#1C7988" ml={2} mb={2} mt={2}>
                                    Thời gian mở bài làm <Text color="red">*</Text>
                                </Text>
                                <Box flexDirection="row" mr={2} mb={2}>
                                    <Box
                                        ml={2}
                                        width="45%"
                                        borderRadius={10}
                                        borderWidth={1}
                                        borderColor="rgba(125, 125, 125, 0.3)"
                                        alignItems="center"
                                    >
                                        <TouchableOpacity disabled onPress={() => showDatePicker("start")}>
                                            <Text style={{padding: 8}}>
                                                {startDate
                                                    ? dayjs(startDate).utc().format("HH:mm-DD-MM-YYYY")
                                                    : "dd/mm/yy"}
                                            </Text>
                                        </TouchableOpacity>
                                    </Box>
                                    <Box alignItems="center" justifyContent="center">
                                        <Text ml={2} color="seen">
                                            -
                                        </Text>
                                    </Box>
                                    <Box
                                        ml={2}
                                        width="45%"
                                        borderRadius={10}
                                        borderWidth={1}
                                        borderColor="rgba(125, 125, 125, 0.3)"
                                        alignItems="center"
                                    >
                                        <TouchableOpacity disabled onPress={() => showDatePicker("end")}>
                                            <Text style={{padding: 8}}>
                                                {endDate
                                                    ? dayjs(endDate).utc().format("HH:mm-DD-MM-YYYY")
                                                    : "dd/mm/yy"}
                                            </Text>
                                        </TouchableOpacity>
                                    </Box>
                                </Box>
                                <Text fontSize={14} color="#f3a908" ml={2}>
                                    {errorTime}
                                </Text>
                                <Text fontSize={16} color="#1C7988" ml={2} mb={2} mt={2}>
                                    Giới hạn thời gian làm bài <Text color="red">*</Text>
                                </Text>
                                <Box flexDirection="row" width={width} alignItems="center">
                                    <TextInput
                                        height={40}
                                        width={100}
                                        borderRadius={10}
                                        style={{
                                            padding: 4,
                                            marginBottom: 10,
                                            marginLeft: 10,
                                            color: "black"
                                        }}
                                        editable={false}
                                        borderWidth={1}
                                        borderColor="rgba(125, 125, 125, 0.3)"
                                        fontSize={14}
                                        textAlign={"center"}
                                        keyboardType="numeric"
                                        value={maxTime}
                                        onFocus={() => setErrormaxTime("")}
                                        onChangeText={(value: any) => {
                                            setMaxTime(value), validate();
                                        }}
                                    ></TextInput>
                                    <Box justifyContent="center">
                                        <Text ml={2} color="seen">
                                            Phút
                                        </Text>
                                    </Box>
                                </Box>
                                <Text fontSize={14} color="#f3a908" ml={2}>
                                    {errorMaxTime}
                                </Text>
                                {/* <Box
                  justifyContent="space-between"
                  alignItems="center"
                  flexDirection="row"
                >
                  <Text fontSize={16} color="seen" ml={2} mb={2} mt={2}>
                    Chọn cách thức tạo câu hỏi <Text color="red">*</Text>
                  </Text>
                </Box> */}
                                {/* <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={dataItem}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Chọn hình thức"
                  value={typeQuestion ? dataItem[0] : dataItem[1]}
                  onChange={(item) => {
                    if (item.value === "0") {
                      setTypeQuestion(false);
                    } else if (item.value === "1") {
                      setTypeQuestion(true);
                    }
                  }}
                  renderRightIcon={() => (
                    <Box pr={2}>
                      <Icon name="down" size={12} color={lightColors.seen} />
                    </Box>
                  )}
                /> */}
                                {/* {typeQuestion ? (
                  <Box flexDirection="row" ml={2}>
                    <NavLink
                      {...{
                        route: "/them-cau-hoi",
                        params: {
                          typeTest: "essayTest",
                          question: question,
                        },
                      }}
                    >
                      <Box
                        borderRadius={5}
                        borderWidth={1}
                        borderColor="rgba(125, 125, 125, 0.3)"
                        backgroundColor="buttonColor"
                        minWidth={90}
                        mr={2}
                        alignItems="center"
                      >
                        <Text
                          style={{ padding: 10, color: "#ffffff", right: 0 }}
                          fontSize={15}
                        >
                          Ngân hàng câu hỏi
                        </Text>
                      </Box>
                    </NavLink>
                    <TouchableOpacity
                      onPress={() => setModalVisibleTemplate(true)}
                    >
                      <Box
                        borderRadius={5}
                        borderWidth={1}
                        borderColor="rgba(125, 125, 125, 0.3)"
                        backgroundColor="buttonColor"
                        minWidth={90}
                        alignItems="center"
                      >
                        <Text
                          style={{ padding: 10, color: "#ffffff", right: 0 }}
                          fontSize={15}
                        >
                          Tải bản mẫu
                        </Text>
                      </Box>
                    </TouchableOpacity>
                  </Box>
                ) : null} */}

                            </Box>

                            <Box
                                width="95%"
                                borderRadius={10}
                                mt={20}
                                borderWidth={1}
                                borderColor="rgba(125, 125, 125, 0.3)"
                            >
                                {typeQuestion ? (
                                    <Box>
                                        <Text
                                            fontSize={16}
                                            color="#1C7988"
                                            ml={2}
                                            fontWeight="bold"
                                            mt={2}
                                        >
                                            Câu hỏi :
                                        </Text>
                                        <Box alignItems="center" mb={2}>
                                            <Box
                                                // {...{
                                                //   route: "/tao-noi-dung-bai-giang",
                                                //   params: {
                                                //     descriptionText: question,
                                                //     typeCreate: "essayTest",
                                                //   },
                                                // }}

                                            >
                                                <Box
                                                    ml={1}
                                                    borderRadius={10}
                                                    borderWidth={1}
                                                    borderColor="rgba(125, 125, 125, 0.3)"
                                                    width={width * 0.9}
                                                    minHeight={200}
                                                >
                                                    {question ? (
                                                        <RenderHtml
                                                            contentWidth={width}
                                                            //@ts-ignore
                                                            contentHeight={height}

                                                            source={{
                                                                html: question,
                                                            }}
                                                        />
                                                    ) : null}
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Text fontSize={14} color="#f3a908" ml={4} mb={2}>
                                            {errorQuestion}
                                        </Text>
                                    </Box>
                                ) : (
                                    <Box>
                                        <Box width="100%" mt={2}>
                                            <Text fontSize={16} color="#1C7988" ml={2} mb={1}>
                                                Đính kèm đề thi có sẵn <Text color="red">*</Text>
                                            </Text>
                                        </Box>
                                        {/* <Box
                      padding={2}
                      flexDirection="row"
                      alignItems="center"
                      width={150}
                    >
                      <CardAttachmentsUpload
                        addFile={addFile}
                        title="Tải lên tài liệu"
                        setModalVisible={setModalVisible}
                        uploadType="multiFile"
                      ></CardAttachmentsUpload>
                    </Box> */}
                                        <Text fontSize={14} color="#f3a908" ml={4} mb={2}>
                                            {errorFile}
                                        </Text>
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
                                                        disabled
                                                    >
                                                        <TouchableOpacity
                                                            key={attachments.id}
                                                            // onLongPress={() => deleteAttachments(idx)}
                                                            onPress={() => {
                                                                //  console.log("attachments" , attachments.file.name);

                                                                Linking.openURL(attachments.file.name)
                                                            }}
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
                            {/* <Box flexDirection="row">
                <TouchableOpacity onPress={() => goback()}>
                  <Box
                    borderRadius={5}
                    borderWidth={1}
                    borderColor="buttonColor"
                    mt={2}
                    mr={2}
                    minWidth={90}
                    alignItems="center"
                  >
                    <Text
                      style={{ padding: 10 }}
                      fontSize={15}
                      color="deleteColor"
                    >
                      Hủy
                    </Text>
                  </Box>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    uploadFile();
                  }}
                >
                  <Box
                    borderRadius={5}
                    borderWidth={1}
                    borderColor="rgba(125, 125, 125, 0.3)"
                    mt={2}
                    backgroundColor="buttonColor"
                    minWidth={90}
                    alignItems="center"
                  >
                    <Text
                      style={{ padding: 10, color: "#ffffff", right: 0 }}
                      fontSize={15}
                    >
                      Hoàn thành
                    </Text>
                  </Box>
                </TouchableOpacity>
              </Box> */}
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                locale="vi"
                                mode={!typeChoose ? "date" : "time"}
                                onConfirm={!typeChoose ? handleConfirm : TimeHandleConfirm}
                                onCancel={DatePickerCancel}
                            />
                            <DateTimePickerModal
                                isVisible={isTimePickerVisible}
                                locale="vi"
                                mode="time"
                                onConfirm={TimeHandleConfirm}
                                onCancel={TimePickerCancel}
                            />
                        </Box>
                        <Box height={40}/>
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
                            title={edit ? "Sửa bài" : "Tạo bài"}
                            type={type}
                            isOpen={modalVisibleNoti}
                            setIsOpen={setModalVisibleNoti}
                        />
                        {/* <PopupNotification
              title={edit ? "Sửa bài" : "Tạo bài"}
              type={type}
              setModalVisible={setModalVisibleNoti}
            ></PopupNotification> */}
                    </Modal>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <ModalConfirm
                            getFile={getFile}
                            setModalVisible={setModalVisible}
                            addFile={addFile}
                        ></ModalConfirm>
                    </Modal>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisibleTemplate}
                        onRequestClose={() => {
                            setModalVisibleTemplate(!modalVisible);
                        }}
                    >
                        <ModalTemplate
                            setModalVisibleTemplate={setModalVisibleTemplate}
                            setQuestion={setQuestion}
                        ></ModalTemplate>
                    </Modal>
                </Box>
            </Box>
        </KeyboardAvoidingView>
    );
};
export default CreateEssayTest;

const styles = StyleSheet.create({
    dropdown: {
        height: 44,
        borderWidth: 1,
        borderColor: "rgba(99, 99, 99, 0.2)",
        borderRadius: 8,
        width: "95%",
        marginBottom: 15,
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
        marginLeft: 15,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 0,
    },
    textInputStyle: {
        height: 44,
        borderWidth: 1,
        borderColor: "rgba(99, 99, 99, 0.2)",
        borderRadius: 8,
        width: "90%",
        marginBottom: 2,
    },
});
