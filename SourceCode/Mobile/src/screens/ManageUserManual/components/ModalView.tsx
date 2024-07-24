import * as DocumentPicker from "expo-document-picker";
import React, { useState, useEffect } from "react";
import {
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { Icon } from "../../../components/svg-icon";
import { Box, Text } from "../../../rebass";
const { width, height } = Dimensions.get("screen");
import moment from "moment";
import { TutourialsApi } from "../../../services/api/Tutuorials/TutourialsApi";
import { generateApiService } from "../../../services/ApiService";
import * as ImagePicker from "expo-image-picker";
import { ActivityHistoriesApi } from "../../../services/api/ActivityHistories/ActivityHistoriesApi";
import FastImageItem from "../../../components/FastImage";
import { API } from "../../../services";
export const ModalView = (props: {
  data?: any;
  setModalVisible: any;
  uploadFile?: any;
  uploadVideo?: any;
  onGetTutorials?: any;
  setTutorialSelected?: any;
  setModalVisibleNoti?: any;
  setType: any;
  setTitleNoti: any;
  tutourials: any;
  setTutourials: any;
}) => {
  const {
    data,
    setModalVisible,
    uploadFile,
    uploadVideo,
    onGetTutorials,
    setTutorialSelected,
    setModalVisibleNoti,
    setType,
    setTitleNoti,
    tutourials,
    setTutourials,
  } = props;
  const [student, setStudent] = useState(false);
  const [teacher, setTeacher] = useState(false);
  const [fileVideo, setFileVideo] = useState<any>("");
  const [fileImage, setFileImage] = useState<any>("");
  const [linkImage, setLinkImage] = useState<string>(data.tutorial_image);
  const [title, setTitle] = useState<string>(data.tutorial_title);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorChoseFileBaner, setErrorChoooseFileBaner] = useState("");
  const [chooseFileBaner, setChooseFileBaner] = useState(false);
  const [errorChoseCheckBox, setErrorChoooseCheckBox] = useState("");
  const [chooseFileImage, setChooseFileImage] = useState(false);

  const pickDocumentVideo = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: "video/*",
      multiple: true,
      copyToCacheDirectory: true,
    });
    setFileVideo(result);
  };
  const pickDocumentImage = async () => {
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
      setFileImage({ uri: localUri, name: filename, type });
    }
  };
  const handleUploadVideo = () => {
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
  };
  const editVideo = async () => {
    if (checkValidateTitle()) {
      // if (checkValidateFileBanner()) {
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
        let linkVideoUpload = data.tutorial_video;
        let linkImageUpload = data.tutorial_image;
        if (fileVideo) {
          if (fileVideo.type === "success") {
            const data = new FormData();
            data.append("file", {
              ...fileVideo,
              uri:
                Platform.OS === "android"
                  ? fileVideo.uri
                  : fileVideo.uri.replace("file://", ""),
              name: fileVideo.name,
              type: fileVideo.mimeType, // it may be necessary in Android.
            });
            linkVideoUpload = await generateApiService.postImage(
              `${API.PUBLIC}services/lmsbackendtest/api/uploadImage`,
              data
            );
          }
        }
        if (fileImage) {
          const data = new FormData();
          data.append("file", {
            ...fileImage,
            uri:
              Platform.OS === "android"
                ? fileImage.uri
                : fileImage.uri.replace("file://", ""),
            name: fileImage.name,
            type: fileImage.mimeType, // it may be necessary in Android.
          });

          linkImageUpload = await generateApiService.postImage(
            `${API.PUBLIC}services/lmsbackendtest/api/uploadImage`,
            data
          );
        }

        console.log("check ,linkImageUpload", linkImageUpload);

        const dataUpload = {
          id: data.id,
          tutorial_title: title,
          tutorial_image: linkImageUpload,
          tutorial_video: linkVideoUpload,
          tutorial_createdDate: new Date(),
          tutorial_isDisplay: "1",
          authorities: arrRole,
        };

        const response = await generateApiService.put(
          TutourialsApi.getTutourialsByid(data.id),
          dataUpload
        );

        if (response && response != 400) {
          setType("success");
          setTitleNoti("Sửa hướng dẫn sử dụng thành công !");
          setModalVisibleNoti(true);
          setModalVisible(false);
          var index = tutourials.findIndex(
            (pTutourials : any) => pTutourials.id == data.id
          );
          if (index >= 0) {
            let newDataTutourials = [...tutourials];
            newDataTutourials[index] = response;
            setTutourials(newDataTutourials);
          }
          const bodyHistory = {
            name: " HDSD " + title,
            method: "PUT",
          };
          const history = await generateApiService.post(
            ActivityHistoriesApi.postHistories(),
            bodyHistory
          );
        } else {
          setType("error");
          setTitleNoti("Sửa hướng dẫn sử dụng thất bại !");
          setModalVisibleNoti(true);
          setModalVisible(false);
        }
      }
    }
  };

  function checkValidateTitle(): boolean {
    let check = true;
    if (!title) {
      check = false;
      setErrorTitle("Tiêu đề bài giảng không để trống!");
    } else {
      check = true;
      setErrorTitle("");
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
  useEffect(() => {
    if (data.authorities.length == 1) {
      if (data.authorities[0].name === "ROLE_STUDENT") {
        setStudent(true);
      } else {
        setTeacher(true);
      }
    }
    if (data.authorities.length == 2) {
      setStudent(true);
      setTeacher(true);
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
          SỬA HƯỚNG DẪN SỬ DỤNG
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
            onFocus={() => setErrorTitle("")}
          ></TextInput>
          {errorTitle ? (
            <Text fontSize={14} color="#f3a908" mb={0}>
              {errorTitle}
            </Text>
          ) : null}
          <Text fontSize={14} marginTop={1}>
            {fileVideo ? fileVideo.name : null}
          </Text>
          <Text fontSize={14} fontWeight="bold" marginBottom={2}>
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
              height={65}
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
         
          {fileImage ? (
            <FastImageItem
              style={{
                height: 150,
                width: "100%",
                backgroundColor: "gray",
                marginTop: 10,
              }}
              source={{ uri: fileImage.uri }}
            ></FastImageItem>
          ) : (
            <FastImageItem
              style={{
                height: 150,
                width: "100%",
                backgroundColor: "gray",
                marginTop: 10,
              }}
              source={{ uri: linkImage }}
            ></FastImageItem>
          )}
     
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
              <Text ml={2}  mt={2} color="seen" fontSize={15}>
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
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false), setTutorialSelected(false);
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
              >
                <Text style={{ padding: 10 }} color="deleteColor">
                  Hủy
                </Text>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity onPress={editVideo}>
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
                  Sửa
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>
        </ScrollView>
      </Box>
    </Box>
  );
};
