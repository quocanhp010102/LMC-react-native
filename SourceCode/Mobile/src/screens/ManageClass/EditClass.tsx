import React, {useCallback, useEffect, useState} from "react";
import {ActivityIndicator, Dimensions, Modal, ScrollView, TextInput, TouchableOpacity,} from "react-native";
import {Devider} from "../../components/Devider";
import {Header, NotificationIcon} from "../../components/Header";
import {InputWithIcon} from "../../components/InputWithIcon";
import {Icon} from "../../components/svg-icon";
import {Box, Flex, Text} from "../../rebass";
import {API} from "../../services";
import {DepartmentApi} from "../../services/api/Departments/DepartmentApi";
import {StudentApi} from "../../services/api/Student/StudentApi";
import {generateApiService} from "../../services/ApiService";
import {StudentList} from "./components/StudentList";
import {UserList} from "./components/UserList";
import {useGoBack} from "../../platform/go-back";
import {ClassApi} from "../../services/api/Class/ClassApi";
import {ActivityHistoriesApi} from "../../services/api/ActivityHistories/ActivityHistoriesApi";
import PopupCloseAutomatically from "../../components/PopupCloseAutomatically";
import { TouchableWithoutFeedback } from "react-native";

const {width, height} = Dimensions.get("screen");

const editClass = (props: any) => {
    const {
        data,
        setModalVisibleNotifi,
        setType,
        setEditTitle,
        listClass,
        setListClass,
    } = props.route.params;
    const [modalVisibleNoti, setModalVisibleNoti] = useState(false);
    const [typeModalClass, setTypeModalClass] = useState<string>("");
    const [editTitleClass, setEditTitleClass] = useState("");
    const [edit, setEdit] = useState<boolean>(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState(data.classroomCode);
    const [content, setContent] = useState(data.classroomName);
    const [totalMembers, setTotalMembers] = useState(data.classroomTotalStudent);
    const [loading, setLoading] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any>([]);
    const [all, setAll] = useState<boolean>(false);
    const [allNew, setAllNew] = useState<boolean>(false);
    const [userChoose, setUserChoose] = useState<any>();
    const [studentChoose, setStudentChoose] = useState<any>();
    const [listUser, setListUser] = useState<any>();
    const [selected, setSelected] = useState<any>([]);
    const [modalAdd, setModalAdd] = useState<boolean>(false);
    const [queryInputStu, setQueryInputStu] = React.useState<string>("");
    const [listStudent, setListStudent] = useState<any>([]);
    const [modalChoose, setModalChoose] = useState(false);
    const [errorTitle, setErrorTitle] = useState("");
    const [errorContent, setErrorContent] = useState("");
    const goBack = useGoBack();
    const [items, setItems] = useState([
        {
            label: data?.department?.department_name,
            value: data?.department?.id,
        },
    ]);
    const [value, setValue] = useState<any>({
        value: items[0].value,
        label: items[0].label,
    });
    const getDataDepartment = async () => {
        const dataDepartments = await generateApiService.get(
            DepartmentApi.getAllDepartments(0, 999)
        );
        if (dataDepartments) {
            setItems(dataDepartments.content);
        }
    };
    const onGetAllStudent = async () => {
      
         
        const response = await generateApiService.get(
            StudentApi.getStudentNotInClass(data.classroomID ?  data.classroomID: data.id)
        );
        if (response) {
            let studentList: any = [];
            response.map((student: any) => {
                studentList.push({
                    id: student.id,
                    student_code: student.student_code,
                    student_fullname: student.student_fullname,
                });
            });            
            setListStudent(studentList);
        }
    };

    async function checkValidateTitle() {
        let check = true;
        if (!title) {
            check = false;
            setErrorTitle("Mã lớp không để trống!");
        } else {
            if (!/^[0-9a-zA-Z\-'_]+$/.test(title)) {
                check = false;
                setErrorTitle("Mã lớp không hợp lệ!");
            } else {
                check = true;
                setErrorTitle("");
            }
        }
        if (title != data.classroomCode) {
            try {
                let checkExistClassroom = await generateApiService.get(
                    ClassApi.checkExistClassroom(title)
                );
            } catch (error) {
                check = false;
                setErrorTitle("Mã lớp đã tồn tại!");
            }
        }
        return check;
    }

    function checkVFalidateContent(): boolean {
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

    const uploadFile = async () => {
        if (await checkValidateTitle()) {
            if (checkVFalidateContent()) {
                try {
                    let newData = data;
                    newData.classroomCode = title;
                    newData.classroomName = content;
                    newData.department = {id: value.value};
                    newData.classroomTotalStudent = listUser.length;
                    newData.id= data.classroomID || data.id
                    data.classroomID = data.classroomID || data.id
                    let updateCourse = await generateApiService.put(
                        ClassApi.getClassById(data.classroomID),
                        newData
                    );
                    
                    setType("success");
                    setEditTitle("Sửa lớp học thành công!");
                    setModalVisibleNotifi(true);
                    setModalVisible(false);
                    goBack();
                    var index = listClass.findIndex(
                        (pClass: any) => pClass.id == updateCourse.id
                    );
                    if (index >= 0) {
                        let newDataClass = [...listClass];
                        newDataClass[index] = updateCourse;
                        setListClass(newDataClass);
                    } else {
                        setListClass([updateCourse, ...listClass]);
                    }
                    const bodyHistory = {
                        name: " lớp học " + content,
                        method: "PUT",
                    };
                    const history = await generateApiService.post(
                        ActivityHistoriesApi.postHistories(),
                        bodyHistory
                    );
                } catch (error) {
                    console.log(error);
                    setType("error");
                    setEditTitle("Sửa lớp học thất bại!");
                    setModalVisibleNotifi(true);
                    setModalVisible(false);
                    goBack();
                }
            }
        }
    };
    const checkVadidateStudent = async (inputValue: any) => {
        if (inputValue.length <= 255) {
            setQueryInputStu(inputValue);
        } else {
            setQueryInputStu("");
        }
    };
    React.useEffect(() => {
        if (queryInputStu) {
            // only change query if there is no typing within 500ms
            const timeout = setTimeout(async () => {
                setQueryInputStu(queryInputStu);
                const response = await generateApiService.get(
                    StudentApi.searchStudentNotInCourse(data.classroomID || data.id, queryInputStu)
                );
                setListStudent(response);
            }, 800);
            return () => {
                clearTimeout(timeout);
            };
        } else {
            onGetAllStudent();
        }
    }, [queryInputStu]);
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
    const onAddStudent = async () => {
        const ids = selectedStudent;
        await generateApiService.post(
            `${API.PUBLIC}services/lmsbackendtest/api/classroom-students/insertStudent/${data.classroomID || data.id}`,
            ids
        );

        let listUpdate = listUser;
        let listStudentUpdate = listStudent;
        for (let i = 0; i < ids.length; i++) {
            for (let index = 0; index < listStudent.length; index++) {
                if (listStudent[index].id === ids[i]) {
                    listUpdate.push(listStudent[index]);
                    listStudentUpdate.splice(index, 1);
                }
            }
        }
        setListUser(listUpdate);
        setListStudent(listStudentUpdate);
        if (allNew) {
            setAllNew(false);
        }
        setSelectedStudent([]);
        setModalVisible(false);
        setTypeModalClass("success");
        setEditTitleClass("Thêm sinh viên thành công");
        setModalVisibleNoti(true);
    };

    const getClass = async () => {
        const response = await generateApiService.get(
            ClassApi.getClassById(data.classroomID || data.id )
        );

        setValue( {label: response?.department?.department_name,
            value: response?.department?.id})
        
        setTotalMembers(response.classroomTotalStudent);
    };
    const onGetStudents = async () => {
        setLoading(true);
        const response = await generateApiService.get(
            `${API.PUBLIC}services/lmsbackendtest/api/students/getAllStudentByClassroom/` +
            (data.classroomID || data.id)
        );
        if (response) {
            setLoading(false);
            let userList: any = [];

            response.content?.map((student: any) => {
                userList.push({
                    id: student.student_id,
                    student_code: student.studentCode,
                    student_fullname: student.studentFullname,
                });
            });
            setListUser(userList);
        }
    };
    const chooseStudent = useCallback(
        (id: any) => {
            let newData = [...selectedStudent];
            if (selectedStudent.includes(id)) {
                newData = newData.filter((x) => x !== id);
            } else {
                newData.push(id);
            }
            setSelectedStudent(newData);
        },
        [selectedStudent]
    );
    const chooseAll = () => {
        if (!all) {
            if (listUser.length > 0) {
                const allId = listUser.map((user: any) => user.id);
                setSelected(allId);
            }
        } else {
            setSelected([]);
        }
        setAll(!all);
    };
    const chooseAllNewStudent = () => {
        if (!allNew) {
            if (listStudent.length > 0) {
                const allId = listStudent.map((user: any) => user.id);
                setSelectedStudent(allId);
            }
        } else {
            setSelectedStudent([]);
        }
        setAllNew(!allNew);
    };
    const onDeleteStudent = async () => {
        if (selected.length > 0) {
            const ids = selected;
            await generateApiService.delete(
                `${API.PUBLIC}services/lmsbackendtest/api/classroom-students/deleteStudent/${data.classroomID || data.id}`,
                ids
            );
            let listUpdate = listUser;
            let listStudentUpdate = listStudent;
            for (let i = 0; i < ids.length; i++) {
                for (let index = 0; index < listUser.length; index++) {
                    if (listUser[index].id === ids[i]) {
                        listStudentUpdate.push(listUser[index]);
                        listUpdate.splice(index, 1);
                    }
                }
            }
            setListUser(listUpdate);
            setListStudent(listStudentUpdate);
            if (all) {
                setAll(false);
            }
            setModalVisible(false);
            setSelected([]);
            setTypeModalClass("success");
            setEditTitleClass("Xóa sinh viên thành công");
            setModalVisibleNoti(true);
        }
    };
    const onDeleteClassRoom = async () => {
        const res = await generateApiService.delete(
            `${API.PUBLIC}services/lmsbackendtest/api/classroom/deleteClassroom/`,
            [data.classroomID || data.id]
        );
        const bodyHistory = {
            name: " lớp học " + data.classroomName,
            method: "DELETE",
        };
        const history = await generateApiService.post(
            ActivityHistoriesApi.postHistories(),
            bodyHistory
        );
        setModalVisible(false);
        setType("success");
        setEditTitle("Xóa lớp học thành công");
        setModalVisibleNotifi(true);
        goBack();
        var index = listClass.findIndex((pClass: any) => pClass.id == data.classroomID || data.id);
        if (index >= 0) {
            let newDataClass = [...listClass];
            newDataClass.splice(index, 1);
            setListClass(newDataClass);
        }
    };
    useEffect(() => {
        onGetStudents();
        getDataDepartment();
        getClass();
    }, []);

    

    return (
        <Box bg="defaultBackground" position="relative" height="100%">
            <Box height="100%">
                <Header title="Chỉnh sửa lớp học" search leftButton="back">
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
                                    fontWeight="bold"
                                    fontSize={20}
                                    color="textColor"
                                    lineHeight={30}
                                >
                                    {data.classroomName}
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Box
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 22,
                        }}
                    >
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Box>
                                <Text fontSize={14} fontWeight="bold" marginBottom={2} mt={2}>
                                    Chuyên ngành<Text color="red">*</Text>
                                </Text>
                                {!edit ? (
                                    <TouchableOpacity
                                        onPress={() => setModalChoose(true)}
                                        style={{width: "90%"}}
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
                                ) : (
                                    <TouchableOpacity
                                        onPress={() => setModalChoose(true)}
                                        style={{width: width * 0.95}}
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
                                )}
                                <Text fontSize={14} fontWeight="bold" marginBottom={2} mt={2}>
                                    Mã lớp<Text color="red">*</Text>
                                </Text>
                                {!edit ? (
                                    <Text marginBottom={14} color="seen">
                                        {data.classroomCode}
                                    </Text>
                                ) : (
                                    <TextInput
                                        //@ts-ignore
                                        height={40}
                                        borderWidth={1}
                                        borderColor="rgba(99, 99, 99, 0.2)"
                                        borderRadius={8}
                                        padding={5}
                                        width="100%"
                                        marginBottom={14}
                                        value={title}
                                        onChangeText={(value) => setTitle(value.trim())}
                                    ></TextInput>
                                )}
                                {errorTitle ? (
                                    <Text fontSize={14} color="#f3a908" mb={1}>
                                        {errorTitle}
                                    </Text>
                                ) : null}
                                <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                                    Tên lớp <Text color="red">*</Text>
                                </Text>
                                {!edit ? (
                                    <Box>
                                        <Text marginBottom={14} color="seen">
                                            {data.classroomName}
                                        </Text>
                                    </Box>
                                ) : (
                                    <TextInput
                                        //@ts-ignore
                                        minHeight={40}
                                        borderWidth={1}
                                        borderColor="rgba(99, 99, 99, 0.2)"
                                        borderRadius={8}
                                        padding={5}
                                        width={width * 0.95}
                                        marginBottom={14}
                                        defaultValue={data.classroomName}
                                      
                                        onChangeText={(value) => setContent(value)}
                                    ></TextInput>
                                )}
                                {errorContent ? (
                                    <Text fontSize={14} color="#f3a908" mb={1}>
                                        {errorContent}
                                    </Text>
                                ) : null}

                                <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                                    Sĩ số
                                </Text>
                                {!edit ? (
                                    <Text>{listUser ? listUser.length : 0}</Text>
                                ) : (
                                    <Text>{listUser ? listUser.length : 0}</Text>
                                )}
                                <Text
                                    fontWeight={500}
                                    fontSize={16}
                                    color="textColor"
                                    padding={2}
                                    paddingX={16}
                                >
                                    DANH SÁCH SINH VIÊN
                                </Text>
                                <Flex
                                    mb={2}
                                    px={16}
                                    flexDirection="row"
                                    alignItems="center"
                                    borderBottomColor="tabBar"
                                ></Flex>
                                <Box
                                    flexDirection="row"
                                    justifyContent="space-between"
                                    paddingX={16}
                                >
                                    <TouchableOpacity
                                        onPress={onDeleteStudent}
                                        style={{
                                            borderRadius: 8,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: "rgba(100, 116, 139, 0.1)",
                                            height: 40,
                                            width: "47.5%",
                                        }}
                                    >
                                        <Icon name="deleteIcon"></Icon>
                                        <Text ml={1} color="deleteColor">
                                            Xóa
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setModalAdd(true), setModalVisible(true);
                                        }}
                                        style={{
                                            borderRadius: 8,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: "#56C8C8",
                                            height: 40,
                                            width: "47.5%",
                                        }}
                                    >
                                        <Icon name="addIcon" ></Icon>
                                        <Text ml={1} color="white">
                                            Thêm
                                        </Text>
                                    </TouchableOpacity>
                                </Box>

                                {loading ? (
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
                                ) : (
                                    <Box

                                        mt={2}
                                        marginX={16}
                                        borderWidth={1}
                                        borderRadius={8}
                                        borderColor="#D4D4D4"
                                    >
                                        <Box
                                            style={{
                                                flex: 1,
                                                flexDirection: "row",

                                            }}
                                        >
                                            <Box
                                                style={{
                                                    width: "10%",
                                                }}
                                            >
                                                <Box
                                                    height={40}
                                                    style={{
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setAll(!all), chooseAll();
                                                        }}
                                                    >
                                                        {all ? (
                                                            <Icon name="chooseBox"></Icon>
                                                        ) : (
                                                            <Icon name="CheckBox"></Icon>
                                                        )}
                                                    </TouchableOpacity>
                                                </Box>
                                            </Box>
                                            <Box
                                                style={{
                                                    width: "25%",
                                                    flexDirection: "row",
                                                }}
                                            >
                                                <Box
                                                    style={{
                                                        width: 1,
                                                        backgroundColor: "#D4D4D4",
                                                    }}
                                                ></Box>
                                                <Box
                                                    height={40}
                                                    style={{
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        width: "100%",
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            color: "#636363",
                                                            fontSize: 12,
                                                            textTransform: "uppercase",
                                                            fontWeight: "bold",
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        MÃ SV
                                                    </Text>
                                                </Box>
                                            </Box>
                                            <Box
                                                style={{
                                                    width: "60%",
                                                    flexDirection: "row",
                                                }}
                                            >
                                                <Box
                                                    style={{
                                                        width: 1,
                                                        backgroundColor: "#D4D4D4",
                                                    }}
                                                ></Box>
                                                <Box
                                                    height={40}
                                                    style={{
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        width: "100%",
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            color: "#636363",
                                                            fontSize: 12,
                                                            textTransform: "uppercase",
                                                            fontWeight: "bold",
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        HỌ VÀ TÊN
                                                    </Text>
                                                </Box>
                                            </Box>
                                        </Box>
                                        {
                                            listUser?.map((data: any, index: number) => {
                                                const isSelected = selected.includes(data.id);
                                            
                                                return (
                                                    <UserList
                                                        key={String(index)}
                                                        choose={choose}
                                                        isSelected={isSelected}
                                                        data={data}
                                                        index={index}
                                                        setUserChoose={setUserChoose}
                                                        setModalAdd={setModalAdd}
                                                        setModalVisible={setModalVisible}
                                                    ></UserList>
                                                );
                                            })}
                                    </Box>
                                )}
                                <Box flexDirection="row" mt={2} width={width * 0.81}></Box>
                            </Box>
                        </ScrollView>
                        <Box flexDirection="row" mt={2} mb={2}>
                            <TouchableOpacity
                                onPress={() => {
                                    setModalAdd(false), setModalVisible(true);
                                }}
                            >
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
                                        Giải tán
                                    </Text>
                                </Box>
                            </TouchableOpacity>
                            {!edit ? (
                                <TouchableOpacity onPress={() => setEdit(true)}>
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
                                            Chỉnh sửa
                                        </Text>
                                    </Box>
                                </TouchableOpacity>
                            ) : (
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
                            )}
                        </Box>
                    </Box>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
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
                                    width: "90%",
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
                                {modalAdd ? (
                                    <Box alignItems="center">
                                        <Text
                                            fontSize={17}
                                            color="seen"
                                            fontWeight="bold"
                                            padding={1}
                                        >
                                            THÊM SINH VIÊN
                                        </Text>
                                        <Flex
                                            mb={2}
                                            p={2}
                                            flexDirection="row"
                                            alignItems="center"
                                            // borderBottomWidth={1}
                                            borderBottomColor="tabBar"
                                        >
                                            {/* <Icon name="search" size={20} /> */}
                                            <InputWithIcon
                                                icon="search"
                                                flex={1}
                                                value={queryInputStu}
                                                onChangeText={(e) => checkVadidateStudent(e)}
                                                iconColor="inputClose"
                                                placeholderTextColor="black"
                                                placeholder="Nhập tìm kiếm"
                                                iconSize={16}
                                                onPress={() => setQueryInputStu("")}
                                                border
                                            />
                                        </Flex>

                                        <Box flex={1}>
                                            <ScrollView>
                                                <Box
                                                    mt={2}
                                                    marginX={16}
                                                    borderWidth={1}
                                                    borderRadius={8}
                                                    borderColor="#D4D4D4"
                                                >
                                                    <Box
                                                        style={{
                                                            flex: 1,
                                                            flexDirection: "row",
                                                        }}
                                                    >
                                                        <Box
                                                            style={{
                                                                width: "10%",
                                                            }}
                                                        >
                                                            <Box
                                                                height={40}
                                                                style={{
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                }}
                                                            >
                                                                <TouchableOpacity
                                                                    onPress={() => {
                                                                        setAllNew(!all), chooseAllNewStudent();
                                                                    }}
                                                                >
                                                                    {allNew ? (
                                                                        <Icon name="chooseBox"></Icon>
                                                                    ) : (
                                                                        <Icon name="CheckBox"></Icon>
                                                                    )}
                                                                </TouchableOpacity>
                                                            </Box>
                                                        </Box>
                                                        <Box
                                                            style={{
                                                                width: "30%",
                                                                flexDirection: "row",
                                                            }}
                                                        >
                                                            <Box
                                                                style={{
                                                                    width: 1,
                                                                    backgroundColor: "#D4D4D4",
                                                                }}
                                                            ></Box>
                                                            <Box
                                                                height={40}
                                                                style={{
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    width: "100%",
                                                                }}
                                                            >
                                                                <Text
                                                                    style={{
                                                                        color: "#636363",
                                                                        fontSize: 12,
                                                                        textTransform: "uppercase",
                                                                        fontWeight: "bold",
                                                                        textAlign: "center",
                                                                    }}
                                                                >
                                                                    MÃ SV
                                                                </Text>
                                                            </Box>
                                                        </Box>
                                                        <Box
                                                            style={{
                                                                width: "60%",
                                                                flexDirection: "row",
                                                            }}
                                                        >
                                                            <Box
                                                                style={{
                                                                    width: 1,
                                                                    backgroundColor: "#D4D4D4",
                                                                }}
                                                            ></Box>
                                                            <Box
                                                                height={40}
                                                                style={{
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    width: "100%",
                                                                }}
                                                            >
                                                                <Text
                                                                    style={{
                                                                        color: "#636363",
                                                                        fontSize: 12,
                                                                        textTransform: "uppercase",
                                                                        fontWeight: "bold",
                                                                        textAlign: "center",
                                                                    }}
                                                                >
                                                                    HỌ VÀ TÊN
                                                                </Text>
                                                            </Box>
                                                        </Box>
                                                        <Box
                                                            style={{
                                                                width: "25%",
                                                                flexDirection: "row",
                                                            }}
                                                        ></Box>
                                                    </Box>
                                                    {loading ? (
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
                                                    ) : (
                                                        listStudent &&
                                                        listStudent.map((data: any, index: number) => {
                                                            const isSelected = selectedStudent.includes(
                                                                data.id
                                                            );
                                                            return (
                                                                <StudentList
                                                                    key={String(index)}
                                                                    choose={chooseStudent}
                                                                    isSelected={isSelected}
                                                                    data={data}
                                                                    index={index}
                                                                    setUserChoose={setStudentChoose}
                                                                    setModalAdd={setModalAdd}
                                                                    setModalVisible={setModalVisible}
                                                                />
                                                            );
                                                        })
                                                    )}
                                                </Box>
                                            </ScrollView>
                                        </Box>

                                        <Box flexDirection="row">
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setSelectedStudent([]);
                                                    setModalVisible(false);
                                                }}
                                            >
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
                                            <TouchableOpacity onPress={onAddStudent}>
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
                                                        style={{
                                                            padding: 10,
                                                            color: "#ffffff",
                                                            right: 0,
                                                        }}
                                                    >
                                                        Cập nhật
                                                    </Text>
                                                </Box>
                                            </TouchableOpacity>
                                        </Box>
                                    </Box>
                                ) : (
                                    <Box alignItems="center">
                                        <Text fontSize={17} color="seen" fontWeight="bold" mb={2}>
                                            GIẢI TÁN LỚP HỌC
                                        </Text>
                                        <Box>
                                            <Icon name="warningIcon"></Icon>
                                            <Text
                                                mt={2}
                                                fontSize={18}
                                                color="#404040"
                                                fontWeight="bold"
                                                mb={2}
                                            >
                                                Xác nhận xóa lớp học này
                                            </Text>
                                        </Box>
                                        <Box flexDirection="row">
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setModalVisible(false);
                                                }}
                                            >
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
                                                    onDeleteClassRoom();
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
                                                        style={{
                                                            padding: 10,
                                                            color: "#ffffff",
                                                            right: 0,
                                                        }}
                                                    >
                                                        Cập nhật
                                                    </Text>
                                                </Box>
                                            </TouchableOpacity>
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </Modal>
                    <Modal animationType="slide" transparent={true} visible={modalChoose}>
                        <TouchableOpacity
                          onPress={() => { setModalChoose(false)}}
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: 22,
                            }}
                            activeOpacity={1}
                        >
                            <TouchableWithoutFeedback>
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
                                <ScrollView>
                                    {items?.map((item: any) => (
                                        <TouchableOpacity
                                            delayPressIn={0}
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                marginBottom: 10,
                                                borderWidth: 1,
                                                minHeight: 40,
                                                borderRadius: 8,
                                                borderColor: "#636363",
                                                width: width * 0.8,
                                            }}
                                            onPress={() => {
                                                setValue({
                                                    value: item.id,
                                                    label: item.department_name,
                                                }),
                                                    setModalChoose(false);
                                            }}
                                        >
                                            <Box
                                                height={19}
                                                width={19}
                                                borderColor={  value.value === item.id ? "#059DCE" : "#DADADA"}
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
                                                        value.value === item.id ? "#059DCE" : "null"
                                                    }
                                                ></Box>
                                            </Box>
                                            <Text ml={2} color="seen" fontSize={15} width={"85%"}>
                                                {item.department_name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
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
                        titleEdit={editTitleClass}
                        title="Sửa lớp học"
                        type={typeModalClass}
                        isOpen={modalVisibleNoti}
                        setIsOpen={setModalVisibleNoti}
                    />
                    {/* <PopupNotification
            titleEdit={editTitleClass}
            title="Sửa lớp học"
            type={typeModalClass}
            setModalVisible={setModalVisibleNoti}
          ></PopupNotification> */}
                </Modal>
            </Box>
        </Box>
    );
};
export default editClass;
