import { View, TouchableOpacity, Dimensions } from "react-native";
import React from "react";

import { Devider } from "../../../components/Devider";
import { InputWithIcon } from "../../../components/InputWithIcon";
import { Flex, Box, TextInput, Text } from "../../../rebass";
const { width, height } = Dimensions.get("screen");

interface HeaderUserManualProps {
  navigate: () => void;
  state: any;
  setState: (data: any) => void;
  removeText: () => void;
  updateQuestion: () => void;
  checkVadidate: (e: string) => void;
}

const HeaderUserManual = (props: HeaderUserManualProps) => {
  const { navigate, state, setState, removeText, updateQuestion, checkVadidate } =
    props;

  return (
    <Box>
      <Flex px={2}>
        <Flex>
          <Text
            fontWeight="bold"
            fontSize={20}
            color="textColor"
            lineHeight={30}
            mt={17}
          >
            THẮC MẮC ĐÃ ĐƯỢC GIẢI ĐÁP
          </Text>
        </Flex>
        <TouchableOpacity onPress={navigate}>
          <Flex
            height={45}
            borderRadius={8}
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            backgroundColor="buttonColor"
            my={2}
            mx={2}
          >
            <Text ml={2} fontSize={17} fontWeight="bold" color="#fff">
              Xem phản hồi
            </Text>
          </Flex>
        </TouchableOpacity>
      </Flex>
      <Flex px={2}>
        <Flex
          flexDirection="row"
          alignItems="flex-start"

        >
          <Flex>
            <Text
              fontWeight="bold"
              fontSize={20}
              color="textColor"
              lineHeight={30}
            >
              LIÊN HỆ HỖ TRỢ
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Box alignItems="center" mt={2}>
        <TextInput
          placeholder={"Điền tiêu đề ..."}
          multiline={false}
          textAlignVertical="center"
          width="90%"
          height={50}
          borderRadius={10}
          placeholderTextColor={"#a9a9a9"}
          borderWidth={1}
          borderColor="rgba(125, 125, 125, 0.3)"
          fontSize={16}
          padding={2}
          marginBottom={18}
          value={state.title}
          onChangeText={(value) => setState({ title: value })}
        />
        <TextInput
          placeholder={"Điền câu hỏi..."}
          multiline={true}
          textAlignVertical="top"
          width="90%"
          height={height * 0.25}
          borderRadius={10}
          borderWidth={1}
          placeholderTextColor={"#a9a9a9"}
          borderColor="rgba(125, 125, 125, 0.3)"
          fontSize={16}
          padding={2}
          marginBottom={18}
          value={state.feedBack}
          onChangeText={(value) => setState({ feedBack: value })}
        />
        <Box flexDirection="row">
          <TouchableOpacity
            onPress={() => {
              removeText();
            }}
          >
            <Box
              borderRadius={5}
              borderWidth={1}
              borderColor="buttonColor"
              mt={2}
              mr={2}
              width={width * 0.4}
              alignItems="center"
            >
              <Text style={{ padding: 10 }} color="deleteColor">
                Xóa
              </Text>
            </Box>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
                updateQuestion();
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
                Gửi câu hỏi
              </Text>
            </Box>
          </TouchableOpacity>
        </Box>
      </Box>
      <Flex px={2} mt={3}>
        <Text fontWeight="bold"  mt={17} fontSize={20} color="textColor" lineHeight={30}>
          HƯỚNG DẪN SỬ DỤNG HCMUSSH - LMS
        </Text>
      </Flex>
      <Box
        mb={2}
        p={2}
        flexDirection="row"
        alignItems="center"
        borderBottomColor="tabBar"
      >
        <InputWithIcon
          icon="search"
          flex={1}
          value={state.queryInput}
          onChangeText={(e) => checkVadidate(e)}
          iconColor="#00A8B5"
          placeholderTextColor="black"
          // placeholder="Nhập tìm kiếm"
          iconSize={16}
          onPress={() => setState({ queryInput: "" })}
          border
          borderColor={'#00A8B5'}

        />
      </Box>
    </Box>
  );
};

export default HeaderUserManual;
