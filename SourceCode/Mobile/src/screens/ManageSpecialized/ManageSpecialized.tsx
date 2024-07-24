import { useIsFocused, useNavigation } from "@react-navigation/native"
import * as ImagePicker from "expo-image-picker"
import React, { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Modal,
  Platform,
  TouchableOpacity,
} from "react-native"
import { CardSpecialized } from "../../components/CardSpecialized"
import { Devider } from "../../components/Devider"
import { Header, NotificationIcon } from "../../components/Header"
import { InputWithIcon } from "../../components/InputWithIcon"
import { Icon } from "../../components/svg-icon"
import { Box, Flex, Text } from "../../rebass"
import { API } from "../../services"
import { generateApiService } from "../../services/ApiService"
import { ActivityHistoriesApi } from "../../services/api/ActivityHistories/ActivityHistoriesApi"
import { DepartmentApi } from "../../services/api/Departments/DepartmentApi"
import ModalAddSpecialized from "./components/ModalAddSpecialized"
import { ModalDelete } from "./components/ModalDelete"
import PopupCloseAutomatically from "../../components/PopupCloseAutomatically"
import { FlatList } from "react-native-gesture-handler"
import { ListRenderItemInfo } from "react-native"
import { useLoadMoreListWithSearch } from "../../hooks/useLoadMoreListWithSearch"
import { RefreshControl } from "react-native"

