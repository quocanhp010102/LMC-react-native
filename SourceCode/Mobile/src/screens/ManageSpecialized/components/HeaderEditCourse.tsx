import { ActivityIndicator, TextInput, TouchableOpacity ,Image } from "react-native";
import { Devider } from "../../../components/Devider";
import { Icon } from "../../../components/svg-icon";
import { Box, Flex, Text } from "../../../rebass";
import { RefObject } from "react";
import FastImageItem from "../../../components/FastImage";

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
  nameCourse: string;
  focusInput: (refCheck: RefObject<TextInput>) => void;
  textRefCourseSemester: RefObject<TextInput>;
  textRefTeacher: RefObject<TextInput>;
  textRefNameCourse: RefObject<TextInput>;
  textRefFile: RefObject<TextInput>;
  isEmpty: boolean;
  disabled?: boolean;
}

export const HeaderEditCourse = (props: IHeaderEditCourse) => {
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
    focusInput,
    textRefCourseSemester,
    textRefNameCourse,
    textRefFile,
    textRefTeacher,
    isEmpty,
    disabled,
  } = props;

  return (
    <>
      <Flex px={16}>
        <Devider></Devider>
        <Flex
          flexDirection="row"
          alignItems="flex-start"
          justifyContent="center"
        >
          <Flex flex={1}>
            <Text
              lineHeight={30}
              color="#1C7988"
              fontWeight="bold"
              fontSize={17}
              style={{ textTransform: "uppercase" }}
            >
              {courseName}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Box paddingX={16} mt={2}>
        <Text color="#1C7988" fontSize={16}>
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
            paddingRight: 5,
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

        <Text color="#1C7988" fontSize={16}>
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
            paddingRight: 5,
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
        <Text color="#1C7988" fontSize={16} mt={2}>
          Giảng viên hướng dẫn<Text color="red">*</Text>
        </Text>
        <Box paddingTop={2}>
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
        </Box>
        <Text mt={2} color="#1C7988" fontSize={16}>
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
            borderColor="#56C8C8"
            mt={2}
            width={"100%"}
            alignItems="center"
            height={91}
            flexDirection="row"
            justifyContent="center"
          >
            <Icon size={24} name="UploadFile"></Icon>
            <Text style={{ padding: 10, fontSize: 16 }} color="#56C8C8">
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
        {(file.uri || linkImage) && (
            <Image
              style={{ height: 150, width: "100%", marginTop: 20 }}
              source={{ uri: file.uri || linkImage }}
            ></Image>
          )}
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
      <Box flexDirection="row" paddingX={16}>
        <TouchableOpacity
          disabled={disabled}
          onPress={onDeleteStudent}
          style={{
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            height: 40,
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
            backgroundColor: "#56C8C8",
            height: 40,
            paddingHorizontal: 5,
            marginLeft: 10,
          }}
        >
          <Icon name="addIcon"></Icon>
          <Text ml={1} color="white">
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
          <ActivityIndicator size="large" color="#00A8B5" />
        </Box>
      ) : !isEmpty ? (
        <Box
          mt={2}
          marginX={16}
          borderWidth={1}
          borderBottomWidth={0}
          borderRadius={8}
          borderBottomLeftRadius={0}
          borderBottomRightRadius={0}
          borderColor="#D4D4D4"
        >
          <Box
            style={{
              flex: 1,
              flexDirection: "row",
              backgroundColor: "#00A8B5",
            }}
            borderRadius={8}
            borderBottomLeftRadius={0}
            borderBottomRightRadius={0}
          >
            <Box
              style={{
                width: "10%",
              }}
            >
              <Box
                height={50}
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setAll(!all), chooseAll();
                  }}
                >
                  {all ? (
                    <Icon name="chooseBox" color={"white"}></Icon>
                  ) : (
                    <Icon name="CheckBox" color={"white"}></Icon>
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
                  backgroundColor: "#00A8B5",
                }}
              ></Box>
              <Box
                height={50}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    color: "white",
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
                  backgroundColor: "#00A8B5",
                }}
              ></Box>
              <Box
                height={50}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    color: "white",
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
                  backgroundColor: "#00A8B5",
                }}
              ></Box>
              <Box
                height={50}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    color: "white",
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
      ) : (
        <Box style={{ alignItems: "center", justifyContent: "center" }} mt={3}>
          <Text>Không có sinh viên nào</Text>
        </Box>
      )}
    </>
  );
};
