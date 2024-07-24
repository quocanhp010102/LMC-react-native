import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  Platform,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";
import { Devider } from "../../components/Devider";
import { Header, NotificationIcon } from "../../components/Header";
import { InputWithIcon } from "../../components/InputWithIcon";
import { Box, Flex, Text } from "../../rebass";
import { ModalAdd } from "./components/ModalAdd";
import { ModalDelete } from "./components/ModalDelete";
import { ModalView } from "./components/ModalView";
import { UserList } from "./components/UserList";
import { useManageUser } from "./useManageUser";
import { Icon } from "../../components/svg-icon";
import PopupCloseAutomatically from "../../components/PopupCloseAutomatically";

const { width } = Dimensions.get("screen");
const ManageUser = () => {
  const {
    keyExtractor,
    onEndReached,
    listUser,
    users,
    onRefresh,
    queryInput,
    checkVadidate,
    modalVisible,
    setModalVisible,
    selected,
    typeModal,
    setTypeModal,
    userChoose,
    setUserChoose,
    modalVisibleNotifi,
    setModalVisibleNotifi,
    type,
    setType,
    titleNoti,
    setTitleNoti,
    choose,
    allNew,
    chooseAllNewStudent,
    disabled,
    setDisabled,
  } = useManageUser();

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
                QUẢN LÝ NGƯỜI DÙNG
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
            iconSize={16}
            border
          />
        </Flex>
        <Box flexDirection="row" ml="2.5%" mr="2.5%" mb={1}>
          <TouchableOpacity
            disabled={disabled}
            style={{
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              height: 40,
            }}
            onPress={() => {
              if (selected.current.length > 0) {
                setTitleNoti("Xoá người dùng");
                setTypeModal("delete"), setModalVisible(true);
              }
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
              marginLeft: 20,
              paddingHorizontal: 5,
            }}
            onPress={() => {
              setTitleNoti("Thêm người dùng");
              setTypeModal("add"), setModalVisible(true);
            }}
          >
            <Icon name="addIcon" color={"white"}></Icon>
            <Text ml={1} color="white">
              Thêm
            </Text>
          </TouchableOpacity>
        </Box>
        {users.isLoading ? (
          <Box
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 22,
            }}
          >
            <ActivityIndicator size="large" color="#00A8B5" />
          </Box>
        ) : (
          <FlatList
            refreshControl={
              <RefreshControl
                onRefresh={onRefresh}
                refreshing={false}
              ></RefreshControl>
            }
            initialNumToRender={25}
            onEndReachedThreshold={3}
            ListHeaderComponent={
              <>
                {listUser.length > 0 && !users.isRefreshing ? (
                  <Box
                    width={width * 0.95}
                    mt={2}
                    ml="2.5%"
                    borderWidth={1}
                    borderTopLeftRadius={8}
                    borderTopRightRadius={8}
                    borderColor="#D4D4D4"
                    borderBottomWidth={0}
                  >
                    <Box
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        alignItems: "flex-start",
                        backgroundColor: "#00A8B5",
                      }}
                      borderTopLeftRadius={8}
                      borderTopRightRadius={8}
                    >
                      <Box
                        style={{
                          width: "10%",
                        }}
                      >
                        <Box
                          height={50}
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              chooseAllNewStudent();
                            }}
                          >
                            {allNew ? (
                              <Icon name="chooseBox" color={"white"}></Icon>
                            ) : (
                              <Icon name="CheckBox" color={"white"}></Icon>
                            )}
                          </TouchableOpacity>
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
                            MÃ SV/GV
                          </Text>
                        </Box>
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
                            HỌ VÀ TÊN
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
                            Vai trò
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    style={{ alignItems: "center", justifyContent: "center" }}
                    mt={3}
                  >
                    <Text>Không có kết quả tương ứng</Text>
                  </Box>
                )}
              </>
            }
            showsHorizontalScrollIndicator={false}
            data={listUser}
            keyboardDismissMode="on-drag"
            renderItem={(items: any) => {
              return (
                <Box width={width * 0.95} ml="2.5%">
                  <UserList
                    key={`${items.index}`}
                    choose={choose}
                    length={listUser.length}
                    data={items.item}
                    index={items.index}
                    allNew={allNew}
                    setUserChoose={setUserChoose}
                    setTypeModal={setTypeModal}
                    setModalVisible={setModalVisible}
                    setTitleNoti={setTitleNoti}
                  ></UserList>
                </Box>
              );
            }}
            onEndReached={onEndReached}
            keyExtractor={keyExtractor}
            ListFooterComponent={
              <Box height={30}>
                {listUser.length > 0 && !users.isRefreshing ? (
                  <Box
                    width={width * 0.95}
                    height={10}
                    top={-5}
                    ml="2.5%"
                    borderWidth={1}
                    borderBottomLeftRadius={8}
                    borderBottomRightRadius={8}
                    borderColor="#D4D4D4"
                    borderTopWidth={0}
                  ></Box>
                ) : null}
                {users.isLoadMore && <ActivityIndicator size={"small"} />}
              </Box>
            }
          />
        )}

        <Modal
          animationType="slide"
          transparent={true}
          statusBarTranslucent={Platform.OS === "android" ? true : false}
          visible={modalVisible}
        >
          {typeModal === "add" ? (
            <ModalAdd
              setModalVisible={setModalVisible}
              setModalVisibleNotifi={setModalVisibleNotifi}
              setType={setType}
              onRefresh={onRefresh}
            ></ModalAdd>
          ) : typeModal === "delete" ? (
            <ModalDelete
              setModalVisible={setModalVisible}
              data={selected.current}
              setModalVisibleNotifi={setModalVisibleNotifi}
              setType={setType}
              onRefresh={onRefresh}
              setDisabled={setDisabled}
              setUserChoose={() => { selected.current =[]}}
            ></ModalDelete>
          ) : (
            <ModalView
              data={userChoose}
              setModalVisible={setModalVisible}
              setModalVisibleNotifi={setModalVisibleNotifi}
              setType={setType}
              onRefresh={onRefresh}
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
            title={titleNoti}
            type={type}
            isOpen={modalVisibleNotifi}
            setIsOpen={setModalVisibleNotifi}
          />
        </Modal>
      </Box>
    </Box>
  );
};
export default ManageUser;
