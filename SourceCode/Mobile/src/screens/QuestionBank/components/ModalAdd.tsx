import React, {useEffect, useState} from "react";
import {
    Dimensions,
    Keyboard,
    Modal,
    ScrollView,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from "react-native";
import {Box, Text} from "../../../rebass";
import {Icon} from "../../../components/svg-icon";
import {generateApiService} from "../../../services/ApiService";
import {useGoBack} from "../../../platform/go-back";
import {DepartmentApi} from "../../../services/api/Departments/DepartmentApi";
import {QuestionsBankApi} from "../../../services/api/QuestionsBank/QuestionsBankApi";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

const {width, height} = Dimensions.get("screen");

export const ModalAdd = (props: {
    data?: any;
    setModalVisible: any;
    getQuestionBankStore: any;
    setTitleEdit: any;
    setType: any;
    setModalVisibleNoti: any;
    questionBank: any;
    edit: boolean;
}) => {
    const {
        data,
        setModalVisible,
        getQuestionBankStore,
        setTitleEdit,
        setType,
        setModalVisibleNoti,
        questionBank,
        edit,
    } = props;
    const [showError , setShowError] = useState<boolean>(false)

    const [typeChoose, setTypeChoose] = useState("");
    const items = [
        {label: "Trắc nghiệm", value: "value1"},
        {label: "Tự luận", value: "value2"},
    ]
    const [itemsDepartment, setItemsDepartment] = useState([]);
    const [itemsCourse, setItemsCourse] = useState<any>([]);
    const [nextStep, setNextStep] = useState(false);
    const [questionEssay, setQuestionEssay] = useState("");
    const [answerEssay, setAnswerEssay] = useState("");
    const getDataDepartment = async () => {
        const dataDepartments = await generateApiService.get(
            DepartmentApi.getAllDepartments()
        );
        if (dataDepartments) {
            setItemsDepartment(dataDepartments.content);
        }
    };
    const [question, setQuestion] = useState<any>([
        {
            question: "",
            answer: [
                {answerName: "", answerStatus: 0},
                {answerName: "", answerStatus: 0},
                {answerName: "", answerStatus: 0},
                {answerName: "", answerStatus: 0},
            ],
        },
    ]);
    const [answerChoose, setAnswerChoose] = useState<any>();
    const [modalChoose, setModalChoose] = useState(false);
    const [value, setValue] = useState<any>({
        value: items[0].value,
        label: items[0].label,
    });
    const [valueDepartments, setValueDepartments] = useState<any>();
    const [valueCourse, setValueCourse] = useState<any>();
    const setNewAnswerChoose = (index: any) => {
        setAnswerChoose(index);
        let newQuestion = [...question];
        question[0].answer.map((answer: any, idx: number) => {
            if (idx == index) {
                newQuestion[0].answer[idx].answerStatus = 1;
            } else {
                newQuestion[0].answer[idx].answerStatus = 0;
            }
        });
        setQuestion(newQuestion);
    };

    const [errorQuestion, setErrorQuestion] = useState("");
    const checkValidate = async () => {
        if (value.value === "value1") {
            let check = true;
            let newErrorQuestion: any = [];
            let checkDa: any = [];
            await question.map(async (newQuestion : any, idx : number) => {
                checkDa[idx] = "";
                if (newQuestion.question) {
                    newErrorQuestion[idx] = "";
                } else {
                    check = false;
                    newErrorQuestion[idx] = "Câu hỏi không được để trống!";
                    await setErrorQuestion(newErrorQuestion);
                    return false;
                }
                newQuestion.answer.map(async (newAnswer: any) => {
                    if (newAnswer.answerName) {
                        newErrorQuestion[idx] = "";
                    } else {
                        check = false;
                        newErrorQuestion[idx] = "Đáp án không được để trống!";
                        await setErrorQuestion(newErrorQuestion[idx]);
                        return false;
                    }
                    if (newAnswer.answerStatus == "1") {
                        checkDa[idx] = "true";
                    }
                });
            });
            if (!check) {
                return check;
            } else {
                checkDa.map(async (data: any, id: number) => {
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
        } else {
            let check = true;
            let newErrorQuestion = "";
            if (questionEssay) {
                newErrorQuestion = "";
            } else {
                check = false;
                newErrorQuestion = "Câu hỏi không được để trống!";
                await setErrorQuestion(newErrorQuestion);
                return false;
            }
            if (answerEssay) {
                newErrorQuestion = "";
            } else {
                check = false;
                newErrorQuestion = "Đáp án không được để trống!";
                await setErrorQuestion(newErrorQuestion);
                return false;
            }
            await setErrorQuestion(newErrorQuestion);
            return check;
        }
    };

    const uploadFile = async () => {
        if (await checkValidate()) {
            if (edit) {
                let newQuestionBank = data;
                newQuestionBank.questionName =
                    value.value == "value1" ? question[0].question : questionEssay;
                newQuestionBank.answerBanks =
                    value.value === "value1"
                        ? question[0].answer
                        : [
                            {
                                id: data.answerBanks[0].id,
                                answerName: answerEssay,
                                answerStatus: "0",
                            },
                        ];

                const uploadQuestion = await generateApiService.put(
                    QuestionsBankApi.getQuestionsBankById(data.id),
                    newQuestionBank
                );
                getQuestionBankStore(true);
                setModalVisible(false);
                setTitleEdit("Sửa câu hỏi thành công !");
                setType("success");
                setModalVisibleNoti(true);
            } else {
                console.log(valueCourse)
                const dataQuestionUpload = {
                    questionType: value.value == "value1" ? "0" : "1",
                    course: {id: valueCourse.value},
                    questionName:
                        value.value === "value1" ? question[0].question : questionEssay,
                    answerBanks:
                        value.value === "value1"
                            ? question[0].answer
                            : [{answerName: answerEssay, answerStatus: "0"}],
                };
                console.log("uploadQuestion", dataQuestionUpload);
                const uploadQuestion = await generateApiService.post(
                    QuestionsBankApi.questionsBank(),
                    dataQuestionUpload
                );
                getQuestionBankStore(true);
                setModalVisible(false);
                setTitleEdit("Thêm câu hỏi thành công !");
                setType("success");
                setModalVisibleNoti(true);
            }
        }
    };
    useEffect(() => {
        getDataDepartment();
        if (edit) {
            setValueDepartments(data.department);
            setValueCourse(data.course);

            setValue({value: data.questionType == "0" ? "value1" : "value2"});

            setNextStep(true);

            if (data.questionType == "0") {
                setQuestion([
                    {question: data.questionName, answer: data.answerBanks},
                ]);
                data.answerBanks.map((answer: any, idx: number) => {
                    if (answer.answerStatus == "1") {
                        setAnswerChoose(idx);
                    }
                });
            } else {
                setQuestionEssay(data.questionName);

                setAnswerEssay(data.answerBanks[0].answerName);
            }
        }
    }, []);
    const setAnswerQuestion = (value: any, index: number) => {
        let newQuestion = [...question];
        newQuestion[0].answer[index].answerName = value;
        setQuestion(newQuestion);
    };
    const setNewQuestion = async (value: any) => {
        let newQuestion = [...question];
        newQuestion[0].question = value;
        setQuestion(newQuestion);
    };

    const setValueDepartmentsCheck = async (item: any) => {
        setValueDepartments(item);
        let newData : any = [];
        const dataCourse = await generateApiService.get(
            DepartmentApi.getCourseByDepartment(item.value)
        );
        dataCourse.content.map((course: any) => {
            newData.push({
                label: course.courseName,
                value: course.courseID,
            });
        });

        setItemsCourse(newData);
    };

    useEffect(() => {
         if(showError) {
             setShowError(false);
         }
    }, [value , valueDepartments , valueCourse]);

    const ListModal = () => {
        let newItems = [];
        if (typeChoose == "departmentChoose") {
            newItems = [];
            itemsDepartment.map((department: any) =>
                newItems.push({
                    label: department.department_name,
                    value: department.id,
                })
            );
        } else if (typeChoose == "courseChoose") {
            newItems = itemsCourse;
        } else if (typeChoose == "typeQuestion") {
            newItems = [];
            newItems = items;
        }



        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                {newItems.map((item: any) => (
                    <TouchableOpacity
                        delayPressIn={0}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 10,
                            borderWidth: 1,
                            height: 40,
                            borderRadius: 8,
                            borderColor: "#636363",
                            width: width * 0.8,
                        }}
                        onPress={() => {
                            typeChoose == "departmentChoose"
                                ? setValueDepartmentsCheck({
                                    value: item.value,
                                    label: item.label,
                                })
                                : typeChoose == "courseChoose"
                                    ? setValueCourse({
                                        value: item.value,
                                        label: item.label,
                                    })
                                    : setValue({value: item.value, label: item.label}),
                                setModalChoose(false);
                        }}
                    >
                        <Box
                            height={19}
                            width={19}
                            borderColor={
                                typeChoose == "departmentChoose"
                                    ? valueDepartments?.value === item.value
                                        ? "#1C7988"
                                        : "#DADADA"
                                    : typeChoose == "courseChoose"
                                        ? valueCourse?.value === item.value
                                            ? "#1C7988"
                                            : "#DADADA"
                                        : value.value === item.value
                                            ? "#1C7988"
                                            : "#DADADA"
                            }
                            borderRadius={50}
                            borderWidth={1}
                            ml={2}
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Box
                                height={12}
                                width={12}
                                borderColor={
                                    typeChoose == "departmentChoose"
                                        ? valueDepartments?.value === item.value
                                            ? "#1C7988"
                                            : "#DADADA"
                                        : typeChoose == "courseChoose"
                                            ? valueCourse?.value === item.value
                                                ? "#1C7988"
                                                : "#DADADA"
                                            : value.value === item.value
                                                ? "#1C7988"
                                                : "#DADADA"
                                }
                                borderRadius={50}
                                backgroundColor={
                                    typeChoose == "departmentChoose"
                                        ? valueDepartments?.value === item.value
                                            ? "#1C7988"
                                            : ""
                                        : typeChoose == "courseChoose"
                                            ? valueCourse?.value === item.value
                                                ? "#1C7988"
                                                : ""
                                            : value.value === item.value
                                                ? "#1C7988"
                                                : ""
                                }
                            ></Box>
                        </Box>
                        <Text ml={2} color="seen" fontSize={15} width={width * 0.67}>
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        );
    };
    if (nextStep) {
        return (
            <Box
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 22,
                }}
            >
                {value.value === "value1" ? (
                    <Box>
                        <Box
                            style={{
                                maxHeight : Dimensions.get('screen').height*0.9,
                                width: width * 0.9,
                                margin: 20,
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
                                justifyContent: "space-between",
                            }}
                        >
                            <KeyboardAwareScrollView
                                showsVerticalScrollIndicator={false}
                                style={{width: width * 0.9}}
                                enableAutomaticScroll
                                enableOnAndroid
                                extraHeight={150}
                            >
                                <Box style={{alignItems: "center", justifyContent: "center"}}>
                                    <Text
                                        fontSize={18}
                                        color="textColor"
                                        fontWeight="bold"
                                        lineHeight={25}
                                        mt={15}
                                        mb={15}
                                    >
                                        {!edit ? "TẠO" : "SỬA"} CÂU HỎI TRẮC NGHIỆM
                                    </Text>
                                    <Box width={"100%"}>
                                        <TextInput
                                            placeholder={"Điền câu hỏi ..."}
                                            multiline={true}
                                            textAlignVertical="top"
                                            //@ts-ignore
                                            width="85%"
                                            marginLeft={10}
                                            height={150}
                                            borderRadius={10}
                                            borderWidth={1}
                                            borderColor="rgba(125, 125, 125, 0.3)"
                                            placeholderTextColor={'#a9a9a9'}
                                            fontSize={16}
                                            padding={2}
                                            marginBottom={10}
                                            value={question[0].question}
                                            onChangeText={(value) => {
                                                setNewQuestion(value);
                                            }}
                                        ></TextInput>
                                    </Box>
                                    {question[0].answer.map((answer: any, index: number) => (
                                        <Box
                                            key={index}
                                            flexDirection="row"
                                            alignItems="center"
                                            justifyContent="space-between"
                                        >
                                            <TextInput
                                                //@ts-ignore
                                                width="85%"
                                                borderRadius={10}
                                                borderWidth={1}
                                                borderColor="rgba(125, 125, 125, 0.3)"
                                                fontSize={16}
                                                padding={2}
                                                placeholderTextColor={'#a9a9a9'}
                                                marginBottom={10}
                                                height={height * 0.075}
                                                placeholder={"Câu trả lời số" + (index + 1)}
                                                value={
                                                    question[0].answer.find((x : any, idx : number) => idx === index)
                                                        .answerName
                                                }
                                                onChangeText={(value) => {
                                                    setAnswerQuestion(value, index);
                                                }}
                                            ></TextInput>
                                            <TouchableOpacity
                                                delayPressIn={0}
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",

                                                    marginLeft: 5,
                                                    marginBottom: 10,
                                                    height: "60%",
                                                    width: "10%",
                                                }}
                                                onPress={() => setNewAnswerChoose(index)}
                                            >
                                                <Box
                                                    height={19}
                                                    width={19}
                                                    borderColor={
                                                        index == answerChoose ? "#1C7988" : "#DADADA"
                                                    }
                                                    borderRadius={50}
                                                    borderWidth={1}
                                                    alignItems="center"
                                                    justifyContent="center"
                                                >
                                                    <Box
                                                        height={12}
                                                        width={12}
                                                        borderColor="#DADADA"
                                                        borderRadius={50}
                                                        backgroundColor={
                                                            index == answerChoose ? "#1C7988" : "null"
                                                        }
                                                    ></Box>
                                                </Box>
                                            </TouchableOpacity>
                                        </Box>
                                    ))}
                                    <Box flex={1} width={'100%'}>
                                    <Text  fontSize={14} color="red" ml={2}  mb={2}>
                                        {errorQuestion}
                                    </Text>
                                    </Box>
                                    <Box flexDirection="row">
                                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                                            <Box
                                                borderRadius={5}
                                                borderWidth={1}
                                                borderColor="deleteColor"
                                                mt={2}
                                                mr={2}
                                                width={width * 0.4}
                                                alignItems="center"

                                            >
                                                <Text style={{padding: 10}} color="deleteColor">
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
                                                borderColor="buttonColor"
                                                mt={2}
                                                backgroundColor="buttonColor"
                                                width={width * 0.4}
                                                alignItems="center"
                                            >
                                                <Text
                                                    style={{padding: 10, color: "#ffffff", right: 0}}
                                                    numberOfLines={1}
                                                >
                                                    Lưu
                                                </Text>
                                            </Box>
                                        </TouchableOpacity>
                                    </Box>
                                </Box>
                            </KeyboardAwareScrollView>
                        </Box>
                    </Box>
                ) : (
                    <Box
                        style={{
                            height: 500,
                            width: width * 0.9,
                            margin: 20,
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
                    >
                        <KeyboardAwareScrollView
                            showsVerticalScrollIndicator={false}
                            style={{width: width * 0.9, height: 600}}
                            enableAutomaticScroll
                            enableOnAndroid
                            extraHeight={150}
                        >
                            <Box
                                style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flex: 1,
                                }}
                            >
                                <Text
                                    fontSize={16}
                                    color="textColor"
                                    fontWeight="bold"
                                    mt={15}
                                    mb={15}
                                >
                                    {!edit ? "TẠO" : "SỬA"} CÂU HỎI TỰ LUẬN
                                </Text>

                                <Box style={{width: "100%"}} pl={2}>
                                    <Text color="#1C7988" fontSize={16} fontWeight="bold" mb={1}>
                                        Tiêu đề câu hỏi
                                    </Text>
                                </Box>
                                <TextInput
                                    placeholder={"Điền câu hỏi ..."}
                                    multiline={true}
                                    textAlignVertical="top"
                                    //@ts-ignore
                                    width="95%"
                                    height={150}
                                    borderRadius={10}
                                    borderWidth={1}
                                    borderColor="rgba(125, 125, 125, 0.3)"
                                    fontSize={16}
                                    padding={2}
                                    marginBottom={10}
                                    value={questionEssay}
                                    onChangeText={(value) => setQuestionEssay(value)}
                                ></TextInput>
                                <Box style={{width: "100%"}} pl={2}>
                                    <Text color="#1C7988" fontSize={16} fontWeight="bold" mb={1}>
                                        Đáp án
                                    </Text>
                                </Box>
                                <TextInput
                                    placeholder={"Điền đáp án ..."}
                                    multiline={true}
                                    textAlignVertical="top"
                                    //@ts-ignore
                                    width="95%"
                                    height={150}
                                    borderRadius={10}
                                    borderWidth={1}
                                    borderColor="rgba(125, 125, 125, 0.3)"
                                    fontSize={16}
                                    padding={2}
                                    marginBottom={10}
                                    value={answerEssay}
                                    onChangeText={(value) => setAnswerEssay(value)}
                                ></TextInput>
                                <Text fontSize={14} color="#f3a908" ml={4} mb={2}>
                                    {errorQuestion}
                                </Text>
                                <Box flexDirection="row">
                                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                                        <Box
                                            borderRadius={5}
                                            borderWidth={1}
                                            borderColor="deleteColor"
                                            mt={2}
                                            mr={2}
                                            width={width * 0.4}
                                            alignItems="center"

                                        >
                                            <Text style={{padding: 10}} color="deleteColor">
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
                                            borderColor="buttonColor"
                                            mt={2}
                                            backgroundColor="buttonColor"
                                            width={width * 0.4}
                                            alignItems="center"
                                        >
                                            <Text
                                                style={{padding: 10, color: "#ffffff", right: 0}}
                                                numberOfLines={1}
                                            >
                                                Lưu
                                            </Text>
                                        </Box>
                                    </TouchableOpacity>
                                </Box>
                            </Box>
                        </KeyboardAwareScrollView>
                    </Box>
                )}

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalChoose}
                    onRequestClose={() => {
                        setModalVisible(false);
                    }}
                >
                    <Box
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 22,
                        }}
                    >
                        <Box
                            style={{
                                maxHeight: height * 0.7,
                                width: width * 0.9,
                                margin: 20,
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
                        >
                            {ListModal()}
                            <TouchableOpacity
                                onPress={() => setModalChoose(false)}
                                style={{
                                    height: 40,
                                    width: 80,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: 8,
                                }}
                            >
                                <Text color="white" fontWeight="bold">
                                    Hủy
                                </Text>
                            </TouchableOpacity>
                        </Box>
                    </Box>
                </Modal>
            </Box>
        );
    }
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <Box
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 22,
                }}
            >
                <Box
                    style={{
                        maxHeight : Dimensions.get('screen').height *0.9,
                        width: width * 0.9,
                        margin: 20,
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
                >
                    <Text
                        fontSize={16}
                        color="textColor"
                        fontWeight="bold"
                        mt={15}
                        mb={15}
                    >
                        TẠO CÂU HỎI MỚI
                    </Text>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <Text color="#1C7988" fontSize={16} fontWeight={500}>
                            Chuyên ngành:
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                setTypeChoose("departmentChoose"), setModalChoose(true);
                            }}
                        >
                            <Box
                                borderWidth={1}
                                height={40}
                                width={"97.5%"}
                                borderColor="rgba(99, 99, 99, 0.15)"
                                mt={1}
                                alignItems="center"
                                justifyContent="space-between"
                                flexDirection="row"
                                borderRadius={5}
                            >
                                <Text color="seen" ml={1} mr={1} width={"90%"}>
                                    {valueDepartments
                                        ? valueDepartments.label
                                        : "Chọn chuyên ngành"}
                                </Text>
                                <Box mr={2}>
                                    <Icon name="moreMember"></Icon>
                                </Box>
                            </Box>
                        </TouchableOpacity>
                        <Text color="#1C7988" fontSize={16} fontWeight={500} mt={3}>
                            Khóa học:
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                setTypeChoose("courseChoose"), setModalChoose(true);
                            }}
                        >
                            <Box
                                borderWidth={1}
                                height={40}
                                width={"97.5%"}
                                borderColor="rgba(99, 99, 99, 0.15)"
                                mt={1}
                                alignItems="center"
                                justifyContent="space-between"
                                flexDirection="row"
                                borderRadius={5}
                            >
                                <Text color="seen" ml={1} mr={1} width={"90%"}>
                                    {valueCourse ? valueCourse.label : "Chọn môn học"}
                                </Text>

                                <Box mr={2}>
                                    <Icon name="moreMember"></Icon>
                                </Box>
                            </Box>
                        </TouchableOpacity>
                        <Text fontSize={16} fontWeight={500} color="#1C7988" mt={2}>
                            Dạng câu hỏi
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                setTypeChoose("typeQuestion"), setModalChoose(true);
                            }}
                        >
                            <Box
                                borderWidth={1}
                                height={40}
                                width={"97.5%"}
                                borderColor="rgba(99, 99, 99, 0.15)"
                                alignItems="center"
                                mt={1}
                                justifyContent="space-between"
                                flexDirection="row"
                                borderRadius={5}
                            >
                                <Text color="seen" ml={1} mr={1} width={"90%"}>
                                    {value?.label}
                                </Text>
                                <Box mr={2}>
                                    <Icon name="moreMember"></Icon>
                                </Box>
                            </Box>
                        </TouchableOpacity>
                        <Text opacity={showError ? 1 : 0} color={'red'}  mt={1}>Vui lòng chọn đầy đủ thông tin!</Text>
                        <Box flexDirection="row">
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Box
                                    borderRadius={5}
                                    borderWidth={1}
                                    borderColor="deleteColor"
                                    mt={2}
                                    mr={2}
                                    width={width * 0.4}
                                    alignItems="center"

                                >
                                    <Text style={{padding: 10}} color="deleteColor">
                                        Hủy
                                    </Text>
                                </Box>
                            </TouchableOpacity>


                            <TouchableOpacity
                                onPress={() => {
                                    if (value && valueDepartments && valueCourse) {
                                        setNextStep(true);
                                    } else {
                                        setShowError(true)
                                    }
                                }}
                            >
                                <Box
                                    borderRadius={5}
                                    borderWidth={1}
                                    borderColor="buttonColor"
                                    mt={2}
                                    backgroundColor="buttonColor"
                                    width={width * 0.4}
                                    alignItems="center"
                                >
                                    <Text
                                        style={{padding: 10, color: "#ffffff", right: 0}}
                                        numberOfLines={1}
                                    >
                                        Tiếp theo
                                    </Text>
                                </Box>
                            </TouchableOpacity>
                        </Box>
                    </ScrollView>
                </Box>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalChoose}
                    onRequestClose={() => {
                        setModalVisible(false);
                    }}
                >
                    <Box
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 22,
                        }}
                    >
                        <Box
                            style={{
                                maxHeight: height * 0.7,
                                width: width * 0.9,
                                margin: 20,
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
                        >
                            {ListModal()}
                            <TouchableOpacity
                                onPress={() => setModalChoose(false)}
                                style={{
                                    height: 40,
                                    width: 80,
                                    backgroundColor: "#00A8B5",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: 8,
                                }}
                            >
                                <Text color="white" fontWeight="bold">
                                    Hủy
                                </Text>
                            </TouchableOpacity>
                        </Box>
                    </Box>
                </Modal>
            </Box>
        </TouchableWithoutFeedback>
    );
};
