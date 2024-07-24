import React from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  Modal,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Devider } from "../../components/Devider";
import { Header, NotificationIcon } from "../../components/Header";
import { InputWithIcon } from "../../components/InputWithIcon";
import { PopupNotification } from "../../components/PopupNotification";
import { Icon } from "../../components/svg-icon";
import { NavLink } from "../../platform/links";
import { Box, Flex, Text } from "../../rebass";
import HeaderManageNews from "./components/HeaderManageNews";
import { ModalAdd } from "./components/ModalAdd";
import { ModalDelete } from "./components/ModalDelete";
import { ModalView } from "./components/ModalView";
import { NewsList } from "./components/NewsList";
import { useManageNews } from "./hooks/useManageNews";
import PopupCloseAutomatically from "../../components/PopupCloseAutomatically";
const ManageNews = (props: any) => {
  const news = props?.route?.params?.news;

  const {
    keyExtractor,
    onEndReached,
    newsDataList,
    onRefresh,
    queryInput,
    checkVadidate,
    setQueryInput,
    setTypeModal,
    setModalVisible,
    setAll,
    all,
    chooseAll,
    selected,
    choose,
    setNewsChoose,
    modalVisible,
    typeModal,
    deleteNews,
    newsChoose,
    modalVisibleNoti,
    setModalVisibleNoti,
    type,
  } = useManageNews();

  React.useEffect(() => {
    if (news) {
      onRefresh();
    }
  }, [news]);
  return (
    <Box bg="defaultBackground" position="relative" height="100%">
      <Box height="100%">
        <Header logo search profile>
          <NotificationIcon />
        </Header>
        <Box height={1} bg="#636363" opacity={0.3} mt={2} />
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
                QUẢN LÝ TIN TỨC
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
            onChangeText={(e) => checkVadidate(e)}
            iconColor="inputClose"
            placeholderTextColor="black"
            // placeholder="Nhập tìm kiếm"
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
              height: 40,
            }}
            onPress={() => {
              setTypeModal("delete"), setModalVisible(true);
            }}
          >
            <Icon name="deleteIcon"></Icon>
            <Text ml={1} fontWeight={400} fontSize={15} color="deleteColor">
              Xóa
            </Text>
          </TouchableOpacity>

          {/* <NavLink
            {...{
              route: "/tao-tin-tuc",
            }}
          >
            <Box
              style={{
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(100, 116, 139, 0.1)",
                height: 40,
                width: "90%",
                marginLeft: "2.5%",
              }}
            >
              <Icon name="addIcon"></Icon>
              <Text ml={1} fontWeight={400} fontSize={15} color="textColor">
                Thêm
              </Text>
            </Box>
          </NavLink> */}
        </Box>
        <Box height={5}></Box>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={onRefresh} />
          }
          ListHeaderComponent={
            <>
              {newsDataList.isEmpty ? (
                <Box
                  style={{ alignItems: "center", justifyContent: "center" }}
                  mt={3}
                >
                  <Text>Không có tin tức nào</Text>
                </Box>
              ) : (
                <HeaderManageNews
                  setAll={setAll}
                  all={all}
                  chooseAll={chooseAll}
                ></HeaderManageNews>
              )}
            </>
          }
          data={newsDataList.data}
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
                  items.index === newsDataList.data.length - 1 ? 1 : 0
                }
                borderBottomLeftRadius={
                  items.index === newsDataList.data.length - 1 ? 8 : 0
                }
                borderBottomRightRadius={
                  items.index === newsDataList.data.length - 1 ? 8 : 0
                }
                backgroundColor={
                  items.index % 2 === 0 ? "#E5F3F8" : "white"
                }
              >
                <NewsList
                  choose={choose}
                  isSelected={isSelected}
                  data={items.item}
                  index={items.index}
                  setNewsChoose={setNewsChoose}
                  setTypeModal={setTypeModal}
                  setModalVisible={setModalVisible}
                ></NewsList>
              </Box>
            );
          }}
          onEndReached={onEndReached}
          keyExtractor={keyExtractor}
          ListFooterComponent={
            <Box height={50}>
              {newsDataList.isLoadMore && (
                <ActivityIndicator size={"small"}></ActivityIndicator>
              )}
            </Box>
          }
        />

        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          {typeModal === "add" ? (
            <ModalAdd setModalVisible={setModalVisible}></ModalAdd>
          ) : typeModal === "delete" ? (
            <ModalDelete
              setModalVisible={setModalVisible}
              deleteNews={deleteNews}
              data={selected}
            ></ModalDelete>
          ) : (
            <ModalView
              data={newsChoose}
              setModalVisible={setModalVisible}
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
            title={typeModal === "delete" ? "Xóa tin tức" : "Tạo tin tứu"}
            type={type}
            isOpen={modalVisibleNoti}
            setIsOpen={setModalVisibleNoti}
          />
          {/* <PopupNotification
            title={typeModal === "delete" ? "Xóa tin tức" : "Tạo tin tứu"}
            type={type}
            setModalVisible={setModalVisibleNoti}
          ></PopupNotification> */}
        </Modal>
      </Box>
    </Box>
  );
};
export default ManageNews;
