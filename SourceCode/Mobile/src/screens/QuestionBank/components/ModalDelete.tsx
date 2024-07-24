import React, { useState, useEffect, useCallback } from "react";
import {
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { Box, Flex, Text } from "../../../rebass";
import { Icon } from "../../../components/svg-icon";
import { NavLink } from "../../../platform/links";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KEYS } from "../../../constants/key";
import { generateApiService } from "../../../services/ApiService";
import { QuestionsBankApi } from "../../../services/api/QuestionsBank/QuestionsBankApi";
const { width, height } = Dimensions.get("screen");
export const ModalDelete = (props: {
  data?: any;
  setModalVisible: any;
  setTitleEdit: any;
  setType: any;
  setModalVisibleNoti: any;
  questionBank: any;
  getQuestionBankStore: any;
}) => {
  const {
    data,
    setModalVisible,
    setTitleEdit,
    setType,
    setModalVisibleNoti,
    questionBank,
    getQuestionBankStore,
  } = props;

  const deleteQuestions = async () => {
    let newQuestionBank = questionBank;

    const deleteQuestion = await generateApiService.delete(
      QuestionsBankApi.getQuestionsBankById(data.id)
    );
      console.log("data" ,deleteQuestion ,data.id)
    getQuestionBankStore(true);
    setModalVisible(false);
    setTitleEdit("Xóa câu hỏi thành công !");
    setType("success");
    setModalVisibleNoti(true);
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <Box alignItems="center" mt={3}>
            <Icon name="delete2" size={50}></Icon>
            <Text fontSize={18} color="seen" textAlign="center" mt={3} mb={3}>
              {data
                ? "Bạn có chắc chắn muốn xóa dữ liệu này không ?"
                : "Chưa chọn thông báo nào để xóa"}
            </Text>
          </Box>
          {data ? (
            <Box flexDirection="row">
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Box
                  borderRadius={5}
                  borderWidth={1}
                  borderColor="buttonColor"
                  mt={2}
                  mr={2}
                  width={width * 0.4}
                  alignItems="center"
                  backgroundColor="rgba(99, 99, 99, 0.1)"
                >
                  <Text style={{ padding: 10 }} color="deleteColor">
                    Hủy
                  </Text>
                </Box>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  deleteQuestions();
                }}
              >
                <Box
                  borderRadius={5}
                  borderWidth={1}
                  borderColor="buttonColor"
                  mt={2}
                  backgroundColor="buttonColor"
                  width={width * 0.4}
                  alignItems="center"
                >
                  <Text
                    style={{ padding: 10, color: "#ffffff", right: 0 }}
                    numberOfLines={1}
                  >
                    Xóa
                  </Text>
                </Box>
              </TouchableOpacity>
            </Box>
          ) : (
            <Box alignItems="center">
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Box
                  borderRadius={5}
                  borderWidth={1}
                  borderColor="rgba(125, 125, 125, 0.3)"
                  mt={2}
                  backgroundColor="buttonColor"
                  width={width * 0.3}
                  alignItems="center"
                >
                  <Text
                    style={{ padding: 10, color: "#ffffff", right: 0 }}
                    numberOfLines={1}
                  >
                    Xác nhận
                  </Text>
                </Box>
              </TouchableOpacity>
            </Box>
          )}
        </ScrollView>
      </Box>
    </Box>
  );
};
