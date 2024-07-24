import { StyleSheet } from "react-native";
import React from "react";
import { Box, Text } from "../../../rebass";
import { Icon } from "../../../components/svg-icon";
import { FlatList } from "react-native";
import ChatView from "./ChatView";
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native";

const PopupChat = ({ file }: { file: any }) => {
  const testChat = [
    {
      name: "Giảng viên",
      time: "11:22",
      file: file?.files_path,
      avatar: "",
      content: "Hiểu bài chưa các em?",
    },
    {
      name: "Học sinh 1",
      time: "12:22",
      file: "",
      avatar: "",
      content: "Em không hiểu, em không hiểu!",
    },
    {
      name: "Học sinh 2",
      time: "12:25",
      file: "",
      avatar: "",
      content: "Em hiểu rồi ạ",
    },
  ];

  return (
    <Box
      width="95%"
      borderRadius={10}
      borderWidth={1}
      borderColor="rgba(125, 125, 125, 0.3)"
      mt={2}
      padding={3}
    >
      <Box flexDirection="row" flex={1} width={"100%"}>
        <Icon name="AttachmentsCourse" size={20} color="white" />
        <Text fontSize={16} color="#1C7988" ml={1}>
          Thảo luận
        </Text>
      </Box>
      <FlatList
        data={testChat}
        style={styles.flatListStyle}
        renderItem={(items) => {
          const { item, index } = items;
          return (
            <ChatView
              content={item.content}
              file={item.file}
              avatar={item.avatar}
              time={item.time}
              name={item.name}
              isTeacher={index === 0}
            />
          );
        }}
        ListFooterComponent={() => {
          return (
            <Box flexDirection={"row"} style={{ gap: 10 }}>
              <TextInput
                style={{
                  height: 40,
                  flex: 1,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "rgba(125, 125, 125, 0.3)",
                }}
              />
              <TouchableOpacity
                style={{
                  height: 40,
                  width: 50,
                  backgroundColor: "#56C8C8",
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text color={"white"} fontSize={17} fontWeight={"bold"}>
                  Gửi
                </Text>
              </TouchableOpacity>
            </Box>
          );
        }}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    width: 120,
    height: 35,
    backgroundColor: "#00A8B5",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  textButtonColor: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
  flatListStyle: {
    marginTop: 10,
    flex: 1,
  },
});

export default PopupChat;
