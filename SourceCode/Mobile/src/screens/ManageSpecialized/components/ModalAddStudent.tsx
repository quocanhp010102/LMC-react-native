import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { InputWithIcon } from "../../../components/InputWithIcon";
import { Icon } from "../../../components/svg-icon";
import { Box, Flex, Text, TextInput } from "../../../rebass";
import { RefFncSelectedAll, StudentList } from "./StudentList";
import { lightColors } from "../../../themes";

interface IModalAddStudent {
  modalAdd: boolean;
  queryInputStu: string;
  checkVadidateStudent: (value: string) => void;
  setQueryInputStu: (value: string) => void;
  // setAllNew: (value: boolean) => void;
  chooseAllNewStudent: (value : boolean) => void;
  setModalVisible: (value: boolean) => void;
  onAddStudent: () => void;
  loading: boolean;
  listStudent: any;
  chooseStudent: (value: any) => void;
  setModalAdd: (value: boolean) => void;
  selectedStudent: any;
  isEmpty : boolean
  // onEndReachedAllStudent : (value: any) => void;
}

const ModalAddStudent = (props: IModalAddStudent) => {
  const {
    modalAdd,
    queryInputStu,
    checkVadidateStudent,
    setQueryInputStu,
    chooseAllNewStudent,
    setModalVisible,
    onAddStudent,
    loading,
    listStudent,
    chooseStudent,
    setModalAdd,
    selectedStudent,
    isEmpty
    // onEndReachedAllStudent
  } = props;
  const { height, width } = Dimensions.get("window");
  const allNew = useRef<boolean>(false);
  const refIconTicker =  useRef<View>()
  const refIcon = useRef<View>()
  const setAllNew = (value: boolean) => {
    refIconTicker.current?.setNativeProps({
      style: {
        opacity: value ? 1 : 0,
      },
    });
    refIcon.current?.setNativeProps({
      style: {
        opacity: !value ? 1 : 0,
      },
    });
    allNew.current = value;
    RefFncSelectedAll.current?.map((valueRef) => {
      valueRef.setIsSelected(value);
    });
    chooseAllNewStudent(value);
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
        {modalAdd ? (
          <Box alignItems="center">
            <Text fontSize={17} color="textColor" fontWeight="bold" padding={1}>
              THÊM SINH VIÊN
            </Text>
            <Flex
              mb={2}
              p={2}
              flexDirection="row"
              alignItems="center"
              borderBottomColor="tabBar"
            >
              <InputWithIcon
                icon="search"
                flex={1}
                value={queryInputStu}
                onChangeText={(e) => checkVadidateStudent(e)}
                iconColor="inputClose"
                placeholderTextColor="black"
                placeholder=""
                iconSize={16}
                onPress={() => setQueryInputStu("")}
                border
              />
            </Flex>
            {loading ? (
              <Box
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 22,
                }}
              >
                <ActivityIndicator size="large" color="#00A8B5" />
              </Box>
            ) : null}
            <Box flex={1}>
              <FlatList
                data={listStudent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                  <Box
                    mt={2}
                    borderWidth={1}
                    borderBottomWidth={0}
                    borderTopLeftRadius={8}
                    borderTopRightRadius={8}
                    borderColor={lightColors.borderColor}
                    backgroundColor={'#00A8B5'}
                  >
                    <Box
                      style={{
                        flex: 1,
                        flexDirection: "row",
                      }}
                    >
                      <Box
                        style={{
                          width: "10%",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            setAllNew(!allNew.current);
                          }}
                        >
                          <Box
                            height={40}
                            style={{
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <View
                              style={{ opacity: 0, position: "absolute" }}
                              ref={refIconTicker}
                            >
                              <Icon name="chooseBox" color={'white'}></Icon>
                            </View>
                            <View ref={refIcon}>
                              <Icon name="CheckBox" color={'white'}></Icon>
                            </View>
                          </Box>
                        </TouchableOpacity>
                      </Box>
                      <Box
                        style={{
                          width: "40%",
                          flexDirection: "row",
                        }}
                      >
                        <Box
                          style={{
                            width: 1,
                            backgroundColor: '#00A8B5'
                          }}
                        ></Box>
                        <Box
                          height={40}
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                          }}
                        >
                          <Text
                            style={{
                              color: "white",
                              fontSize: 12,
                              textTransform: "uppercase",
                              fontWeight: "bold",
                              textAlign: "center",
                            }}
                          >
                            MÃ SV
                          </Text>
                        </Box>
                      </Box>
                      <Box
                        style={{
                          width: "50%",
                          flexDirection: "row",
                        }}
                      >
                        <Box
                          style={{
                            width: 1,
                            backgroundColor:'#00A8B5'
                          }}
                        ></Box>
                        <Box
                          height={40}
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                          }}
                        >
                          <Text
                            style={{
                                color: "white",
                              fontSize: 12,
                              textTransform: "uppercase",
                              fontWeight: "bold",
                              textAlign: "center",
                            }}
                          >
                            HỌ VÀ TÊN
                          </Text>
                        </Box>
                      </Box>
                      <Box
                        style={{
                          width: "25%",
                          flexDirection: "row",
                        }}
                      ></Box>
                    </Box>
                    <Box
                      borderColor={lightColors.borderColor}
                      borderBottomWidth={1}
                      backgroundColor={"rgba(100, 116, 139, 0.05)"}
                      height={isEmpty ? 40 : 0}
                      alignItems={"center"}
                      justifyContent={"center"}
                    >
                      <Text> {isEmpty && `Không có dữ liệu`}</Text>
                    </Box>
                  </Box>
                }
                renderItem={(items: ListRenderItemInfo<any>) => {
                  return (
                    <Box
                      borderRightWidth={1}
                      borderLeftWidth={1}
                      borderColor={lightColors.borderColor}
                      borderBottomWidth={
                        listStudent.length - 1 === items.index ? 1 : 0
                      }
                      borderBottomLeftRadius={
                        listStudent.length - 1 === items.index ? 8 : 0
                      }
                      borderBottomRightRadius={
                        listStudent.length - 1 === items.index ? 8 : 0
                      }
                      backgroundColor={
                        items.index % 2 === 0
                          ? "#E5F3F8"
                          : "white"
                      }
                    >
                      <StudentList
                        key={String(items.index)}
                        choose={chooseStudent}
                        isSelectedAll={allNew.current}
                        data={items.item}
                        index={items.index}
                        setModalAdd={setModalAdd}
                        setModalVisible={setModalVisible}
                      />
                    </Box>
                  );
                }}
                // onEndReached={onEndReachedAllStudent}
                // ListFooterComponent={
                //   <Box height={30}>{students.isLoadMore && <ActivityIndicator size={"small"} />}</Box>
                // }
              />
            </Box>
            <Box flexDirection="row">
              <TouchableOpacity
                onPress={() => {
                  selectedStudent.current = [];
                  setModalVisible(false);
                }}
              >
                <Box
                  borderRadius={5}
                  borderWidth={1}
                  borderColor="#FD1A1A"
                  mt={2}
                  mr={2}
                  width={width * 0.4}
                  alignItems="center"
                >
                  <Text style={{ padding: 10, color: "#FD1A1A" }}>Hủy</Text>
                </Box>
              </TouchableOpacity>
              <TouchableOpacity onPress={onAddStudent}>
                <Box
                  borderRadius={5}
                  borderWidth={1}
                  borderColor="buttonColor"
                  mt={2}
                  backgroundColor="buttonColor"
                  width={width * 0.4}
                  alignItems="center"
                >
                  <Text style={{ padding: 10, color: "#ffffff", right: 0 }}>
                    Cập nhật
                  </Text>
                </Box>
              </TouchableOpacity>
            </Box>
          </Box>
        ) : (
          <Box alignItems="center">
            <Text fontSize={17} color="seen" fontWeight="bold" padding={1}>
              THÔNG BÁO
            </Text>
            <TextInput
              textAlignVertical="top"
              multiline={true}
              width={width * 0.8}
              height={height * 0.25}
              borderRadius={10}
              borderWidth={1}
              borderColor="rgba(125, 125, 125, 0.3)"
              padding={4}
              fontSize={16}
              marginBottom={10}
              marginTop={10}
            ></TextInput>
            <Box flexDirection="row">
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Box
                  borderRadius={5}
                  borderWidth={1}
                  borderColor="rgba(125, 125, 125, 0.3)"
                  mt={2}
                  mr={2}
                  width={width * 0.4}
                  alignItems="center"
                  backgroundColor="rgba(99, 99, 99, 0.1)"
                >
                  <Text style={{ padding: 10 }}>Hủy</Text>
                </Box>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Box
                  borderRadius={5}
                  borderWidth={1}
                  borderColor="rgba(125, 125, 125, 0.3)"
                  mt={2}
                  backgroundColor="buttonColor"
                  width={width * 0.4}
                  alignItems="center"
                >
                  <Text style={{ padding: 10, color: "#ffffff", right: 0 }}>
                    Cập nhật
                  </Text>
                </Box>
              </TouchableOpacity>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ModalAddStudent;
