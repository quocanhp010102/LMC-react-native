import { Dimensions, TouchableOpacity } from "react-native";

import { Box, Flex, Text } from "../rebass";
const { width, height } = Dimensions.get("screen");

export const CardNavigationQA = (props: {
  question: any[];
  tl: any[];
  setModalVisible: any;
  onPressTouch: any;
}) => {
  return (
    <Flex
      flex={1}
      mt={2}
      flexDirection="row"
      flexWrap="wrap"
      alignItems="flex-start"
    >
      {props.question.map((question : any, index : number) => (
        <TouchableOpacity
          style={{ padding: 5 }}
          key={`${question.id}-${index}` }
          onPress={() => {
            props.setModalVisible(false), props.onPressTouch(index);
          }}
        >
          <Box
            width={width * 0.13}
            height={height * 0.075}
            borderRadius={3}
            mt={1}
            borderColor="buttonColor"
            borderWidth={1}
            alignItems="center"
            justifyContent="space-between"
          >
            <Text mt={0.5} color="textColor" fontSize={18}>
              {index + 1}
            </Text>
            <Box
              style={{
                borderBottomLeftRadius: 2,
                borderBottomRightRadius: 2,
              }}
              backgroundColor={
                props.tl.find((item) => item.idQuestion == question.id)
                  ? "buttonColor"
                  : null
              }
              height={10}
              width={width * 0.13}
            ></Box>
          </Box>
        </TouchableOpacity>
      ))}
    </Flex>
  );
};
