import React, {useState} from "react";
import {Dimensions, FlatList, ListRenderItemInfo, Modal, RefreshControl} from "react-native";
import {Devider} from "../../components/Devider";
import {Header, NotificationIcon} from "../../components/Header";
import {Box, Flex, Text} from "../../rebass";
import {generateApiService} from "../../services/ApiService";
import {FeedBackApi} from "../../services/api/FeedBack/FeedBackApi";
import {ModalAdd} from "./components/ModalAdd";
import {ModalDelete} from "./components/ModalDelete";
import {ModalView} from "./components/ModalView";
import {NotificationList} from "./components/NotificationList";
import PopupCloseAutomatically from "../../components/PopupCloseAutomatically";

const {width} = Dimensions.get("screen");
const ManageFeedback = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [listNotification, setListNotification] = useState<any>([]);
    const [typeModal, setTypeModal] = useState<string>();
    const [userChoose, setNotificationChoose] = useState<any>([]);
    const refreshing = false
    const [page, setPage] = useState(0);
    const size = 10
    const [totalPages, setTotalPages] = useState(0);
    const [modalVisibleNoti, setModalVisibleNoti] = useState(false);
    const [type, setType] = useState<string>("");
    const [titleNoti, setTitleNoti] = useState("");

    const getData = async (page: number, size: number) => {
        const dataFeedBack = await generateApiService.get(
            FeedBackApi.getAllFeedBack(page, size)
        );
        setTotalPages(dataFeedBack.totalPages);
        setListNotification(dataFeedBack.content);
    };


    React.useEffect(() => {
        getData(0, 20);
        setPage(0);
    }, []);
    const LoadMore = async (page: number, size: number) => {
        const dataFeedBack = await generateApiService.get(
            FeedBackApi.getAllFeedBack(page, size)
        );

        setListNotification([...listNotification, ...dataFeedBack.content]);
    };
    const isCloseToBottom = ({
                                 layoutMeasurement,
                                 contentOffset,
                                 contentSize,
                             }: any) => {
        const paddingToBottom = 20;
        return (
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom
        );
    };
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
                        mb={2}
                    >
                        <Flex flex={1}>
                            <Text
                                fontWeight="bold"
                                fontSize={20}
                                color="textColor"
                                lineHeight={30}
                            >
                                QUẢN LÝ PHẢN HỒI
                            </Text>
                        </Flex>
                    </Flex>
                </Flex>

                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => {
                                getData(0, 20), setPage(0);
                            }}
                        />
                    }
                    onScroll={({nativeEvent}) => {
                        if (isCloseToBottom(nativeEvent)) {
                            if (page < totalPages) {
                                LoadMore(page + 1, size);
                                setPage(page + 1);
                            }
                        }
                    }}
                    scrollEventThrottle={400}
                    ListHeaderComponent={<HeaderManageFeedBack/>}
                    data={listNotification}
                    renderItem={(items: ListRenderItemInfo<any>) => {
                        const {index, item} = items;
                        return (
                            <Box
                                width={"95%"}
                                ml="2.5%"
                                borderLeftWidth={1}
                                borderRightWidth={1}
                                borderColor="#D4D4D4"
                                borderBottomWidth={
                                    items.index === listNotification.length - 1 ? 1 : 0
                                }
                                borderBottomLeftRadius={
                                    items.index === listNotification.length - 1 ? 8 : 0
                                }
                                borderBottomRightRadius={
                                    items.index === listNotification.length - 1 ? 8 : 0
                                }
                                backgroundColor={
                                    items.index % 2 === 0 ? "#E5F3F8" : "white"
                                }
                            >
                                <NotificationList
                                    key={index}
                                    data={item}
                                    index={index}
                                    setNotificationChoose={setNotificationChoose}
                                    setTypeModal={setTypeModal}
                                    setModalVisible={setModalVisible}
                                ></NotificationList>
                            </Box>
                        );
                    }}
                    ListFooterComponent={
                        <Box height={50}>
                        </Box>
                    }
                ></FlatList>

                <Modal animationType="slide" transparent={true} visible={modalVisible}>
                    {typeModal === "add" ? (
                        <ModalAdd
                            setModalVisible={setModalVisible}
                            getData={getData}
                        ></ModalAdd>
                    ) : typeModal === "delete" ? (
                        <ModalDelete
                            setModalVisible={setModalVisible}
                            getData={getData}
                        ></ModalDelete>
                    ) : (
                        <ModalView
                            data={userChoose}
                            setModalVisible={setModalVisible}
                            getData={getData}
                            setModalVisibleNoti={setModalVisibleNoti}
                            setType={setType}
                            setTitleNoti={setTitleNoti}
                        ></ModalView>
                    )}
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisibleNoti}
                    onRequestClose={() => {
                        setModalVisibleNoti(!modalVisibleNoti);
                    }}
                >
                    <PopupCloseAutomatically
                        titleEdit={titleNoti}
                        title="Tạo tin tứu"
                        type={type}
                        isOpen={modalVisibleNoti}
                        setIsOpen={setModalVisibleNoti}
                    />
                    {/* <PopupNotification
            titleEdit={titleNoti}
            title="Tạo tin tứu"
            type={type}
            setModalVisible={setModalVisibleNoti}
          ></PopupNotification> */}
                </Modal>
            </Box>
        </Box>
    );
};
export default ManageFeedback;


const HeaderManageFeedBack = () => {
    return (
        <Box
            width={width * 0.95}
            mt={2}
            ml="2.5%"
            borderWidth={1}
            borderTopLeftRadius={8}
            borderTopRightRadius={8}
            borderBottomWidth={0}
            borderColor="#D4D4D4"
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
                <Box
                    style={{
                        width: "30%",
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
                            Họ tên
                        </Text>
                    </Box>
                </Box>
                <Box
                    style={{
                        width: "25%",
                        flexDirection: "row",
                    }}
                >
                    <Box
                        style={{
                            width: 1,

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
                            phân quyền
                        </Text>
                    </Box>
                </Box>
                <Box
                    style={{
                        width: "35%",
                        flexDirection: "row",
                    }}
                >
                    <Box
                        style={{
                            width: 1,

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
                            tiêu đề
                        </Text>
                    </Box>
                </Box>
                <Box
                    style={{
                        width: "10%",
                        flexDirection: "row",
                    }}
                >
                    <Box
                        style={{
                            width: 1,

                        }}
                    ></Box>
                    <Box
                        height={50}
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                        }}
                    ></Box>
                </Box>
            </Box>
        </Box>
    );
}
