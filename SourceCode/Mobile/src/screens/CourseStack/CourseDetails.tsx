import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { CardAttachments } from "../../components/CardAttachments";
import { CardLesson } from "../../components/CardLesson";
import { Header, NotificationIcon } from "../../components/Header";
import { ListMemberCourse } from "../../components/ListMemberCourse";
import { Icon } from "../../components/svg-icon";
import { NavLink } from "../../platform/links";
import { Box, Flex, Text } from "../../rebass";
import { generateApiService } from "../../services/ApiService";
import { ActivityHistoriesApi } from "../../services/api/ActivityHistories/ActivityHistoriesApi";
import { CourseApi } from "../../services/api/Course/CourseApi";
import { UploadFileApi } from "../../services/api/UploadFile/UploadFileApi";
import { ModalConfirm } from "./components/ModalConfirm";
import { ModalDelete } from "./components/ModalDelete";
import PopupCloseAutomatically from "../../components/PopupCloseAutomatically";

const CourseDetails = (props: { id?: string; data?: any }) => {
  const route: {
    params?: { id_course?: number };
  } = useRoute();
  //@ts-ignore
  const idCourse = props.route.params.id_course;
  const navigation = useNavigation();
  const [state, _setState] = useState<any>({
    dataCourse: [],
    attachments: [],
    lesson: [],
    loading: false,
    fileChoose: null,
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
      setState({ loading: false });
    }
  };
  const uploadFile = async (nameFile: any) => {
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
    // setLoading(true);
    // setModalVisible(true);
    const fileUrl = await res;
    const fileCourse = {
      fileOfCoursePath: fileUrl,
      fileOfCourseName: nameFile,
      course: {
        id: idCourse,
      },
    };
    let updateCourse = await generateApiService.post(
      CourseApi.postFileOfCourse(),
      fileCourse
    );

    const newAttachment = state.attachments;
    // newAttachment[state.attachments.length] = response;
    setState({
      attachments: newAttachment,
      modalVisible: false,
      loading: false,
    });
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
      fileChoose: { attachments, index },
      modalType: "delete",
      modalVisible: true,
    });
  };

  const confirmDelete = async (id: any, index: number) => {
    const newAttachment = state.attachments;
    newAttachment.splice(index, 1);
    setState({ attachments: newAttachment });
    let deleteApi = await generateApiService
      .delete(CourseApi.deleteFileOfCourse(id))
      .then((response) => {});
  };
  const setModalVisible = (value: any) => {
    setState({ modalVisible: value });
  };
  useEffect(() => {
    getData();
  }, []);

  const goBackCourseScreen = () => {
    //@ts-ignore
    if (props.route.params.backToHome) {
      navigation.goBack();
    } else {
      navigation.navigate("/goc-hoc-tap", {
        newCourse: idCourse,
      });
    }
  };
  return (
    <Box bg="defaultBackground" position="relative" height="100%">
      <Box height="100%" mt={2}>
        <Header
          title="Chi Tiết Khóa Học"
          search
          leftButton="back"
          leftButtonClick={goBackCourseScreen}
        >
          <NotificationIcon />
        </Header>
        <Box height={1} bg="#636363" opacity={0.3} mt={2} />
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
                  style={{ textTransform: "uppercase" }}
                >
                  {state?.dataCourse?.courseName}
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
                <Icon name="AttachmentsCourse" size={20} color="#00A8B5" />
                <Text fontSize={16} color="#1C7988" ml={1}>
                  File đính kèm
                </Text>
              </Box>
              {(state.attachments ?? []).map(
                (attachments: any, idx: number) => {
                  let checkFile = attachments.fileOfCoursePath.split(".").pop();
                  return (
                    <TouchableOpacity
                      key={attachments.id}
                      onPress={() =>
                        Linking.openURL(attachments.fileOfCoursePath)
                      }
                    >
                      <Box alignItems="center" mb={1}>
                        <CardAttachments
                          key={attachments.id}
                          title={attachments.fileOfCourseName}
                          checkFile={checkFile}
                        />
                      </Box>
                    </TouchableOpacity>
                  );
                }
              )}
              {state.loading ? (
                <Box
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                  mb={1}
                >
                  <ActivityIndicator size="large" color="#00A8B5" />
                </Box>
              ) : null}
            </Box>
            <Box
              width="95%"
              borderRadius={10}
              borderWidth={1}
              borderColor="rgba(125, 125, 125, 0.3)"
              mt={2}
            >
              <Box flexDirection="row" padding={3}>
                <Icon name="lesson" size={20} color="white" />
                <Text fontSize={16} color="#1C7988" ml={1}>
                  Bài giảng
                </Text>
              </Box>
              {state.lesson.map((lesson: any, idx: number) => {
                return (
                  <NavLink
                    key={idx}
                    {...{
                      route: "/chi-tiet-bai-giang",
                      params: {
                        id: lesson.id,
                        data: lesson,
                        title: state?.dataCourse?.courseName,
                        idCourse: idCourse,
                      },
                    }}
                  >
                    <Box alignItems="center" mb={1}>
                      <CardLesson title={lesson.lesson_name} />
                    </Box>
                  </NavLink>
                );
              })}
              {state.loading ? (
                <Box
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                  mb={1}
                >
                  <ActivityIndicator size="large" color="#00A8B5" />
                </Box>
              ) : null}
            </Box>
            <Box
              width="95%"
              borderRadius={10}
              borderWidth={1}
              borderColor="rgba(125, 125, 125, 0.3)"
              mt={2}
            >
              <Box flexDirection="row" padding={3} alignItems={"center"}>
                <Icon name="testCourse" />
                <Text fontSize={16} color="#1C7988" ml={1}>
                  Bài thi
                </Text>
              </Box>

              {state.test?.map((test: any, idx: number) => (
                // test.typeOfExams.id == 1 ? (
                <NavLink
                  key={idx}
                  {...{
                    route: "/thong-tin-bai-thi",
                    params: {
                      id_course: state.dataCourse.id,
                      id: test.id,
                      title: state.dataCourse.courseName,
                    },
                  }}
                >
                  <Box alignItems="center" mb={1}>
                    <CardLesson title={test.examName} />
                  </Box>
                </NavLink>
              ))}
              {state.loading ? (
                <Box
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                  mb={1}
                >
                  <ActivityIndicator size="large" color="#00A8B5" />
                </Box>
              ) : null}
            </Box>
            <Box
              width="95%"
              borderRadius={10}
              borderWidth={1}
              borderColor="rgba(125, 125, 125, 0.3)"
              mt={2}
            >
              <Box
                mb={11}
                flexDirection="row"
                padding={3}
                backgroundColor={"#00A8B5"}
                borderTopLeftRadius={10}
                borderTopRightRadius={10}
              >
                <Icon name="Member" size={20} color="white" />
                <Text fontSize={16} color="white" ml={1}>
                  Thành viên khóa học:{" "}
                  {+state.dataCourse?.courseTotalStudent + 1 || ""}
                </Text>
              </Box>
              <ListMemberCourse
                title={"Giảng viên"}
                children={[
                  {
                    name: state.lecturer?.lecturer_fullname,
                    avatar: state.lecturer?.lecturer_avatar,
                  },
                ]}
              ></ListMemberCourse>
              <Box height={10}></Box>
              <ListMemberCourse
                title={"Sinh viên"}
                children={state?.members?.map((itemMember: any) => {
                  return {
                    name: itemMember?.student_fullname,
                    avatar: itemMember?.student_avatar,
                  };
                })}
              />

              <Box height={10}></Box>
            </Box>
          </Box>
          <Box height={30} />
        </ScrollView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={state.modalVisible}
        >
          {state.loading === true ? (
            <Box
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 22,
              }}
            >
              <ActivityIndicator size="large" color="#00A8B5" />
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
              setModalVisible={setModalVisible}
              confirmDelete={confirmDelete}
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
            title="Đăng file"
            type={type}
            isOpen={modalVisibleNoti}
            setIsOpen={setModalVisibleNoti}
          />
          {/* <PopupNotification
            title="Đăng file"
            type={type}
            setModalVisible={setModalVisibleNoti}
          ></PopupNotification> */}
        </Modal>
      </Box>
    </Box>
  );
};
export default CourseDetails;
