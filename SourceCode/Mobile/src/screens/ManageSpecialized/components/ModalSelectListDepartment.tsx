import { Dimensions } from "react-native";
import React from "react";
import { Box, Text } from "../../../rebass";
import { FlatList } from "react-native";
import { ListRenderItemInfo } from "react-native";
import { TouchableOpacity } from "react-native";
import ICCheckAll from "../../../components/svg-icon/ICCheckAll";
import { TouchableWithoutFeedback } from "react-native";

const ModalSelectListDepartment = ({
  data,
  setValue,
  setModalChoose,
  value,
  loadMore,
}: {
  data: any;
  setValue: (value: any) => void;
  setModalChoose: (value: boolean) => void;
  value: number[];
  loadMore: () => void;
}) => {
  const { height, width } = Dimensions.get("screen");
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
            <Text color="#1C7988" fontSize={22} mb={2} mt={1}>Danh sách chuyên ngành</Text>
          <FlatList
            data={data}
            showsVerticalScrollIndicator={false}
            onEndReached={() => {
              loadMore();
            }}
            onEndReachedThreshold={0.5}
            renderItem={(info: ListRenderItemInfo<any>) => {
              const { item } = info;
             const checkItem = value.includes(item.id);
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
                    setValue(item.id);
                    // setModalChoose(false);
                  }}
                >
                  <Box
                    width={30}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    {checkItem && <ICCheckAll></ICCheckAll>}
                  </Box>
                  <Text ml={2} color="seen" fontSize={15} width={"85%"}>
                    {item.id} - {item.department_name}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
            <TouchableOpacity onPress={() => {setModalChoose(false)}}>
              <Box
                borderRadius={5}
                borderWidth={1}
                borderColor="rgba(125, 125, 125, 0.3)"
                mt={1}
                mb={1}
                backgroundColor="buttonColor"
                width={width * 0.4}
                alignItems="center"
              >
                <Text
                  style={{ padding: 10, color: "#ffffff", right: 0 }}
                  numberOfLines={1}
                >
                  Xong
                </Text>
              </Box>
            </TouchableOpacity>
        </Box>
      
    </Box>
  );
};

export default ModalSelectListDepartment;
