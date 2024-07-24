import React from "react";
import { TouchableOpacity, Dimensions } from "react-native";
import { Box, Text } from "../rebass";
import { Icon } from "./svg-icon";
import dayjs from "dayjs";
const { width, height } = Dimensions.get("screen");

export const CardHistoryExam = (props: {
  subject: string;
  status: string;
  submittedTime: string;
  points: number;
}) => {
  return (
    <Box
      width="90%"
      borderRadius={10}
      borderWidth={1}
      borderColor="rgba(125, 125, 125, 0.3)"
      mt={1}
    >
      <Text fontSize={16} color="#636363" fontWeight={700} padding={1}>
        Bài thi:{" "}
        <Text fontSize={14} fontWeight={400} color="#636363">
          {props.subject}
        </Text>
      </Text>
      <Text fontSize={16} color="#636363" fontWeight={700} padding={1}>
        Trạng Thái:{" "}
        <Text fontSize={14} fontWeight={400} color="#636363">
          {props.status}
        </Text>
      </Text>
      <Text fontSize={16} color="#636363" fontWeight={700} padding={1}>
        Thời Gian Nộp:{" "}
        <Text fontSize={14} fontWeight={400} color="#636363">
          {dayjs(props.submittedTime).format("hh:mm -DD-MM-YYYY")}
        </Text>
      </Text>
      <Text fontSize={16} color="#636363" fontWeight={700} padding={1}>
        Điểm Số:{" "}
        <Text fontSize={18} fontWeight={600} color="#E60000">
          {props.points}
          <Text fontSize={14} fontWeight={400} color="#636363">
            /100
          </Text>
        </Text>
      </Text>
      <Box alignItems="center" mt={2}>
  
      </Box>
    </Box>
  );
};
