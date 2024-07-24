import { FastImage } from "components-base";
import { useEffect, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  TouchableOpacity
} from "react-native";
import RenderHtml from "react-native-render-html";
import { Devider } from "../../components/Devider";
import { Header, NotificationIcon } from "../../components/Header";
import PopupCloseAutomatically from "../../components/PopupCloseAutomatically";
import { Icon } from "../../components/svg-icon";
import { Box, Flex, Text, TextInput } from "../../rebass";
import { generateApiService } from "../../services/ApiService";
import { ExamsApi } from "../../services/api//Exams/ExamsApi";
import { StudentApi } from "../../services/api//Student/StudentApi";
const { width, height } = Dimensions.get("screen");
const EssayDetail = (props : any) => {
  const [listExams, setListExams] = useState([]);
  const [exams, setExams] = useState<any>();
  const [textPress, setTextPress] = useState(0);
  const [point, setPoint] = useState<any>(0);
  const [comment, setComment] = useState<string>();
  const [modalVisible, setModalVisible] = useState(false);
  const [listStudent, setListStudent] = useState<any>([]);
  const { id_exam, id_course, id_student } = props.route.params;
  const [modalVisibleNoti, setModalVisibleNoti] = useState(false);
  const [type, setType] = useState<string>("");
  const onGetExams = async () => {
    try {
      const response = await generateApiService.get(
        ExamsApi.getExamSubmit(id_exam)
      );
      if (response) {
        const dataExams = await generateApiService.get(
          ExamsApi.getAllExamStudentInCourse(id_course, response.student.id)
        );
        setListExams(dataExams.content);
      }
      if (response) {
        setExams(response);
      }
    } catch (err) {
      try {
        onGetExamsById(id_student);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onGetExamsById = async (id : any, id_exams?: any) => {
    try {
      setModalVisible(false);
      let response;
      if (id_exams) {
        response = await generateApiService.get(
          ExamsApi.getExamStudentById(id_exams, id)
        );
      } else {
        response = await generateApiService.get(
          ExamsApi.getExamStudentById(props.route.params.id_exam, id)
        );
      }
      if (response) {
        const dataExams = await generateApiService.get(
          ExamsApi.getAllExamStudentInCourse(
            props.route.params.id_course,
            response.student.id
          )
        );
        setListExams(dataExams.content);
      }
      if (response) {
        setExams(response);
        if (response.examsHistoryPoint) {
          setPoint(response.examsHistoryPoint);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getStudentList = async () => {
    const StudentList = await generateApiService.get(
      StudentApi.getStudentOfCourse(props.route.params.id_exam)
    );
    if (StudentList) {
      setListStudent(StudentList.content);
    }
  };
  useEffect(() => {
    getStudentList();
    if (id_student) {
      onGetExamsById(id_student);
    } else {
      onGetExams();
    }
  }, []);

  const submit = async () => {
    try {
      let dataEssayTest = {
        id: exams?.id,
        examsHistoryTeacherComment: null,
        examsHistoryAnswer: exams?.examsHistoryAnswer,
        examsHistoryPoint: point,
        examsHistorySubmissionTime: exams?.examsHistorySubmissionTime,
        examsHistoryStatus: exams?.examsHistoryStatus,
        examsHistoryFileAnswer: exams?.examsHistoryFileAnswer,
        exams: {
          id: exams?.exams?.id,
        },
        student: {
          id: exams?.student?.id,
        },
      };

      console.log("dataEssayTest" ,dataEssayTest);
      
      const response = await generateApiService.put(
        ExamsApi.putSubmit(exams.id),
        dataEssayTest
      );
      onGetExams();
      setType("success");
      setModalVisibleNoti(true);
    } catch (error) {
      setType("error");
      setModalVisibleNoti(true);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={"padding"}
      keyboardVerticalOffset={Platform.OS === "ios" ? textPress : 0}
      enabled={Platform.OS === "ios"}
    >
      <Box bg="defaultBackground" position="relative" height="100%">
        <Box height="100%" mt={2} justifyContent="center">
          <Header title="Chi tiết bài thi" search leftButton="back">
            <NotificationIcon />
          </Header>
          <Box height={1} bg="#636363" opacity={0.3} mt={2} />
          <ScrollView showsVerticalScrollIndicator={false}>
            <Flex flex={1} px={2}>
              <Devider></Devider>
              <Flex
                flexDirection="row"
                alignItems="flex-start"
                justifyContent="center"
              >
                <Flex flex={1}>
                  <Text
                    color="textColor"
                    fontWeight="bold"
                    fontSize={20}
                    style={{ textTransform: "uppercase" }}
                  >
                    HỌC VIÊN : {exams ? exams.student.student_fullname : null}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            <Text fontSize={20} color="#32813D" ml={2} mt={2}>
              ĐỀ BÀI
            </Text>
            {exams ? (
              exams.exams.questions[0].questionsFile ? (
                <Box
                  width={width * 0.95}
                  borderRadius={10}
                  borderWidth={1}
                  borderColor="rgba(125, 125, 125, 0.3)"
                  style={{ position: "relative" }}
                  flexDirection="row"
                  // justifyContent="space-between"
                  alignItems="center"
                  height={50}
                  ml={2}
                  mt={2}
                >
                  <Box
                    alignItems="center"
                    flexDirection="row"
                    position="relative"
                    ml={2}
                    width="85%"
                  >
                    <Icon name="test" size={10} color="white" />
                    <Text
                      fontSize={12}
                      fontWeight="400"
                      color="#636363"
                      marginLeft={20}
                      numberOfLines={2}
                    >
                      {exams.exams.questions[0].questionsFile}
                    </Text>
                  </Box>
                  <Box ml={2} width="15%">
                    <Icon name="downloadAttachments" size={20} />
                  </Box>
                </Box>
              ) : (
                <Box
                  mt={2}
                  ml={2}
                  borderRadius={10}
                  borderWidth={1}
                  borderColor="rgba(125, 125, 125, 0.3)"
                  width="95%"
                  minHeight={200}
                >
                  <Box padding={2}>
                    <RenderHtml
                      contentWidth={width}
                      source={{
                        html: exams.exams.questions[0].questionsName,
                      }}
                    />
                  </Box>
                </Box>
              )
            ) : null}

            <Box style={{ padding: 10 }}>
              <Text fontSize={20} color="#32813D" mt={3}>
                TRẢ LỜI
              </Text>
            </Box>
            {exams ? (
              exams.examsHistoryFileAnswer ? (
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(exams.examsHistoryFileAnswer);
                  }}
                >
                  <Box
                    width={width * 0.95}
                    borderRadius={10}
                    borderWidth={1}
                    borderColor="rgba(125, 125, 125, 0.3)"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    height={50}
                    mt={2}
                    ml="2.5%"
                  >
                    <Box
                      alignItems="center"
                      flexDirection="row"
                      position="relative"
                      ml={2}
                    >
                      <Icon name="test" size={10} color="white" />
                      <Text
                        fontSize={12}
                        fontWeight="400"
                        color="#636363"
                        marginLeft={20}
                        numberOfLines={2}
                        width="80%"
                      >
                        {exams.examsHistoryFileAnswer}
                      </Text>
                    </Box>
                    <Box mr={1}>
                      <Icon name="downloadAttachments" size={20} />
                    </Box>
                  </Box>
                </TouchableOpacity>
              ) : (
                <Box
                  ml="2.5%"
                  width={width * 0.95}
                  style={{
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "rgba(99, 99, 99, 0.2)",

                    minHeight: 200,
                  }}
                >
                  <Text
                    style={{
                      padding: 10,
                      fontSize: 16,
                      color: "#636363",
                      marginTop: 10,
                    }}
                  >
                    {exams.examsHistoryAnswer}
                  </Text>
                </Box>
              )
            ) : null}
            {/* <Box style={{ padding: 10 }} mt={2}>
              <Text fontSize={20} color="#32813D">
                BÀI THI ĐÃ TẢI LÊN
              </Text>
            </Box>
            <Box
              style={{
                flex: 1,
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "flex-start",
              }}
              ml="2.5%"
              width={width * 0.95}
            >
              <Box
                mt={2}
                borderWidth={1}
                borderRadius={8}
                borderColor="#D4D4D4"
              >
                <Box
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "flex-start",
                  }}
                >
                  <Box
                    style={{
                      width: "10%",
                    }}
                  >
                    <Box
                      height={40}
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      <Text>STT</Text>
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
                        TÊN BÀI THI
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
                        NGÀY NỘP
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
                        XEM BÀI THI
                      </Text>
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
                        ĐIỂM
                      </Text>
                    </Box>
                  </Box>
                </Box>
                {listExams &&
                  listExams.map((data, index) => {
                    return (
                      <ExamsList
                        key={String(index)}
                        data={data}
                        index={index}
                        idStudent={exams ? exams.student.id : null}
                        onGetExamsById={onGetExamsById}
                      ></ExamsList>
                    );
                  })}
              </Box>
            </Box>
            <Text fontSize={20} color="#32813D" mt={2} ml={2}>
              NHẬN XÉT CỦA GIẢNG VIÊN
            </Text> */}
            {/* <TextInput
              // onFocus={() => setTextPress(64)}
              // onBlur={() => setTextPress(0)}
              value={comment}
              width={width * 0.95}
              style={{
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "rgba(99, 99, 99, 0.2)",
                textAlignVertical: "top",
              }}
              height={200}
              ml={2}
              mt={2}
              multiline
              onChangeText={(value) => setComment(value)}
            >
              {exams && exams.examsHistoryTeacherComment
                ? exams.examsHistoryTeacherComment
                : comment}
            </TextInput> */}
            <Box alignItems="center" flexDirection="row">
              <Text
                fontSize={17}
                color="seen"
                ml={2}
                mt={2}
                mb={2}
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                TỔNG ĐIỂM CHẤM:{" "}
              </Text>
              <Box>
                <TextInput
                  keyboardType="numeric"
                  color="red"
                  fontSize={20}
                  value={point.toString()}
                  placeholderTextColor={"red"}
                  placeholder="0"
                  maxLength={3}
                  onFocus={() => {
                    setPoint("");
                  }}
                  onChangeText={(value: any) => {
                    if (value > 100) {
                      // setPoint(100);
                      return;
                    }
                    if (value && !isNaN(value)) {
                      setPoint(+value);
                    } else {  
                      setPoint("");
                    }
                  }}
                  // keyboardType="numeric"
                  // color="red"
                  // onFocus={() => setTextPress(64)}
                  // onBlur={() => setTextPress(0)}
                  // value={point.toString()}
                  // min={0}
                  // max={100}
                  // onChangeText={(value) => {
                  //   if (value <= 100) {
                  //     setPoint(+value);
                  //   }
                  // }}
                ></TextInput>
                <Box height={1} bg="#636363"></Box>
              </Box>
              <Text fontSize={20} color="seen" ml={1}  fontWeight="bold">
                /100
              </Text>
            </Box>
            <Box style={{ alignItems: "center" }}>
              <Box flexDirection="row">
                {/* <TouchableOpacity>
                  <Box
                    borderRadius={5}
                    borderWidth={1}
                    borderColor="rgba(125, 125, 125, 0.3)"
                    mt={2}
                    mr={2}
                    width={width * 0.4}
                    alignItems="center"
                  >
                    <Text style={{ padding: 10 }}>Xóa</Text>
                  </Box>
                </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => {
                    submit();
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
                    <Text style={{ padding: 10, color: "#ffffff", right: 0 }}>
                      Chấm điểm
                    </Text>
                  </Box>
                </TouchableOpacity>
              </Box>
            </Box>
            <Box height={20} />
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(false);
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
                    height: "90%",
                    width: "90%",

                    backgroundColor: "white",
                    borderRadius: 20,

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
                  <Text fontSize={20} color="seen" fontWeight="bold" mt={4}>
                    DANH SÁCH HỌC VIÊN
                  </Text>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {listStudent &&
                      listStudent.map((student : any, index : number) => {
                        return (
                          <TouchableOpacity
                            style={{
                              width: width * 0.85,
                              marginTop: 10,
                              flex: 1,
                            }}
                            onPress={() =>
                              student.point != "Chưa thi"
                                ? onGetExamsById(student.id)
                                : null
                            }
                          >
                            <Box
                              flexDirection="row"
                              alignItems="center"
                              justifyContent="space-between"
                            >
                              <Box
                                flexDirection="row"
                                alignItems="center"
                                flex={1}
                              >
                                {student.img ? (
                                  <FastImage
                                    style={{
                                      height: 40,
                                      width: 40,
                                      borderRadius: 50,
                                    }}
                                    source={{
                                      uri: student.img,
                                    }}
                                    onError={() => {
                                      // setImageUrl(
                                      //   "https://www.seekpng.com/png/detail/514-5147412_default-avatar-icon.png"
                                      // );
                                    }}
                                  />
                                ) : (
                                  <Box
                                    width={40}
                                    height={40}
                                    borderRadius={50}
                                    backgroundColor="buttonColor"
                                    alignItems="center"
                                    justifyContent="center"
                                  >
                                    <Text
                                      color="#ffffff"
                                      fontSize={13}
                                      fontWeight="bold"
                                    >
                                      {student?.fullname
                                        ?.split(" ")
                                        .slice(-1)
                                        .join(" ")
                                        .charAt(0)}
                                    </Text>
                                  </Box>
                                )}
                                <Box flex={1} mr={1}>
                                  <Text
                                    fontSize={16}
                                    color={"#636363"}
                                    opacity={
                                      student.point == "Chưa thi" ? 0.5 : 1
                                    }
                                    ml={1}
                                    numberOfLines={2}
                                  >
                                    {student.fullname}
                                  </Text>
                                </Box>
                              </Box>
                              <Text
                                fontSize={16}
                                color={
                                  student.point == "Chưa thi"
                                    ? "#DC4E41"
                                    : "#00A717"
                                }
                                ml={1}
                                numberOfLines={1}
                              >
                                {student.point}
                              </Text>
                            </Box>
                          </TouchableOpacity>
                        );
                      })}
                  </ScrollView>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={{
                      width: 60,
                      height: 40,
                      borderWidth: 1,
                      borderColor: "#00A8B5",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 8,
                      backgroundColor: "#00A8B5",
                      marginBottom : 10
                    }}
                  >
                    <Text fontSize={15} fontWeight="bold" color="#ffffff">
                      Hủy
                    </Text>
                  </TouchableOpacity>
                </Box>
              </Box>
            </Modal>
          </ScrollView>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleNoti}
            onRequestClose={() => {
              setModalVisible(!modalVisibleNoti);
            }}
          >
            <PopupCloseAutomatically
              title="Chấm điểm"
              type={type}
              isOpen={modalVisibleNoti}
              setIsOpen={setModalVisibleNoti}
            />
            {/* <PopupNotification
              title="Chấm điểm"
              type={type}
              setModalVisible={setModalVisibleNoti}
            ></PopupNotification> */}
          </Modal>
          <TouchableOpacity
            style={{ position: "absolute", right: 0 }}
            onPress={() => setModalVisible(true)}
          >
            <Icon name="tabQuestion"></Icon>
          </TouchableOpacity>
        </Box>
      </Box>
    </KeyboardAvoidingView>
  );
};
export default EssayDetail;
