import React, {Dispatch, SetStateAction} from "react";
import {Dimensions, ScrollView, TouchableOpacity,} from "react-native";
import {Box, Text} from "../../../rebass";
import Swiper from "react-native-swiper";
import RenderHtml from "react-native-render-html";
import {dataTemplate} from "./fakeData";
import {useNavigation} from "@react-navigation/native";

const {width, height} = Dimensions.get("screen");
const TemplateDetail = (data: any, setModalVisibleTemplate: any, setQuestion: any) => {
    const navigation = useNavigation();
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Box alignItems="center">
                <Text color="textColor" fontSize={18} fontWeight={700}>
                    {data.courseName}
                </Text>
            </Box>
            <RenderHtml
                contentWidth={width}
                //@ts-ignore
                contentHeight={height}
                source={{
                    html: data.questionsName,
                }}
            />

            <Box flexDirection="row" justifyContent="space-between">
                <TouchableOpacity onPress={() => setModalVisibleTemplate(false)}>
                    <Box
                        alignItems="center"
                        justifyContent="center"
                        borderRadius={8}
                        borderWidth={1}
                        borderColor="buttonColor"
                        width={60}
                        height={40}
                        backgroundColor="rgba(99, 99, 99, 0.1)"
                    >
                        <Text fontWeight="bold" color="deleteColor">
                            Hủy
                        </Text>
                    </Box>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate("/tao-bai-thi-tu-luan", {
                            newQuestion: data.questionsName,
                        }),
                            setModalVisibleTemplate(false);
                    }}
                >
                    <Box
                        alignItems="center"
                        justifyContent="center"
                        borderWidth={1}
                        height={40}
                        width={60}
                        borderRadius={8}
                        backgroundColor="buttonColor"
                        borderColor="buttonColor"
                        right={0}
                    >
                        <Text color="#ffffff" fontWeight="bold">
                            Chọn
                        </Text>
                    </Box>
                </TouchableOpacity>
            </Box>
        </ScrollView>
    );
};
export const ModalTemplate = (props: {
    setModalVisibleTemplate: any;
    setQuestion: Dispatch<SetStateAction<string>>

}) => {
    const {setModalVisibleTemplate, setQuestion} = props;
    return (
        <Box
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 22,
            }}
        >
            <Box
                style={{
                    height: "70%",
                    width: "90%",
                    margin: 20,
                    backgroundColor: "white",
                    borderRadius: 20,
                    padding: 10,
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5,
                }}
            >
                <Swiper showsButtons={true}>
                    {dataTemplate.map((data) => (
                        <Box>
                            {TemplateDetail(data, setModalVisibleTemplate, setQuestion)}
                        </Box>
                    ))}
                </Swiper>
            </Box>
        </Box>
    );
};
