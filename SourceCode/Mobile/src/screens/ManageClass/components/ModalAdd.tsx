import React, {useEffect, useState} from "react";
import {Dimensions, Modal, ScrollView, TextInput, TouchableOpacity,} from "react-native";
import {Box, Text} from "../../../rebass";
import {Icon} from "../../../components/svg-icon";
import {generateApiService} from "../../../services/ApiService";
import {useGoBack} from "../../../platform/go-back";
import {DepartmentApi} from "../../../services/api/Departments/DepartmentApi";
import {ClassApi} from "../../../services/api/Class/ClassApi";
import {ActivityHistoriesApi} from "../../../services/api/ActivityHistories/ActivityHistoriesApi";

const {width, height} = Dimensions.get("screen");

export const ModalAdd = (props: {
    setModalVisible: any;
    getData: any;
    setModalVisibleNotifi: any;
    setType: any;
    setEditTitle: any;
    listClass?: any;
    setListClass?: any;
}) => {
    const goBack = useGoBack();
    const {
        setModalVisible,
        getData,
        setModalVisibleNotifi,
        setType,
        setEditTitle,
        listClass,
        setListClass,
    } = props;

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [items, setItems] = useState([]);
    const [modalChoose, setModalChoose] = useState(false);
    const [errorTitle, setErrorTitle] = useState("");
    const [errorContent, setErrorContent] = useState("");
    const [errorValue, setErrorValue] = useState("");
    const getDataDepartment = async () => {
        const dataDepartments = await generateApiService.get(
            DepartmentApi.getAllDepartments()
        );
        if (dataDepartments) {
            setItems(dataDepartments.content);
        }
    };

    async function checkValidateTitle() {
        let check = true;
        if (!title) {
            check = false;
            setErrorTitle("Mã lớp không để trống!");
            return check;
        } else {
            if (!/^[0-9a-zA-Z]+$/.test(title)) {
                check = false;
                setErrorTitle("Mã lớp không hợp lệ!");
                return check;
            } else {
                check = true;
                setErrorTitle("");
                return check;
            }
        }
    }

    function checkValidateContent(): boolean {
        let check = true;
        if (!content) {
            check = false;
            setErrorContent("Tên lớp không để trống!");
        } else {
            check = true;
            setErrorContent("");
        }
        return check;
    }

    function isEmptyObject(obj: any): boolean {
        let check = true;
        if (Object.keys(obj).length === 0) {
            check = false;
            setErrorValue("Bạn chưa chọn chuyên ngành!");
        } else {
            check = true;
            setErrorValue("");
        }
        return check;
    }

    const [value, setValue] = useState<any>({});
    const uploadFile = async () => {
        if (await checkValidateTitle()) {
            if (checkValidateContent()) {
                if (isEmptyObject(value)) {
                    try {
                        const dataClassUpload = {
                            classroomCode: title,
                            classroomName: content,
                            department: {
                                id: value.value,
                            },
                        };
                        let updateCourse = await generateApiService.post(
                            ClassApi.getAllClass(),
                            dataClassUpload
                        );
                        updateCourse.department.department_name = value.label;
                        setModalVisible(false);
                        setType("success");
                        setEditTitle("Thêm lớp học thành công !");
                        setModalVisibleNotifi(true);

                        let newDataClass = [updateCourse, ...listClass];
                        setListClass(newDataClass);
                        const bodyHistory = {
                            name: " lớp học " + title,
                            method: "POST",
                        };
                        const history = await generateApiService.post(
                            ActivityHistoriesApi.postHistories(),
                            bodyHistory
                        );
                    } catch (error) {
                        setModalVisible(false);
                        setType("error");
                        setEditTitle("Thêm lớp học thất bại !");
                        setModalVisibleNotifi(true);
                    }
                }
            }
        }
    };

    useEffect(() => {
        getDataDepartment();
    }, []);

    return (
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
                <Text fontSize={16} color="textColor" fontWeight="bold" mt={15} mb={15}>
                    THÊM LỚP HỌC
                </Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                        Mã lớp<Text color="red">*</Text>
                    </Text>
                    <TextInput//@ts-ignore
                        height={40}
                        borderWidth={1}
                        borderColor="rgba(99, 99, 99, 0.2)"
                        borderRadius={8}
                        width={width * 0.8}
                        marginBottom={5}
                        onFocus={() => setErrorTitle("")}
                        value={title}
                        onChangeText={(value) => setTitle(value.trim())}
                    ></TextInput>

                    <Text fontSize={14} color="#f3a908" mb={2}>
                        {errorTitle}
                    </Text>
                    <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                        Tên lớp<Text color="red">*</Text>
                    </Text>
                    <TextInput//@ts-ignore
                        height={40}
                        borderWidth={1}
                        borderColor="rgba(99, 99, 99, 0.2)"
                        borderRadius={8}
                        width={width * 0.8}
                        marginBottom={0}
                        multiline={false}
                        onFocus={() => setErrorContent("")}
                        onChangeText={(value) => setContent(value)}
                    ></TextInput>
                    <Text fontSize={14} color="#f3a908" mb={2}>
                        {errorContent}
                    </Text>
                    <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                        Chuyên ngành<Text color="red">*</Text>
                    </Text>

                    <TouchableOpacity
                        onPress={() => setModalChoose(true)}
                        style={{width: width * 0.8}}
                    >
                        <Box
                            borderRadius={10}
                            borderWidth={1}
                            borderColor="rgba(125, 125, 125, 0.3)"
                            width="100%"
                            mb={2}
                            height={40}
                            justifyContent="space-between"
                            flexDirection="row"
                            alignItems="center"
                            padding={1}
                        >
                            <Text>{value?.label}</Text>
                            <Icon name="moreMember"></Icon>
                        </Box>
                    </TouchableOpacity>
                    <Text fontSize={14} color="#f3a908" mb={2}>
                        {Object.keys(value).length === 0 ? errorValue : ""}
                    </Text>
                    <Box flexDirection="row">
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Box
                                borderRadius={5}
                                borderWidth={1}
                                borderColor="buttonColor"
                                mt={2}
                                mr={2}
                                width={width * 0.4}
                                alignItems="center"
                                backgroundColor="rgba(99, 99, 99, 0.1)"
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
                                borderColor="rgba(125, 125, 125, 0.3)"
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
                </ScrollView>
            </Box>
            <Modal animationType="slide" transparent={true} visible={modalChoose}>
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
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {items.map((item: any) => (
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
                                        setValue({value: item.id, label: item.department_name}),
                                            setModalChoose(false);
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
                                                value.value === item.id ? "green" : "null"
                                            }
                                        ></Box>
                                    </Box>
                                    <Text ml={2} color="seen" fontSize={15}>
                                        {item.department_name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};
