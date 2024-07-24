import {useEffect, useState} from "react";
import {Dimensions, TextInput, TouchableOpacity} from "react-native";
import {Box} from "../rebass";

const {height} = Dimensions.get("screen");
export const CardAddQuestion = (props: {
    title?: string;
    iconName?: string;
    data?: any;
    isSelected?: string;
    choose?: any;
    setQuestion?: any;
    question?: any;
    index: number;
}) => {
    const [onChange, setChange] = useState<any>();
    const {
        data,
        isSelected,
        choose,
        setQuestion,
        question,
        index,
    } = props;
    const [answerAmount, setAnswerAmount] = useState(data);
    const [da, setDa] = useState<number>();
    const setChoose = async (id: number) => {
        const newQuestion = question;
        const newAnswer = newQuestion[index].answers;
        for (let i = 0; i < newAnswer.length; i++) {
            if (i === id) {
                newAnswer[i].answersStatus = 1;
            } else {
                newAnswer[i].answersStatus = 0;
            }
        }
        newQuestion[index].answers = newAnswer;
        setQuestion(newQuestion);
        setDa(id);
    };
    const setTextAnswer = (value: string, id: number) => {
        const newQuestion = question;
        if (newQuestion[index].answers.length > 0) {
            newQuestion[index].answers[id].answersName = value;
            setQuestion(newQuestion);
        }
    };
    const setTextQuestion = (value: string) => {
        const newQuestion = question;
        newQuestion[index].questionsName = value;
        setQuestion(newQuestion);
    };
    useEffect(() => {
        setChange(answerAmount);
    }, []);
    useEffect(() => {
        data.answers.forEach((answer: any, index: number) => {
            if (answer.answersStatus == 1) {
                setDa(index);
            }
        });
    }, [data.answers]);

    return (
        <Box>
            <Box alignItems="center" flexDirection="row">
                <TextInput
                    placeholder={"Điền câu hỏi ..."}
                    multiline={true}
                    textAlignVertical="top"
                    //@ts-ignore
                    width="90%"
                    style={{minHeight: height * 0.15, color: "black"}}
                    editable={false}
                    borderRadius={10}
                    borderWidth={1}
                    borderColor="rgba(125, 125, 125, 0.3)"
                    fontSize={16}
                    padding={2}
                    marginBottom={10}
                    defaultValue={question[index].questionsName}
                    onChangeText={(value) => setTextQuestion(value)}
                ></TextInput>
                {/* <TouchableOpacity
          onPress={() => {
            choose(index);
          }}
          style={{ marginLeft: 5 }}
        >
          {isSelected ? (
            <Icon name="chooseBox"></Icon>
          ) : (
            <Icon name="CheckBox"></Icon>
          )}
        </TouchableOpacity> */}
            </Box>
            {onChange &&
                onChange.answers.map((answer: any, index2: number) => {
                    return (
                        <Box
                            key={index2}
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <TextInput
                                //@ts-ignore
                                width="90%"
                                borderRadius={10}
                                borderWidth={1}
                                borderColor="rgba(125, 125, 125, 0.3)"
                                fontSize={16}
                                padding={2}
                                marginBottom={10}
                                multiline
                                style={{minHeight: height * 0.075 }}
                                editable={false}
                                placeholder={"Câu trả lời số " + (index2 + 1)}
                                defaultValue={question[index]?.answers[index2]?.answersName}
                                onChangeText={(value) => setTextAnswer(value, index2)}
                            ></TextInput>
                            <TouchableOpacity
                                delayPressIn={0}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginLeft: 5,
                                    marginBottom: 10,
                                    height: "60%",
                                    width: "10%",
                                }}
                                disabled
                                // onPress={() => setChoose(index2)}
                            >
                                <Box
                                    height={19}
                                    width={19}
                                    borderColor="#DADADA"
                                    borderRadius={50}
                                    borderWidth={1}
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Box
                                        height={12}
                                        width={12}
                                        borderColor="#DADADA"
                                        borderRadius={50}
                                        backgroundColor={index2 === da ? "green" : "null"}
                                    ></Box>
                                </Box>
                            </TouchableOpacity>
                        </Box>
                    );
                })}
        </Box>
    );
};
