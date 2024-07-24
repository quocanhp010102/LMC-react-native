import {useNavigation} from "@react-navigation/native";
import React, {useEffect, useState} from "react";
import {ActivityIndicator, Linking, Modal, Platform, RefreshControl, ScrollView, TouchableOpacity} from "react-native";
import Swipeout from "react-native-swipeout";
import {CardAttachments} from "../../components/CardAttachments";
import {CardAttachmentsUpload} from "../../components/CardAttachmentsUpload";
import {CardLesson} from "../../components/CardLesson";
import {Devider} from "../../components/Devider";
import {Header, NotificationIcon} from "../../components/Header";
import {Icon} from "../../components/svg-icon";
import {Box, Flex, Text} from "../../rebass";
import {generateApiService} from "../../services/ApiService";
import {ActivityHistoriesApi} from "../../services/api/ActivityHistories/ActivityHistoriesApi";
import {CourseApi} from "../../services/api/Course/CourseApi";
import {ExamsApi} from "../../services/api/Exams/ExamsApi";
import {LessonApi} from "../../services/api/Lesson/LessonApi";
import {UploadFileApi} from "../../services/api/UploadFile/UploadFileApi";
import {ModalConfirm} from "./components/ModalConfirm";
import {ModalDelete} from "./components/ModalDelete";
import PopupCloseAutomatically from "../../components/PopupCloseAutomatically";

