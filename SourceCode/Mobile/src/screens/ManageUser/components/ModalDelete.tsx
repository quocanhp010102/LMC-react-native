import React from "react";
import { Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { Box, Text } from "../../../rebass";
import { Icon } from "../../../components/svg-icon";
import { generateApiService } from "../../../services/ApiService";
import { UserApi } from "../../../services/api/Keycloak/UserApi";

const { width } = Dimensions.get("screen");
export const ModalDelete = (props: {
  data?: any;
  setModalVisible: any;
  setType: (value: string) => void;
  setModalVisibleNotifi: (value: boolean) => void;
  onRefresh: () => void;
  setDisabled: (value: boolean) => void;
  setUserChoose: () => void;
}) => {
  const {
    data,
    setModalVisible,
    setType,
    setModalVisibleNotifi,
    onRefresh,
    setDisabled,
    setUserChoose,
  } = props;

  const deleteUser = async () => {
    try {
      const response = await generateApiService.delete(
        UserApi.deleteUser(),
        data
      );
      if (response) {
        setDisabled(true);
        setModalVisible(false);
        setType("success");
        setTimeout(() => {
          setModalVisibleNotifi(true);
        }, 500);
        setUserChoose()
        onRefresh();
      } else {
        setType("warning");
        setTimeout(() => {
          setModalVisibleNotifi(true);
        }, 500);
       
      }
    } catch (error) {
      setModalVisible(false);
     
      setType("error");
      setTimeout(() => {
        setModalVisibleNotifi(true);
      }, 500);
    }
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
            <Icon name="confirmDeleteNote" size={50} color={"#FD1A1A"}></Icon>
            <Text fontSize={18} color="seen" textAlign="center" mt={3} mb={3}>
              Bạn có chắc chắn muốn xóa dữ liệu này không ?
            </Text>
          </Box>
          <Box flexDirection="row">
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Box
                borderRadius={5}
                borderWidth={1}
                borderColor="#FD1A1A"
                mt={2}
                mr={2}
                width={width * 0.4}
                alignItems="center"
              >
                <Text style={{ padding: 10, color: "#FD1A1A" }}>Hủy</Text>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                deleteUser();
              }}
            >
              <Box
                borderRadius={5}
                borderWidth={1}
                borderColor="rgba(125, 125, 125, 0.3)"
                mt={2}
                backgroundColor="#00A8B5"
                width={width * 0.4}
                alignItems="center"
              >
                <Text
                  style={{
                    padding: 10,
                    color: "white",
                  }}
                  numberOfLines={1}
                >
                  Xóa
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>
        </ScrollView>
      </Box>
    </Box>
  );
};
