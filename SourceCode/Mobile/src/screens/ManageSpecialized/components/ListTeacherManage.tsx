import {  ActivityIndicator, Dimensions, FlatList, RefreshControl, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import React from "react";
import { Box ,Text} from "../../../rebass";

interface IListTeacherManage {
  setValue: (value: any) => void;
  setModalChoose: (value: boolean) => void;
  value: any;
  keyExtractor: (_: any, index: number) => string;
  onEndReached: () => void;
  teachers: any;
  isRefreshing : boolean;
  onRefresh : () => void;
}

const ListTeacherManage = React.memo((
    props : IListTeacherManage
) => {
    const {
      setValue,
      setModalChoose,
      value,
      keyExtractor,
      onEndReached,
      teachers,
      isRefreshing ,
      onRefresh
    } = props;
    const { width ,height} = Dimensions.get("window")
 
  return (
    <TouchableOpacity
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
    }}
    activeOpacity={1}
    onPress={() => {
        setModalChoose(false);
    }}
  >
    <TouchableWithoutFeedback>
  
    <Box
      style={{
        maxHeight: height * 0.7,
        width: width * 0.9,
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
    <FlatList
      showsVerticalScrollIndicator={false}
      data={teachers}
      keyboardDismissMode="on-drag"
      contentContainerStyle={{ width : width*0.8}}
      renderItem={(items: any) => {
        const item = items.item
        return (
          <TouchableOpacity
            delayPressIn={0}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
              borderWidth: 1,
              height: 40,
              borderRadius: 8,
              borderColor: "#636363",
 
            }}
            onPress={() => {
              setValue({ value: item.id, label: item.lecturer_fullname }),
                setModalChoose(false);
            }}
          >
            <Box
              height={19}
              width={19}
              borderColor="#DADADA"
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
                backgroundColor={value?.value === item?.id ? "green" : "null"}
              ></Box>
            </Box>
            <Text ml={2} color="seen" fontSize={15}>
              {item.lecturer_fullname}
            </Text>
          </TouchableOpacity>
        );
      }}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.8}
      keyExtractor={keyExtractor}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => {
            onRefresh()
          }}
        />
      }
      ListFooterComponent={
        <>{teachers.isLoadMore && <ActivityIndicator size={"small"} />}</>
      }
    />
    </Box>
   
    </TouchableWithoutFeedback>
    </TouchableOpacity>
  );
});

export default ListTeacherManage;
