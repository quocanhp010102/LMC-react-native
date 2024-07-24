import {
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Box, Text } from "../rebass";
const { width } = Dimensions.get("screen");
const CardAnswer = (props: {
  question: any;
  idQuestion: number;
  questionChoose : any;
  da : any;
  tl: object;
}) => {
  const { question } = props;
  const questionChoose = (idAnswer : number) => {
    props.questionChoose(props.idQuestion, idAnswer);
  };

  return (
    <Box>
      {props.question?.map((Answer: any, index : number) => (
        <TouchableOpacity
          key={`${question.id}-${index}`}
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 5,
          }}
          onPress={() => {
            questionChoose(Answer?.id);
          }}
        >
          <Box
            width={width * 0.9}
            borderRadius={10}
            borderWidth={1}
            borderColor="rgba(125, 125, 125, 0.3)"
            mt={1}
            flexDirection="row"
          >
            <Box
              backgroundColor="rgba(125, 125, 125, 0.1)"
              width="10%"
              style={{ borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}
              alignItems="center"
              justifyContent="center"
            >
              <Box
                height={15}
                width={15}
                borderRadius={50}
                borderWidth={2}
                alignItems="center"
                justifyContent="center"
                borderColor={props?.da == Answer?.id ? "#014F59" : "#DADADA"}
              >
                <Box
                  height={8}
                  width={8}
                  borderRadius={50}
                  backgroundColor={props?.da == Answer?.id ? "#014F59" : "null"}
                ></Box>
              </Box>
            </Box>
            <Box
              alignItems="center"
              justifyContent="center"
              style={{ minHeight: 40 }}
            >
              <Text width={width * 0.8} px={2}>
                {Answer?.answersName}
              </Text>
            </Box>
          </Box>
        </TouchableOpacity>
      ))}
    </Box>
  );
};
export default CardAnswer;
