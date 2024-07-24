import { Dimensions } from "react-native";
import { Box, Text ,TextInput } from "../rebass";
const { width, height } = Dimensions.get("screen");
export const CardEssay = (props: {
  da : any;
  handleDa : any;
  idQuestion: number;
  dataQuestions: any[];
  tl: object;
}) => {
  return (
    <Box>
      {props.dataQuestions.map((question : any) => (
        <Box width="100%" key={question.id}>
          <Text fontSize={16} fontWeight={700} color="#636363" padding={2}>
            {question.content}
          </Text>
          <Box alignItems="center">
            <TextInput
              multiline={true}
              textAlignVertical="top"
              width={width * 0.9}
              height={height * 0.25}
              borderRadius={10}
              borderWidth={1}
              borderColor="rgba(125, 125, 125, 0.3)"
              padding={4}
              fontSize={16}
              marginBottom={10}
            ></TextInput>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
