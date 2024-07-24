import React from "react";
import { Image, Dimensions } from "react-native";
import { Box, Flex, Text, Card } from "../rebass";
import { Icon } from "./svg-icon";
import { FastImage } from "components-base";
const { width, height } = Dimensions.get("screen");
export const CardCourse = (props: {
  percent?: number;
  title?: string;
  image?: string;
  class?: string;
}) => {
  let progressColor = "#00A717";
   if(props.percent !== undefined) {
  if (props.percent < 40) {
    progressColor = "#D70000";
  } else if (props.percent < 70) {
    progressColor = "#D7A700";
  } else {
    progressColor = "#00A717";
  }
}
  return (
    <Card
      width={width * 0.45}
      borderRadius={10}
      borderWidth={1}
      borderColor="rgba(125, 125, 125, 0.3)"
      style={{
        marginLeft: 10,
        marginTop: 10,
      }}
    >
      <Box height={90} width={"100%"}>
        <FastImage
          
          source={{ uri: props.image }}
          style={{
            height: "100%",
            width: "100%",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
        /> 
   
      </Box>
      <Box>
        <Box ml={1} mt={2} height={30}>
          <Text
            fontSize={12}
            fontWeight="500"
            color="#636363"
            lineHeight={15}
            numberOfLines={2}
          >
            {props.title}
          </Text>
        </Box>
        {props.percent !== undefined ? (
          <Box alignItems="center" mb={2}>
            {/* <Box width="100%" paddingRight={11}>
              <Text
                width="100%"
                fontSize={8}
                fontWeight="100"
                color="#636363"
                fontStyle="italic"
                textAlign="right"
              >
                Hoàn thành:
                <Text
                  width="100%"
                  fontSize={8}
                  fontWeight="100"
                  color={progressColor}
                  fontStyle="italic"
                >
                  {props.percent}%
                </Text>
              </Text>
            </Box>
            <Box
              height={5}
              width="90%"
              backgroundColor="white"
              borderWidth={1}
              borderRadius={5}
              borderColor="rgba(125, 125, 125, 0.3)"
            >
              <Box
                backgroundColor={progressColor}
                width={props.percent + "%"}
                height={3}
                borderRadius={5}
              />
            </Box> */}
          </Box>
        ) : (
          <Box mt={2} ml={1} mb={2}>
            {/* <Text fontWeight={400} fontSize={10} color="seen">
              Lớp:@{props.class}
            </Text> */}
          </Box>
        )}
      </Box>
    </Card>
  );
};
