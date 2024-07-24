import React, {useCallback, useEffect, useState} from "react";
import {ActivityIndicator, Dimensions, Modal, ScrollView, TextInput, TouchableOpacity,} from "react-native";
import {Box, Flex, Text} from "../../../rebass";
import {Icon} from "../../../components/svg-icon";
import {generateApiService} from "../../../services/ApiService";
import {ClassApi} from "../../../services/api/Class/ClassApi";
import {InputWithIcon} from "../../../components/InputWithIcon";
import {UserList} from "./UserList";
import {StudentApi} from "../../../services/api/Student/StudentApi";
import {StudentList} from "./StudentList";
import {DepartmentApi} from "../../../services/api/Departments/DepartmentApi";
import {API} from "../../../services";

const {width, height} = Dimensions.get("screen");

export const ModalView = (props: {
    data?: any;
    setModalVisibleView: any;
    getData: any;
    setModalVisibleNotifi: any;
}) => {
    const {data, setModalVisibleView, getData, setModalVisibleNotifi} = props;
    const [edit, setEdit] = useState<boolean>(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState(data.classroomCode);
    const [content, setContent] = useState(data.classroomCode);
    const [loading, setLoading] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any>([]);
    const [all, setAll] = useState<boolean>(false);
    const [userChoose, setUserChoose] = useState<any>();
    const [studentChoose, setStudentChoose] = useState<any>();
    const [listUser, setListUser] = useState<any>();
    const [selected, setSelected] = useState<any>([]);
    const [modalAdd, setModalAdd] = useState<boolean>(false);
    const [queryInputStu, setQueryInputStu] = React.useState<string>("");
    const [listStudent, setListStudent] = useState([]);
    const [modalChoose, setModalChoose] = useState(false);
    const [items, setItems] = useState([
        {
            label: data.department.department_name,
            value: data.department.id,
        },
    ]);
    const [value, setValue] = useState<any>({
        value: items[0].value,
        label: items[0].label,
    });
    const getDataDepartment = async () => {
        const dataDepartments = await generateApiService.get(
            DepartmentApi.getAllDepartments()
        );
        if (dataDepartments) {
            setItems(dataDepartments.content);
        }
    };
    const onGetAllStudent = async () => {
        const response = await generateApiService.get(StudentApi.getAllStudent());
        if (response) {
            setListStudent(response.content);
        }
    };
    const uploadFile = async () => {
        let newData = data;
        newData.classroomCode = title;
        newData.classroomName = content;
        newData.department = {id: value.value};

        let updateCourse = await generateApiService
            .put(ClassApi.getClassById(data.id), newData)
            .then((response) => {
                getData();
            });
    };
    const checkVadidateStudent = async (inputValue: any) => {
        if (inputValue.length <= 255) {
            setQueryInputStu(inputValue);

            if (inputValue.length !== 0) {
                const response = await generateApiService.get(
                    StudentApi.searchStudent(inputValue)
                );
                if (response) {
                    setListStudent(response.content);
                }
            } else {
                onGetAllStudent();
            }
        } else {
            setQueryInputStu("");
        }
    };
    const choose = useCallback(
        (id : any) => {
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
            `${API.PUBLIC}services/lmsbackendtest/api/classroom-students/insertStudent/${data.id}`,
            ids
        );
        setSelectedStudent([]);
        setModalVisible(false);
        onGetStudents();
    };
    const onGetStudents = async () => {
        setLoading(true);
        const response = await generateApiService.get(
            `${API.PUBLIC}services/lmsbackendtest/api/students/getAllStudentByClassroom/` +
            data.id
        );
        if (response) {
            setLoading(false);

            setListUser(response.content);
        }
    };
    const chooseStudent = useCallback(
        (id :any) => {
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
                const allId = listUser.map((user : any) => user.id);
                setSelected(allId);
            }
        } else {
            setSelected([]);
        }
        setAll(!all);
    };
    const onDeleteStudent = async () => {
        const ids = selected;
        await generateApiService.delete(
            `${API.PUBLIC}services/lmsbackendtest/api/classroom-students/deleteStudent/${data.id}`,
            ids
        );

        setModalVisible(false);
        onGetStudents();
    };
    const onDeleteClassRoom = async () => {
        const res = await generateApiService.delete(
            `${API.PUBLIC}services/lmsbackendtest/api/classroom/deleteClassroom/`,
            [data.id]
        );
        setModalVisibleNotifi(true);
        setModalVisible(false), setModalVisibleView(false);
        getData();
    };
    useEffect(() => {
        onGetStudents();
        onGetAllStudent();
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
                    height: height * 0.9,
                }}
            >
                <Box
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    width="90%"
                >
                    <Box></Box>
                    <Text
                        fontSize={16}
                        color="textColor"
                        fontWeight="bold"
                        mt={15}
                        mb={15}
                    >
                        LỚP HỌC
                    </Text>
                    <TouchableOpacity onPress={() => setModalVisibleView(false)}>
                        <Box mt={15} mb={15}>
                            <Icon name="cross" size={16} color="headerText"/>
                        </Box>
                    </TouchableOpacity>
                </Box>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Box>
                        {/* <Text fontSize={14} fontWeight="bold" marginBottom={2}>
              Mã chuyên ngành
            </Text>
            {!edit ? (
              <Text>
                {data.department
                  ? data.department.department_name
                  : data.departmentName}
              </Text>
            ) : (
              <Text>
                {data.department
                  ? data.department.department_name
                  : data.departmentName}
              </Text>
            )} */}
                        <Text fontSize={14} fontWeight="bold" marginBottom={2} mt={2}>
                            Chuyên ngành
                        </Text>
                        {!edit ? (
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
                        ) : (
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
                        )}
                        <Text fontSize={14} fontWeight="bold" marginBottom={2} mt={2}>
                            Mã lớp
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
                                width="100%"
                                marginBottom={14}
                                defaultValue={data.classroomCode}
                                onChangeText={(value) => setTitle(value)}
                            ></TextInput>
                        )}

                        <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                            Tên lớp
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
                                height={40}
                                borderWidth={1}
                                borderColor="rgba(99, 99, 99, 0.2)"
                                borderRadius={8}
                                width="100%"
                                marginBottom={14}
                                defaultValue={data.classroomName}
                                multiline={true}
                                onChangeText={(value) => setContent(value)}
                            ></TextInput>
                        )}
                        <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                            Sĩ số
                        </Text>
                        {!edit ? (
                            <Text>{data.classroomTotalStudent}</Text>
                        ) : (
                            <Text>{data.classroomTotalStudent}</Text>
                        )}
                        <Text
                            fontWeight={500}
                            fontSize={16}
                            color="#32813D"
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
                            // borderBottomWidth={1}
                            borderBottomColor="tabBar"
                        >
                            {/* <Icon name="search" size={20} /> */}
                            {/* <InputWithIcon
                icon="search"
                flex={1}
                value={queryInput}
                onChangeText={(e) => checkVadidate(e)}
                iconColor="inputClose"
                placeholderTextColor="black"
                placeholder="Nhập tìm kiếm"
                iconSize={16}
                onPress={() => setQueryInput("")}
              /> */}
                        </Flex>
                        <Box
                            flexDirection="row"
                            justifyContent="space-between"
                            // ml="2.5%"
                            // mr="2.5%"
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
                                <Text ml={1} color="seen">
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
                                    backgroundColor: "rgba(100, 116, 139, 0.1)",
                                    height: 40,
                                    width: "47.5%",
                                }}
                            >
                                <Icon name="add-calendar"></Icon>
                                <Text ml={1} color="seen">
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
                                // width={width * 0.95}
                                mt={2}
                                // ml="2.5%"
                                marginX={16}
                                borderWidth={1}
                                borderRadius={8}
                                borderColor="#D4D4D4"
                            >
                                <Box
                                    style={{
                                        flex: 1,
                                        flexDirection: "row",
                                        // flexWrap: "wrap",
                                        // alignItems: "center",
                                    }}
                                >
                                    <Box
                                        style={{
                                            width: "10%",
                                        }}
                                    >
                                        <Box
                                            height={40}
                                            style={{alignItems: "center", justifyContent: "center"}}
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
                                    {/* <Box
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
                        thông báo
                      </Text>
                    </Box>
                  </Box> */}
                                </Box>
                                {listUser &&
                                    listUser.map((data : any, index : number) => {
                                        const isSelected = selected.includes(data.student_id);
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
                <Box flexDirection="row" mt={2}>
                    <TouchableOpacity
                        onPress={() => {
                            setModalAdd(false), setModalVisible(true);
                        }}
                    >
                        <Box
                            borderRadius={5}
                            borderWidth={1}
                            borderColor="rgba(125, 125, 125, 0.3)"
                            mt={2}
                            mr={2}
                            width={width * 0.4}
                            alignItems="center"
                            backgroundColor="rgba(99, 99, 99, 0.1)"
                        >
                            <Text style={{padding: 10}}>Giải tán</Text>
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
                                setEdit(false), uploadFile(), setModalVisibleView(false);
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
                    )}
                </Box>
            </Box>
            <Modal animationType="slide" transparent={true} visible={modalVisible}>
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
                                <Text fontSize={17} color="seen" fontWeight="bold" padding={1}>
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
                                                ></Box>
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
                                                        width: "40%",
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
                                                listStudent.map((data : any, index) => {
                                                    const isSelected = selectedStudent.includes(data.id);
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
                                            borderColor="rgba(125, 125, 125, 0.3)"
                                            mt={2}
                                            mr={2}
                                            width={width * 0.4}
                                            alignItems="center"
                                            backgroundColor="rgba(99, 99, 99, 0.1)"
                                        >
                                            <Text style={{padding: 10}}>Hủy</Text>
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
                                            <Text style={{padding: 10, color: "#ffffff", right: 0}}>
                                                Cập nhật
                                            </Text>
                                        </Box>
                                    </TouchableOpacity>
                                </Box>
                            </Box>
                        ) : (
                            <Box alignItems="center">
                                <Text fontSize={17} color="seen" fontWeight="bold" padding={1}>
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
                                            borderColor="rgba(125, 125, 125, 0.3)"
                                            mt={2}
                                            mr={2}
                                            width={width * 0.4}
                                            alignItems="center"
                                            backgroundColor="rgba(99, 99, 99, 0.1)"
                                        >
                                            <Text style={{padding: 10}}>Hủy</Text>
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
                                            <Text style={{padding: 10, color: "#ffffff", right: 0}}>
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
                        <ScrollView>
                            {items.map((item : any) => (
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
                                    <Text ml={2} color="seen" fontSize={15} width={"85%"}>
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
