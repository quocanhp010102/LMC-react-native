import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colors } from "../../../constants";
import { TextInput } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Box } from "../../../rebass";
import { Dimensions } from "react-native";
import { backgroundColor } from "styled-system";
import { ScrollView } from "react-native";
import { Modal } from "react-native";
import ModalSelectListDepartment from "./ModalSelectListDepartment";
const { width, height } = Dimensions.get("screen");

export const ModalCreateSubject = ({
  disableModal,
  items,
  setValue,
  setModalChoose,
  value,
  LoadMoreDepartment,
  modalChoose,
  event,
  setEvent,
  nameSubject,
  setNameSubject,
  codeSubject,
  setCodeSubject,
  postSubject,
  textRefName,
  textRefCode,
}: {
  disableModal: () => void;
  items: any[];
  setValue: (value: any) => void;
  setModalChoose: (value: boolean) => void;
  value: any;
  LoadMoreDepartment: () => void;
  modalChoose: boolean;
  event: boolean;
  setEvent: React.Dispatch<React.SetStateAction<boolean>>;
  nameSubject: string;
  setNameSubject: React.Dispatch<React.SetStateAction<string>>;
  codeSubject: string;
  setCodeSubject: React.Dispatch<React.SetStateAction<string>>;
  postSubject: () => void;
  textRefName: any;
  textRefCode: any;
}) => {
  return (
    <View style={styles.modal}>
      <View style={styles.container}>
        <Text style={styles.title}>Tạo môn học mới</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <Text style={styles.labelInput}>Tên môn học</Text>
            <TextInput
              style={styles.inputControl}
              value={nameSubject}
              onChangeText={(e) => {
                console.log(e);
                setNameSubject(e);
              }}
            />
            <TextInput
              ref={textRefName}
              style={{ color: "red", marginBottom: 10 }}
              value={""}
              editable={false}
            ></TextInput>
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.labelInput}>Mã môn học</Text>
            <TextInput
              style={styles.inputControl}
              value={codeSubject}
              onChangeText={(e) => setCodeSubject(e)}
            />
            <TextInput
              ref={textRefCode}
              style={{ color: "red", marginBottom: 10 }}
              value={""}
              editable={false}
            ></TextInput>
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.labelInput}>Phân loại môn học</Text>
            <TouchableOpacity
              onPress={() => setEvent(true)}
              style={{ width: Dimensions.get("screen").width * 0.8 }}
            >
              <View style={styles.optionContainer}>
                <View
                  style={[
                    styles.dotView,
                    { borderColor: event ? "#1C7988" : "#DADADA" },
                  ]}
                >
                  <View
                    style={[
                      styles.miniDot,
                      { backgroundColor: event ? "#1C7988" : "transparent" },
                    ]}
                  ></View>
                </View>
                <Text style={styles.textOption}>
                  Môn học chung cho tất cả chuyên ngành học
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setEvent(false)}
              style={{ width: Dimensions.get("screen").width * 0.8 }}
            >
              <View style={styles.optionContainer}>
                <View
                  style={[
                    styles.dotView,
                    { borderColor: !event ? "#1C7988" : "#DADADA" },
                  ]}
                >
                  <View
                    style={[
                      styles.miniDot,
                      { backgroundColor: !event ? "#1C7988" : "transparent" },
                    ]}
                  ></View>
                </View>
                <Text style={styles.textOption}>Chọn chuyên ngành</Text>
              </View>
            </TouchableOpacity>
            {!event && (
              <TouchableOpacity
                onPress={() => {
                  setModalChoose(true);
                }}
              >
                <Box
                  borderRadius={5}
                  borderWidth={1}
                  borderColor="rgba(125, 125, 125, 0.3)"
                  mt={1}
                  mb={1}
                  backgroundColor="buttonColor"
                  width={100}
                  alignItems="center"
                >
                  <Text
                    style={{ padding: 10, color: "#ffffff", right: 0 }}
                    numberOfLines={1}
                  >
                    Chọn
                  </Text>
                </Box>
              </TouchableOpacity>
            )}
          </View>
          <Box
            alignItems="center"
            flexDirection={"row"}
            justifyContent="center"
            mt={2}
          >
            <TouchableOpacity
              onPress={() => {
                disableModal?.();
              }}
            >
              <Box
                borderRadius={5}
                borderWidth={1}
                borderColor="rgba(125, 125, 125, 0.3)"
                mt={1}
                mb={1}
                width={width * 0.4}
                alignItems="center"
              >
                <Text
                  style={{
                    padding: 10,
                    right: 0,
                    color: "red",
                  }}
                  numberOfLines={1}
                >
                  Huỷ
                </Text>
              </Box>
            </TouchableOpacity>
            <Box width={20} />
            <TouchableOpacity
              onPress={() => {
                postSubject();
              }}
            >
              <Box
                borderRadius={5}
                borderWidth={1}
                borderColor="rgba(125, 125, 125, 0.3)"
                mt={1}
                mb={1}
                backgroundColor="buttonColor"
                width={width * 0.4}
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
        </ScrollView>
      </View>
      <Modal animationType="slide" transparent={true} visible={modalChoose}>
        <ModalSelectListDepartment
          data={items}
          setValue={setValue}
          value={value}
          setModalChoose={setModalChoose}
          loadMore={LoadMoreDepartment}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.30)",
  },
  container: {
    maxHeight: "90%",
    width: "90%",
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.text_white,
  },
  title: {
    fontSize: 24,
    color: Colors.secondary,
    textAlign: "center",
    fontWeight: "600",
  },
  formContainer: {
    marginTop: 12,
  },
  labelInput: {
    fontSize: 14,
    color: Colors.text_4A4A4A,
    marginBottom: 8,
  },
  inputControl: {
    borderWidth: 1,
    borderColor: Colors.br_D4D4D4,
    borderRadius: 8,
    height: 40,
    paddingHorizontal: 4,
  },
  textOption: {
    marginLeft: 10,
  },
  optionContainer: {
    width: "100%",
    height: 40,
    flexDirection: "row",
    alignItems: "center",
  },
  dotView: {
    height: 19,
    width: 19,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: 9.5,
  },
  miniDot: {
    width: 12,
    height: 12,
    borderRadius: 50,
  },
});
