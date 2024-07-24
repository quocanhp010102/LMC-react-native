import { Dimensions } from "react-native";
import React from "react";
import { Box, Text } from "../../../rebass";
import { FlatList } from "react-native";
import { ListRenderItemInfo } from "react-native";
import { TouchableOpacity } from "react-native";
import { InputWithIcon } from "../../../components/InputWithIcon";

const ClassListModal = ({
  data,
  setValue,
  setModalChoose,
  value,
  loadMore,
  queryInput,
  setQueryInput,
}: {
  data: any;
  setValue: (value: any) => void;
  setModalChoose: (value: boolean) => void;
  value: any;
  loadMore: () => void;
  queryInput: string;
  setQueryInput: (value: string) => void;
}) => {
  const { height, width } = Dimensions.get("screen");
  const checkValidate = async (inputValue: any) => {
    if (inputValue.length <= 255) {
      setQueryInput(inputValue);
    } else {
      setQueryInput("");
    }
  };

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
          maxHeight: height * 0.7,
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
        <Box width={width * 0.8} flex={1} mb={6}>
          <InputWithIcon
            icon="search"
            value={queryInput}
            onChangeText={(e) => checkValidate(e)}
            iconColor="inputClose"
            placeholderTextColor="black"
            iconSize={16}
            border
          />
        </Box>
        <FlatList
          data={data}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            loadMore();
          }}
          onEndReachedThreshold={0.5}
          renderItem={(info: ListRenderItemInfo<any>) => {
            const { item, index } = info;
            return (
              <TouchableOpacity
                delayPressIn={0}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                  borderWidth: 1,
                  minHeight: 40,
                  borderRadius: 8,
                  borderColor: "#636363",
                  width: width * 0.8,
                }}
                onPress={() => {
                  setValue({
                    value: item.classroomID,
                    label: item.classroomName,
                  }),
                    setModalChoose(false);
                }}
              >
                <Box
                  height={19}
                  width={19}
                  borderColor={
                    value.value === item.classroomID ? "#059DCE" : "#DADADA"
                  }
                  borderRadius={50}
                  borderWidth={1}
                  ml={2}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Box
                    height={12}
                    width={12}
                    borderColor="#DADADA"
                    borderRadius={50}
                    backgroundColor={
                      value.value === item.classroomID ? "#059DCE" : "null"
                    }
                  ></Box>
                </Box>
                <Text ml={2} color="seen" fontSize={15} width={"85%"}>
                  {item.classroomID} - {item.classroomName}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </Box>
    </Box>
  );
};

export default ClassListModal;
