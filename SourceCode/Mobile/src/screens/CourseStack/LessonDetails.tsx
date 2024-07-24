import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Linking,
  Modal,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RenderHtml from "react-native-render-html";
import { CardAttachments } from "../../components/CardAttachments";
import { Header, NotificationIcon } from "../../components/Header";
import PopupCloseAutomatically from "../../components/PopupCloseAutomatically";
import { Icon } from "../../components/svg-icon";
import { useAppSelector } from "../../hooks/ReduxHook";
import { Box, Flex, Text, TextInput } from "../../rebass";
import { generateApiService } from "../../services/ApiService";
import { ActivityHistoriesApi } from "../../services/api/ActivityHistories/ActivityHistoriesApi";
import { LessonApi } from "../../services/api/Lesson/LessonApi";
import { ModalDelete } from "./components/ModalDelete";
import { Keyboard } from "react-native";
import { ResizeMode, Video } from "expo-av";
import PopupChat from "./components/PopupChat";
const { width } = Dimensions.get("screen");
const LessonDetails = (props: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState<string>("");
  const user = useAppSelector((state) => state.users.userList[0]);
  const dataUser = useAppSelector((state) => state.users.profile)
  const role = user.role;
  const dataLesson = props.route.params.data;
  const fileLesson = dataLesson.filesOfLessons
    ? dataLesson.filesOfLessons.filter((file: any) => file.type === "OTHER")
    : null;
  const fileVideoLesson = dataLesson.filesOfLessons
    ? dataLesson.filesOfLessons.filter((file: any) => file.type === "VIDEO")
    : null;
  const [idSubmit, setIdSubmit] = useState<any>();
  const title = props.route.params.title;
  const [lesson, setLesson] = useState<any>();
  const [titleMessage, setTitleMessage] = useState("Gửi phần trăm");
  const [percent, setPercent] = useState<any>("");
  const [filesOfLessons, setFilesOfLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [newPercent, setNewPercent] = useState<any>(0);
  const [oldPercent, setOldPercent] = useState<any>();
  const [ModalConfirm, setModalConfirm] = useState<boolean>(false);
  const navigation = useNavigation();
  const getData = async () => {
    if (role == "0") {
      const newData = await generateApiService.get(
        LessonApi.getPercentOfLesson(props.route?.params?.id)
      );
      const data = await generateApiService.get(
        LessonApi.getLesson(props.route.params.id)
      );
      setLesson(data);
      if (newData) {
        setPercent(newData.content[0].percent);
        setIdSubmit(newData.content[0].id);
      }
    } else {
      const data = await generateApiService.get(
        LessonApi.getLesson(props.route.params.id)
      );
      if (data) {
        setLesson(data);
        const bodyHistory = {
          name: data.lesson_name,
          lesson: {
            id: props.route.params.id,
          },
          method: "GET",
        };
        await generateApiService.post(
          ActivityHistoriesApi.postHistories(),
          bodyHistory
        );
        setFilesOfLessons(data.filesOfLessons);
        setLoading(false);
      }
    }
  };
  const submit = async () => {
    setLoadingSubmit(true);
    setTitleMessage("Gửi phần trăm");
    try {
      const dataSubmit = {
        id: idSubmit,
        percent: +percent,
        isDone: 0,
        lesson: {
          id: props.route.params.id,
        },
        student: {
          id: dataUser.id,
        },
      };

      let dataCourse = await generateApiService.put(
        LessonApi.submitPercentOfLesson(idSubmit),
        dataSubmit
      );
      if (dataCourse == 400) {
        setType("warning");
        setModalVisible(true);
      } else {
        setNewPercent(percent);
        setType("success");
        setModalVisible(true);
      }
      setLoadingSubmit(false);
    } catch (error) {
      setType("error");
      setModalVisible(true);
      setLoadingSubmit(false);
    }
  };

  const confirmDelete = async () => {
    setTitleMessage("Xoá bài giảng");
    try {
      await generateApiService.delete(
        LessonApi.deleteLesson(props.route?.params.id)
      );
      setModalConfirm(false);
      setType("success");
      setModalVisible(true);
      console.log("delete", props.route?.params.id);
      navigation.navigate("/chi-tiet-khoa-hoc-gv", {
        id_course: props?.route?.params?.idCourse,
        newDelete: props?.route?.params?.id,
      });
    } catch (error) {
      setModalConfirm(false);
      setType("error");
      setModalVisible(true);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const goBackCourseDetails = () => {
    if (role == "0") {
      navigation.navigate("/chi-tiet-khoa-hoc", {
        newPercent: newPercent ? newPercent - oldPercent : 0,
      });
    } else {
      navigation.goBack();
    }
  };

  return (
    <Box style={{ flex: 1 }}>
      <Box bg="defaultBackground" position="relative" height="100%">
        <Box height="100%" mt={2}>
          <Header
            title="Chi tiết bài giảng"
            search
            leftButton="back"
            leftButtonClick={goBackCourseDetails}
          >
            <NotificationIcon />
          </Header>
          <Box height={1} bg="#636363" opacity={0.3} mt={2} />
          <KeyboardAwareScrollView
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={() => {
                  getData();
                }}
              ></RefreshControl>
            }
            keyboardShouldPersistTaps={true}
            keyboardDismissMode="on-drag"
            extraHeight={170}
          >
            <Flex flex={1} px={2}>
              <Flex
                flexDirection="row"
                alignItems="flex-start"
                justifyContent="center"
              >
                <Flex flex={1}>
                  <Text
                    color="textColor"
                    fontWeight="bold"
                    fontSize={17}
                    mt={17}
                    style={{ textTransform: "uppercase" }}
                  >
                    {title}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            <Box alignItems="center">
              <Box
                width="95%"
                borderRadius={10}
                borderWidth={1}
                borderColor="rgba(125, 125, 125, 0.3)"
                mt={2}
              >
                <Text
                  fontWeight={500}
                  fontSize={16}
                  color="#00A8B5"
                  padding={2}
                >
                  {lesson?.lesson_name}
                </Text>
              </Box>
              <Box
                width="95%"
                backgroundColor="#FFF9F9"
                borderRadius={10}
                borderWidth={1}
                borderColor="rgba(125, 125, 125, 0.3)"
                mt={2}
              >
                <Box flexDirection="row" m={3}>
                  <Icon name="NotificationCourse" size={20} color="#00A8B5" />
                  <Flex flexDirection="column" ml={2}>
                    <Text fontWeight={500} fontSize={16} color="#1C7988">
                      Thông báo chung
                    </Text>
                    <Text color="#636363" pt={2} pr={4} fontSize={12}>
                      {lesson?.lesson_notification}
                    </Text>
                  </Flex>
                </Box>
              </Box>
              {lesson && lesson.lesson_content?.length > 0 ? (
                <Box
                  mt={2}
                  borderRadius={10}
                  borderWidth={1}
                  borderColor="rgba(125, 125, 125, 0.3)"
                  width="95%"
                  minHeight={200}
                >
                  <Box padding={2}>
                    <RenderHtml
                      contentWidth={width * 0.95}
                      source={{
                        html: lesson.lesson_content,
                      }}
                    />
                    {fileVideoLesson?.length > 0 && (
                      <Box>
                        <Text style={{ fontSize: 18, fontWeight: "700" }}>
                          Video bài giảng
                        </Text>
                        {fileVideoLesson.map((item: any) => {
                          return (
                            <Box>
                            <Video
                              style={{
                                alignSelf: "center",
                                width: "100%",
                                height: 200,
                                borderTopLeftRadius: 8,
                                borderTopRightRadius: 8,
                                marginTop : 20
                              }}
                              source={{
                                uri: item.files_path,
                              }}
                              resizeMode={ResizeMode.CONTAIN}
                              isLooping
                              useNativeControls
                            />
                            <Text style={{
                              fontSize : 15,
                              marginTop : 10,
                              fontWeight : '500'
                            }}
                            numberOfLines={1}
                            >
                              {item.files_name}
                            </Text>
                          </Box>);
                        })}
                      </Box>
                    )}
                  </Box>
                </Box>
              ) : null}
              {fileLesson && (
                <Box
                  width="95%"
                  borderRadius={10}
                  borderWidth={1}
                  borderColor="rgba(125, 125, 125, 0.3)"
                  mt={2}
                >
                  <Box flexDirection="row" padding={3}>
                    <Icon name="AttachmentsCourse" size={20} color="white" />
                    <Text fontSize={16} color="#1C7988" ml={1}>
                      Tệp bài giảng
                    </Text>
                  </Box>
                  {fileLesson.map((file: any) => {
                    return (
                      <TouchableOpacity
                        onPress={() => Linking.openURL(file.files_path)}
                      >
                        <Box alignItems="center" mb={1}>
                          <CardAttachments
                            title={file.files_name}
                            checkFile={file.files_name?.split(".").pop()}
                          />
                        </Box>
                      </TouchableOpacity>
                    );
                  })}
                </Box>
              )}
              <PopupChat file={fileLesson[0]}></PopupChat>
              {role == "0" ? (
                <Box
                  mt={2}
                  borderRadius={10}
                  borderWidth={1}
                  borderColor="rgba(125, 125, 125, 0.3)"
                  width="95%"
                  minHeight={50}
                  flexDirection="row"
                  justifyContent="space-between"
                >
                  <Box
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text fontSize={16} color="seen" ml={2} fontWeight="bold">
                      Mức độ hiểu bài :{" "}
                    </Text>
                    <Box>
                      <Box position={"relative"}>
                        <TextInput
                          keyboardType="numeric"
                          color="red"
                          fontSize={20}
                          value={percent.toString()}
                          placeholderTextColor={"red"}
                          width={35}
                          placeholder=""
                          maxLength={3}
                          onFocus={() => {
                            setPercent("");
                          }}
                          onChangeText={(value: any) => {
                            if (value > 100) {
                              setPercent(100);
                              return;
                            }
                            if (value && !isNaN(value)) {
                              setPercent(+value);
                            } else {
                              setPercent("");
                            }
                          }}
                        ></TextInput>
                        <Box
                          position={"absolute"}
                          bottom={-3}
                          left={0}
                          height={1}
                          width={35}
                          bg="#636363"
                          opacity={0.3}
                        ></Box>
                      </Box>
                    </Box>
                    <Text fontSize={20} color="seen" ml={1} fontWeight="bold">
                      /100
                    </Text>
                  </Box>
                  <TouchableOpacity
                    onPress={() => {
                      Keyboard.dismiss();
                      setTimeout(() => {
                        submit();
                      }, 500);
                    }}
                    style={{ right: 0 }}
                  >
                    <Box
                      bg="buttonColor"
                      alignItems="center"
                      justifyContent="center"
                      height={40}
                      width={80}
                      borderRadius={8}
                      mt={1}
                      mr={2}
                      style={{ flexDirection: "row" }}
                    >
                      <Text color="white">Submit</Text>
                      {/* {loadingSubmit && (
                        <ActivityIndicator
                          style={{ marginLeft: 5 }}
                          size={"small"}
                        ></ActivityIndicator>
                      )} */}
                    </Box>
                  </TouchableOpacity>
                </Box>
              ) : (
                <Box flexDirection="row">
                  <TouchableOpacity
                    onPress={() => {
                      setModalConfirm(true);
                    }}
                  >
                    <Box
                      borderRadius={5}
                      borderWidth={1}
                      borderColor="deleteColor"
                      mt={2}
                      mr={2}
                      width={width * 0.4}
                      alignItems="center"
                      backgroundColor="rgba(99, 99, 99, 0.1)"
                    >
                      <Text style={{ padding: 10 }} color="deleteColor">
                        Xoá
                      </Text>
                    </Box>
                  </TouchableOpacity>
                </Box>
              )}
            </Box>
            <Box height={50} />
          </KeyboardAwareScrollView>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <PopupCloseAutomatically
              title={titleMessage}
              type={type}
              isOpen={modalVisible}
              setIsOpen={(value: boolean) => {
                setModalVisible(value);
              }}
            />
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={ModalConfirm}
          >
            <ModalDelete
              confirmDelete={confirmDelete}
              setModalVisible={setModalConfirm}
              modalType={"deleteLesson"}
              getFile={"check getFile"}
            ></ModalDelete>
          </Modal>
        </Box>
      </Box>
    </Box>
  );
};
export default LessonDetails;
