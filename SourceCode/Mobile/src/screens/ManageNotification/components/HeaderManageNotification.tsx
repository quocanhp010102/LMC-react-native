import { Dimensions, TouchableOpacity } from "react-native";
import React from "react";
import { width } from "styled-system";
import { Devider } from "../../../components/Devider";
import { InputWithIcon } from "../../../components/InputWithIcon";
import { Icon } from "../../../components/svg-icon";
import { Box, Flex, Text } from "../../../rebass";

interface IHeaderManageNotification {
  setAll: (value: boolean) => void;
  all: boolean;
  chooseAll: () => void;
}

const HeaderManageNotification = (props: IHeaderManageNotification) => {
  const { setAll, all, chooseAll } = props;

  const { width } = Dimensions.get("screen");

  return (
    <Box
      width={width * 0.95}
      mt={2}
      ml="2.5%"
      borderWidth={1}
      borderTopLeftRadius={8}
      borderTopRightRadius={8}
      borderBottomWidth={0}
      borderColor="#D4D4D4"
      backgroundColor={'#00A8B5'}
    >
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
            setAll(!all), chooseAll();
          }}
          style={{
            width: "10%",
          }}
        >
          <Box
            height={50}
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            {all ? (
              <Icon name="chooseBox" color={'white'}></Icon>
            ) : (
              <Icon name="CheckBox" color={'white'}></Icon>
            )}
          </Box>
        </TouchableOpacity>
        <Box
          style={{
            width: "65%",
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
              TIÊU ĐỀ
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
              ĐỐI TƯỢNG
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HeaderManageNotification;
