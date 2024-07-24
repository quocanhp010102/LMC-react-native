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
  data: any;
  index: number;
  setTypeModal: (value : string) => void;
  setModalVisible: (value : boolean) => void;
  setNotificationChoose: (value : any) => void;
}
const genericMemo: <T>(component: T) => T = memo;
export const NotificationList: React.FC<Props> = genericMemo((props: Props) => {
  const { data, index, setTypeModal, setModalVisible, setNotificationChoose } =
    props;

  return (
    <Box
      key={data.id}
      style={{
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start",
        backgroundColor:
          index % 2 === 0 ? "#E5F3F8" : "white",
      }}
    >
      <TouchableOpacity
        onPress={() => {
          setNotificationChoose(data),
            setTypeModal("view"),
            setModalVisible(true);
        }}
        style={{
          width: "30%",
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
          <Box>
            <Text
              style={{
                color: "#636363",
                fontSize: 12,
                textAlign: "center",
              }}
            >
              {data.user.fullName}
            </Text>
          </Box>
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
          >
            {data.typeUser == "1" ? "Giảng Viên" : "Sinh Viên"}
          </Text>
        </Box>
      </Box>
      <TouchableOpacity
        onPress={() => {
          setNotificationChoose(data),
            setTypeModal("view"),
            setModalVisible(true);
        }}
        style={{
          width: "35%",
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
            numberOfLines={2}
          >
            {data.content}
          </Text>
        </Box>
      </TouchableOpacity>
      <Box
        style={{
          width: "10%",
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
          {data.status === "1" ? (
            <Icon name="chooseBox"></Icon>
          ) : (
            <Icon name="CheckBox"></Icon>
          )}
        </Box>
      </Box>
    </Box>
  );
});
