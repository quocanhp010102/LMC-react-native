import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Icon } from "../../../components/svg-icon";
import { Box, Text } from "../../../rebass";
const { width, height } = Dimensions.get("screen");
import * as ImagePicker from "expo-image-picker";
import FastImageItem from "../../../components/FastImage";
export const ModalAdd = (props: {
  data?: any;
  setModalVisible: any;
  uploadFile?: any;
  uploadVideo?: any;
}) => {
  const { data, setModalVisible, uploadFile, uploadVideo } = props;
  const [student, setStudent] = useState(false);
  const [teacher, setTeacher] = useState(false);
  const [fileVideo, setFileVideo] = useState<any>("");
  const [fileImage, setFileImage] = useState<any>("");
  const [title, setTitle] = useState<string>("");
  const [errorTitle, setErrorTitle] = useState("");
  const [errorChoseFileVideo, setErrorChoooseFileVideo] = useState("");
  const [chooseFileVideo, setChooseFileVideo] = useState(false);
  const [errorChoseFileBaner, setErrorChoooseFileBaner] = useState("");
  const [chooseFileBaner, setChooseFileBaner] = useState(false);
  const [errorChoseCheckBox, setErrorChoooseCheckBox] = useState("");
  const pickDocumentVideo = async () => {
    setErrorChoooseFileVideo("");
    let result :any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });
    if (!result.cancelled) {
      let localUri = result.uri;
      let filename = localUri.split("/").pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `video/${match[1]}` : `video`;
      setFileVideo({ uri: localUri, name: filename, type });
      setChooseFileVideo(true);
      setErrorChoooseFileVideo("");
    } else {
      setChooseFileVideo(false);
      setErrorChoooseFileVideo("Bạn chưa chọn file Video!");
    }
  };
  const pickDocumentImage = async () => {
    setErrorChoooseFileBaner("");
    let result :any = await ImagePicker.launchImageLibraryAsync({
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
      setFileImage({ uri: localUri, name: filename, type });
      setChooseFileBaner(true);
      setErrorChoooseFileBaner("");
    } else {
      setChooseFileBaner(false);
      setErrorChoooseFileBaner("Bạn chưa chọn file ảnh bìa!");
    }
  };
  const handleUploadVideo = () => {
    if (checkValidateTitle()) {
      if (checkValidateFileVideo()) {
        if (checkValidateFileBanner()) {
          if (checkValidateCheckBox()) {
            let arrRole: { name: string }[] = [];
            if (student) {
              arrRole.push({ name: "ROLE_STUDENT" });
            }
            if (!student) {
              arrRole.filter((role) => role.name !== "ROLE_STUDENT");
            }
            if (teacher) {
              arrRole.push({ name: "ROLE_LECTURER" });
            }
            if (!teacher) {
              arrRole.filter((role) => role.name !== "ROLE_LECTURER");
            }
            uploadVideo(title, arrRole, fileVideo, fileImage);
          }
        }
      }
    }
  };

  function checkValidateTitle(): boolean {
    let check = true;
    if (!title) {
      check = false;
      setErrorTitle("Tiêu đề video không được để trống!");
    } else {
      check = true;
      setErrorTitle("");
    }
    return check;
  }

  function checkValidateFileVideo(): boolean {
    let check = true;
    if (!chooseFileVideo) {
      check = false;
      setErrorChoooseFileVideo("Bạn chưa chọn file Video!");
    } else {
      check = true;
      setErrorChoooseFileVideo("");
    }
    return check;
  }

  function checkValidateFileBanner(): boolean {
    let check = true;
    if (!chooseFileBaner) {
      check = false;
      setErrorChoooseFileBaner("Bạn chưa chọn file ảnh bìa!");
    } else {
      check = true;
      setErrorChoooseFileBaner("");
    }
    return check;
  }

  function checkValidateCheckBox(): boolean {
    let check = true;
    if (student || teacher) {
      setErrorChoooseCheckBox("");
      check = true;
    } else {
      check = false;
      setErrorChoooseCheckBox("Chọn ít nhất 1 đối tượng!");
    }
    return check;
  }

  const onChangeStudent = () => {
    setErrorChoooseCheckBox("");
    setStudent(!student);
  };

  const onChangeTeacher = () => {
    setErrorChoooseCheckBox("");
    setTeacher(!teacher);
  };
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
        }}
      >
        <Text
          fontSize={16}
          color="textColor"
          fontWeight="bold"
          mt={15}
          mb={15}
          padding={2}
        >
          THÊM HƯỚNG DẪN SỬ DỤNG
        </Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text fontSize={14} fontWeight="bold" marginBottom={2}>
            Tiêu đề
          </Text>
          <TextInput
            onChangeText={(value) => setTitle(value)}
            value={title}
            //@ts-ignore
            height={40}
            borderWidth={1}
            borderColor="rgba(99, 99, 99, 0.2)"
            borderRadius={8}
            width="100%"
            marginBottom={5}
            onFocus={() => setErrorTitle("")}
          ></TextInput>
          {errorTitle ? (
            <Text fontSize={14} color="#f3a908" mb={1}>
              {errorTitle}
            </Text>
          ) : null}

          <Text fontSize={14} fontWeight="bold" marginBottom={2}>
            Tải lên video hướng dẫn
          </Text>
          <TouchableOpacity onPress={pickDocumentVideo}>
            <Box
              borderRadius={5}
              borderWidth={1}
              borderColor="#00A8B5"
              mr={2}
              width={"100%"}
              alignItems="center"
              height={height * 0.1}
              backgroundColor="rgba(99, 99, 99, 0.1)"
              flexDirection="row"
              justifyContent="center"
            >
              <Icon size={24} name="UploadFile"></Icon>
              <Text style={{ padding: 10, fontSize: 16 }} color="#00A8B5">
                Tải lên
              </Text>
            </Box>
          </TouchableOpacity>
          {errorChoseFileVideo ? (
            <Text fontSize={14} color="#f3a908" mb={1}>
              {errorChoseFileVideo}
            </Text>
          ) : undefined}
          {fileVideo ? (
            <Text fontSize={14} mb={1} mt={1}>
              {fileVideo.name}{" "}
            </Text>
          ) : null}
          <Text fontSize={14} fontWeight="bold" marginBottom={2} mt={2}>
            Tải lên ảnh bìa video
          </Text>
          <TouchableOpacity onPress={pickDocumentImage}>
            <Box
              borderRadius={5}
              borderWidth={1}
              borderColor="#00A8B5"
              mr={2}
              width={"100%"}
              alignItems="center"
              height={50}
              backgroundColor="rgba(99, 99, 99, 0.1)"
              flexDirection="row"
              justifyContent="center"
            >
              <Icon size={24} name="UploadFile"></Icon>
              <Text style={{ padding: 10, fontSize: 16 }} color="#00A8B5">
                Tải lên
              </Text>
            </Box>
          </TouchableOpacity>
          {errorChoseFileBaner ? (
            <Text fontSize={14} color="#f3a908" mb={1}>
              {errorChoseFileBaner}
            </Text>
          ) : undefined}
       
          <FastImageItem
            style={{ height: 150, width: "100%" , backgroundColor : "gray"  , marginTop : 10}}
            source={{ uri: fileImage.uri }}
          ></FastImageItem>
          <Text fontSize={14} fontWeight="bold" marginBottom={2} marginTop={1}>
            Đối tượng hướng dẫn
          </Text>
          <Box
            borderRadius={10}
            borderWidth={1}
            borderColor="rgba(125, 125, 125, 0.3)"
          >
            <TouchableOpacity
              delayPressIn={0}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
              onPress={() => onChangeStudent()}
            >
              <Box
                height={19}
                width={19}
                borderColor={student ? "#00A8B5" :"#DADADA"}
                borderRadius={50}
                borderWidth={1}
                ml={2}
                alignItems="center"
                justifyContent="center"
                mt={2}
              >
                <Box
                  height={12}
                  width={12}
                  borderColor="#DADADA"
                  borderRadius={50}
                  backgroundColor={student ? "#00A8B5" : "null"}
                ></Box>
              </Box>
              <Text ml={2} mt={2} color="seen" fontSize={15}>
                Sinh viên
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              delayPressIn={0}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
              onPress={() => onChangeTeacher()}
            >
              <Box
                height={19}
                width={19}
                borderColor={teacher ? "#00A8B5" :"#DADADA"}
                borderRadius={50}
                borderWidth={1}
                ml={2}
                alignItems="center"
                justifyContent="center"
              >
                <Box
                  height={12}
                  width={12}
                  borderColor="#DADADA"
                  borderRadius={50}
                  backgroundColor={teacher ? "#00A8B5" : "null"}
                ></Box>
              </Box>
              <Text ml={2} color="seen" fontSize={15}>
                Giảng viên
              </Text>
            </TouchableOpacity>
          </Box>
          {errorChoseCheckBox ? (
            <Text fontSize={14} color="#f3a908" mb={1}>
              {errorChoseCheckBox}
            </Text>
          ) : undefined}
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
            <TouchableOpacity onPress={handleUploadVideo}>
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
                  Lưu
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>
        </ScrollView>
      </Box>
    </Box>
  );
};
