import React from "react";
import {Dimensions} from "react-native";
import {Box, Card, Text} from "../rebass";
import {FastImage} from "components-base";

const {width, height} = Dimensions.get("screen");

export const CardSpecialized = React.memo((props: {
    title?: string;
    course?: number;
    image?: string;
    isSelected?: boolean;
    englishType?: boolean
}) => {
    return (
        <Card
            height={143}
            width={width * 0.45}
            borderRadius={5}

            borderColor={props.isSelected ? "#00ff00" : "rgba(125, 125, 125, 0.3)"}
            style={{
                marginTop: 22,
                backgroundColor : props.englishType ? "#DAFBFF" : "white",
                shadowColor: '#171717',
                shadowOffset: {width: -2, height: 6},
                shadowOpacity: 0.2,
                shadowRadius: 3,

            }}

        >
            <Box height={96} width={"100%"}>
                <FastImage
                    source={{uri: props.image}}
                    style={{
                        height: "100%",
                        width: "100%",
                        borderRadius :5,
                        backgroundColor :"white"
                    }}
                />
            </Box>
            <Box py={1} flex={1}>
                <Box alignItems="center" px={1}>
                    <Text
                        fontSize={15}
                        fontWeight="600"
                        color="#1C7988"
                        numberOfLines={1}
                        style={{textTransform: "uppercase"}}
                    >
                        {props.title}
                    </Text>
                    <Text fontWeight={400} fontSize={10} color="#1C7988" mt={1} mb={1}>
                        {props.course} khóa học
                    </Text>
                </Box>

            </Box>
        </Card>
    );
});