const CourseDetailsTeacher = (props: { id?: string; data?: any }) => {
    const navigation = useNavigation();
    //@ts-ignore
    const idCourse = props.route.params.id_course;
    //@ts-ignore
    const newDelete = props.route.params.newDelete
    //@ts-ignore
    const {newLesson, newExams} = props.route.params;
    const [state, _setState] = useState<any>({
        dataCourse: [],
        attachments: [],
        lesson: [],
        loading: false,
        loadingFile: false,
        fileChoose: null,
        examChoose: null,
        lessonChoose: null,
        modalVisible: false,
        members: [],
        test: [],
        lecturer: [],
    });
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [modalVisibleNoti, setModalVisibleNoti] = useState(false);
    const [type, setType] = useState<string>("");
    const setState = (data: any) => {
        _setState({
            ...state,
            ...data,
        });
    };
    const getData = async () => {
        try {
            setState({
                loading: true,
            });
            const [
                courseInfo,
                studentInCourse,
                fileOfCourse,
                lessonOfCourse,
                testOfCourse,
            ] = await Promise.all([
                generateApiService.get(CourseApi.getCourseInfo(idCourse)),
                generateApiService.get(CourseApi.getAllStudentCourse(idCourse)),
                generateApiService.get(CourseApi.getFileOfCourse(idCourse)),
                generateApiService.get(CourseApi.getLessonsOfCourse(idCourse)),
                generateApiService.get(CourseApi.getTestOfCourse(idCourse)),
            ]);

            if (courseInfo) {
                setState({
                    dataCourse: courseInfo,
                    attachments: fileOfCourse.content,
                    lesson: lessonOfCourse.content,
                    test: testOfCourse.content,
                    members: studentInCourse,
                    lecturer: courseInfo.lecturer,
                    loading: false,
                });

                const bodyHistory = {
                    name: courseInfo.courseName,
                    course: {
                        id: idCourse,
                    },
                    method: "GET",
                };
                await generateApiService.post(
                    ActivityHistoriesApi.postHistories(),
                    bodyHistory
                );
            }
        } catch (error) {

            setState({loading: false});
        }
    };
    const uploadFile = async (nameFile: any) => {
        try {
            setState({
                loadingFile: true,
                modalVisible: true,
            });
            const data = new FormData();
            data.append("file", {
                ...state.getFile,
                uri:
                    Platform.OS === "android"
                        ? state.getFile.uri
                        : state.getFile.uri.replace("file://", ""),
                name: state.getFile.name,
                type: state.getFile.mimeType, // it may be necessary in Android.
            });
            let res = await generateApiService.postImage(
                UploadFileApi.UploadFile(),
                data
            );

            const fileUrl = await res;
            const fileCourse = {
                fileOfCoursePath: fileUrl,
                fileOfCourseName: nameFile,
                course: {
                    id: idCourse,
                },
            };
            await generateApiService
                .post(CourseApi.postFileOfCourse(), fileCourse)
                .then((response) => {
                    const newAttachment = state.attachments;
                    newAttachment[state.attachments.length] = response;
                    setState({
                        attachments: newAttachment,
                        modalVisible: false,
                        loadingFile: false,
                    });
                });
            setType("success");
            setModalVisibleNoti(true);
        } catch (error) {
            setType("error");
            setModalVisibleNoti(true);
        }
    };

    const chooseFile = (result: any) => {
        setState({
            getFile: result,
            modalVisible: true,
            modalType: "confirm",
        });
    };
    const deleteAttachments = (attachments: any, index: number) => {
        setState({
            fileChoose: {attachments, index},
            modalType: "delete",
            modalVisible: true,
        });
    };
    const deleteLesson = (lesson: any, index: number) => {
        setState({
            fileChoose: {lesson, index},
            modalType: "deleteLesson",
            modalVisible: true,
        });
    };
    const deleteExams = (exams: any, index: number) => {
        setState({
            fileChoose: {exams, index},
            modalType: "deleteExams",
            modalVisible: true,
        });
    };
    const confirmDelete = async (id: any, index: number) => {
        try {
            if (state.modalType === "delete") {
                await generateApiService.delete(CourseApi.deleteFileOfCourse(id));
                const newAttachment = state.attachments;
                newAttachment.splice(index, 1);
                setState({attachments: newAttachment, modalVisible: false});
                setType("success");
                setModalVisibleNoti(true);
            } else if (state.modalType === "deleteLesson") {
                await generateApiService.delete(LessonApi.deleteLesson(id));
                const newLesson = state.lesson;
                newLesson.splice(index, 1);
                setState({lesson: newLesson, modalVisible: false});
                setType("success");
                setModalVisibleNoti(true);
            } else if (state.modalType === "deleteExams") {
                await generateApiService.delete(ExamsApi.deleteExams(id));
                const newExams = state.test.filter((exam: any) => exam.id != id);
                setState({test: newExams, modalVisible: false});
                setType("success");
                setModalVisibleNoti(true);
            }
        } catch (error) {
            setType("error");
            setModalVisibleNoti(true);
        }
    };

    const setModalVisible = async (value: any) => {
        await setState({modalVisible: value});
    };

    useEffect(() => {
        if (newLesson) {
            var index = state.lesson.findIndex(
                (pLesson: any) => pLesson.id == newLesson.id
            );

            if (index >= 0) {
                let newDataLesson = [...state.lesson];
                newDataLesson[index] = newLesson;
                setState({lesson: newDataLesson});
            } else {
                setState({lesson: [...state.lesson, newLesson]});
            }
        }
        if (newExams) {
            var index = state.test.findIndex((pTest: any) => pTest.id == newExams.id);
            if (index >= 0) {
                let newDataExams = [...state.test];
                newDataExams[index] = newExams;
                setState({test: newDataExams});
            } else {
                setState({test: [...state.test, newExams]});
            }
        }
    }, [newLesson, newExams]);

    const goBackCourseScreen = () => {
        //@ts-ignore        
        if(props.route.params.backToHome) {
          navigation.goBack()
        } else {
        navigation.navigate("/goc-hoc-tap", {
            newCourse: idCourse,
        });
    }
    };
    useEffect(() => {
        getData();
    }, [newDelete ,idCourse]);
    return (
        <Box bg="defaultBackground" position="relative" height="100%">
            <Box height="100%" mt={2}>
                <Header title="Chi Tiết Khóa Học" search leftButton="back"   leftButtonClick={goBackCourseScreen} >
                    <NotificationIcon/>
                </Header>
                <Box height={1} bg="#636363" opacity={0.3} mt={2}/>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => {
                                getData();
                            }}
                        />
                    }
                >
                    <Flex flex={1} px={2}>
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
                                    mt={17}
                                    style={{textTransform: "uppercase"}}
                                >
                                    {state.dataCourse.courseName}
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Box alignItems="center">
                        {/* <Box
                            width="95%"
                            backgroundColor="#FFF9F9"
                            borderRadius={10}
                            borderWidth={1}
                            borderColor="rgba(125, 125, 125, 0.3)"
                            mt={2}
                        >
                            <Box flexDirection="row" ml={3} mt={2}>
                                <Box>
                                    <Icon name="NotificationCourse" size={20} color="#00A8B5"/>
                                </Box>
                                <Box flexDirection="column" flex={1}>
                                    <Text fontWeight={500} fontSize={16} color="#1C7988" ml={2}>
                                        Thông báo chung
                                    </Text>
                                    <Text color="#636363" padding={2} fontSize={12}>
                                        {state.dataCourse?.courseNotification}
                                    </Text>
                                </Box>
                            </Box>
                        </Box> */}
                        <Box
                            width="95%"
                            borderRadius={10}
                            borderWidth={1}
                            borderColor="rgba(125, 125, 125, 0.3)"
                            mt={2}
                        >
                            <Box flexDirection="row" padding={3}>
                                <Icon name="AttachmentsCourse" size={20} color="white"/>
                                <Text fontSize={16} color="#1C7988" ml={1}>
                                    File đính kèm
                                </Text>
                            </Box>
                            <Box ml={2} mb={2} width={140}>
                                <CardAttachmentsUpload
                                    title="Tải lên tài liệu"
                                    chooseFile={chooseFile}
                                />
                            </Box>
                            {state.loading ? (
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
                            {(state.attachments ? state.attachments : []).map(
                                (attachments: any, idx: number) => {
                                    let swipeoutBtns = [
                                        {
                                            component: (
                                                <Box height={40} mr={2} mt={1}>
                                                    <TouchableOpacity
                                                        onPress={() => deleteAttachments(attachments, idx)}
                                                        style={{
                                                            flex: 1,
                                                            backgroundColor: "red",
                                                            width: "100%",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            borderRadius: 8,
                                                        }}
                                                    >
                                                        <Text color="white" fontSize={14} fontWeight="bold">
                                                            Xóa
                                                        </Text>
                                                    </TouchableOpacity>
                                                </Box>
                                            ),
                                            backgroundColor: "white",
                                            disabled: true,
                                        },
                                    ];
                                    let checkFile = attachments.fileOfCoursePath.split(".").pop();
                                    return (
                                        //@ts-ignore
                                        <Swipeout right={swipeoutBtns} backgroundColor={"white"}>
                                            <TouchableOpacity
                                                key={attachments.id}
                                                onPress={() =>
                                                    Linking.openURL(attachments.fileOfCoursePath)
                                                }
                                                onLongPress={() => deleteAttachments(attachments, idx)}
                                            >
                                                <Box alignItems="center" mb={1}>
                                                    <CardAttachments
                                                        key={attachments.id}
                                                        title={attachments.fileOfCourseName}
                                                        checkFile={checkFile}
                                                        delete={() => {
                                                            deleteAttachments(attachments, idx);
                                                        }}
                                                    />
                                                </Box>
                                            </TouchableOpacity>
                                        </Swipeout>
                                    );
                                }
                            )}
                        </Box>
                        <Box
                            width="95%"
                            borderRadius={10}
                            borderWidth={1}
                            borderColor="rgba(125, 125, 125, 0.3)"
                            mt={2}
                        >
                            <Box flexDirection="row" padding={3}>
                                <Icon name="lesson" size={20} color="white"/>
                                <Text fontSize={16} color="#1C7988" ml={1}>
                                    Bài giảng
                                </Text>
                            </Box>
                            {/* <Box flexDirection="row" ml={2} mb={2}>
                <NavLink
                  {...{
                    route: "/tao-bai-giang",
                    params: {
                      id_course: idCourse,
                      title: state.dataCourse.courseName,
                    },
                  }}
                >
                  <Icon name="UploadLesson" />
                </NavLink>
              </Box> */}
                            {state.loading ? (
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
                            {state.lesson.map((lesson: any, idx: number) => {

                                let swipeoutBtns = [
                                    {
                                        component: (
                                            <Box height={40} mr={2} mt={1}>
                                                <TouchableOpacity
                                                    onPress={() => deleteLesson(lesson, idx)}
                                                    style={{
                                                        flex: 1,
                                                        backgroundColor: "red",
                                                        width: "100%",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        borderRadius: 8,
                                                    }}
                                                >
                                                    <Text color="white" fontSize={14} fontWeight="bold">
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
                                    <Swipeout right={swipeoutBtns} backgroundColor={"white"}>
                                        <TouchableOpacity
                                            onLongPress={() => deleteLesson(lesson, idx)}
                                            onPress={() => {
                                                navigation.navigate("/chi-tiet-bai-giang", {
                                                    id: lesson.id,
                                                    data: lesson,
                                                    title: state.dataCourse.courseName,
                                                    idCourse: idCourse,
                                                });
                                            }}
                                        >
                                            <Box alignItems="center" mb={1}>
                                                <CardLesson title={lesson.lesson_name}/>
                                            </Box>
                                        </TouchableOpacity>
                                    </Swipeout>
                                );
                            })}
                        </Box>
                        <Box
                            width="95%"
                            borderRadius={10}
                            borderWidth={1}
                            borderColor="rgba(125, 125, 125, 0.3)"
                            mt={2}
                        >
                            <Box flexDirection="row" padding={3}>
                                <Icon name="testCourse"/>
                                <Text fontSize={16} color="#1C7988" ml={1}>
                                    Bài thi
                                </Text>
                            </Box>
                            {/* <Box flexDirection="row" ml={2} mb={2}>
                <NavLink
                  {...{
                    route: "/tao-bai-thi-tu-luan",
                    params: {
                      id_course: idCourse,
                      titleCourse: state.dataCourse.courseName,
                    },
                  }}
                >
                  <Icon name="UploadTest" color="white"></Icon>
                </NavLink>
                <Box ml={2}>
                  <NavLink
                    {...{
                      route: "/tao-bai-thi-trac-nghiem",
                      params: {
                        id_course: idCourse,
                        titleCourse: state.dataCourse.courseName,
                      },
                    }}
                  >
                    <Icon name="UploadEssay"></Icon>
                  </NavLink>
                </Box>
              </Box> */}
                            {state.loading ? (
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
                            {state.test?.map((test: any, idx: number) => {
                                let swipeoutBtns = [
                                    {
                                        component: (
                                            <Box height={40} mr={2} mt={1}>
                                                <TouchableOpacity
                                                    onPress={() => deleteExams(test, idx)}
                                                    style={{
                                                        flex: 1,
                                                        backgroundColor: "red",
                                                        width: "100%",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        borderRadius: 8,
                                                    }}
                                                >
                                                    <Text color="white" fontSize={14} fontWeight="bold">
                                                        Xóa
                                                    </Text>
                                                </TouchableOpacity>
                                            </Box>
                                        ),
                                        backgroundColor: "white",
                                        disabled: true,
                                    },
                                ];
                                return test.typeOfExams.id == 1 ? (
                                    //@ts-ignore
                                    <Swipeout right={swipeoutBtns} backgroundColor={"white"}>
                                        <TouchableOpacity
                                            onLongPress={() => deleteExams(test, idx)}
                                            onPress={() =>
                                                navigation.navigate("/tao-bai-thi-trac-nghiem", {
                                                    id: test.id,
                                                    titleCourse: state.dataCourse.courseName,
                                                    data: test,
                                                    edit: true,
                                                    id_course: idCourse,
                                                })
                                            }
                                        >
                                            <Box alignItems="center" mb={1}>
                                                <CardLesson title={test.examName} delete={() => {
                                                    deleteExams(test, idx)
                                                }}/>
                                            </Box>
                                        </TouchableOpacity>
                                    </Swipeout>
                                ) : (
                                    //@ts-ignore
                                    <Swipeout right={swipeoutBtns} backgroundColor={"white"}>
                                        <TouchableOpacity
                                            onLongPress={() => deleteExams(test, idx)}
                                            onPress={() =>
                                                navigation.navigate("/tao-bai-thi-tu-luan", {
                                                    id: test.id,
                                                    titleCourse: state.dataCourse.courseName,
                                                    data: test,
                                                    edit: true,
                                                    id_course: idCourse,
                                                })
                                            }
                                        >
                                            <Box alignItems="center" mb={1}>
                                                <CardLesson title={test.examName} delete={() => {
                                                    deleteExams(test, idx)
                                                }}/>
                                            </Box>
                                        </TouchableOpacity>
                                    </Swipeout>
                                );
                            })}
                        </Box>
                    </Box>
                    <Box height={40}/>
                </ScrollView>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={state.modalVisible}
                >
                    {state.loadingFile == true ? (
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
                    ) : state.modalType === "confirm" ? (
                        <ModalConfirm
                            getFile={state.getFile}
                            setModalVisible={setModalVisible}
                            uploadFile={uploadFile}
                            uploadType="upload"
                        ></ModalConfirm>
                    ) : (
                        <ModalDelete
                            getFile={state.fileChoose}
                            confirmDelete={confirmDelete}
                            setModalVisible={setModalVisible}
                            modalType={state.modalType}
                        ></ModalDelete>
                    )}
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
                        title={
                            state.modalType === "confirm"
                                ? "Đăng file"
                                : state.modalType === "delete"
                                    ? "Xóa file"
                                    : "Xóa bài"
                        }
                        type={type}
                        isOpen={modalVisibleNoti}
                        setIsOpen={setModalVisibleNoti}
                    />
                    {/* <PopupNotification
            title={
              state.modalType === "confirm"
                ? "Đăng file"
                : state.modalType === "delete"
                ? "Xóa file"
                : "Xóa bài"
            }
            type={type}
            setModalVisible={setModalVisibleNoti}
          ></PopupNotification> */}
                </Modal>
            </Box>
        </Box>
    );
};
export default CourseDetailsTeacher;
