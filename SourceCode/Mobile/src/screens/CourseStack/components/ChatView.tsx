import React from "react";
import { Box, Text } from "../../../rebass";
import { FastImage } from "components-base";
import { TouchableOpacity } from "react-native";
import { Linking } from "react-native";
import { CardAttachments } from "../../../components/CardAttachments";

const ChatView = ({
  name,
  time,
  file,
  avatar,
  content,
  isTeacher
}: {
  name: string;
  time: string;
  file: string;
  avatar: string;
  content: string;
  isTeacher? : boolean;
}) => {
  return (
    <Box
      style={{
        flexDirection: "row",
        marginBottom: 10,
        flex: 1,
        width: "100%",
      }}
    >
      {avatar ? (
        <FastImage
          style={{
            height: 36,
            width: 36,
            borderRadius: 50,
          }}
          source={{
            uri: avatar,
          }}
          onError={() => {}}
        />
      ) : (
        <Box
          width={36}
          height={36}
          borderRadius={50}
          backgroundColor="buttonColor"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="#ffffff" fontSize={19} fontWeight="bold">
            {name?.split(" ").slice(-1).join(" ").charAt(0) || "T"}
          </Text>
        </Box>
      )}
      <Box style={{ flex: 1, width: "100%" }}>
        <Box
          style={{
            backgroundColor: "#EFF2F5",
            borderRadius: 10,
            padding: 10,
            marginLeft: 5,
          }}
        >
          <Box style={{ flexDirection: "row" }}>
            <Text style={{ color: isTeacher ? 'red' : "blue", fontWeight: "700", marginBottom: 2 }}>
              {name}
            </Text>
            <Text fontSize={13} ml={1} fontWeight={"400"}>
              {time}
            </Text>
          </Box>
          <Text style={{ maxWidth: "90%", fontSize: 16 }}>{content}</Text>
          {file && (
            <TouchableOpacity
              style={{ marginTop: 10 }}
              onPress={() => Linking.openURL(file)}
            >
              <Box alignItems="center" mb={1}>
                <CardAttachments
                  title={file}
                  checkFile={file?.split(".").pop()}
                  widthFile={"100%"}
                />
              </Box>
            </TouchableOpacity>
          )}
        </Box>
      </Box>
    </Box>
  );
};
export default ChatView;
