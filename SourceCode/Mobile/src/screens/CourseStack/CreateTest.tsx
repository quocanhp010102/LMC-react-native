import {useNavigation} from "@react-navigation/native";
import dayjs from "dayjs";
import {useCallback, useEffect, useState} from "react";
import {Dimensions, KeyboardAvoidingView, Modal, Platform, ScrollView, TouchableOpacity, View,} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {CardAddQuestion} from "../../components/CardAddQuestion";
import {Devider} from "../../components/Devider";
import {Header, NotificationIcon} from "../../components/Header";
import {useGoBack} from "../../platform/go-back";
import {Box, Flex, Text, TextInput} from "../../rebass";
import {generateApiService} from "../../services/ApiService";
import {ActivityHistoriesApi} from "../../services/api/ActivityHistories/ActivityHistoriesApi";
import {ExamsApi} from "../../services/api/Exams/ExamsApi";
import {dataQuizTemplate, dataQuizTemplate2} from "./components/fakeData";
import PopupCloseAutomatically from "../../components/PopupCloseAutomatically";

const {width, height} = Dimensions.get("screen");
const CreateTest = (props: {
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
        props.route.params;
    const goBack = useGoBack();
    const [modalVisibleNoti, setModalVisibleNoti] = useState(false);
    const [type, setType] = useState<string>("");
    const [attachments, setAttachments] = useState([]);
    const [getFile, setGetFile] = useState<any>();
    const [timeChoose, setTimeChoose] = useState<any>("");

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
    const navigation = useNavigation();
    const [title, setTitle] = useState(edit ? data?.examName : "");
    const [dateType, setDateType] = useState("");
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const [attendance, setAttendance] = useState(false);
    const [typeQuestion, setTypeQuestion] = useState(true);
    const [numberOfQuestion, setNumberOfQuestion] = useState();
    const [maxScore, setMaxScore] = useState(100);
    const [minScore, setMinScore] = useState(50);
    const [all, setAll] = useState<boolean>(false);
    const [selected, setSelected] = useState<any>([]);
    const [typeChoose, setTypeChoose] = useState<boolean>(false);
    const [realTime, setRealTime] = useState(true);
    const [newExam, setNewExam] = useState();
    const [errorTitle, setErrorTitle] = useState("");
    const [errorTime, setErrorTime] = useState("");
    const [errorMaxTime, setErrormaxTime] = useState("");
    const [errorQuestion, setErrorQuestion] = useState([]);
    const [question, setQuestion] = useState<any>([]);
    const [items, setItems] = useState([
        {label: "Chọn template ", value: "value1"},
        {label: "Template 1", value: "value2"},
        {label: "Template 2", value: "value3"},
    ]);
    const [value, setValue] = useState({
        value: items[0].value,
        label: items[0].label,
    });
    const choose = useCallback(
        (id: any) => {
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
    useEffect(() => {
        if (newQuestion) {
            setQuestion(newQuestion);
        }
    }, [newQuestion]);
    useEffect(() => {
        if (value) {
            if (value.value == "value1") {
                if (edit) {
                    getData();
                } else {
                    setQuestion([
                        {
                            questionsName: "",
                            answers: [
                                {
                                    answersName: "",
                                    answersStatus: "0",
                                },
                                {
                                    answersName: "",
                                    answersStatus: "0",
                                },
                                {
                                    answersName: "",
                                    answersStatus: "0",
                                },
                                {
                                    answersName: "",
                                    answersStatus: "0",
                                },
                            ],
                        },
                    ]);
                }
            } else if (value.value == "value2") {
                setQuestion(dataQuizTemplate);
            } else if (value.value == "value3") {
                setQuestion(dataQuizTemplate2);
            }
        }
    }, [value]);

    const getData = async () => {
        // const getRealTime = await generateApiService.get(
        //   "http://worldtimeapi.org/api/timezone/Asia/Ho_Chi_Minh"
        // );
        // if (
        //   dayjs(data?.examOpenTime).unix() -
        //     new Date(getRealTime.datetime).getTime() / 1000 <
        //   0
        // ) {
        //   setRealTime(false);
        // }
        const dataExams = await generateApiService.get(ExamsApi.getExamById(id));

        if (dataExams) {
            if (
                dayjs(dataExams?.examOpenTime).unix() - new Date().getTime() / 1000 <
                0
            ) {
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

            setQuestion(dataExams.questions);
            setNewExam(dataExams);
        }
    };

    useEffect(() => {
        if (edit) {
            getData();
        }
    }, []);
    // const chooseAll = () => {
    //     if (!all) {
    //         const allId = question.map((question: any, index: number) => index);
    //         setSelected(allId);
    //     } else {
    //         setSelected([]);
    //     }
    //     setAll(!all);
    // };
    // const showDatePicker = async (e) => {
    //     setErrorTime("");
    //     setDateType(e);
    //     setDatePickerVisibility(true);
    // };
    // const showTimePicker = () => {
    //     setTimePickerVisibility(true);
    // };
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
    const deleteQuestion = async () => {
        let deleteArray = selected.toString();
        const NewArray = question;
        for (let i = 0; i < selected.length; i++) {
            NewArray.splice(
                NewArray.findIndex((data: any, index: number) => index == selected[i]),
                1
            );
        }
        setQuestion(NewArray);
        setSelected([]);
    };
    const TimePickerCancel = () => {
        setTimeChoose(null);
        hideTimePicker();
    };
    const handleConfirm = async (date: any) => {
        if (Platform.OS === "android") {
            if (dateType === "start") {
                setStartDate(dayjs(date).add(7, "hour"));
                await hideDatePicker();
                setTimePickerVisibility(true);
            } else {
                setEndDate(dayjs(date).add(7, "hour"));
                await hideDatePicker();
                setTimePickerVisibility(true);
            }
        } else {
            if (dateType === "start") {
                setStartDate(dayjs(date).add(7, "hour"));
                setTypeChoose(true);
                // await hideDatePicker();
                // setTimePickerVisibility(true);
            } else {
                setEndDate(dayjs(date).add(7, "hour"));
                setTypeChoose(true);
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
    // const addFile = (file , filename) => {
    //   const newAttachment = attachments;
    //   newAttachment[attachments.length] = { file, filename };
    //   setAttachments([{ file, filename }]);
    //   setModalVisible(false);
    // };
    // const deleteAttachments = (index) => {
    //   const newAttachment = attachments;
    //   newAttachment.splice(index, 1);
    //   setAttachments(newAttachment);
    // };
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

    async function checkValidateQuestion() {
        let check = true;
        let newErrorQuestion: any = [];
        let checkDa: any = [];
        await question.map(async (newQuestion: any, idx: number) => {
            checkDa[idx] = "";
            if (newQuestion.questionsName) {
                newErrorQuestion[idx] = "";
            } else {
                check = false;
                newErrorQuestion[idx] = "Câu hỏi không được để trống!";
                await setErrorQuestion(newErrorQuestion);
                return false;
            }
            newQuestion.answers.map(async (newAnswer: any) => {
                if (newAnswer.answersName) {
                    newErrorQuestion[idx] = "";
                } else {
                    check = false;
                    newErrorQuestion[idx] = "Đáp án không được để trống!";
                    await setErrorQuestion(newErrorQuestion);
                    return check;
                }
                if (newAnswer.answersStatus == "1") {
                    checkDa[idx] = "true";
                }
            });
        });
        if (!check) {
            return check;
        } else {
            checkDa.map(async (data: any, id: any) => {
                if (data == "true") {
                    newErrorQuestion[id] = "";
                } else {
                    check = false;
                    newErrorQuestion[id] = "Chưa chọn đáp án đúng!";
                    await setErrorQuestion(newErrorQuestion);
                    return check;
                }
            });
            await setErrorQuestion(newErrorQuestion);
            return check;
        }
    }

    const uploadTest = async () => {
        if (await checkValidateTitle()) {
            if (await checkValidateTime()) {
                if (await checkValidateMaxTime()) {
                    if (await checkValidateQuestion()) {
                        try {
                            if (!edit) {
                                let newQuestion = question;
                                const dataTest = {
                                    examName: title,
                                    examCloseTime: dayjs(endDate)
                                        .utc()
                                        .format("YYYY-MM-DDTHH:mm"),
                                    examOpenTime: dayjs(startDate)
                                        .utc()
                                        .format("YYYY-MM-DDTHH:mm"),
                                    examLimittedWorkingTime: maxTime,
                                    course: {
                                        id: id_course,
                                    },
                                    questions: question,
                                    typeOfExams: {
                                        id: "1",
                                    },
                                };

                                let updateCourse = await generateApiService.post(
                                    ExamsApi.postExam(),
                                    dataTest
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
                            } else {
                                if (realTime) {
                                    let newQuestion = question;
                                    await newQuestion.map((newQuestion: any) => {
                                        delete newQuestion.id,
                                            delete newQuestion.questionsFile,
                                            delete newQuestion.questionsPoint;
                                        newQuestion.answers.map((newQuestion: any) => {
                                            delete newQuestion.answersPoint, delete newQuestion.id;
                                        });
                                    });
                                    let newExam1: any = newExam;
                                    newExam1.examName = title;
                                    (newExam1.examCloseTime = endDate),
                                        (newExam1.examOpenTime = startDate),
                                        (newExam1.examLimittedWorkingTime = maxTime),
                                        (newExam1.questions = question);
                                    let updateCourse = await generateApiService.put(
                                        ExamsApi.getExamById(data.id),
                                        newExam1
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
                        } catch (error) {
                            setType("error");
                            setModalVisibleNoti(true);
                        }
                    }
                }
            }
        }
    };

    const [open, setOpen] = useState(false);
    // const [items, setItems] = useState([
    //   { label: "Hoàn thành các bài trước đó", value: "value1" },
    //   { label: "Không hoàn thành các bài trước đó", value: "value2" },
    // ]);
    // const [value, setValue] = useState({
    //   value: items[0].value,
    //   label: items[0].label,
    // });
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <KeyboardAvoidingView
            behavior={"padding"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
            enabled={Platform.OS === "ios"}
        >
            <Box bg="defaultBackground" position="relative" height="100%">
                <Box height="100%" mt={2}>
                    <Header
                        title={edit ? "Bài thi trắc nghiệm" : "Tạo bài trắc nghiệm"}
                        search
                        leftButton="back"
                    >
                        <NotificationIcon/>
                    </Header>
                    <Box height={1} bg="#636363" opacity={0.3} mt={2}/>
                    <ScrollView>
                        <Flex flex={1} px={2}>
                            <Devider></Devider>
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
                                    Thiết lập bài thi trắc nghiệm
                                </Text>
                            </Box>
                            <Box width="95%" mt={2}>
                                <Text fontSize={16} color="seen" ml={2} mb={2}>
                                    Tiêu đề bài thi <Text color="red">*</Text>
                                </Text>
                                <Box alignItems="center">
                                    <TextInput
                                        multiline={true}
                                        textAlignVertical="top"
                                        width={width * 0.9}
                                        borderRadius={10}
                                        style={{
                                            minHeight: 50,
                                            padding: 4,
                                            marginBottom: 10,
                                            color: "black"
                                        }}
                                        borderWidth={1}
                                        borderColor="rgba(125, 125, 125, 0.3)"
                                        editable={false}
                                        fontSize={16}
                                        value={title}
                                        onFocus={() => setErrorTitle("")}
                                        onChangeText={(value) => setTitle(value)}
                                    ></TextInput>
                                </Box>
                                <Text fontSize={14} color="#f3a908" ml={2}>
                                    {errorTitle}
                                </Text>
                                <Text fontSize={16} color="seen" ml={2} mb={2}>
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
                                        <TouchableOpacity
                                            // onPress={() => showDatePicker("start")}

                                        >
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
                                        <TouchableOpacity
                                            // onPress={() => showDatePicker("end")}
                                        >
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
                                <Text fontSize={16} color="seen" ml={2} mb={2}>
                                    Giới hạn thời gian làm bài <Text color="red">*</Text>
                                </Text>
                                <Box flexDirection="row" width={width} alignItems="center">
                                    <TextInput
                                        height={40}
                                        width={100}
                                        borderRadius={10}
                                        borderWidth={1}
                                        borderColor="rgba(125, 125, 125, 0.3)"
                                        style={{
                                            padding: 4,
                                            marginBottom: 10,
                                            marginLeft: 10,
                                            color: "black"
                                        }}
                                        editable={false}
                                        fontSize={14}
                                        textAlign={"center"}
                                        keyboardType="numeric"
                                        value={maxTime}
                                        onChangeText={(value) => setMaxTime(value)}
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
                            </Box>

                            <Box
                                width="95%"
                                mt={2}
                                borderRadius={8}
                                borderWidth={question.length > 1 ? 1 : 0}
                                borderColor={"rgba(125, 125, 125, 0.3)"}
                                padding={1}
                            >
                                {/* <Box
                  alignItems="center"
                  justifyContent="space-between"
                  flexDirection="row"
                >
                  <Text ml={2} color="seen" fontSize={15} mb={2}>
                    Tạo mới bài thi trắc Nghiệm
                  </Text>
                  <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Icon name="addIcon" />
                  </TouchableOpacity>
                </Box> */}

                                {/* <Box
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="flex-start"
                  mb={2}
                  mt={1}
                  ml={1}
                >
                  <NavLink
                    {...{
                      route: "/them-cau-hoi",
                      params: {
                        typeTest: "quizTest",
                        question: question,
                      },
                    }}
                  >
                    <Box
                      style={{
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: lightColors.borderColor,
                        height: 40,
                        flexDirection: "row",
                        alignItems: "center",
                        marginLeft: 4,
                        justifyContent: "center",
                      }}
                    >
                      <Box marginLeft={2}>
                        <Icon name="questionBankIcon" />
                      </Box>
                      <Text color="textColor" px={2}>
                        Ngân hàng câu hỏi
                      </Text>
                    </Box>
                  </NavLink>
                </Box> */}
                                {/* <Box flexDirection="row" mb={2}>
                  <TouchableOpacity
                    style={{
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: lightColors.borderColor,
                      height: 40,
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: 10,
                      justifyContent: "center",
                      width: "45%",
                    }}
                    onPress={() => chooseAll()}
                  >
                    <Box marginLeft={2}>
                      <ICCheckAll />
                    </Box>
                    <Text color="textColor" px={2}>
                      Chọn tất cả
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: lightColors.borderColor,
                      height: 40,
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: 10,
                      justifyContent: "center",
                      width: "45%",
                    }}
                    onPress={() => deleteQuestion()}
                  >
                    <Box marginLeft={2}>
                      <Icon name="remove" />
                    </Box>
                    <Text color="deleteColor" px={2}>
                      Xóa
                    </Text>
                  </TouchableOpacity>
                </Box> */}
                                {question.map((questionData: any, index: number) => {
                                    const isSelected = selected.includes(index);
                                    return (
                                        <Box key={index}>
                                            <Text fontSize={16} color="seen" fontWeight="bold" ml={1}>
                                                Câu {index + 1}:
                                            </Text>
                                            <Text fontSize={14} color="#f3a908" ml={1}>
                                                {errorQuestion[index]}
                                            </Text>
                                            <CardAddQuestion
                                                data={questionData}
                                                question={question}
                                                choose={choose}
                                                isSelected={isSelected}
                                                setQuestion={setQuestion}
                                                index={index}
                                            />
                                        </Box>
                                    );
                                })}
                                <Box flexDirection="row" justifyContent="flex-end" mr={1}>
                                    <TouchableOpacity
                                        onPress={() =>
                                            setQuestion([
                                                ...question,
                                                {
                                                    questionsName: "",
                                                    answers: [
                                                        {
                                                            answersName: "",
                                                            answersStatus: "0",
                                                        },
                                                        {
                                                            answersName: "",
                                                            answersStatus: "0",
                                                        },
                                                        {
                                                            answersName: "",
                                                            answersStatus: "0",
                                                        },
                                                        {
                                                            answersName: "",
                                                            answersStatus: "0",
                                                        },
                                                    ],
                                                },
                                            ])
                                        }
                                    >
                                        {/* <Box
                      bg="#DC4E41"
                      height={30}
                      width={30}
                      borderRadius={50}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text fontSize={21} color="white" fontWeight="bold">
                        +
                      </Text>
                    </Box> */}
                                    </TouchableOpacity>
                                </Box>
                            </Box>
                            {/* <Box flexDirection="row">
                <TouchableOpacity onPress={() => goBack()}>
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
                    uploadTest();
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
                        <Box height={20}/>
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
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: 22,
                            }}
                        >
                            <View
                                style={{
                                    width: "90%",
                                    margin: 20,
                                    backgroundColor: "white",
                                    borderRadius: 20,
                                    padding: 10,

                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 4,
                                    elevation: 5,
                                }}
                            >
                                <Box alignItems="center">
                                    <Text
                                        color="buttonColor"
                                        fontSize={20}
                                        fontWeight="bold"
                                        py={2}
                                    >
                                        CHỌN TEMPLATE MẪU
                                    </Text>
                                </Box>
                                {items.map((items: any) => (
                                    <TouchableOpacity
                                        key={items.id}
                                        onPress={() => {
                                            setValue({value: items.value, label: items.label}),
                                                setModalVisible(!modalVisible);
                                        }}
                                    >
                                        <Box
                                            width="100%"
                                            borderRadius={10}
                                            borderWidth={1}
                                            borderColor="rgba(125, 125, 125, 0.3)"
                                            height={40}
                                            mb={2}
                                            flexDirection="row"
                                            justifyContent="center"
                                            alignItems="center"
                                        >
                                            <Text color="seen" width="90%" fontSize={16}>
                                                {items.label}
                                            </Text>
                                            <Box
                                                height={19}
                                                width={19}
                                                borderColor="#DADADA"
                                                borderRadius={50}
                                                borderWidth={1}
                                                ml={2}
                                                alignItems="center"
                                                justifyContent="center"
                                            >
                                                <Box
                                                    height={12}
                                                    width={12}
                                                    borderColor="#DADADA"
                                                    borderRadius={50}
                                                    backgroundColor={
                                                        items.value == value.value ? "green" : "null"
                                                    }
                                                ></Box>
                                            </Box>
                                        </Box>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </Modal>
                </Box>
            </Box>
        </KeyboardAvoidingView>
    );
};
export default CreateTest;
