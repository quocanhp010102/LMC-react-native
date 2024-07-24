import { TouchableOpacity } from "react-native";
import { Box, Text } from "./../rebass";
import { Icon } from "./svg-icon";
import ICCancel from "./svg-icon/ICCancel";
import { useEffect } from "react";
export const PopupNotification = (props: {
  title?: string;
  setModalVisible: any;
  type?: string;
  titleEdit?: string;
}) => {
  const { title, setModalVisible, type, titleEdit } = props;
  const checkType = () => {
    switch (type) {
      case "success":
        return (
          <>
            <Icon name="modalAlert" size={54}></Icon>
            <Text mt={21} fontSize={18} color="#404040">
              {titleEdit ? titleEdit : title ? title + " thành công!" : ""}
            </Text>
          </>
        );
      case "warning":
        return (
          <>
            <Icon name="warningIcon" size={64}></Icon>
            <Text mt={21} fontSize={18} color="#404040">
              {titleEdit ? titleEdit : "Có lỗi xảy ra!"}
            </Text>
          </>
        );
      case "error":
        return (
          <>
            <Icon name="errorIcon" size={54}></Icon>
            <Text mt={21} fontSize={18} color="#404040">
              {titleEdit ? titleEdit : title ? title + " thất bại!" : ""}
            </Text>
          </>
        );
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
          margin: 20,
          backgroundColor: "white",
          borderRadius: 10,
          padding: 20,
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
        height={210}
        width="90%"
      >
        <TouchableOpacity
          onPress={() => {
            setModalVisible("false");
          }}
          style={{ position: "absolute", padding : 10,  paddingBottom : 20 ,  paddingLeft : 20, top : 0 , right : 0}}
        >
          <Box>
            <ICCancel></ICCancel> 
          </Box>
        </TouchableOpacity>
        <Box alignItems={"center"}>
          {checkType()}
          <Box alignItems="center">
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                backgroundColor: "#00A8B5",
                justifyContent: "center",
                alignItems: "center",
                height: 40,
                width: 110,
                borderRadius: 6,
                marginTop: 35,
              }}
            >
              <Text color="white" fontWeight="bold">
                Xác nhận
              </Text>
            </TouchableOpacity>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
