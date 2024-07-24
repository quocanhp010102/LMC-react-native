import { View } from "react-native";

import { Box, Text } from "../rebass";
import CardAnswer from "./CardAnswer";
let a: any[] = [];

export const CardQuestion = (props: {
  da: any;
  handleDa: any;
  idQuestion: number;
  dataQuestions: any[];
  tl: any[];
  setCardPosition: any;
  page?: number;
}) => {
  const onLayout = async (event: any, id: number) => {
    const { y } = await event.nativeEvent.layout;
    a[id] = y;
    props.setCardPosition(a);
  };

  const sentence = (page: number): number => {
    let result: number = 0;
    if (page == 0) {
      result = 0;
    } else if (page > 0) {
      result = page * 5
    }
    return result;
  }
  return (
    <Box>
      {props.dataQuestions.map((question: any, index: any) => (
        <Box width="100%" key={question.id}>
          <Text fontSize={16} fontWeight={700} color="#636363" mt={2} px={2}>
            Câu {sentence(props.page ?? 0) + index + 1 + ": " + question.questionsName}
          </Text>
          <CardAnswer
            question={question.answers}
            questionChoose={props.handleDa}
            idQuestion={question.id}
            da={props.tl.find((item: any) => item.idQuestion == question.id)?.value}
            tl={props.tl}
          ></CardAnswer>
          <View onLayout={(event) => onLayout(event, index)}></View>
        </Box>
      ))}
    </Box>
  );
};
