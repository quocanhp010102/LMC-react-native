import React, { useEffect } from "react";
import { Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { Icon } from "../../../components/svg-icon";
import { Box, Text } from "../../../rebass";
const { width, height } = Dimensions.get("screen");
export const ModalDelete = (props: {
  data?: any;
  setModalVisible: any;
  handleDeleteTutorials?: any;
  setModalVisibleNoti?: any;
  setType?: any;
  setTitleNoti?: any;
}) => {
  const {
    data,
    setModalVisible,
    handleDeleteTutorials,
    setModalVisibleNoti,
    setType,
    setTitleNoti,
  } = props;
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
              {typeof data == "number"
                ? "Bạn có chắc chắn muốn xóa dữ liệu này không ?"
                : "Chưa chọn khóa học để xóa !"}
            </Text>
          </Box>
          {typeof data == "number" ? (
            <Box flexDirection="row">
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Box
                  borderRadius={5}
                  borderWidth={1}
                  borderColor="textColor"
                  mt={2}
                  mr={2}
                  width={width * 0.4}
                  alignItems="center"
                  backgroundColor="rgba(99, 99, 99, 0.1)"
                >
                  <Text style={{ padding: 10, color: "#CC0000" }}>Hủy</Text>
                </Box>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleDeleteTutorials();
                }}
              >
                <Box
                  borderRadius={5}
                  borderWidth={1}
                  mt={2}
                  backgroundColor="buttonColor"
                  width={width * 0.4}
                  alignItems="center"
                  borderColor="buttonColor"
                >
                  <Text style={{ padding: 10, color: "#ffffff", right: 0 }}>
                    Xóa
                  </Text>
                </Box>
              </TouchableOpacity>
            </Box>
          ) : (
            <Box alignItems="center">
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Box
                  borderRadius={5}
                  borderWidth={1}
                  borderColor="buttonColor"
                  mt={2}
                  width={width * 0.4}
                  alignItems="center"
                  backgroundColor="rgba(99, 99, 99, 0.1)"
                >
                  <Text style={{ padding: 10, color: "#CC0000" }}>Hủy</Text>
                </Box>
              </TouchableOpacity>
            </Box>
          )}
        </ScrollView>
      </Box>
    </Box>
  );
};
