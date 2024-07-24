import {ActivityIndicator, FlatList, ListRenderItemInfo, Modal, RefreshControl, TouchableOpacity,} from "react-native";
import {Devider} from "../../components/Devider";
import {Header, NotificationIcon} from "../../components/Header";
import {InputWithIcon} from "../../components/InputWithIcon";
import {Icon} from "../../components/svg-icon";
import {Box, Flex, Text} from "../../rebass";
import HeaderManageNotification from "./components/HeaderManageNotification";
import {ModalAdd} from "./components/ModalAdd";
import {ModalDelete} from "./components/ModalDelete";
import {ModalView} from "./components/ModalView";
import {NotificationList} from "./components/NotificationList";
import {useManageNotification} from "./hooks/useManageNotification";
import PopupCloseAutomatically from "../../components/PopupCloseAutomatically";

const ManageNotification = () => {
    const {
        keyExtractor,
        onEndReached,
        notifications,
        onRefresh,
        setTypeModal,
        queryInput,
        setQueryInput,
        checkValidate,
        setModalVisible,
        setAll,
        all,
        chooseAll,
        choose,
        setNotificationChoose,
        modalVisible,
        selected,
        typeModal,
        setTitleEdit,
        deleteNotification,
        setType,
        type,
        titleEdit,
        setModalVisibleNotifi,
        modalVisibleNotifi,
        userChoose,
    } = useManageNotification();

    return (
        <Box bg="defaultBackground" position="relative" height="100%">
            <Box height="100%">
                <Header logo search profile>
                    <NotificationIcon/>
                </Header>
                <Box height={1} bg="#636363" opacity={0.3} mt={2}/>
                <Box>
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
                                    QUẢN LÝ THÔNG BÁO
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

                        ml="2.5%"
                        mr="2.5%"
                    >
                        <TouchableOpacity
                            style={{
                                borderRadius: 8,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",

                                height: 40,

                            }}
                            onPress={() => {
                                setTypeModal("delete"), setModalVisible(true);
                            }}
                        >
                            <Icon name="deleteIcon"></Icon>
                            <Text ml={1} color="deleteColor">
                                Xóa
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                borderRadius: 8,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#56C8C8",
                                height: 40,
                                paddingHorizontal: 10,
                                marginLeft : 10
                            }}
                            onPress={() => {
                                setTypeModal("add"), setModalVisible(true);
                            }}
                        >
                            <Icon name="addIcon"></Icon>
                            <Text ml={1} color="white">
                                Thêm
                            </Text>
                        </TouchableOpacity>
                    </Box>
                    <Box height={5}></Box>
                </Box>
                <FlatList
                    refreshControl={
                        <RefreshControl refreshing={false} onRefresh={onRefresh}/>
                    }
                    onEndReached={onEndReached}
                    data={notifications.data}
                    ListHeaderComponent={
                        <>
                            {!notifications.isEmpty ? (
                                <HeaderManageNotification
                                    setAll={setAll}
                                    all={all}
                                    chooseAll={chooseAll}
                                ></HeaderManageNotification>
                            ) : (
                                <Box
                                    style={{alignItems: "center", justifyContent: "center"}}
                                    mt={3}
                                >
                                    <Text>Không có thông báo nào</Text>
                                </Box>
                            )}
                        </>
                    }
                    renderItem={(items: ListRenderItemInfo<any>) => {
                        const isSelected = selected.includes(items.item.id);
                        return (
                            <Box
                                width={"95%"}
                                ml="2.5%"
                                borderLeftWidth={1}
                                borderRightWidth={1}
                                borderColor="#D4D4D4"
                                borderBottomWidth={
                                    items.index === notifications.data.length - 1 ? 1 : 0
                                }
                                borderBottomLeftRadius={
                                    items.index === notifications.data.length - 1 ? 8 : 0
                                }
                                borderBottomRightRadius={
                                    items.index === notifications.data.length - 1 ? 8 : 0
                                }
                                backgroundColor={
                                    items.index % 2 === 0 ? "#E5F3F8" : "white"
                                }
                            >
                                <NotificationList
                                    choose={choose}
                                    isSelected={isSelected}
                                    data={items.item}
                                    key={items.index}
                                    index={items.index}
                                    setNotificationChoose={setNotificationChoose}
                                    setTypeModal={setTypeModal}
                                    setModalVisible={setModalVisible}
                                ></NotificationList>
                            </Box>
                        );
                    }}
                    ListFooterComponent={
                        <Box height={50}>
                            {notifications.isLoadMore && (
                                <ActivityIndicator size={"small"}></ActivityIndicator>
                            )}
                        </Box>
                    }
                    keyExtractor={keyExtractor}
                />

                <Modal animationType="slide" transparent={true} visible={modalVisible}>
                    {typeModal === "add" ? (
                        <ModalAdd
                            setModalVisible={setModalVisible}
                            getData={onRefresh}
                            listNotification={notifications.data}
                            setListNotification={notifications.setData}
                            setTitleEdit={setTitleEdit}
                            setType={setType}
                            setModalVisibleNoti={setModalVisibleNotifi}
                        ></ModalAdd>
                    ) : typeModal === "delete" ? (
                        <ModalDelete
                            setModalVisible={setModalVisible}
                            deleteNotification={deleteNotification}
                            data={selected}
                            setTitleEdit={setTitleEdit}
                            setType={setType}
                            setModalVisibleNoti={setModalVisibleNotifi}
                        ></ModalDelete>
                    ) : (
                        <ModalView
                            data={userChoose}
                            getData={onRefresh}
                            setModalVisible={setModalVisible}
                            setTitleEdit={setTitleEdit}
                            setType={setType}
                            setModalVisibleNoti={setModalVisibleNotifi}
                            listNotification={notifications.data}
                            setListNotification={notifications.setData}
                        ></ModalView>
                    )}
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisibleNotifi}
                    onRequestClose={() => {
                        setModalVisibleNotifi(!modalVisibleNotifi);
                    }}
                >
                    <PopupCloseAutomatically
                        titleEdit={titleEdit}
                        title="Tạo thông báo thành công"
                        type={type}
                        isOpen={modalVisibleNotifi}
                        setIsOpen={setModalVisibleNotifi}
                    />
                </Modal>
            </Box>
        </Box>
    );
};
export default ManageNotification;
