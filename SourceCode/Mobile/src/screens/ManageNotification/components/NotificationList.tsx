import React, { useState, useEffect, memo } from "react";
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

interface Props {
  choose: (id : any) => void;
  isSelected: boolean;
  data: any;
  setTypeModal: (value : string) => void;
  setModalVisible: (value : boolean) => void;
  setNotificationChoose: (value : string) => void;
  index: number;
}
const genericMemo: <T>(component: T) => T = memo;
export const NotificationList: React.FC<Props> = genericMemo((props: Props) => {
  const {
    data,
    choose,
    index,
    isSelected,
    setTypeModal,
    setModalVisible,
    setNotificationChoose,
  } = props;
  
  return (
    <Box
      style={{
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start",
      
      }}
    >
      <TouchableOpacity
        onPress={() => {
          choose(data.id);
        }}
        style={{
          width: "10%",
          flexDirection: "row",
        }}
      >
        <Box
          height={40}
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {isSelected ? (
            <Icon name="chooseBox"></Icon>
          ) : (
            <Icon name="CheckBox"></Icon>
          )}
        </Box>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setNotificationChoose(data),
            setTypeModal("view"),
            setModalVisible(true);
        }}
        style={{
          width: "65%",
          flexDirection: "row",
        }}
      >
        <Box
          style={{
            width: 1,
            backgroundColor: "#D4D4D4",
          }}
        ></Box>
        <Box
          height={40}
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Text
            style={{
              color: "#636363",
              fontSize: 12,
              textAlign: "center",
            }}
            numberOfLines={2}
          >
            {data.notificationTitle}
          </Text>
        </Box>
      </TouchableOpacity>

      <Box
        style={{
          width: "25%",
          flexDirection: "row",
        }}
      >
        <Box
          style={{
            width: 1,
            backgroundColor: "#D4D4D4",
          }}
        ></Box>
        <Box
          height={40}
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#636363",
              fontSize: 12,

              textAlign: "center",
            }}
          >
            {data.authorities
              ? data.authorities.length === 2
                ? "Cả hai"
                : data.authorities.length === 1
                ? data.authorities[0].name === "ROLE_STUDENT"
                  ? "Sinh viên"
                  : "Giảng viên"
                : "Thiếu"
              : null}
          </Text>
        </Box>
      </Box>
    </Box>
  );
});
