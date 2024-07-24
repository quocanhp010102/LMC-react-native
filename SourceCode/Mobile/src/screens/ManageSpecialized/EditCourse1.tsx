import * as ImagePicker from "expo-image-picker";
import moment from "moment";
import React, {useCallback, useState} from "react";
import {
    ActivityIndicator,
    BackHandler,
    Dimensions,
    ListRenderItemInfo,
    Modal,
    Platform,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import {Devider} from "../../components/Devider";
import {Header, NotificationIcon} from "../../components/Header";
import {InputWithIcon} from "../../components/InputWithIcon";
import {Icon} from "../../components/svg-icon";
import {Box, Flex, Text, TextInput} from "../../rebass";
import {API} from "../../services";
import {CourseApi} from "../../services/api/Course/CourseApi";
import {StudentApi} from "../../services/api/Student/StudentApi";
import {generateApiService} from "../../services/ApiService";
import {StudentList} from "./components/StudentList";
import {UserList} from "./components/UserList";
import {ActivityHistoriesApi} from "../../services/api/ActivityHistories/ActivityHistoriesApi";
import {useListTeacherManage} from "./components/hooks/useListTeacherManage";
import ListTeacherManage from "./components/ListTeacherManage";
import {lightColors} from "../../themes";
import {FlatList} from "react-native-gesture-handler";
import PopupCloseAutomatically from "../../components/PopupCloseAutomatically";

const {width, height} = Dimensions.get("screen");

const editCourse = ({navigation, route}: any) => {
    const [modalVisibleNoti, setModalVisibleNoti] = useState(false);
    const [type, setType] = useState<string>("");
    const [editTitle, setEditTitle] = useState("");
    const {courseName, lectureName, coursesSemester, courseID} =
        route.params.courseDetail;
    const {idDepartment, name_Department, NewCourse} = route.params;
    const [modalVisible, setModalVisible] = useState(false);
    const [modalChoose, setModalChoose] = useState(false);
    const {keyExtractor, onEndReached, teachers, onRefresh} =
        useListTeacherManage();
    const [modalAdd, setModalAdd] = useState<boolean>();
    const [queryInputStu, setQueryInputStu] = React.useState<string>("");
    const [listUser, setListUser] = useState<any>();
    const [selected, setSelected] = useState<any>([]);
    const [selectedStudent, setSelectedStudent] = useState<any>([]);
    const [all, setAll] = useState<boolean>(false);
    const [allNew, setAllNew] = useState<boolean>(false);
    const [nameCourse, setNameCourse] = useState<string>("");
    const [courseSemester, setCourseSemester] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [listStudent, setListStudent] = useState<any>([]);
    const [linkImage, setLinkImage] = useState<string>("");
    const [file, setFile] = useState<any>("");
    const [notification, setNotification] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [totalStudent, setTotalStudent] = useState<string>("");
    const [value, setValue] = useState<any>({});

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
                    StudentApi.searchStudentNotInCourse(courseID, queryInputStu)
                );

                setListStudent(response.content);
            }, 800);
            return () => {
                clearTimeout(timeout);
            };
        } else {
            onGetAllStudent();
        }
    }, [queryInputStu]);
    const choose = useCallback(
        (id: number) => {
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
    const chooseStudent = useCallback(
        (id: number) => {
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
            const allId = listUser.map((user: any) => user.id);
            setSelected(allId);
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
    const onGetStudents = async () => {
        setLoading(true);
        const response = await generateApiService.get(
            CourseApi.getStudentByCourse(courseID)
        );
        if (response) {
            setLoading(false);
            let userList: any = [];
            response.content.map((student: any) => {
                userList.push({
                    id: student.id,
                    student_code: student.student_code,
                    student_fullname: student.student_fullname,
                });
            });

            setListUser(userList);
        }
    };
    const onGetAllStudent = async () => {
        const response = await generateApiService.get(
            StudentApi.getStudentNotInCourse(courseID)
        );
        if (response) {
            let studentList: any = [];
            response.content.map((student: any) => {
                studentList.push({
                    id: student.id,
                    student_code: student.student_code,
                    student_fullname: student.student_fullname,
                });
            });
            setListStudent(studentList);
        }
    };

    const onAddStudent = async () => {
        try {
            if (selectedStudent.length > 0) {
                const ids = selectedStudent;
                await generateApiService.post(CourseApi.addStudent(courseID), ids);
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
                setSelected([]);
                setEditTitle("Thêm sinh viên thành công !");
                setType("success");
                setModalVisibleNoti(true);
            } else {
                setModalVisible(false);
            }
        } catch (e) {
            setEditTitle("Thêm sinh viên thất bai !");
            setType("error");
            setModalVisibleNoti(true);
        }
    };

    const onDeleteStudent = async () => {
        if (selected.length > 0) {
            try {
                const ids = selected;
                await generateApiService.delete(CourseApi.deleteStudent(courseID), ids);

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
                setSelected([]);
                setModalVisible(false);
                setEditTitle("Xóa sinh viên thành công !");
                setType("success");
                setModalVisibleNoti(true);
            } catch (error) {
                setEditTitle("Xóa sinh viên thất bai !");
                setType("error");
                setModalVisibleNoti(true);
            }
        }
    };
    const pickDocument = async () => {
        let result : any = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            let localUri = result.uri;
            let filename = localUri.split("/").pop();
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;
            if (type === `image/jpg`) {
                type = `image/jpeg`;
            }
            setFile({uri: localUri, name: filename, type});
        }
    };

    const onGetDetailCourse = async () => {
        const response = await generateApiService.get(
            CourseApi.getCourseById(courseID)
        );
        if (response) {
            setNameCourse(response.courseName);

            setCourseSemester(response.courseSemester);

            setLinkImage(response.courseImage);

            setNotification(response.courseNotification);

            setDescription(response.courseDescription);

            setTotalStudent(response.courseTotalStudent);

            setValue({
                value: response.lecturer.id,
                label: response.lecturer.lecturer_fullname,
            });
        }
    };

    const onEditCourse = async () => {
        try {
            let res;
            if (file.type === "success") {
                const data = new FormData();
                data.append("file", {
                    ...file,
                    uri:
                        Platform.OS === "android"
                            ? file.uri
                            : file.uri.replace("file://", ""),
                    name: file.name,
                    type: file.mimeType, // it may be necessary in Android.
                });
                res = await generateApiService.postImage(
                    `${API.PUBLIC}services/lmsbackendtest/api/uploadImage`,
                    data
                );
            }
            console.log("Asdasd" , res ,file);
            
            const body = {
                courseNotification: notification,
                courseName: nameCourse,
                courseDescription: description,
                courseTotalStudent: totalStudent,
                courseCreatedDate: moment(new Date()).format("YYYY-MM-YY"),
                courseSemester: courseSemester,
                courseImage: res ? res : linkImage,
                lecturer: {
                    id: value.value,
                },
                department: {
                    id: idDepartment,
                },
                id: courseID,
            };

            const response = await generateApiService.put(
                CourseApi.getCourseById(courseID),
                body
            );

            console.log("asdasdcccc" ,response);
            

            if (response == 400) {
                setEditTitle("có lỗi xảy ra!");
                setType("warning");
                setModalVisibleNoti(true);
            } else {
                const bodyHistory = {
                    name: " khóa học " + nameCourse,
                    method: "PUT",
                };
                const history = await generateApiService.post(
                    ActivityHistoriesApi.postHistories(),
                    bodyHistory
                );
                setEditTitle("Sửa khóa học thành công !");
                setType("success");
                setModalVisibleNoti(true);
                navigation.navigate("/quan-li-khoa-hoc", {
                    id_course: idDepartment,
                    department_name: name_Department,
                    newCourse: {
                        courseID: courseID,
                        courseName: response.courseName,
                        coursesSemester: response.courseSemester,
                        lectureName: response.lecturer.lecturer_fullname,
                        totalStudent: response.courseTotalStudent,
                    },
                });
            }
        } catch (error) {
            setEditTitle("Sửa khóa học thất bại !");
            setType("error");
            setModalVisibleNoti(true);
        }
    };

    React.useEffect(() => {
        if (NewCourse) {
            setEditTitle("Thêm khóa học thành công !");
            setType("success");
            setModalVisibleNoti(true);
        }
        onGetDetailCourse();
        onGetStudents();
        onGetAllStudent();
    }, []);

    React.useEffect(() => {
        const backAction = () => {
            navigation.navigate("/quan-li-khoa-hoc", {
                id_course: idDepartment,
                department_name: name_Department,
                newCourse: listUser
                    ? {
                        courseID: courseID,
                        courseName: courseName,
                        coursesSemester: coursesSemester,
                        lectureName: lectureName,
                        totalStudent: listUser.length,
                    }
                    : null,
            });

            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, [listUser]);
    return (
        <Box bg="defaultBackground" position="relative" height="100%">
            <Box height="100%">
                <Header logo search>
                    <NotificationIcon/>
                </Header>
                <Box height={1} bg="#636363" opacity={0.3} mt={2}/>
                <FlatList
                    data={listUser}
                    ListHeaderComponent={
                        <HeaderEditCourse
                            nameCourse={nameCourse}
                            courseName={courseName}
                            setNameCourse={setNameCourse}
                            courseSemester={courseSemester}
                            setCourseSemester={setCourseSemester}
                            setModalChoose={setModalChoose}
                            value={value}
                            pickDocument={pickDocument}
                            file={file}
                            linkImage={linkImage}
                            onDeleteStudent={onDeleteStudent}
                            setModalAdd={setModalAdd}
                            setModalVisible={setModalVisible}
                            loading={loading}
                            setAll={setAll}
                            chooseAll={chooseAll}
                            all={all}

                        ></HeaderEditCourse>
                    }
                    renderItem={(items: ListRenderItemInfo<any>) => {
                        const data = items.item;
                        const isSelected = selected.includes(data.id);
                        return (
                            <Box
                                marginX={16}
                                borderLeftWidth={1}
                                borderRightWidth={1}
                                borderBottomWidth={listUser.length - 1 === items.index ? 1 : 0}
                                borderColor="#D4D4D4"
                                borderBottomLeftRadius={
                                    listUser.length - 1 === items.index ? 8 : 0
                                }
                                borderBottomRightRadius={
                                    listUser.length - 1 === items.index ? 8 : 0
                                }


                            >
                                <UserList
                                    key={String(items.index)}
                                    choose={choose}
                                    isSelected={isSelected}
                                    data={data}
                                    index={items.index}
                                    setModalAdd={setModalAdd}
                                    setModalVisible={setModalVisible}
                                ></UserList>
                            </Box>
                        );
                    }}
                    ListFooterComponent={<Box height={40}></Box>}
                />

                <Box flexDirection="row" justifyContent="space-between" marginX={16}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("/quan-li-khoa-hoc", {
                                id_course: idDepartment,
                                department_name: name_Department,
                                newCourse: listUser
                                    ? {
                                        courseID: courseID,
                                        courseName: courseName,
                                        coursesSemester: coursesSemester,
                                        lectureName: lectureName,
                                        totalStudent: listUser.length,
                                    }
                                    : null,
                            });
                        }}
                        style={{
                            borderRadius: 8,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "rgba(100, 116, 139, 0.1)",
                            height: 40,
                            width: "47.5%",
                            borderColor: lightColors.textColor,
                            borderWidth: 1,
                        }}
                    >
                        <Text ml={1} color="deleteColor">
                            Quay lại
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onEditCourse}
                        style={{
                            borderRadius: 8,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#00A8B5",
                            height: 40,
                            width: "47.5%",
                        }}
                    >
                        <Text ml={1} color="#fff">
                            Chỉnh sửa
                        </Text>
                    </TouchableOpacity>
                </Box>
                <Box height={20}/>
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
                                <Text
                                    fontSize={17}
                                    color="textColor"
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
                                    borderBottomColor="tabBar"
                                >
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
                                                            MÃ SV
                                                        </Text>
                                                    </Box>
                                                </Box>
                                                <Box
                                                    style={{
                                                        width: "50%",
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
                                                listStudent.map((data : any, index : number) => {
                                                    const isSelected = selectedStudent.includes(data.id);
                                                    return (
                                                        <StudentList
                                                            key={String(index)}
                                                            choose={chooseStudent}
                                                            // isSelected={isSelected}
                                                            data={data}
                                                            index={index}
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
                                            borderColor="#00A8B5"
                                            mt={2}
                                            mr={2}
                                            width={width * 0.4}
                                            alignItems="center"
                                            backgroundColor="rgba(99, 99, 99, 0.1)"
                                        >
                                            <Text style={{padding: 10, color: "#CC0000"}}>Hủy</Text>
                                        </Box>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={onAddStudent}>
                                        <Box
                                            borderRadius={5}
                                            borderWidth={1}
                                            borderColor="buttonColor"
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
                                    THÔNG BÁO
                                </Text>
                                <TextInput
                                    textAlignVertical="top"
                                    multiline={true}
                                    width={width * 0.8}
                                    height={height * 0.25}
                                    borderRadius={10}
                                    borderWidth={1}
                                    borderColor="rgba(125, 125, 125, 0.3)"
                                    padding={4}
                                    fontSize={16}
                                    marginBottom={10}
                                    marginTop={10}
                                ></TextInput>
                                <Box flexDirection="row">
                                    <TouchableOpacity onPress={() => setModalVisible(false)}>
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
                                    <TouchableOpacity onPress={() => setModalVisible(false)}>
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
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleNoti}
                onRequestClose={() => {
                    setModalVisibleNoti(!modalVisibleNoti);
                }}
            >
                <PopupCloseAutomatically
                    titleEdit={editTitle}
                    title="Sửa khóa học"
                    type={type}
                    isOpen={modalVisibleNoti}
                    setIsOpen={setModalVisibleNoti}
                />
                {/* <PopupNotification
          titleEdit={editTitle}
          title="Sửa khóa học"
          type={type}
          setModalVisible={setModalVisibleNoti}
        ></PopupNotification> */}
            </Modal>
            <Modal animationType="slide" transparent={true} visible={modalChoose}>
                <ListTeacherManage
                    setValue={setValue}
                    value={value}
                    setModalChoose={setModalChoose}
                    keyExtractor={keyExtractor}
                    onEndReached={onEndReached}
                    teachers={teachers.data}
                    isRefreshing={teachers.isRefreshing}
                    onRefresh={onRefresh}
                ></ListTeacherManage>
            </Modal>
        </Box>
    );
};
export default editCourse;

interface IHeaderEditCourse {
    courseName: string;
    setNameCourse: (value: string) => void;
    courseSemester: string;
    setCourseSemester: (value: string) => void;
    setModalChoose: (value: boolean) => void;
    value: any;
    pickDocument: () => void;
    file: any;
    linkImage: any;
    onDeleteStudent: () => void;
    setModalAdd: (value: boolean) => void;
    setModalVisible: (value: boolean) => void;
    loading: boolean;
    setAll: (value: boolean) => void;
    chooseAll: () => void;
    all: any;
    nameCourse: string
    listUser?: any
}

const HeaderEditCourse = (props: IHeaderEditCourse) => {

    const {
        courseName,
        setNameCourse,
        courseSemester,
        setCourseSemester,
        setModalChoose,
        value,
        pickDocument,
        file,
        linkImage,
        onDeleteStudent,
        setModalAdd,
        setModalVisible,
        loading,
        setAll,
        chooseAll,
        all,
        nameCourse,
        listUser
    } = props;

    return (
        <>
            <Flex flex={1} px={16}>
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
                            fontSize={17}
                            style={{textTransform: "uppercase"}}
                        >
                            {courseName}
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
            <Box paddingX={16} mt={2}>
                <Text color="seen" fontSize={16}>
                    Tên khóa học<Text color="red">*</Text>
                </Text>
                <TextInput
                    height={50}
                    borderRadius={10}
                    borderWidth={1}
                    borderColor="rgba(125, 125, 125, 0.3)"
                    padding={1}
                    fontSize={16}
                    marginBottom={2}
                    marginTop={1}
                    value={nameCourse}
                    onChangeText={(value) => setNameCourse(value)}
                ></TextInput>

                <Text color="seen" fontSize={16}>
                    Học kỳ<Text color="red">*</Text>
                </Text>
                <TextInput
                    height={50}
                    borderRadius={10}
                    borderWidth={1}
                    borderColor="rgba(125, 125, 125, 0.3)"
                    padding={1}
                    fontSize={16}
                    marginBottom={2}
                    marginTop={1}
                    value={courseSemester}
                    onChangeText={(value) => setCourseSemester(value)}
                ></TextInput>
                <Text color="seen" fontSize={16} mt={2}>
                    Giảng viên hướng dẫn<Text color="red">*</Text>
                </Text>
                <Box paddingTop={2}>
                    <TouchableOpacity onPress={() => setModalChoose(true)}>
                        <Box
                            borderRadius={10}
                            borderWidth={1}
                            borderColor="rgba(125, 125, 125, 0.3)"
                            width="100%"
                            mb={2}
                            height={50}
                            justifyContent="space-between"
                            flexDirection="row"
                            alignItems="center"
                            padding={1}
                        >
                            <Text>{value?.label}</Text>
                            <Icon name="moreMember"></Icon>
                        </Box>
                    </TouchableOpacity>
                </Box>
                <Text mt={2} color="seen" fontSize={16}>
                    Tải lên ảnh khóa học<Text color="red">*</Text>
                </Text>
                <TouchableOpacity onPress={pickDocument}>
                    <Box
                        borderRadius={5}
                        borderWidth={1}
                        borderColor="rgba(125, 125, 125, 0.3)"
                        mt={2}
                        width={"100%"}
                        alignItems="center"
                        height={91}
                        backgroundColor="rgba(99, 99, 99, 0.1)"
                        flexDirection="row"
                        justifyContent="center"
                    >
                        <Icon size={24} name="UploadFile"></Icon>
                        <Text style={{padding: 10, fontSize: 16}} color="deleteColor">
                            Tải lên
                        </Text>
                    </Box>
                </TouchableOpacity>
                {file ? (
                    <Box marginTop={2}>
                        <Text>{file.name.split("\\").pop().split("/").pop()}</Text>
                    </Box>
                ) : linkImage ? (
                    <Box marginTop={2}>
                        <Text>{linkImage.split("\\").pop().split("/").pop()}</Text>
                    </Box>
                ) : null}
            </Box>
            <Text
                fontWeight={500}
                fontSize={16}
                color="textColor"
                padding={2}
                paddingX={16}
                mt={2}
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
            <Box flexDirection="row" justifyContent="space-between" paddingX={16}>
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
                        backgroundColor: "rgba(100, 116, 139, 0.1)",
                        height: 40,
                        width: "47.5%",
                    }}
                >
                    <Icon name="addIcon"></Icon>
                    <Text ml={1} color="textColor">
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
                listUser.length > 0 ?
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
                                    width: "15%",
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
                                        STT
                                    </Text>
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
                                    width: "50%",
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
                    </Box>
                    : <Box>

                    </Box>
            )}
        </>
    );
};
