import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import { Dimensions, TouchableOpacity } from "react-native";
import { Box, Text } from "../rebass";
import { Icon } from "./svg-icon";
import * as ImagePicker from "expo-image-picker";
export const CardAttachmentsUpload = (props: {
  title?: string;
  iconName?: string;
  chooseFile?: any;
  addFile?: any;
  typeFile?: string;
}) => {
  const [fileResponse, setFileResponse] = useState([]);
  const pickDocument = async () => {
    if (props.typeFile) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        // aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        let localUri = result.assets[0].uri;
        let filename = localUri.split("/").pop();
        let match = /\.(\w+)$/.exec(filename || "");
        let type = match ? `image/${match[1]}` : `image`;
        if (type === `image/jpg`) {
          type = `image/jpeg`;
        }
        if (props.addFile) {
          props.addFile({
            uri: localUri,
            name: filename,
            mimeType: type,
            type: "success",
            height: result.assets[0].height,
            width: result.assets[0].width,
          });
        } else {
          props.chooseFile({
            uri: localUri,
            name: filename,
            mimeType: type,
            type: "success",
            height: result.assets[0].height,
            width: result.assets[0].width,
          });
        }
      } else {
        if (props.addFile) {
          props.addFile({
            type: "cancel",
          });
        } else {
          props.chooseFile({
            type: "cancel",
          });
        }
      }
    } else {
      let result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        multiple: false,
        copyToCacheDirectory: true,
      });

    
      if (props.addFile) {
        props.addFile(result);
      } else {
        props.chooseFile(result);
      }
    }
  };

  return (
    <Box
      borderRadius={10}
      borderWidth={1}
      borderColor="rgba(125, 125, 125, 0.3)"
      style={{ position: "relative" }}
      flexDirection="row"
      alignItems="center"
      height={40}
    >
      <TouchableOpacity
        onPress={pickDocument}
        style={{
          flexDirection: "row",
          height: "100%",
          width: "100%",
          alignItems: "center",
        }}
      >
        <Box ml={2}>
          <Icon name="UploadFile"></Icon>
        </Box>
        <Text color="deleteColor" ml={1}>
          {props.title ? props.title : " Tải lên tài liệu"}
        </Text>
      </TouchableOpacity>
    </Box>
  );
};
