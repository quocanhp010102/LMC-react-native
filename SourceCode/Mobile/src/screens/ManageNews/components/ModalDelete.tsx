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
const { width, height } = Dimensions.get("screen");
export const ModalDelete = (props: {
  data?: any;
  setModalVisible: any;
  deleteNews: any;
}) => {
  const { data, setModalVisible, deleteNews } = props;
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
            <Icon name="confirmDeleteNote" size={50} color={'red'}></Icon>
            <Text fontSize={18} color="seen" textAlign="center" mt={3} mb={3}>
              {data.length > 0
                ? " Bạn có chắc chắn muốn xóa dữ liệu này không ?"
                : "Chưa chọn tin tức nào để xóa !"}
            </Text>
          </Box>
          {data.length > 0 ? (
            <Box flexDirection="row">
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Box
                  borderRadius={5}
                  borderWidth={1}
                  borderColor="#CC0000"
                  mt={2}
                  mr={2}
                  width={width * 0.4}
                  alignItems="center"
               
                >
                  <Text
                    style={{
                      padding: 10,
                      fontSize: 18,
                      color: "#CC0000",
                    }}
                  >
                    Hủy
                  </Text>
                </Box>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  deleteNews(), setModalVisible(false);
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
                  <Text
                    style={{
                      padding: 10,
                      color: "#ffffff",
                      right: 0,

                      fontSize: 18,
                    }}
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
                    style={{
                      padding: 10,
                      color: "#ffffff",
                      right: 0,

                      fontSize: 18,
                    }}
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
