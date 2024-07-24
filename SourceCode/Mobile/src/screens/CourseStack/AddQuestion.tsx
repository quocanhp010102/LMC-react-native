import {useNavigation} from "@react-navigation/native";
import React, {useEffect, useState} from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {Devider} from "../../components/Devider";
import {Header, HeaderClose} from "../../components/Header";
import {InputWithIcon} from "../../components/InputWithIcon";
import {Icon} from "../../components/svg-icon";
import {Box, Flex, Text} from "../../rebass";
import {generateApiService} from "../../services/ApiService";
import {DepartmentApi} from "../../services/api/Departments/DepartmentApi";
import {QuestionsBankApi} from "../../services/api/QuestionsBank/QuestionsBankApi";
import PopupCloseAutomatically from "../../components/PopupCloseAutomatically";

const {width, height} = Dimensions.get("screen");
const AddQuestion = (props: any) => {
    const [modalVisibleNotifi, setModalVisibleNotifi] = useState(false);
    const type = ""
    const titleEdit = ""
    const [modalVisible, setModalVisible] = useState(false);
    const [queryInput, setQueryInput] = React.useState<string>("");
    const [loading, setLoading] = React.useState<boolean>(false);
    const [filter, setFilter] = React.useState<boolean>(false);
    const [showAnswer, setShowAnswer] = React.useState<any>("");
    const [questionBank, setQuestionBank] = React.useState<any[]>([]);
    const [dataFilter, setDataFilter] = React.useState([]);
    const typeTest = props.route.params.typeTest
    const [questionChoose, setQuestionChoose] = React.useState<any[]>([]);
    const [page, setPage] = useState(0);
    const size = 10
    const refreshing = false
    const [totalPages, setTotalPages] = useState(0);
    const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
    const navigation = useNavigation();
    let timeOut;
    const checkVadidate = (inputValue: any) => {
        if (inputValue.length <= 255) {
            setQueryInput(inputValue);

            if (inputValue === "") {
            }
        } else {
            setQueryInput("");
        }
    };
    const setQuestionShow = (id: any) => {
        if (id == showAnswer) {
            setShowAnswer("");
        } else {
            setShowAnswer(id);
        }
    };

    const [items, setItems] = useState([
        {label: "Tất cả", value: "value0"},
        {label: "Trắc nghiệm", value: "value1"},
        {label: "Tự luận", value: "value2"},
    ]);
    const [typeChoose, setTypeChoose] = useState("");
    const [itemsDepartment, setItemsDepartment] = useState([
        {label: "Tất cả", value: "value0"},
    ]);
    const [itemsCourse, setItemsCourse] = useState([
        {label: "Tất cả", value: "value0"},
    ]);
    const [modalChoose, setModalChoose] = useState(false);
    const [value, setValue] = useState({
        value: items[0].value,
        label: items[0].label,
    });
    const [valueDepartments, setValueDepartments] = useState({
        value: itemsDepartment[0].value,
        label: itemsDepartment[0].label,
    });
    const [valueCourse, setValueCourse] = useState({
        value: itemsCourse[0].value,
        label: itemsCourse[0].label,
    });
    const addQuestionBank = (question: any) => {
        let newQuestion = [...questionChoose];
        let check = questionChoose.findIndex(
            (questionChoose) => questionChoose.id === question.id
        );
        if (check == -1) {
            newQuestion.push(question)
            setQuestionChoose(newQuestion);
        } else {
            newQuestion.splice(check, 1);
            setQuestionChoose(newQuestion);
        }
    };
    const getQuestionBankStore = async (page: number, size: number) => {
        setLoadingSearch(true);
        if (typeTest == "essayTest") {
            const dataQuestionsBank = await generateApiService.get(
                QuestionsBankApi.filterQuestionsBank("", "", 1, "", page, size)
            );
            if (dataQuestionsBank) {
                setQuestionBank(dataQuestionsBank.content);
                setTotalPages(dataQuestionsBank.totalPages);
                setLoadingSearch(false);
            }
        } else {
            const dataQuestionsBank = await generateApiService.get(
                QuestionsBankApi.filterQuestionsBank("", "", 0, "", page, size)
            );
            if (dataQuestionsBank) {
                setQuestionBank(dataQuestionsBank.content);
                setTotalPages(dataQuestionsBank.totalPages);
                setLoadingSearch(false);
            }
        }
    };
    const LoadMore = async (page: number, size: number) => {
        setLoadingSearch(true);
        try {
            if (typeTest == "essayTest") {
                const dataQuestionsBank = await generateApiService.get(
                    QuestionsBankApi.filterQuestionsBank("", "", 1, "", page, size)
                );
                if (dataQuestionsBank) {
                    setQuestionBank([...questionBank, ...dataQuestionsBank.content]);
                    setLoadingSearch(false);
                }
            } else {
                const dataQuestionsBank = await generateApiService.get(
                    QuestionsBankApi.filterQuestionsBank("", "", 0, "", page, size)
                );
                if (dataQuestionsBank) {
                    setQuestionBank([...questionBank, ...dataQuestionsBank.content]);
                    setLoadingSearch(false);
                }
            }
        } catch (error) {
            setLoadingSearch(false);
        }
    };
    const getDataDepartment = async () => {
        const dataDepartments = await generateApiService.get(
            DepartmentApi.getAllDepartments(page)
        );
        if (dataDepartments) {
            setItemsDepartment(dataDepartments.content);
        }
    };


    useEffect(() => {
        getQuestionBankStore(0, 10);
        getDataDepartment();
        setPage(0);
    }, []);

    const addNewQuestion = async () => {
        if (typeTest == "essayTest") {
            let newQuestion = props.route.params.question
                ? props.route.params.question
                : "";
            for (let i = 0; i < questionChoose.length; i++) {
                newQuestion =
                    newQuestion + `<div>${questionChoose[i].questionName}</div>`;
            }
            navigation.navigate("/tao-bai-thi-tu-luan", {newQuestion: newQuestion});
        } else {
            let newQuestion = [...props.route.params.question];
            const getQuestionChoose = questionChoose;
            let newQuestionBank = getQuestionChoose;
            await newQuestionBank.forEach((QuestionBank) => {
                delete QuestionBank.id,
                    delete QuestionBank.questionType,
                    delete QuestionBank.course,
                    (QuestionBank.questionsName = QuestionBank.questionName),
                    delete QuestionBank.questionName,
                    (QuestionBank.answers = QuestionBank.answerBanks),
                    delete QuestionBank.answerBanks,
                    QuestionBank.answers.forEach((answers: any) => {
                        delete answers.id;
                        answers.answersName = answers.answerName;
                        answers.answersStatus = answers.answerStatus;
                        delete answers.answerName;
                        delete answers.answerStatus;
                    });
                newQuestion.push(QuestionBank);
            });
            navigation.navigate("/tao-bai-thi-trac-nghiem", {
                newQuestion: newQuestion,
            });
        }
    };

    const filterValue = async (dataValue: any, dataLabel: any) => {
        switch (typeChoose) {
            case "departmentChoose":
                setValueDepartments({
                    value: dataValue,
                    label: dataLabel,
                }),
                    setValueCourse({
                        value: itemsCourse[0].value,
                        label: itemsCourse[0].label,
                    });
                let newData = [{label: "Tất cả", value: "value0"}];
                const dataCourse = await generateApiService.get(
                    DepartmentApi.getCourseByDepartment(dataValue)
                );
                dataCourse.content.map((course: any) => {
                    newData.push({
                        label: course.courseName,
                        value: course.courseID,
                    });
                });

                setItemsCourse(newData);

                break;
            case "courseChoose":
                setValueCourse({
                    value: dataValue,
                    label: dataLabel,
                });
                break;
            case "typeQuestion":
                setValue({value: dataValue, label: dataLabel});
                break;
        }
    };
    useEffect(() => {
        let idDepartment = valueDepartments.value;
        let idCourse = valueCourse.value;
        let idType: any = value.value;
        const getDataFilter = async (queryInput: any) => {
            if (
                idDepartment != "value0" ||
                idCourse != "value0" ||
                idType != "value0" ||
                queryInput
            ) {
                if (idCourse == "value0") {
                    idCourse = "";
                }
                if (idDepartment == "value0") {
                    idDepartment = "";
                }
                if (typeTest == "essayTest") {
                    idType = 1;
                } else {
                    idType = 0;
                }
                const dataQuestionsBank = await generateApiService.get(
                    QuestionsBankApi.filterQuestionsBank(
                        idDepartment,
                        idCourse,
                        idType,
                        queryInput,
                        0,
                        20
                    )
                );

                setDataFilter(dataQuestionsBank.content);
            }
        };
        if (queryInput) {
            const timeout = setTimeout(async () => {
                setQueryInput(queryInput);
                getDataFilter(queryInput);
            }, 800);
            return () => {
                clearTimeout(timeout);
            };
        } else {
            getDataFilter("");
        }
    }, [valueDepartments, valueCourse, value, queryInput]);
    const isCloseToBottom = ({
                                 layoutMeasurement,
                                 contentOffset,
                                 contentSize,
                             }: {
        layoutMeasurement: any,
        contentOffset: any,
        contentSize: any,
    }) => {
        const paddingToBottom = 20;
        return (
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom
        );
    };

    const ListModal = () => {
        let newItems: any[] = [];
        if (typeChoose == "departmentChoose") {
            newItems = [{label: "Tất cả", value: "value0"}];


            itemsDepartment.map((department: any) =>
                newItems.push({
                    label: department.department_name,
                    value: department.id,
                })
            );
        } else if (typeChoose == "courseChoose") {
            newItems = itemsCourse;
        } else if (typeChoose == "typeQuestion") {
            newItems = [{label: "Tất cả", value: "value0"}];
            newItems = items;
        }

        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                {newItems.map((item) => (
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
                            filterValue(item.value, item.label), setModalChoose(false);
                        }}
                    >
                        <Box
                            height={19}
                            width={19}
                            borderColor="#DADADA"
                            borderRadius={50}
                            borderWidth={1}
                            ml={2}
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Box
                                height={12}
                                width={12}
                                borderColor="#DADADA"
                                borderRadius={50}
                                backgroundColor={
                                    typeChoose == "departmentChoose"
                                        ? valueDepartments?.value === item.value
                                            ? "green"
                                            : ""
                                        : typeChoose == "courseChoose"
                                            ? valueCourse?.value === item.value
                                                ? "green"
                                                : ""
                                            : value.value === item.value
                                                ? "green"
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
    return (
        <Box bg="defaultBackground" position="relative" height="100%">
            <Box height="100%">
                <Header logo menu>
                    <HeaderClose/>
                </Header>
                <Box height={1} bg="#636363" opacity={0.3} mt={2}/>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => {
                                getQuestionBankStore(0, 10), setPage(0);
                            }}
                        />
                    }
                    onScroll={({nativeEvent}) => {
                        if (isCloseToBottom(nativeEvent)) {
                            if (page < totalPages && !loadingSearch) {
                                LoadMore(page + 1, size);
                                setPage(page + 1);
                            }
                        }
                    }}
                    scrollEventThrottle={400}
                >
                    <Flex flex={1} px={2}>
                        <Devider></Devider>
                        <Flex
                            flexDirection="row"
                            alignItems="flex-start"
                            justifyContent="center"
                        >
                            <Flex flex={1}>
                                <Text
                                    lineHeight={30}
                                    color="textColor"
                                    fontWeight="bold"
                                    fontSize={20}
                                    style={{textTransform: "uppercase"}}
                                >
                                    Ngân hàng câu hỏi
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex
                        mb={2}
                        p={2}
                        flexDirection="row"
                        alignItems="center"
                        // borderBottomWidth={1}
                        borderBottomColor="tabBar"
                        height={70}
                        justifyContent="space-between"
                    >
                        <Box width="80%">
                            <InputWithIcon
                                border
                                backgroundColor="#fff"
                                icon="search"
                                flex={1}
                                value={queryInput}
                                onChangeText={(e) => checkVadidate(e)}
                                iconColor="inputClose"
                                iconSize={16}
                                onPress={() => setQueryInput("")}
                            />
                        </Box>
                        <TouchableOpacity
                            onPress={() => {
                                setFilter(!filter);
                            }}
                            style={{
                                backgroundColor: "rgba(100, 116, 139, 0.1)",
                                width: 50,
                                height: "100%",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 10,
                            }}
                        >
                            {!filter ? (
                                <Icon name="filterIcon"></Icon>
                            ) : (
                                <Icon name="filterChooseIcon"></Icon>
                            )}
                        </TouchableOpacity>
                    </Flex>
                    {filter ? (
                        <Box px={2}>
                            <Text color="textColor" fontSize={16} fontWeight={500}>
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
                                    width={"100%"}
                                    borderColor="rgba(99, 99, 99, 0.15)"
                                    mt={1}
                                    alignItems="center"
                                    justifyContent="space-between"
                                    flexDirection="row"
                                    borderRadius={5}
                                >
                                    <Text color="buttonColor" ml={1} mr={1} width={"90%"}>
                                        {valueDepartments
                                            ? valueDepartments.label
                                            : "Chọn chuyên ngành"}
                                    </Text>

                                    <Box mr={2}>
                                        <Icon name="moreMember"></Icon>
                                    </Box>
                                </Box>
                            </TouchableOpacity>
                            <Text color="textColor" fontSize={16} fontWeight={500} mt={3}>
                                Môn học:
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setTypeChoose("courseChoose"), setModalChoose(true);
                                }}
                            >
                                <Box
                                    borderWidth={1}
                                    height={40}
                                    width={"100%"}
                                    borderColor="rgba(99, 99, 99, 0.15)"
                                    mt={1}
                                    alignItems="center"
                                    justifyContent="space-between"
                                    flexDirection="row"
                                    borderRadius={5}
                                >
                                    <Text color="buttonColor" ml={1} mr={1} width={"90%"}>
                                        {valueCourse ? valueCourse.label : "Chọn chuyên ngành"}
                                    </Text>

                                    <Box mr={2}>
                                        <Icon name="moreMember"></Icon>
                                    </Box>
                                </Box>
                            </TouchableOpacity>
                        </Box>
                    ) : null}
                    {loading ? (
                        <Box
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: 10,
                            }}
                            mb={1}
                        >
                            <ActivityIndicator size="large" color="#00A8B5"/>
                        </Box>
                    ) : (
                        (valueDepartments.value == "value0" &&
                            valueCourse.value == "value0" &&
                            value.value == "value0" &&
                            !queryInput
                                ? questionBank
                                : dataFilter
                        ).map((question, index) => {
                            let check = questionChoose.findIndex(
                                (questionChoose) => questionChoose.id === question.id
                            );
                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        addQuestionBank(question);
                                    }}
                                >
                                    <Box
                                        borderWidth={1}
                                        borderColor={
                                            check != -1
                                                ? "rgba(0, 59, 114, 0.5)"
                                                : "rgba(99, 99, 99, 0.15)"
                                        }
                                        width="95%"
                                        ml={2}
                                        mt={2}
                                        borderRadius={5}
                                    >
                                        <Box flexDirection="row" justifyContent="space-between">
                                            <Box flexDirection="row" padding={2} alignItems="center">
                                                <Icon name="questionIcon"></Icon>
                                                <Text
                                                    color="textColor"
                                                    fontSize={16}
                                                    fontWeight={500}
                                                    ml={2}
                                                >
                                                    Câu hỏi {index + 1}{" "}
                                                    <Text
                                                        color="rgba(0, 59, 114, 0.5)"
                                                        fontSize={12}
                                                        fontWeight={500}
                                                    >
                                                        #{question.id}
                                                    </Text>
                                                </Text>
                                            </Box>
                                        </Box>
                                        <Text
                                            color="buttonColor"
                                            ml={5}
                                            mt={2}
                                            fontSize={15}
                                            width={"90%"}
                                        >
                                            {question.questionName}
                                        </Text>

                                        <Box alignItems="center" flexDirection="row" ml={2} mt={3}>
                                            <Icon name="showAnswerIcon"></Icon>
                                            <TouchableOpacity
                                                onPress={() => setQuestionShow(question.id)}
                                            >
                                                <Text ml={2} color="#32813D" numberOfLines={1}>
                                                    {showAnswer != question.id
                                                        ? "Xem đáp án"
                                                        : question.questionType == "0"
                                                            ? question.answerBanks.map((x: any, index2: any) =>
                                                                x.answerStatus == 1
                                                                    ? `Đáp án  ${index2 + 1} : ` + x.answerName
                                                                    : null
                                                            )
                                                            : "Đáp án : " + question.answerBanks[0]?.answerName}
                                                </Text>
                                            </TouchableOpacity>
                                        </Box>
                                        <Box
                                            flexDirection="row"
                                            alignItems="center"
                                            justifyContent="space-between"
                                            mt={4}
                                            mb={1}
                                        >
                                            <Box
                                                minHeight={30}
                                                bg="#F1F1F1"
                                                ml={2}
                                                alignItems="center"
                                                justifyContent="center"
                                                borderRadius={5}
                                                //@ts-ignore
                                                alignSelf="flex-start"
                                                maxWidth={width * 0.4}
                                            >
                                                <Text color="seen" fontSize={12} px={1}>
                                                    Ngành:{" "}
                                                    <Text
                                                        color="seen"
                                                        fontSize={12}
                                                        px={1}
                                                        style={{textTransform: "lowercase"}}
                                                    >
                                                        {question?.course?.department?.department_name}
                                                    </Text>
                                                </Text>
                                            </Box>
                                            <Box
                                                minHeight={30}
                                                bg="#F1F1F1"
                                                mr={2}
                                                ml={2}
                                                alignItems="center"
                                                justifyContent="center"
                                                borderRadius={5}
                                                maxWidth={width * 0.5}
                                            >
                                                <Text color="seen" fontSize={12} px={1}>
                                                    Môn:{" "}
                                                    <Text
                                                        color="seen"
                                                        fontSize={12}
                                                        px={1}
                                                        style={{textTransform: "lowercase"}}
                                                    >
                                                        {question?.course?.courseName}
                                                    </Text>
                                                </Text>
                                            </Box>
                                        </Box>
                                    </Box>
                                </TouchableOpacity>
                            );
                        })
                    )}
                    {loadingSearch ? (
                        <Box
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: 22,
                            }}
                        >
                            <ActivityIndicator size="large" color="#00A8B5"/>
                        </Box>
                    ) : null}
                </ScrollView>
                <Box alignItems="center" flexDirection={"row"}
                     justifyContent="center"
                     mt={2}
                >
                    <TouchableOpacity
                        onPress={() => {

                        }}
                    >
                        <Box
                            borderRadius={5}
                            borderWidth={1}
                            borderColor="rgba(125, 125, 125, 0.3)"
                            mt={1}
                            mb={1}
                            width={width * 0.4}
                            alignItems="center"
                        >
                            <Text
                                style={{
                                    padding: 10,
                                    right: 0,
                                    color: "red",
                                }}
                                numberOfLines={1}
                            >
                                Huỷ
                            </Text>
                        </Box>
                    </TouchableOpacity>
                    <Box width={20}></Box>
                    <TouchableOpacity
                        onPress={() => {
                            addNewQuestion();
                        }}
                    >
                        <Box
                            borderRadius={5}
                            borderWidth={1}
                            borderColor="rgba(125, 125, 125, 0.3)"
                            mt={1}
                            mb={1}
                            backgroundColor="buttonColor"
                            width={width * 0.4}
                            alignItems="center"
                        >
                            <Text
                                style={{padding: 10, color: "#ffffff", right: 0}}
                                numberOfLines={1}
                            >
                                Xác nhận
                            </Text>
                        </Box>
                    </TouchableOpacity>
                </Box>
                <Box height={20}/>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisibleNotifi}
                    onRequestClose={() => {
                        setModalVisibleNotifi(!modalVisibleNotifi);
                    }}
                >
                    <PopupCloseAutomatically
                        titleEdit={titleEdit}
                        title="Tạo câu hỏi thành công"
                        type={type}
                        isOpen={modalVisibleNotifi}
                        setIsOpen={setModalVisibleNotifi}
                    />
                    {/* <PopupNotification
            titleEdit={titleEdit}
            title="Tạo câu hỏi thành công"
            type={type}
            setModalVisible={setModalVisibleNotifi}
          ></PopupNotification> */}
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalChoose}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
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
        </Box>
    );
};
export default AddQuestion;
const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 300,
        padding: 16,
        paddingTop: 100,
        backgroundColor: "#fff",
    },
    cell: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: 50,
    },
});
