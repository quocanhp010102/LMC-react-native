import React from "react"
import {
  ActivityIndicator,
  Modal,
  RefreshControl,
  TouchableOpacity,
} from "react-native"
import { Devider } from "../../components/Devider"
import { Header, NotificationIcon } from "../../components/Header"
import { InputWithIcon } from "../../components/InputWithIcon"
import { Icon } from "../../components/svg-icon"
import { Box, Flex, Text } from "../../rebass"
import { ModalDelete } from "./components/ModalDelete"
import PopupCloseAutomatically from "../../components/PopupCloseAutomatically"
import { FlatList } from "react-native"
import ManagerSubjectItem from "./components/ManagerSubjectItem"
import ManagerSubjectHeader from "./components/ManagerSubjectHeader"
import { useManagerSubject } from "./components/hooks/useManagerSubject"
import { ModalCreateSubject } from "./components/ModalCreateSubject"

const ManageSubject = (props: any) => {
  const {
    choose,
    chooseAll,
    selected,
    setSelected,
    all,
    getChecked,
    data,
    pullToRefresh,
    handleLoadMore,
    refresh,
    setData,
    isLoading,
    isEmpty,
    isLoadMore,
    handleDelete,
    checkVadidate,
    modalVisibleNoti,
    setModalVisibleNoti,
    editTitle,
    setEditTitle,
    type,
    setType,
    department_name,
    modalVisible,
    setModalVisible,
    goBack,
    queryInput,
    setQueryInput,
    id_course,
    modalEdit,
    setModalEdit,
    modalChoose,
    setModalChoose,
    items,
    value,
    setValue,
    LoadMoreDepartment,
    event,
    setEvent,
    nameSubject,
    setNameSubject,
    codeSubject,
    setCodeSubject,
    postSubject,
    textRefName,
    textRefCode,
    resetSubject,
    openEdit,
    openNew,
    showModalDelete,
  } = useManagerSubject(props.route.params)

  return (
    <Box bg="defaultBackground" position="relative" height="100%">
      <Box height="100%">
        <Header
          title="Quản lý môn học"
          search
          leftButton="back"
          leftButtonClick={goBack}
        >
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
                {department_name}
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Box>
          <Flex
            mb={1}
            p={2}
            flexDirection="row"
            alignItems="center"
            borderBottomColor="tabBar"
            height={70}
          >
            <Box width="100%">
              <InputWithIcon
                icon="search"
                flex={1}
                value={queryInput}
                onChangeText={(e) => checkVadidate(e)}
                iconColor="inputClose"
                placeholderTextColor="black"
                placeholder="Nhập tìm kiếm"
                iconSize={16}
                onPress={() => setQueryInput("")}
                border
              />
            </Box>
          </Flex>
          <Box flexDirection="row" ml="2.5%" mr="2.5%" mb={2}>
            <TouchableOpacity onPress={() => showModalDelete()}>
              <Box
                height={40}
                style={{
                  borderRadius: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="deleteIcon"></Icon>
                <Text ml={1} color="deleteColor">
                  Xóa
                </Text>
              </Box>
            </TouchableOpacity>
            <Box paddingX={2}>
              <TouchableOpacity
                onPress={() => {
                  openNew()
                }}
              >
                <Box
                  backgroundColor="#56C8C8"
                  height={40}
                  paddingX={2}
                  style={{
                    borderRadius: 8,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name="addIcon"></Icon>
                  <Text ml={1} color="white">
                    Thêm
                  </Text>
                </Box>
              </TouchableOpacity>
            </Box>
            {selected.length > 0 && (
              <Box>
                <TouchableOpacity
                  onPress={() => {
                    openEdit()
                  }}
                >
                  <Box
                    backgroundColor="white"
                    height={40}
                    paddingX={2}
                    style={{
                      borderRadius: 8,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon name="editIcon"></Icon>
                    <Text ml={1} color="black">
                      Sửa
                    </Text>
                  </Box>
                </TouchableOpacity>
              </Box>
            )}
          </Box>
        </Box>
        {isLoading ? (
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
        <FlatList
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={pullToRefresh} />
          }
          ListHeaderComponent={
            <>
              {isEmpty ? (
                <Box
                  style={{ alignItems: "center", justifyContent: "center" }}
                  mt={3}
                >
                  <Text>Không có môn học nào</Text>
                </Box>
              ) : (
                <ManagerSubjectHeader isCheckAll={all} onCheckAll={chooseAll} />
              )}
            </>
          }
          style={{
            flex: 1,
            paddingHorizontal: 12,
          }}
          data={data}
          renderItem={(items) => {
            return (
              <ManagerSubjectItem
                isEven={(items.index + 1) % 2 === 0}
                data={items.item}
                isChecked={getChecked(items.item.id)}
                onChecked={() => choose(items.item.id)}
              />
            )
          }}
          onEndReached={handleLoadMore}
          keyExtractor={(item) => String(item.id)}
          ListFooterComponent={
            <Box height={50}>
              {isLoadMore && (
                <ActivityIndicator size={"small"}></ActivityIndicator>
              )}
            </Box>
          }
        />
        <Modal animationType="slide" transparent={true} visible={modalEdit}>
          <ModalCreateSubject
            disableModal={() => {
              setModalEdit(false)
              resetSubject()
            }}
            items={items}
            modalChoose={modalChoose}
            setModalChoose={setModalChoose}
            value={value}
            setValue={setValue}
            LoadMoreDepartment={LoadMoreDepartment}
            event={event}
            setEvent={setEvent}
            nameSubject={nameSubject}
            codeSubject={codeSubject}
            setCodeSubject={setCodeSubject}
            setNameSubject={setNameSubject}
            postSubject={postSubject}
            textRefCode={textRefCode}
            textRefName={textRefName}
          />
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleNoti}
          onRequestClose={() => {
            setModalVisibleNoti(!modalVisibleNoti)
          }}
        >
          <PopupCloseAutomatically
            titleEdit={editTitle}
            title="Tạo khóa học"
            type={type}
            isOpen={modalVisibleNoti}
            setIsOpen={setModalVisibleNoti}
          />
        </Modal>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <ModalDelete
            handleDeleteTutorials={handleDelete}
            setModalVisible={() => {
              setModalVisible(false)
              setSelected([])
            }}
            setModalVisibleNoti={setModalVisibleNoti}
            setType={setType}
            setEditTitle={setEditTitle}
            data={selected.length}
          ></ModalDelete>
        </Modal>
      </Box>
    </Box>
  )
}
export default ManageSubject
