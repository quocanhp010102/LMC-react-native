import { useEffect, useState } from "react";
import {
  Dimensions,
  Keyboard,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity
} from "react-native";
import { Box, Text } from "../../../rebass";
import { generateApiService } from "../../../services/ApiService";
import { FeedBackApi } from "../../../services/api/FeedBack/FeedBackApi";
import { ActivityIndicator } from "react-native";
import { lightColors } from "../../../themes";
const { width, height } = Dimensions.get("screen");

export const ModalView = (props: {
  data?: any;
  setModalVisible: any;
  getData: any;
  setModalVisibleNoti: any;
  setType: any;
  setTitleNoti: any;
}) => {
  const {
    data,
    setModalVisible,
    getData,
    setModalVisibleNoti,
    setType,
    setTitleNoti,
  } = props;
  const [edit, setEdit] = useState<boolean>(false);
  const [items, setItems] = useState([
    { label: "Hoc sinh", value: "value1" },
    { label: "Giảng viên", value: "value2" },
    { label: "Tất cả", value: "value3" },
  ]);
  const [checkOnBlur, setCheckOnBlur] = useState(false);
  const [answerContent, setAnswerContent] = useState("");
  const [errorAnswerContent, setErrorAnswerContent] = useState("");
  const [loading , setLoading] = useState(false)

  function checkValidateTitle(): boolean {
    let check = true;
    if (!answerContent) {
      check = false;
      setErrorAnswerContent("Giải đáp không được để trống!");
    } else {
      check = true;
      setErrorAnswerContent("");
    }
    return check;
  }

  const uploadFile = async () => {
    setLoading(true)
    Keyboard.dismiss()
    if (checkValidateTitle()) {
      try {
        const dataUpload = {
          id: data.id,
          title: data.title,
          answerContent: answerContent,
          status: "1",
          content: data.content,
          typeUser: data.typeUser,
          user: data.user,
        };
        let updateFeedBack = await generateApiService
          .put(FeedBackApi.updateFeedBack(data.id), dataUpload)
          .then((response) => {
            getData();
          });
        setTitleNoti("Giải đáp thắc mắc thành công !");
        setType("success");
        setModalVisible(false);
        setLoading(false)
        setModalVisibleNoti(true);
      } catch (e) {
        setTitleNoti("Giải đáp thắc mắc thất bại !");
        setType("success");
        setLoading(false)
        setModalVisible(false);
        setModalVisibleNoti(true);
      }
    }
  };
  useEffect(() => {
    if (!data.answerContent) {
      setEdit(true);
    }
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
          height: height * 0.7,
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
        <Text fontSize={16} color="textColor" fontWeight="bold" mt={15} mb={15}>
          GIẢI ĐÁP
        </Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps
        >
          <Text fontSize={14} fontWeight="bold" marginBottom={2}>
            Người đặt câu hỏi
          </Text>
          <Text marginBottom={14} color="seen">
            {data.user.firstName + " " + data.user.lastName}
          </Text>
          <Text fontSize={14} fontWeight="bold" marginBottom={2}>
            Phân quyền
          </Text>
          <Text marginBottom={14} color="seen">
            {data.typeUser == "1" ? "Giảng Viên" : "Sinh Viên"}
          </Text>
          <Text fontSize={14} fontWeight="bold" marginBottom={2}>
            Tiêu đề
          </Text>
          <Text marginBottom={14} color="seen">
            {data.title}
          </Text>
          <Text fontSize={14} fontWeight="bold" marginBottom={2}>
            Nội dung
          </Text>
          <Box minHeight={100}>
            <Text marginBottom={14} color="seen">
              {data.content}
            </Text>
          </Box>
          <Text fontSize={14} fontWeight="bold" marginBottom={2}>
            Giải đáp phản hồi
          </Text>
          {!edit ? (
            <Box minHeight={100}>
              <Text marginBottom={14} color="seen">
                {data.answerContent}
              </Text>
            </Box>
          ) : (
            <TextInput
              //@ts-ignore
              minHeight={100}
              borderWidth={1}
              borderColor="rgba(99, 99, 99, 0.2)"
              borderRadius={8}
              width="100%"
              marginBottom={14}
              defaultValue={data.answerContent}
              textAlignVertical="top"
              multiline={true}
              style={{
                paddingLeft: 5,
                paddingRight: 5,
              }}
              onFocus={() => {
                setErrorAnswerContent(""), setCheckOnBlur(true);
              }}
              onBlur={() => {
                setCheckOnBlur(false);
              }}
              onChangeText={(value) => setAnswerContent(value)}
            ></TextInput>
          )}
          <Text fontSize={14} color="#f3a908" ml={2}>
            {errorAnswerContent}
          </Text>
          <Box flexDirection="row">
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Box
                borderRadius={5}
                borderWidth={1}
                borderColor="deleteColor"
                mt={2}
                mr={2}
                width={width * 0.4}
                alignItems="center"
              >
                <Text style={{ padding: 10 }} color="deleteColor">
                  Hủy
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
                    style={{ padding: 10, color: "#ffffff", right: 0 }}
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
                  borderColor="rgba(125, 125, 125, 0.3)"
                  mt={2}
                  backgroundColor="buttonColor"
                  width={width * 0.4}
                  alignItems="center"
                  flexDirection={"row"}
                  justifyContent={"center"}
                >
                  <Text
                    style={{ padding: 10, color: "#ffffff" }}
                    numberOfLines={1}
                  >
                    Phản hồi
                  </Text>
                  {loading && (
                    <ActivityIndicator size={"small"} color={"white"}></ActivityIndicator>
                  )}
                </Box>
              </TouchableOpacity>
            )}
          </Box>
          {Platform.OS === "ios" && checkOnBlur ? (
            <Box height={height * 0.3}></Box>
          ) : null}
        </ScrollView>
      </Box>
    </Box>
  );
};
