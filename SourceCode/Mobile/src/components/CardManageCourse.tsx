import React, { ReactNode } from "react";
import { Dimensions } from "react-native";
import { Box, Card, Text } from "../rebass";
const { width, height } = Dimensions.get("screen");
interface Props {
  choose?: boolean;
  children: ReactNode;
  title: string;
  data?: any
}
export const CardManageCourse = ({ choose, children, title }: Props) => {
  return (
    <Card
      width={choose ? width * 0.88 : width * 0.95}
      borderRadius={10}
      // borderWidth={1}
      borderColor="rgba(125, 125, 125, 0.3)"
      style={{
        marginTop: 10,
      }}
      backgroundColor="#E5F3F8"
      py={2}
    >
      <Box alignItems="center"    >
        <Text
          color="#00A8B5"
          style={{
            textTransform: "uppercase",
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
            paddingVertical : 16 ,
            width : "90%"
          }}
        >
          {title}
        </Text>
      </Box>
      <Box alignItems="center">
        <Box
          width={"90%"}
          borderRadius={10}
          backgroundColor="#FFFFFF"
          borderColor="#00A8B5"
        >
          {children ? children : null}
        </Box>
      </Box>
    </Card>
  );
};
