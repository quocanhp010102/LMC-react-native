import React, {useEffect, useState} from "react";
import {Dimensions, TouchableOpacity,} from "react-native";
import {Box, Text} from "../rebass";
import {Icon} from "./svg-icon";
import ICCancel from "./svg-icon/ICCancel";

const {width} = Dimensions.get("screen");

export const CardAttachments = (props: {
    title?: string;
    iconName?: string;
    checkFile?: string;
    widthFile? : string
    delete?: () => void
}) => {
    const {title, iconName, checkFile ,widthFile} = props;
    const [typeFile, setTypeFile] = useState<any>("otherFile");
    const iconCheck = () => {
        if (checkFile?.toLowerCase() == "doc" || checkFile == "docx") {
            setTypeFile("docxFile");
        } else if (checkFile?.toLowerCase() == "pdf") {
            setTypeFile("test");
        } else if (checkFile?.toLowerCase() == "xlsx") {
            setTypeFile("xlsxFile");
        } else if (checkFile?.toLowerCase() == "pptx") {
            setTypeFile("pptxFile");
        } else {
            setTypeFile("otherFile");
        }
    };
    useEffect(() => {
        iconCheck();
    }, [checkFile]);
    return (
        <Box
            width={widthFile || width * 0.9}
            borderRadius={10}
            borderWidth={1}
            borderColor="rgba(125, 125, 125, 0.3)"
            style={{position: "relative"}}
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            height={50}
        >
            <Box
                alignItems="center"
                flexDirection="row"
                position="relative"
                ml={2}
                width="80%"
            >
                <Icon name={typeFile} size={10} color="white"/>
                <Text
                    fontSize={12}
                    fontWeight="400"
                    color="#636363"
                    marginLeft={2}
                    numberOfLines={2}
                >
                    {title}
                </Text>
            </Box>
            {props.delete ? (
                <TouchableOpacity onPress={props.delete}>
                    <Box mr={3} style={{padding: 6}}>
                        <ICCancel></ICCancel>
                    </Box>
                </TouchableOpacity>
            ) : (
                <Box ml={3} width="15%">
                    <Icon name={"downloadAttachments"} size={20} color="#56C8C8"/>
                </Box>
            )}
        </Box>
    );
};
