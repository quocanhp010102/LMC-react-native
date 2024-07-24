import * as ImagePicker from "expo-image-picker";
import moment from "moment";
import { RefObject, useRef, useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  TouchableOpacity,
  TextInput
} from "react-native";
import { Devider } from "../../components/Devider";
import FastImageItem from "../../components/FastImage";
import { Header, NotificationIcon } from "../../components/Header";
import { PopupNotification } from "../../components/PopupNotification";
import { Icon } from "../../components/svg-icon";
import { Box, Flex, Text } from "../../rebass";
import { API } from "../../services";
import { generateApiService } from "../../services/ApiService";
import { ActivityHistoriesApi } from "../../services/api/ActivityHistories/ActivityHistoriesApi";
import { CourseApi } from "../../services/api/Course/CourseApi";
import ListTeacherManage from "./components/ListTeacherManage";
import { useListTeacherManage } from "./components/hooks/useListTeacherManage";
import PopupCloseAutomatically from "../../components/PopupCloseAutomatically";
const addCourse = ({ navigation, route }: any) => {
  const [modalVisibleNoti, setModalVisibleNoti] = useState(false);
  const [type, setType] = useState<string>("");
  const { idDepartment } = route.params;
  const [modalChoose, setModalChoose] = useState(false);
  const [nameCourse, setNameCourse] = useState<string>("");
  const [courseSemester, setCourseSemester] = useState<string>("");
  const { keyExtractor, onEndReached, teachers, onRefresh } = useListTeacherManage();
  const [file, setFile] = useState<any>("");
  const [value, setValue] = useState<any>();


  const pickDocument = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      let localUri = result.assets[0].uri;
      let filename = localUri.split("/").pop() || "";
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      if (type === `image/jpg`) {
        type = `image/jpeg`;
      }
      setFile({ uri: localUri, name: filename, type });
    }
  };
  const handleAddCourse = async () => {
    try {
      const data = new FormData();
      data.append("file", {
        ...file,
        uri:
          Platform.OS === "android"
            ? file.uri
            : file.uri.replace("file://", ""),
        name: file.name,
        type: file.type, 
      });
      let res = await generateApiService.postImage(
        `${API.PUBLIC}services/lmsbackendtest/api/uploadImage`,
        data
      );
      const body = {
        courseNotification: "courseNotification",
        courseCode: "",
        courseName: nameCourse,
        courseDescription: "courseDescription",
        courseTotalStudent: 0,
        courseCreatedDate: moment(new Date()).format("YYYY-MM-DD"),
        courseSemester: courseSemester,
        courseImage: res,
        lecturer: {
          id: value.value,
        },
        subject: {
          id: idDepartment,
        },
      };
      const response = await generateApiService.post(
        CourseApi.getAllCourse(),
        body
      );
      const bodyHistory = {
        name: " khóa học " + nameCourse,
        method: "POST",
      };
      await generateApiService.post(
        ActivityHistoriesApi.postHistories(),
        bodyHistory
      );

      const courseDetail = {
        courseID: response.id,
        courseName: response.courseName,
        coursesSemester: response.courseSemester,
        lectureName: value.label,
        totalStudent: response.courseTotalStudent,
      };

      navigation.navigate("/chinh-sua-khoa-hoc", {
        courseDetail: courseDetail,
        idDepartment: response.subject.id,
        name_Department: route.params.subject_name,
        NewCourse: true,
      });
    } catch (error) {
      console.log("Eeeee" , error);
      
      setType("error");
      setModalVisibleNoti(true);
    }
  };
  const textRefNameCourse = useRef<TextInput>(null);
  const textRefCourseSemester = useRef<TextInput>(null);
  const textRefFile = useRef<TextInput>(null);
  const textRefTeacher = useRef<TextInput>(null);
  const checkEmpty = (value: string, refCheck: RefObject<TextInput>) => {
    if (value?.trim()) {
      focusInput(refCheck)

      return true;
    }
    refCheck?.current?.setNativeProps({
      style: {
        opacity: 1,
        height: null,
      },
    });

    return false;
  };

  const checkValidate = () => {
    const checkNameCourse = checkEmpty(nameCourse, textRefNameCourse);
    const checkCourseSemester = checkEmpty(
      courseSemester,
      textRefCourseSemester
    );
    const checkFile = checkEmpty(file.uri, textRefFile);
    const checkTeacher = checkEmpty(value?.label, textRefTeacher);
    if (checkNameCourse && checkFile && checkCourseSemester && checkTeacher) {
      handleAddCourse();
    }
  };

  const focusInput = (refCheck: RefObject<TextInput>) => {
    refCheck?.current?.setNativeProps({
      style: {
        opacity: 0,
        height: 0,
      },
    });
  };

  return (
    <Box bg="defaultBackground" position="relative" height="100%">
      <Box height="100%">
        <Header logo search>
          <NotificationIcon />
        </Header>
        <Box height={1} bg="#636363" opacity={0.3} mt={2} />
        <ScrollView>
          <Flex flex={1} px={16}>
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
                  {route.params.department_name}
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Box paddingX={16} mt={2}>
            <Text color="seen" fontSize={16}>
              Tên khóa học<Text color="red">*</Text>
            </Text>
            <TextInput
              style={{
                height: 50,
                borderRadius: 10,
                width: "100%",
                fontSize: 16,
                borderWidth: 1,
                marginTop: 10,
                borderColor: "rgba(125, 125, 125, 0.3)",
                paddingLeft: 5,
                paddingRight: 5
              }}
              value={nameCourse}
              onChangeText={(value) => setNameCourse(value)}
              onFocus={() => {
                focusInput(textRefNameCourse);
              }}
            ></TextInput>
            <TextInput
              ref={textRefNameCourse}
              style={{
                color: "red",
                marginBottom: 10,
                marginTop: 2,
                height: 0,
                opacity: 0,
              }}
              value="Không được bỏ trống"
              editable={false}
            ></TextInput>
            <Text color="seen" fontSize={16}>
              Học kỳ<Text color="red">*</Text>
            </Text>
            <TextInput
              style={{
                height: 50,
                borderRadius: 10,
                width: "100%",
                fontSize: 16,
                borderWidth: 1,
                marginTop: 10,
                borderColor: "rgba(125, 125, 125, 0.3)",
                paddingLeft: 5,
                paddingRight: 5
              }}
              value={courseSemester}
              onFocus={() => {
                focusInput(textRefCourseSemester);
              }}
              onChangeText={(value) => setCourseSemester(value)}
            ></TextInput>
            <TextInput
              ref={textRefCourseSemester}
              style={{
                color: "red",
                marginBottom: 10,
                marginTop: 2,
                height: 0,
                opacity: 0,
              }}
              value="Không được bỏ trống"
              editable={false}
            ></TextInput>
            <Text color="seen" fontSize={16} mb={1}>
              Giảng viên hướng dẫn<Text color="red">*</Text>
            </Text> 
            <TouchableOpacity
              onPress={() => {
                focusInput(textRefTeacher);
                setModalChoose(true);
              }}
            >
              <Box
                borderRadius={10}
                borderWidth={1}
                borderColor="rgba(125, 125, 125, 0.3)"
                width="100%"
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
            <TextInput
              ref={textRefTeacher}
              style={{
                color: "red",
                marginBottom: 10,
                marginTop: 2,
                height: 0,
                opacity: 0,
              }}
              value="Không được bỏ trống"
              editable={false}
            ></TextInput>
            <Text mt={2} color="seen" fontSize={16}>
              Tải lên ảnh khóa học<Text color="red">*</Text>
            </Text>
            <TouchableOpacity
              onPress={() => {
                focusInput(textRefFile);
                pickDocument();
              }}
            >
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
                <Text style={{ padding: 10, fontSize: 16 }} color="deleteColor">
                  Tải lên
                </Text>
              </Box>
            </TouchableOpacity>
            <TextInput
              ref={textRefFile}
              style={{
                color: "red",
                marginBottom: 10,
                marginTop: 2,
                height: 0,
                opacity: 0,
              }}
              value="Không được bỏ trống"
              editable={false}
            ></TextInput>
            <FastImageItem
              style={{ height: 150, width: "100%", marginTop: 20 }}
              source={{ uri: file.uri }}
            ></FastImageItem>
          </Box>
          <Box height={20} />
        </ScrollView>
        <Box flexDirection="row" justifyContent="space-between" marginX={16}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(100, 116, 139, 0.1)",
              height: 40,
              width: "47.5%",
              borderColor: "#00A8B5",
              borderWidth: 1,
            }}
          >
            <Text ml={1} color="#CC0000">
              Quay lại
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={checkValidate}
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
              Hoàn thành
            </Text>
          </TouchableOpacity>
        </Box>
        <Box height={20} />
      </Box>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleNoti}
        onRequestClose={() => {
          setModalVisibleNoti(!modalVisibleNoti);
        }}
      >
        <PopupCloseAutomatically
          title="Tạo khóa học"
          type={type}
          isOpen={modalVisibleNoti}
          setIsOpen={setModalVisibleNoti}
        />
        {/* <PopupNotification
          title="Tạo khóa học"
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
export default addCourse;