const items = [
  { label: "Cơ bản", value: "0" },
  { label: "Nâng cao", value: "1" },
]
const ManageSpecialized = (props: any) => {
  const [modalVisibleNoti, setModalVisibleNoti] = useState(false);
  const [typeNoti, setTypeNoti] = useState<string>("");
  const [editTitle, setEditTitle] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const newCourse = props.route.params?.newCourse;
  // const [queryInput, setQueryInput] = React.useState<string>();
  // const [departments, setDepartments] = useState<any>([]);
  const [linkImage, setLinkImage] = useState<string>("");
  const [typeProgram, setTypeProgram] = useState<number>(0);
  const [departmentName, setDepartmentName] = useState<string>("");
  const [file, setFile] = useState<any>({});
  const [selected, setSelected] = useState<any>([]);
  const [departmentSelected, setDepartmentSelected] = useState<boolean>(false);
  const navigation = useNavigation();
  const [modalDeleteVisible, setModalDeleteVisible] = useState<boolean>(false);
  const [type, setType] = useState<string>("");
  const [itemSelected, setItemSelected] = useState<any>();
  const isFocus = useIsFocused()


  const searchDepartment = async (queryInput: string , page: number , size : number) => {
    const response = await generateApiService.get(
      DepartmentApi.searchDepartment(queryInput , page)
    )
    if (response) {
      return {
        data: response.content,
        success: true,
      };
    }
    return response
  }

  const [value, setValue] = useState(items[0].value)

  const onGetDepartments = async (page : number , size : number) => {
    const dataDepartments = await generateApiService.get(
      DepartmentApi.getAllDepartments(page)
    )
  
    if (dataDepartments) {
      return {
        data: dataDepartments.content,
        success: true,
      };
    }
    return dataDepartments
  }

  const {
    onEndReached,
    onRefresh,
    keyExtractor,
    checkValidateSearch,
    queryInput,
    setQueryInput,
    data : departments,
  } = useLoadMoreListWithSearch<any>({ onGetAllData : onGetDepartments, searchDataCheck : searchDepartment});



  useEffect(() => {
    if(isFocus) {
    setSelected([])
    if (queryInput) {
      const timeout = setTimeout(async () => {
        departments.refresh();
      }, 800);
      return () => {
        clearTimeout(timeout);
      };
    } else {
      departments.refresh();
    }
  }
  }, [queryInput ,isFocus]);

  const pickDocument = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      let localUri = result.assets?.[0].uri
      let filename: any = localUri.split("/").pop()
      let match = /\.(\w+)$/.exec(filename)
      let type = match ? `image/${match[1]}` : `image`
      if (type === `image/jpg`) {
        type = `image/jpeg`
      }
      setFile({ uri: localUri, name: filename, type });
    }
  };

  const handleCreateDepartment = async () => {
    try {
      const data = new FormData()
      data.append("file", {
        ...file,
        uri:
          Platform.OS === "android"
            ? file.uri
            : file.uri.replace("file://", ""),
        name: file.name,
        type: file.type, // it may be necessary in Android.
      })

      let res = await generateApiService.postImage(
        `${API.PUBLIC}services/lmsbackendtest/api/uploadImage`,
        data
      )
      if (res) {
        setLinkImage(res)
      }
      const body = {
        department_name: departmentName,
        department_type: String(typeProgram),
        department_image: res,
      }
      const response = await generateApiService.post(
        DepartmentApi.getAllDepartments(0),
        body
      )

      const bodyHistory = {
        name: " chuyên ngành " + departmentName,
        method: "POST",
      }
      await generateApiService.post(
        ActivityHistoriesApi.postHistories(),
        bodyHistory
      )
      setModalVisibleNoti(true)
      setEditTitle("Tạo chuyên ngành thành công !")
      setModalVisible(false)
      setTypeNoti("success")
      
      let newDataDepartments = [response, ...departments.data]
      departments.setData(newDataDepartments)
      setDepartmentName("")
      setTypeProgram(0)
      setLinkImage("")
      setFile("")
    } catch (error) {

      setModalVisible(false)
      setEditTitle("Tạo chuyên ngành thất bại !")
      setTypeNoti("error")
      setModalVisibleNoti(true)
    }
  }

  const choose = React.useCallback(
    (id: any) => {
      setSelected(id)
    },
    [selected]
  )

  const handleDelete = async () => {
    try {
      await generateApiService.delete(DepartmentApi.editDepartment(selected))
      const bodyHistory = {
        name:
          " chuyên ngành " +
          departments.data.find((x: any) => x.id == selected).department_name,
        method: "DELETE",
      }
      await generateApiService.post(
        ActivityHistoriesApi.postHistories(),
        bodyHistory
      )
      setModalDeleteVisible(false)
      setEditTitle("Xóa chuyên ngành thành công !")
      setTypeNoti("success")
      setModalVisibleNoti(true)
      var index = departments.data.findIndex(
        (pDepartment: any) => pDepartment.id == selected
      )
      if (index >= 0) {
        let newDataDepartments = [...departments.data]
        newDataDepartments.splice(index, 1)
        departments.setData(newDataDepartments)
      }
      setDepartmentSelected(false)
      setSelected([])
    } catch (error) {
      setModalDeleteVisible(false)
      setEditTitle("Xóa chuyên ngành thất bại !")
      setTypeNoti("error")
      setModalVisibleNoti(true)
    }
  }

  const handleEditDepartment = async () => {
    try {
      const data = new FormData()
      data.append("file", {
        ...file,
        uri:
          Platform.OS === "android"
            ? file.uri
            : file.uri.replace("file://", ""),
        name: file.name,
        type: file.type, // it may be necessary in Android.
      })

      let res = await generateApiService.postImage(
        `${API.PUBLIC}services/lmsbackendtest/api/uploadImage`,
        data
      )
      if (res) {
        setLinkImage(res)
      }
      const body = {
        ...itemSelected,
        id: itemSelected.id,
        department_name: departmentName,
        department_type: String(typeProgram),
        department_image: res || linkImage,
      }
      const response = await generateApiService.put(
        DepartmentApi.editDepartment(itemSelected.id),
        body
      )
      const bodyHistory = {
        name: " chuyên ngành " + departmentName,
        method: "PUT",
      };
     await generateApiService.post(
        ActivityHistoriesApi.postHistories(),
        bodyHistory
      )
      setEditTitle("Sửa chuyên ngành thành công !")
      setModalVisible(false)
      setTypeNoti("success")
      setModalVisibleNoti(true)
      var index = departments.data.findIndex(
        (pDepartment: any) => pDepartment.id == itemSelected.id
      )
      if (index >= 0) {
        let newDataDepartments = [...departments.data]
        newDataDepartments[index] = body
        departments.setData(newDataDepartments)
      }
      setDepartmentName("")
      setTypeProgram(0)
      setLinkImage("")
      setFile("")
      setDepartmentSelected(false)
    } catch (error) {
      setEditTitle("Sửa chuyên ngành thất bại !")
      setModalVisible(false)
      setTypeNoti("error")
      setModalVisibleNoti(true)
    }
  }

  const onAddSpecialized = () => {
    setModalVisible(false);
    setDepartmentSelected(false);
    setDepartmentName("");
    setTypeProgram(0);
    setLinkImage("");
    setFile("");
  };
  
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
                DANH SÁCH NGÀNH ĐÀO TẠO
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
          height={70}
          justifyContent="space-between"
        >
          <Box flex={1} style={{ marginRight: 9 }}>
            <InputWithIcon
              icon="search"
              flex={1}
              height={50}
              value={queryInput}
              onChangeText={(e) => checkValidateSearch(e)}
              iconColor="inputClose"
              placeholderTextColor="black"
              // placeholder="Nhập tìm kiếm"
              iconSize={16}
              onPress={() => setQueryInput("")}
              border
            />
          </Box>
          <TouchableOpacity
            style={{
              backgroundColor: "#56C8C8",
              width: 51,
              height: 51,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
            }}
            onPress={() => {
              setType("add")
              setFile("")
              setModalVisible(true)
            }}
          >
            <Icon name="addIcon" color={"white"}></Icon>
          </TouchableOpacity>
        </Flex>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          ml="2.5%"
          mr="2.5%"
          mb={2}
        >
          {departmentSelected && type === "edit" ? (
            <TouchableOpacity
              style={{
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(100, 116, 139, 0.1)",
                height: 40,
                width: "47.5%",
              }}
              onPress={() => {
                setDepartmentSelected(false)
              }}
            >
              <Icon name="editIcon"></Icon>
              <Text ml={1} color="#56C8C8">
                Hủy
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setDepartmentSelected(true)
                setFile("")
                setType("edit")
              }}
              style={{
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(100, 116, 139, 0.1)",
                height: 40,
                width: "47.5%",
              }}
            >
              <Icon name="editIcon"></Icon>

              <Text ml={1} color="#56C8C8">
                Sửa
              </Text>
            </TouchableOpacity>
          )}
          {departmentSelected && type === "delete" ? (
            <TouchableOpacity
              style={{
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(100, 116, 139, 0.1)",
                height: 40,
                width: "47.5%",
              }}
              onPress={() => {
                setDepartmentSelected(false)
              }}
            >
              <Icon name="deleteIcon"></Icon>
              <Text ml={1} color="deleteColor">
                Hủy
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(100, 116, 139, 0.1)",
                height: 40,
                width: "47.5%",
              }}
              onPress={() => {
                setDepartmentSelected(true)
                setType("delete")
              }}
            >
              <Icon name="deleteIcon"></Icon>
              <Text ml={1} color="deleteColor">
                Xóa
              </Text>
            </TouchableOpacity>
          )}
        </Box>
        <FlatList
          data={departments.data}
          refreshControl={
            <RefreshControl
              onRefresh={onRefresh}
              refreshing={false}
            ></RefreshControl>
          }
          keyExtractor={keyExtractor}
          ListHeaderComponent={
            <Box>
              {departments.isLoading ? (
                queryInput ? (
                  <Box
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text
                      textAlign="center"
                      color="lightText"
                      py={4}
                      marginRight={1}
                    >
                      Đang tìm kiếm
                    </Text>
                    <ActivityIndicator size="small" color="gray" />
                  </Box>
                ) : (
                  <ActivityIndicator size={"small"} />
                )
              ) : (
                departments.data.length < 1 && (
                  <Box
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    mt={3}
                  >
                    <Text>Không có chuyên ngành nào</Text>
                  </Box>
                )
              )}
            </Box>
          }
          numColumns={2}
          onEndReached={onEndReached}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginHorizontal: 16,
          }}
          renderItem={(info: ListRenderItemInfo<any>) => {
            const { item, index } = info
            const isSelected = selected === item.id
            return (
              <Box flexDirection="row" alignItems="center" key={String(index)}>
                <TouchableOpacity
                  onPress={() => {
                    if (departmentSelected) {
                      if (type === "delete") {
                        choose(item.id)
                        setModalDeleteVisible(true)
                      } else {
                        setItemSelected(item)
                        setDepartmentName(item.department_name)
                        setLinkImage(item.department_image)
                        setValue(items[Number(item.department_type)].value)
                        setModalVisible(true)
                      }
                    } else {
                      navigation.navigate("/quan-li-mon-hoc", {
                        id_course: item.id,
                        department_name: item.department_name,
                      })
                    }
                  }}
                >
                  <CardSpecialized
                    title={item.department_name}
                    image={item.department_image}
                    course={item.countSubject}
                    isSelected={isSelected}
                  ></CardSpecialized>
                </TouchableOpacity>
              </Box>
            )
          }}
          ListFooterComponent={<Box height={30}></Box>}
        ></FlatList>

        <Modal
          animationType="slide"
          transparent={true}
          statusBarTranslucent
          visible={modalVisible}
        >
          <ModalAddSpecialized
            type={type}
            departmentName={departmentName}
            setDepartmentName={setDepartmentName}
            pickDocument={pickDocument}
            file={file}
            handleEditDepartment={handleEditDepartment}
            handleCreateDepartment={handleCreateDepartment}
            linkImage={linkImage}
            onAddSpecialized={onAddSpecialized}
            items={items}
            value={value}
            setValue={setValue}
            setTypeProgram={setTypeProgram}
          ></ModalAddSpecialized>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalDeleteVisible}
        >
          <ModalDelete
            handleDeleteTutorials={handleDelete}
            setModalVisible={() => {
              setModalDeleteVisible(false)
              setDepartmentSelected(false)
              setSelected([])
            }}
            data={selected}
          ></ModalDelete>
        </Modal>
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisibleNoti}
          onRequestClose={() => {
            setModalVisibleNoti(!modalVisibleNoti)
          }}
        >
          <PopupCloseAutomatically
            titleEdit={editTitle}
            title="Tạo chuyên ngành"
            type={typeNoti}
            isOpen={modalVisibleNoti}
            setIsOpen={setModalVisibleNoti}
          />
        </Modal>
      </Box>
    </Box>
  )
}
export default ManageSpecialized
