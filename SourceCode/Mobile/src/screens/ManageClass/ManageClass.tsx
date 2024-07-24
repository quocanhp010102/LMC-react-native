import React, {useCallback, useEffect, useState} from "react";
import {Dimensions, ListRenderItemInfo, Modal, RefreshControl, TouchableOpacity,} from "react-native";
import {Devider} from "../../components/Devider";
import {Header, NotificationIcon} from "../../components/Header";
import {InputWithIcon} from "../../components/InputWithIcon";
import {Icon} from "../../components/svg-icon";
import {Box, Flex, Text} from "../../rebass";
import {generateApiService} from "../../services/ApiService";
import {ClassApi} from "../../services/api/Class/ClassApi";
import {ClassList} from "./components/ClassList";
import {ModalAdd} from "./components/ModalAdd";
import {FlatList} from "react-native-gesture-handler";
import {useManageClass} from "./hooks/useManageClass";
import PopupCloseAutomatically from "../../components/PopupCloseAutomatically";

const {width} = Dimensions.get("screen");
const ManageClass = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleNotifi, setModalVisibleNotifi] = useState(false);
    const [type, setType] = useState<string>("");
    const [editTitle, setEditTitle] = useState("");
    const [selected, setSelected] = useState<any>([]);
    const {keyExtractor, onEndReached, classList, onRefresh ,queryInput ,setQueryInput ,checkValidate} = useManageClass();



    const choose = useCallback(
        (id: number) => {
            let newData = [...selected];
            if (selected.includes(id)) {
                newData = newData.filter((x) => x !== id);
            } else {
                newData.push(id);
            }
            setSelected(newData);
        },
        [selected]
    );


    return (
        <Box bg="defaultBackground" position="relative" height="100%">
            <Box height="100%">
                <Header logo search profile>
                    <NotificationIcon/>
                </Header>
                <Box height={1} bg="#636363" opacity={0.3} mt={2}/>
                <Flex px={2}>
                    <Devider></Devider>
                    <Flex
                        flexDirection="row"
                        alignItems="flex-start"
                        justifyContent="center"
                    >
                        <Flex flex={1}>
                            <Text
                                fontWeight="bold"
                                fontSize={20}
                                color="textColor"
                                lineHeight={30}
                            >
                                QUẢN LÝ LỚP HỌC
                            </Text>
                        </Flex>
                    </Flex>
                </Flex>
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
                        value={queryInput}
                        onChangeText={(e) => checkValidate(e)}
                        iconColor="inputClose"
                        placeholderTextColor="black"
                        placeholder="Nhập tìm kiếm"
                        iconSize={16}
                        onPress={() => setQueryInput("")}
                        border
                    />
                </Flex>
                <Box
                    flexDirection="row"
                    justifyContent="space-between"
                    ml="2.5%"
                    mr="2.5%"
                >
                    <TouchableOpacity
                        style={{
                            borderRadius: 8,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#56C8C8",
                            height: 40,
                            paddingHorizontal: 10
                        }}
                        onPress={() => {
                            setModalVisible(true);
                        }}
                    >
                        <Icon name="addIcon" color={'white'}></Icon>
                        <Text ml={1} color="white">
                            Thêm
                        </Text>
                    </TouchableOpacity>
                </Box>

                <FlatList
                    refreshControl={
                        <RefreshControl refreshing={false} onRefresh={onRefresh}/>
                    }
                    data={classList.data}
                    ListHeaderComponent={<HeaderManageClass queryInput={queryInput}/>}
                    renderItem={(items: ListRenderItemInfo<any>) => {
                        const {item, index} = items;
                        const isSelected = selected.includes(item.id);
                        return (
                            <Box
                                width={"95%"}
                                ml="2.5%"
                                borderLeftWidth={1}
                                borderRightWidth={1}
                                borderColor="#D4D4D4"
                                borderBottomWidth={items.index === classList.data.length - 1 ? 1 : 0}
                                borderBottomLeftRadius={
                                    items.index === classList.data.length - 1 ? 8 : 0
                                }
                                borderBottomRightRadius={
                                    items.index === classList.data.length - 1 ? 8 : 0
                                }
                                backgroundColor={
                                     index % 2 === 0 ? "#E5F3F8" : "white"
                                }
                            >
                                <ClassList
                                    key={index}
                                    choose={choose}
                                    isSelected={isSelected}
                                    data={item}
                                    index={index}
                                    setType={setType}
                                    listClass={classList.data}
                                    getData={onRefresh}
                                    setListClass={classList.setData}
                                    setModalVisibleNotifi={setModalVisibleNotifi}
                                    setEditTitle={setEditTitle}
                                ></ClassList>
                            </Box>
                        );
                    }}
                    onEndReached={onEndReached}
                    keyExtractor={keyExtractor}
                />

                <Box height={20}/>

                {modalVisibleNotifi ? (
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisibleNotifi}
                        onRequestClose={() => {
                            setModalVisibleNotifi(!modalVisibleNotifi);
                        }}
                    >
                        <PopupCloseAutomatically
                            titleEdit={editTitle}
                            title="Tạo lớp học thành công"
                            type={type}
                            isOpen={modalVisibleNotifi}
                            setIsOpen={setModalVisibleNotifi}
                        />
                        {/* <PopupNotification
              titleEdit={editTitle}
              title="Tạo lớp học thành công"
              type={type}
              setModalVisible={setModalVisibleNotifi}
            ></PopupNotification> */}
                    </Modal>
                ) : (
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                    >
                        <ModalAdd
                            setModalVisible={setModalVisible}
                            listClass={classList.data}
                            setListClass={classList.setData}
                            getData={onRefresh}
                            setType={setType}
                            setModalVisibleNotifi={setModalVisibleNotifi}
                            setEditTitle={setEditTitle}
                        ></ModalAdd>
                    </Modal>
                )}
            </Box>
        </Box>
    );
};
export default ManageClass;

interface IHeaderManageClass {
    queryInput: string;
}

const HeaderManageClass = (props: IHeaderManageClass) => {
    const {queryInput} = props;
    return (
        <Box
            width={width * 0.95}
            mt={2}
            ml="2.5%"
            borderWidth={1}
            borderTopLeftRadius={8}
            borderTopRightRadius={8}
            borderColor="#D4D4D4"
            borderBottomWidth={0}
            backgroundColor={'#00A8B5'}
        >
            <Box
                style={{
                    flex: 1,
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "flex-start",
                }}
            >
                {/* <Box
                    style={{
                        width: "10%",
                    }}
                >
                    <Box
                        height={50}
                        style={{alignItems: "center", justifyContent: "center"}}
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
                            STT
                        </Text>
                    </Box>
                </Box> */}
                <Box
                    style={{
                        width: "25%",
                        flexDirection: "row",
                    }}
                >
                    <Box
                        style={{
                            width: 1,
                            backgroundColor: "#00A8B5",
                        }}
                    ></Box>
                    <Box
                        height={50}
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
                            MÃ LỚP
                        </Text>
                    </Box>
                </Box>
                <Box
                    style={{
                        width: "60%",
                        flexDirection: "row",
                    }}
                >
                    <Box
                        style={{
                            width: 1,
                            backgroundColor: "#00A8B5",
                        }}
                    ></Box>

                    <Box
                        height={50}
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
                            TÊN LỚP
                        </Text>
                    </Box>
                </Box>
                  <Box
                    style={{
                        width: "15%",
                    }}
                >
                    <Box
                        height={50}
                        style={{alignItems: "center", justifyContent: "center"}}
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
                            SĨ SỐ
                        </Text>
                    </Box>
                </Box>
            </Box>

        </Box>
    );
};
