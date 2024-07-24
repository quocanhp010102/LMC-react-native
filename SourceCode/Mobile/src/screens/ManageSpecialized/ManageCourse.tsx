import {useIsFocused, useNavigation} from "@react-navigation/native";
import React, {useCallback, useEffect, useState} from "react";
import {ActivityIndicator, BackHandler, Modal, ScrollView, TouchableOpacity} from "react-native";
import {CardManageCourse} from "../../components/CardManageCourse";
import {Devider} from "../../components/Devider";
import {Header, NotificationIcon} from "../../components/Header";
import {InputWithIcon} from "../../components/InputWithIcon";
import {Icon} from "../../components/svg-icon";
import {NavLink} from "../../platform/links";
import {Box, Flex, Text} from "../../rebass";
import {generateApiService} from "../../services/ApiService";
import {CourseApi} from "../../services/Course/CourseApi";
import {ActivityHistoriesApi} from "../../services/api/ActivityHistories/ActivityHistoriesApi";
import {DepartmentApi} from "../../services/api/Departments/DepartmentApi";
import {ModalDelete} from "./components/ModalDelete";
import PopupCloseAutomatically from "../../components/PopupCloseAutomatically";

const ManageCourse = (props: any) => {  
    const navigation = useNavigation();
    const [modalVisibleNoti, setModalVisibleNoti] = useState(false);
    const [type, setType] = useState<string>("");
    const {id_course, department_name, newCourse} = props.route.params;
    const [modalVisible, setModalVisible] = useState(false);
    const [courseSelected, setCourseSelected] = useState(false);
    const [countCourse, setCountCourse] = useState<number | null>(null);
    const [listCourse, setListCourse] = useState<any>([]);
    const [selected, setSelected] = useState<any>([]);
    const [queryInput, setQueryInput] = React.useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [editTitle, setEditTitle] = useState<string>("");

    const checkVadidate = (inputValue: any) => {
        if (inputValue.length <= 255) {
            setQueryInput(inputValue);
        } else {
            setQueryInput("");
        }
    };
    
    const choose = useCallback(
        (id: any) => {
            setSelected(id);
            setModalVisible(true);
        },
        [selected]
    );

    const onGetCourses = async () => {
        setLoading(true);
        const response = await generateApiService.get(
            DepartmentApi.getCoursesByDepartments(id_course)
        );
        if (response) {
            setLoading(false);
            setCountCourse(response.totalElements)
            setListCourse(response.content);
        }
    };

    useEffect(() => {
        if (queryInput) {
            const timeout = setTimeout(async () => {
                setQueryInput(queryInput);
                const response = await generateApiService.get(
                    DepartmentApi.searchCourseInDepartment(id_course, queryInput)
                );
                setListCourse(response.content);
            }, 800);
            return () => {
                clearTimeout(timeout);
            };
        } else {
            onGetCourses();
        }
    }, [queryInput]);

    const isFocused = useIsFocused()

    useEffect(() => {
        if (isFocused) {
            onGetCourses();
        }
    }, [isFocused]);

    useEffect(() => {
        if (newCourse) {
            var index = listCourse.findIndex(
                (pCourse: any) => pCourse.courseID == newCourse.courseID
            );
            if (index >= 0) {
                let newDataCourse = [...listCourse];
                newDataCourse[index] = newCourse;
                setListCourse(newDataCourse);
            } else {
                setListCourse([newCourse, ...listCourse]);
                setCountCourse((countCourse || 0) + 1);
            }
        }
    }, [newCourse]);
    const goBack = () => {
        navigation.navigate("/quan-li-mon-hoc", {
            newCourse: {course: listCourse, id: id_course, countCourse: countCourse},
        });
    };
    React.useEffect(() => {
        const backAction = () => {
            goBack();
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => backHandler.remove();
    }, [listCourse]);
    const handleDelete = async () => {
        await generateApiService.delete(
            CourseApi.deleteCourse(selected)
        );
        const bodyHistory = {
            name:
                " khóa học " +
                listCourse.find((x: any) => x.courseID == selected).courseName,
            method: "DELETE",
        };
        await generateApiService.post(
            ActivityHistoriesApi.postHistories(),
            bodyHistory
        );
        setEditTitle("Xóa khóa học thành công!");
        setType("success");
        setModalVisibleNoti(true);
        var index = listCourse.findIndex((pCourse: any) => pCourse.courseID == selected);
        if (index >= 0) {
            let newDataCourse = [...listCourse];
            newDataCourse.splice(index, 1);
            setListCourse(newDataCourse);
            setCountCourse((countCourse || 0) - 1);
        }
        setModalVisible(false);
        setCourseSelected(false);
        setSelected([]);
    };
    return (
        <Box bg="defaultBackground" position="relative" height="100%">
            <Box height="100%">
                <Header
                    title="Quản lý khóa học"
                    search
                    leftButton="back"
                    leftButtonClick={goBack}
                >
                    <NotificationIcon/>
                </Header>

                <Box height={1} bg="#636363" opacity={0.3} mt={2}/>
                <Flex px={2}>
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
                                {department_name}
                            </Text>
                        </Flex>
                    </Flex>
                </Flex>
                <Box>
                    <Flex
                        mb={1}
                        p={2}
                        flexDirection="row"
                        alignItems="center"
                        borderBottomColor="tabBar"
                        height={70}

                    >
                        <Box width="100%">
                            <InputWithIcon
                                icon="search"
                                flex={1}
                                value={queryInput}
                                onChangeText={(e) => checkVadidate(e)}
                                iconColor="inputClose"
                                placeholderTextColor="black"
                                placeholder="Nhập tìm kiếm"
                                iconSize={16}
                                onPress={() => setQueryInput("")}
                                border
                            />
                        </Box>
                    </Flex>
                    <Box
                        flexDirection="row"
                        ml="2.5%"
                        mr="2.5%"
                        mb={2}
                    >
                        {!courseSelected ? (
                            <TouchableOpacity

                                onPress={() => setCourseSelected(true)}
                            >
                                <Box

                                    height={40}
                                    style={{
                                        borderRadius: 8,
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Icon name="deleteIcon"></Icon>
                                    <Text ml={1} color="deleteColor">
                                        Xóa
                                    </Text>
                                </Box>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                onPress={() => setCourseSelected(false)}
                            >
                                <Box

                                    height={40}
                                    style={{
                                        borderRadius: 8,
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Icon name="deleteIcon"></Icon>
                                    <Text ml={1} color="deleteColor">
                                        Xác nhận
                                    </Text>
                                </Box>
                            </TouchableOpacity>
                        )}
                        <Box paddingX={2}>
                            <NavLink
                                {...{
                                    route: "/them-khoa-hoc",
                                    params: {
                                        idDepartment: id_course,
                                        department_name: department_name,
                                        name_Department: department_name,
                                    },
                                }}
                            >
                                <Box
                                    backgroundColor="#56C8C8"
                                    height={40}
                                    paddingX={2}
                                    style={{
                                        borderRadius: 8,
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Icon name="addIcon"></Icon>
                                    <Text ml={1} color="white">
                                        Thêm
                                    </Text>
                                </Box>
                            </NavLink>
                        </Box>
                    </Box>
                </Box>
                {loading ? (
                    <Box
                        style={{

                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 22,
                        }}
                    >
                        <ActivityIndicator size="large" color="#00A8B5"/>
                    </Box>
                ) : null}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {listCourse.length !== 0 &&
                        listCourse.map((data: any, index: number) => {
                            return (
                                <Box
                                    key={String(index)}
                                    flexDirection="row"
                                    alignItems="center"
                                    paddingX={16}
                                    justifyContent="center"

                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            !courseSelected
                                                ? navigation.navigate("/chinh-sua-khoa-hoc", {
                                                    courseDetail: data,
                                                    idDepartment: id_course,
                                                    name_Department: department_name,
                                                })
                                                : choose(data.courseID);
                                        }}
                                    >
                                        <CardManageCourse title={data.courseName} data={data}>
                                            <Box
                                                flexDirection="row"
                                                flexWrap="wrap"
                                                alignItems="center"
                                                ml={2}
                                            >
                                                <Text
                                                    color="seen"
                                                    fontSize={18}
                                                    fontWeight="bold"
                                                    ml={2}
                                                    width="40%"
                                                >
                                                    Học kỳ
                                                </Text>
                                                <Text color="seen" fontSize={18} mt={4} width="55%">
                                                    {data.coursesSemester}
                                                </Text>
                                                <Text
                                                    color="seen"
                                                    fontSize={18}
                                                    fontWeight="bold"
                                                    mt={4}
                                                    ml={2}
                                                    width="40%"
                                                >
                                                    Sĩ Số
                                                </Text>
                                                <Text color="seen" fontSize={18} mt={4} width="55%">
                                                    {data.totalStudent}
                                                </Text>
                                                <Text
                                                    color="seen"
                                                    fontSize={18}
                                                    fontWeight="bold"
                                                    mt={4}
                                                    ml={2}
                                                    width="40%"
                                                >
                                                    Giảng Viên
                                                </Text>
                                                <Text color="seen" fontSize={18} mt={4} width="55%">
                                                    {data.lectureName}
                                                </Text>
                                            </Box>
                                        </CardManageCourse>
                                    </TouchableOpacity>
                                </Box>
                            );
                        })}

                    <Box height={20}/>
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
                            title="Tạo khóa học"
                            type={type}
                            isOpen={modalVisibleNoti}
                            setIsOpen={setModalVisibleNoti}
                        />
                    </Modal>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                    >
                        <ModalDelete
                            handleDeleteTutorials={handleDelete}
                            setModalVisible={() => {
                                setModalVisible(false);
                                setCourseSelected(false);
                                setSelected([]);
                            }}
                            setModalVisibleNoti={setModalVisibleNoti}
                            setType={setType}
                            setEditTitle={setEditTitle}
                            data={selected}
                        ></ModalDelete>
                    </Modal>
                </ScrollView>
            </Box>
        </Box>
    );
};
export default ManageCourse;
