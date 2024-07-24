import React from "react";
import { Dimensions, TouchableOpacity } from "react-native";
import { Box, Text } from "../rebass";
import { Icon } from "./svg-icon";
import ICCancel from "./svg-icon/ICCancel";
const { width, height } = Dimensions.get("screen");

export const CardLesson = (props: { title?: string; iconName?: string , delete?: () => void  }) => {
  return (
    <Box
      width={width * 0.9}
      borderRadius={10}
      borderWidth={1}
      borderColor="rgba(125, 125, 125, 0.3)"
      style={{ position: "relative" }}
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      height={50}
    >
      <Box alignItems="center" flexDirection="row" position="relative" ml={2}>
        <Text
          fontSize={12}
          fontWeight="400"
          color="#636363"
          numberOfLines={2}
          width="90%"
        >
          {props.title}
        </Text>
      </Box>
      {props.delete ? (
        <TouchableOpacity onPress={props.delete} >
          <Box mr={3} style={{ padding : 6 }}>
            <ICCancel></ICCancel>
          </Box>
        </TouchableOpacity>
      ) : (
        <Box mr={3}>
          <Icon name="NotificationCourse" size={16} color="#56C8C8" />
        </Box>
      )}
    </Box>
  );
};
