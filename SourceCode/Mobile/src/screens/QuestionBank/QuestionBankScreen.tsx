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
import {Header, NotificationIcon} from "../../components/Header";
import {InputWithIcon} from "../../components/InputWithIcon";
import {Icon} from "../../components/svg-icon";
import {Box, Flex, Text} from "../../rebass";
import {generateApiService} from "../../services/ApiService";
import {ModalAdd} from "./components/ModalAdd";
import {ModalDelete} from "./components/ModalDelete";
import {DepartmentApi} from "../../services/api/Departments/DepartmentApi";
import {QuestionsBankApi} from "../../services/api/QuestionsBank/QuestionsBankApi";
import {useNavigation} from "@react-navigation/native";
import PopupCloseAutomatically from "../../components/PopupCloseAutomatically";

const {width, height} = Dimensions.get("screen");

const QuestionBankScreen = () => {
    const [modalVisibleNotifi, setModalVisibleNotifi] = useState(false);
    const [type, setType] = useState<string>("");
    const [titleEdit, setTitleEdit] = useState("");
    const [typeModal, setTypeModal] = useState<string>();
    const [modalVisible, setModalVisible] = useState(false);
    const [queryInput, setQueryInput] = React.useState<string>("");
    const [loading, setLoading] = React.useState<boolean>(false);
    const [filter, setFilter] = React.useState<boolean>(false);
    const [showAnswer, setShowAnswer] = React.useState<number>(-1);
    const [questionBank, setQuestionBank] = React.useState<any>([]);
    const [selected, setSelected] = useState("");
    const [edit, setEdit] = React.useState<boolean>(false);
    const [dataFilter, setDataFilter] = React.useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState(0);
    const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
    const [newItemid, setNewItemId] = useState<number>(0)

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
            setShowAnswer(-1);
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
    const [itemsDepartment, setItemsDepartment] = useState<any>([
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

    const getQuestionBankStore = async (page: number, size: number) => {
        const dataQuestionsBank = await generateApiService.get(
            QuestionsBankApi.getAllQuestionsBank(page, size)
        );
        if (dataQuestionsBank) {
            setQuestionBank(dataQuestionsBank.content);
            setTotalPages(dataQuestionsBank.totalPages);
        }
    };
    const getDataDepartment = async () => {
        const dataDepartments = await generateApiService.get(
            DepartmentApi.getAllDepartments(0, 999)
        );
        if (dataDepartments) {
            setItemsDepartment(dataDepartments.content);
        }
    };
    const navigation = useNavigation();
    const LoadMore = async (page: number, size: number) => {
        setLoadingSearch(true);
        const dataQuestionsBank = await generateApiService.get(
            QuestionsBankApi.getAllQuestionsBank(page, size)
        );
        setQuestionBank([...questionBank, ...dataQuestionsBank.content]);
        setLoadingSearch(false);
    };
    useEffect(() => {
        getQuestionBankStore(0, 10);
        getDataDepartment();
        setPage(0);
    }, []);

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
        let idCourse: any = valueCourse.value;
        let idType: any = value.value;
        const getDataFilter = async (queryInput?: any) => {
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
                if (idType == "value0") {
                    idType = "";
                }
                if (idType == "value1") {
                    idType = 0;
                }
                if (idType == "value2") {
                    idType = 1;
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
                setRefreshing(false)
                setDataFilter(dataQuestionsBank.content);
            } else {
                setRefreshing(false)
                getQuestionBankStore(0, 10);
                setPage(0);
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
            getDataFilter();
        }
    }, [valueDepartments, valueCourse, value, queryInput, refreshing]);

    const isCloseToBottom = ({
                                 layoutMeasurement,
                                 contentOffset,
                                 contentSize,
                             }: any) => {
        const paddingToBottom = 20;
        return (
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom
        );
    };

    const ListModal = () => {
        let newItems: any = [];
        if (typeChoose == "departmentChoose") {
            newItems = [{label: "Tất cả", value: "value0"}];
            itemsDepartment.map((department: any) =>
                newItems.push({
                    label: department.department_name,
                    value: department.id,
                })
            );
        } else if (typeChoose == "typeQuestion") {
            newItems = [{label: "Tất cả", value: "value0"}];
            newItems = items;
        } else if (typeChoose == "courseChoose") {
            newItems = itemsCourse;
        }

        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                {newItems?.map((item: any) => (
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
                                borderColor="#DADADA"
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

    // @ts-ignore
    function toLetters(num: any) {
        "use strict";
        var mod = num % 26,
            pow = (num / 26) | 0,
            out = mod ? String.fromCharCode(64 + mod) : (--pow, "Z");
        return pow ? toLetters(pow) + out : out;
    }

    return (
        <Box bg="defaultBackground" position="relative" height="100%">
            <Box height="100%">
                <Header logo search>
                    <NotificationIcon/>
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
                    showsVerticalScrollIndicator={false}
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
                                    color="#1C7988"
                                    fontWeight="bold"
                                    fontSize={20}
                                    style={{textTransform: "uppercase"}}
                                >
                                    Ngân hàng câu hỏi
                                </Text>
                            </Flex>
                            <TouchableOpacity
                                onPress={() => {
                                    setEdit(false), setTypeModal("add"), setModalVisible(true);
                                }}
                            >
                                <Box
                                    backgroundColor="rgba(100, 116, 139, 0.1)"
                                    height={40}
                                    width={100}
                                    style={{
                                        borderRadius: 8,
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: '#56C8C8'
                                    }}
                                >
                                    <Icon name="addIcon" color={'white'}></Icon>
                                    <Text ml={1} color="white">
                                        Thêm
                                    </Text>
                                </Box>
                            </TouchableOpacity>
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
                                iconColor="#56C8C8"
                                iconSize={16}
                                onPress={() => setQueryInput("")}
                                borderColor="#56C8C8"
                            />
                        </Box>
                        <TouchableOpacity
                            onPress={() => {
                                setFilter(!filter);
                            }}
                            style={{
                                backgroundColor: "#56C8C8",
                                width: 50,
                                height: "100%",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 10,

                            }}
                        >
                            {!filter ? (
                                <Icon name="filterIcon" color={'white'}></Icon>
                            ) : (
                                <Icon name="filterChooseIcon" color={'white'}></Icon>
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
                                Khoá học:
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
                            <Text color="textColor" fontSize={16} fontWeight={500} mt={3}>
                                Dạng câu hỏi:
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setTypeChoose("typeQuestion"), setModalChoose(true);
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
                                        {value ? value.label : "Chọn chuyên ngành"}
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
                        ).map((question: any, index: number) => { 
                            
                            return (
                            <Box
                                borderWidth={1}
                                borderColor="rgba(99, 99, 99, 0.15)"
                                backgroundColor={'#E5F3F8'}
                                width="95%"
                                ml={2}
                                mt={2}
                                borderRadius={5}
                                flex={1}
                            >
                                <Box flexDirection="row" justifyContent="space-between">
                                    <Box flexDirection="row" padding={2} alignItems="center">
                                        <Icon name="questionIcon"></Icon>
                                        <Text
                                            color="#484848"
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
                                    <Box flexDirection="row" mr={2} mt={2}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setSelected(question),
                                                    setEdit(true),
                                                    setTypeModal("add"),
                                                    setModalVisible(true);
                                            }}
                                        >
                                            <Icon name="editIcon"></Icon>
                                        </TouchableOpacity>
                                        <Box width={20}></Box>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setSelected(question),
                                                    setTypeModal("delete"),
                                                    setModalVisible(true);
                                            }}
                                        >
                                            <Icon name="deleteIcon"></Icon>
                                        </TouchableOpacity>
                                    </Box>
                                </Box>
                                <Text
                                    color="#484848"
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
                                        <Text ml={2} color={showAnswer != question.id ? "#1C7988" : '#00B219'} numberOfLines={1}>
                                            {showAnswer != question.id
                                                ? "Xem đáp án"
                                                : question.questionType == "0"
                                                    ? question.answerBanks.map((x: any, index2: number) =>
                                                        x.answerStatus == 1
                                                            ? `Đáp án  ${toLetters(index2 + 1)} : ` +
                                                            x.answerName
                                                            : null
                                                    )
                                                    : "Đáp án : " + question.answerBanks[0]?.answerName}
                                        </Text>
                                    </TouchableOpacity>
                                </Box>
                                <Box

                                    alignItems="center"

                                    mt={4}
                                    mb={1}
                                >
                                    <Box
                                        minHeight={30}
                                        bg="#00A8B5"
                                        ml={2}
                                        alignItems="center"
                                        justifyContent="center"
                                        borderRadius={5}

                                        //@ts-ignore
                                        alignSelf="flex-start"
                                        maxWidth={width * 0.4}
                                    >
                                        <Text color="white" fontSize={12} px={1}>
                                            Ngành:{" "}
                                            <Text
                                                color="white"
                                                fontSize={12}
                                                px={1}
                                                style={{textTransform: "lowercase"}}
                                            >
                                                {question?.course?.subject?.departments?.[0]?.department_name}
                                            </Text>
                                        </Text>
                                    </Box>
                                </Box>

                                <Box
                                    minHeight={30}
                                    bg="#00A8B5"
                                    ml={2}
                                    mt={1}
                                    mb={2}
                                    alignItems="center"
                                    justifyContent="center"
                                    borderRadius={5}
                                    //@ts-ignore
                                    alignSelf="flex-start"
                                    maxWidth={width * 0.4}
                                >
                                    <Text color="white" fontSize={12} px={1}>
                                        Môn:{" "}
                                        <Text
                                            color="white"
                                            fontSize={12}
                                            px={1}
                                            style={{textTransform: "lowercase"}}
                                        >
                                            {question?.course?.courseName}
                                        </Text>
                                    </Text>
                                </Box>
                            </Box>
                        )
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
                    <Box height={20}/>
                </ScrollView>
                <Modal animationType="slide" transparent={true} visible={modalVisible}>
                    {typeModal === "add" ? (
                        <ModalAdd
                            edit={edit}
                            setModalVisible={setModalVisible}
                            getQuestionBankStore={setRefreshing}
                            setTitleEdit={setTitleEdit}
                            data={selected}
                            setType={setType}
                            setModalVisibleNoti={setModalVisibleNotifi}
                            questionBank={questionBank}
                        ></ModalAdd>
                    ) : typeModal === "delete" ? (
                        <ModalDelete
                            setModalVisible={setModalVisible}
                            questionBank={questionBank}
                            data={selected}
                            setTitleEdit={setTitleEdit}
                            setType={setType}
                            setModalVisibleNoti={setModalVisibleNotifi}
                            getQuestionBankStore={setRefreshing}
                        ></ModalDelete>
                    ) : null}
                </Modal>
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
                        title="Tạo thông báo thành công"
                        type={type}
                        isOpen={modalVisibleNotifi}
                        setIsOpen={setModalVisibleNotifi}
                    />
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
export default QuestionBankScreen;
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
