import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  Modal,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Devider } from "../../components/Devider";
import { Header, NotificationIcon } from "../../components/Header";
import { Box, Flex, Text } from "../../rebass";
import { API } from "../../services";
import { generateApiService } from "../../services/ApiService";
import { useAppSelector } from "../../hooks/ReduxHook";
import { useResultFeedBack } from "./hooks/useResultFeedBack";
const ViewFeedBack = () => {
  const { feedBack, keyExtractor } = useResultFeedBack();
  return (
    <Box bg="defaultBackground" position="relative">
      <Box height="100%">
        <Header search profile title="PHẢN HỒI THẮC MẮC" leftButton="back">
          <NotificationIcon />
        </Header>
        <Box height={1} bg="#636363" opacity={0.3} mt={2} />
        <Flex mx={2} mb={2}>
          <Devider />
          <Text
            fontWeight="bold"
            fontSize={20}
            color="textColor"
            lineHeight={30}
          >
            Danh sách phản hồi
          </Text>
        </Flex>

        <FlatList
          showsHorizontalScrollIndicator={false}
          data={feedBack.data}
          keyboardDismissMode="on-drag"
          renderItem={(items: ListRenderItemInfo<any>) => {
            return <FeeBackItem node={items.item} index={items.index} />;
          }}
          showsVerticalScrollIndicator={false}
      
          onEndReached={feedBack.handleLoadMore}
          onEndReachedThreshold={0.8}
          keyExtractor={keyExtractor}
          ListFooterComponent={
            <>
              {feedBack.isLoadMore && <ActivityIndicator />}
              <Box height={20} />
            </>
          }
        />
      </Box>
    </Box>
  );
};

const FeeBackItem = (props: { node: any; index: number }) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <TouchableOpacity onPress={() => setModalVisible(true)}>
      <Flex
        alignItems="center"
        flexDirection="row"
        mx={2}
        bg={props.index % 2 == 0 ? "rgba(99, 99, 99, 0.05)" : ""}
      >
        <Flex
          // bg="#C4C4C4"
          overflow="hidden"
          position="relative"
          borderRadius={4}
          justifyContent="center"
          alignItems="center"
          width={70}
          height={70}
        >
          <Text>{props.index + 1}</Text>
        </Flex>

        <Text color="normalText" fontSize={2} numberOfLines={2} width="80%">
          {props.node.title}
        </Text>
      </Flex>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <ModalView data={props.node} setModalVisible={setModalVisible} />
      </Modal>
    </TouchableOpacity>
  );
};
export const ModalView = (props: { data?: any; setModalVisible: any }) => {
  const role: any = useAppSelector((state) => state.users.userList[0].role);
  const { data, setModalVisible } = props;
  return (
    <Box
      position="relative"
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
          borderRadius: 10,
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
        <Text
          fontSize={16}
          color="textColor"
          fontWeight="bold"
          mt={15}
          mb={15}
          padding={2}
        >
          PHẢN HỒI THẮC MẮC
        </Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: "rgba(99, 99, 99, 0.05)" }}
        >
          <Box
            style={{
              flex: 1,
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
            mt={2}
            mx={2}
          >
            <Box width="50%">
              <Flex flexDirection="column">
                <Text
                  fontSize={14}
                  fontWeight="bold"
                  marginBottom={2}
                  color="#7D7D7D"
                >
                  Người đặt câu hỏi:
                </Text>
                <Text fontSize={14} marginBottom={2} ml={2}>
                  {data.user.firstName} {data.user.lastName}
                </Text>
              </Flex>
            </Box>
            <Box width="50%">
              <Flex flexDirection="column">
                <Text
                  fontSize={14}
                  fontWeight="bold"
                  marginBottom={2}
                  color="#7D7D7D"
                >
                  Phân quyền:
                </Text>
                <Text fontSize={14} marginBottom={2} ml={2}>
                  {role == 0 ? "Sinh viên" : "Giảng viên"}
                </Text>
              </Flex>
            </Box>
          </Box>
          <Box height={1} width="100%" bg="separator" mb={1} mt={1} />
          <Flex flexDirection="column" mx={2}>
            <Text
              fontSize={14}
              fontWeight="bold"
              marginBottom={2}
              color="#7D7D7D"
            >
              Tiêu đề:
            </Text>
            <Text fontSize={14} marginBottom={2} ml={2}>
              {data.title}
            </Text>
          </Flex>
          <Box height={1} width="100%" bg="separator" mb={1} mt={1} />
          <Flex flexDirection="column" mx={2}>
            <Text
              fontSize={14}
              fontWeight="bold"
              marginBottom={2}
              color="#7D7D7D"
            >
              Thắc mắc cần giải đáp:
            </Text>
            <Text fontSize={14} marginBottom={2} ml={2}>
              {data.content}
            </Text>
          </Flex>
          <Box height={1} width="100%" bg="separator" mb={1} mt={1} />
          <Flex flexDirection="column" mx={2}>
            <Text
              fontSize={14}
              fontWeight="bold"
              marginBottom={2}
              color="#7D7D7D"
            >
              Nội dung giải đáp:
            </Text>
            <Text fontSize={14} marginBottom={2} ml={2}>
              {data.answerContent}
            </Text>
          </Flex>
        </ScrollView>
        <Flex alignItems="center" justifyContent="center">
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Flex
              // flex={1}
              height={45}
              width={100}
              borderRadius={8}
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              backgroundColor="buttonColor"
              // my={2}
              mt={2}
              mx={2}
            >
              <Text fontSize={17} fontWeight="bold" color="#fff">
                Xong
              </Text>
            </Flex>
          </TouchableOpacity>
        </Flex>
      </Box>
    </Box>
  );
};

export default ViewFeedBack;
