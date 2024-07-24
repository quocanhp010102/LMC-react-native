import * as DocumentPicker from "expo-document-picker"
import * as FileSystem from "expo-file-system"
import * as ImagePicker from "expo-image-picker"
import { useEffect, useState } from "react"
import {
  Dimensions,
  ImageBackground,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native"
import { Header, NotificationIcon } from "../../components/Header"
import { Icon } from "../../components/svg-icon"
import { useAppDispatch, useAppSelector } from "../../hooks/ReduxHook"
import { Box, Text } from "../../rebass"
import { generateApiService } from "../../services/ApiService"
import { ProfileApi } from "../../services/api/Profile/ProfileApi"
import { UploadFileApi } from "../../services/api/UploadFile/UploadFileApi"
import PopupCloseAutomatically from "../../components/PopupCloseAutomatically"
import { MediaTypeOptions } from "expo-image-picker/src/ImagePicker.types"
import { avatarUrl } from "../../components/calendar/const"
import { updateProfile } from "../../Redux/counterSlice"

const { width, height } = Dimensions.get("screen")
const ProfileScreen = () => {
  const [modalVisibleNoti, setModalVisibleNoti] = useState(false)
  const [type, setType] = useState<string>("")
  const role = useAppSelector((state) => state.users.userList[0].role)

  const [getFile, setGetFile] = useState<any>()
  const [showModal, setShowModal] = useState(false)

  const dispatch = useAppDispatch()
  const dataUser = useAppSelector((state) => state.users.profile)

  //   const [dataUser, setDataUser] = useState<any>([])
  //   const onGetProfile = async () => {
  //     if (role == "0") {
  //       const response = await generateApiService.get(ProfileApi.getInfoStudent())
  //       if (response) {
  //         setDataUser(response)
  //       }
  //     } else if (role == "1") {
  //       const response = await generateApiService.get(
  //         ProfileApi.getInfoLecturer()
  //       )

  //       if (response) {
  //         setDataUser(response)
  //       }
  //     } else if (role == "2") {
  //       const response = await generateApiService.get(ProfileApi.getInfoAdmin())

  //       if (response) {
  //         setDataUser(response)
  //       }
  //     }
  //   }
  const pickDocument = async () => {
    let result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })
    if (!result.cancelled) {
      let localUri = result.uri
      const NewResult = await FileSystem.getInfoAsync(result.uri)
      let filename = localUri.split("/").pop()
      let match = /\.(\w+)$/.exec(filename)
      let type = match ? `image/${match[1]}` : `image`
      if (type === `image/jpg`) {
        type = `image/jpeg`
      }
      setGetFile({
        uri: localUri,
        name: filename,
        type,
      })
      setShowModal(true)
    } else {
      setGetFile(null)
    }
  }

  const pickDocument2 = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      multiple: true,
      copyToCacheDirectory: true,
      type: "image/*",
    })

    if (result.type === "success") {
      setGetFile(result)
      setShowModal(true)
    } else {
      setGetFile(null)
    }
  }
  const uploadFile = async () => {
    try {
      const data = new FormData()

      data.append("file", {
        ...getFile,
        uri:
          Platform.OS === "android"
            ? getFile.uri
            : getFile.uri.replace("file://", ""),
        name: getFile.name,
        type: getFile.type,
      })

      let res = await generateApiService.postImage(
        UploadFileApi.UploadFile(),
        data
      )

      let updateCourse = await generateApiService.put(
        ProfileApi.updateAvatar(),
        [res]
      )
      dispatch(
        updateProfile({
          ...dataUser,
          avatarUrlCustom: res,
        })
      )
      setType("success")
      setModalVisibleNoti(true)
    } catch (error) {
      setType("error")
      setModalVisibleNoti(true)
    }
  }
  const [modalVisible, setModalVisible] = useState(false)
  const [items, setItems] = useState([
    { label: "Chọn từ album ảnh ", value: "value1" },
    { label: "Chọn trong tệp tin", value: "value2" },
  ])
  const [value, setValue] = useState({
    value: items[0].value,
    label: items[0].label,
  })

  return (
    <Box bg="defaultBackground" position="relative" height="100%">
      <Box height="100%">
        <Header logo search>
          <NotificationIcon />
        </Header>

        <Box height={1} bg="#636363" opacity={0.3} mt={2} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={false} />}
        >
          <Box alignItems="center" mt={23}>
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS === "android") {
                  pickDocument()
                  // pickDocument2();
                } else {
                  pickDocument()
                }
              }}
            >
              <Box
                width={100}
                height={100}
                style={{
                  borderRadius: 50,
                  overflow: "hidden",
                  borderWidth: 0.3,
                  borderColor: "#014F59",
                }}
              >
                <ImageBackground
                  source={{
                    uri: getFile ? getFile?.uri : dataUser?.avatarUrlCustom,
                  }}
                  style={{
                    width: 100,
                    height: 100,
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                  resizeMode={"cover"}
                  imageStyle={{ borderRadius: 50 }}
                >
                  <Box
                    backgroundColor="buttonColor"
                    width={80}
                    height={"20%"}
                    justifyContent="center"
                    style={{ borderBottomLeftRadius: 1, opacity: 0.7 }}
                  >
                    <Icon name="camera"></Icon>
                  </Box>
                </ImageBackground>
              </Box>
            </TouchableOpacity>

            {role == "0" ? (
              <Text fontSize={36} color="#1C7988" mt={15}>
                {dataUser?.student_fullname}
              </Text>
            ) : role == "1" ? (
              <Text fontSize={36} color="#1C7988" mt={15}>
                {dataUser?.lecturer_fullname}
              </Text>
            ) : (
              <Text fontSize={36} color="#1C7988" mt={15}>
                {dataUser?.admin_fullname}
              </Text>
            )}

            <Box
              width="90%"
              mt={38}
              backgroundColor="rgba(99, 99, 99, 0.1)"
              height={1}
            ></Box>
          </Box>
          <Box
            flexWrap="wrap"
            flexDirection="row"
            alignItems="flex-start"
            flex={1}
            width={width * 0.9}
            mt={54}
            ml={33}
            mr={38}
          >
            <Box style={{ width: "55%" }}>
              <Box flexDirection="row" alignItems="center">
                <Text fontSize={18} mr={1} color="textColor" fontWeight="bold">
                  Họ tên
                </Text>
                {/* <Icon name="edit" size={17}></Icon> */}
              </Box>

              {role == "0" ? (
                <Text mt={18} color="seen" fontSize={18}>
                  {dataUser.student_fullname}
                </Text>
              ) : role == "1" ? (
                <Text mt={18} color="seen" fontSize={18}>
                  {dataUser.lecturer_fullname}
                </Text>
              ) : (
                <Text mt={18} color="seen" fontSize={18}>
                  {dataUser.admin_fullname}
                </Text>
              )}
            </Box>
            <Box style={{ width: "35%" }} ml={29}>
              <Box flexDirection="row" alignItems="center">
                <Text fontSize={18} mr={1} color="textColor" fontWeight="bold">
                  Giới tính
                </Text>
                {/* <Icon name="edit" size={17}></Icon> */}
              </Box>
              {role == "0" ? (
                <Text mt={18} color="seen" fontSize={18}>
                  {dataUser.student_gender
                    ? dataUser.student_gender
                    : "Chưa cập nhật"}
                </Text>
              ) : role == "1" ? (
                <Text mt={18} color="seen" fontSize={18}>
                  {dataUser.lecturer_gender
                    ? dataUser.lecturer_gender
                    : "Chưa cập nhật"}
                </Text>
              ) : (
                <Text mt={18} color="seen" fontSize={18}>
                  {dataUser.admin_gender
                    ? dataUser.admin_gender
                    : "Chưa cập nhật"}
                </Text>
              )}
            </Box>

            <Box mt={35} width="55%">
              {role == "0" ? (
                <Box>
                  <Text
                    fontSize={18}
                    mr={1}
                    color="textColor"
                    fontWeight="bold"
                  >
                    Mã sinh viên
                  </Text>
                  <Text mt={18} color="seen" fontSize={18}>
                    {dataUser.student_code}
                  </Text>
                </Box>
              ) : role == "1" ? (
                <Box>
                  <Text
                    fontSize={18}
                    mr={1}
                    color="textColor"
                    fontWeight="bold"
                  >
                    Mã giảng viên
                  </Text>
                  <Text mt={18} color="seen" fontSize={18}>
                    {dataUser.lecturer_code}
                  </Text>
                </Box>
              ) : (
                <Box>
                  <Text
                    fontSize={18}
                    mr={1}
                    color="textColor"
                    fontWeight="bold"
                  >
                    Mã đào tạo
                  </Text>
                  <Text mt={18} color="seen" fontSize={18}>
                    {dataUser.admin_code}
                  </Text>
                </Box>
              )}
            </Box>
            <Box style={{ width: "35%" }} mt={35} ml={29}>
              <Box flexDirection="row">
                <Text fontSize={18} mr={1} color="textColor" fontWeight="bold">
                  Phân quyền
                </Text>
              </Box>

              {role == "0" ? (
                <Text mt={18} color="seen" fontSize={18}>
                  Sinh viên
                </Text>
              ) : role == "1" ? (
                <Text mt={18} color="seen" fontSize={18}>
                  Giảng viên
                </Text>
              ) : (
                <Text mt={18} color="seen" fontSize={18}>
                  Đào tạo
                </Text>
              )}
            </Box>

            <Box style={{ width: "90%" }} mt={35} mb={2}>
              <Box flexDirection="row" alignItems="center">
                <Text fontSize={18} mr={1} color="textColor" fontWeight="bold">
                  Email
                </Text>
              </Box>
              {role == "0" ? (
                <Text mt={18} color="seen" fontSize={18}>
                  {dataUser.student_email}
                </Text>
              ) : role == "1" ? (
                <Text mt={18} color="seen" fontSize={18}>
                  {dataUser.lecturer_email}
                </Text>
              ) : (
                <Text mt={18} color="seen" fontSize={18}>
                  {dataUser.admin_email}
                </Text>
              )}
            </Box>
          </Box>
        </ScrollView>
        <Modal animationType="slide" transparent={true} visible={showModal}>
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
              <Box alignItems="center">
                <Text
                  fontSize={16}
                  color="seen"
                  fontWeight="bold"
                  mt={15}
                  mb={100}
                >
                  XÁC NHẬN UPLOAD AVATAR
                </Text>
                <Box alignItems="center" flexDirection="row">
                  <TouchableOpacity
                    onPress={() => {
                      setShowModal(false), setGetFile(null)
                    }}
                    style={{
                      marginRight: 15,

                      height: 40,
                      minWidth: 80,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "#00A8B5",
                    }}
                  >
                    <Text fontWeight="bold" color="deleteColor">
                      Hủy
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      uploadFile(), setShowModal(false)
                    }}
                    style={{
                      backgroundColor: "#00A8B5",
                      height: 40,
                      minWidth: 80,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "#00A8B5",
                    }}
                  >
                    <Text fontWeight="bold" color="white">
                      Xác nhận
                    </Text>
                  </TouchableOpacity>
                </Box>
              </Box>
            </Box>
          </Box>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible)
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 22,
            }}
          >
            <View
              style={{
                width: "90%",
                margin: 20,
                backgroundColor: "white",
                borderRadius: 20,
                padding: 10,

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
              {items.map((items, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={async () => {
                    if (idx == 0) {
                      await setModalVisible(!modalVisible), pickDocument()
                    } else if (idx == 1) {
                      await setModalVisible(!modalVisible), pickDocument2()
                    }
                    setValue({ value: items.value, label: items.label })
                  }}
                >
                  <Box
                    width="100%"
                    borderRadius={10}
                    borderWidth={1}
                    borderColor="rgba(125, 125, 125, 0.3)"
                    height={40}
                    mb={2}
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                    padding={2}
                  >
                    <Text color="seen" width="90%">
                      {items.label}
                    </Text>
                    <Box
                      height={19}
                      width={19}
                      borderColor="#DADADA"
                      borderRadius={50}
                      borderWidth={1}
                      ml={2}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Box
                        height={12}
                        width={12}
                        borderColor="#DADADA"
                        borderRadius={50}
                        backgroundColor={
                          items.value == value.value ? "green" : "null"
                        }
                      ></Box>
                    </Box>
                  </Box>
                </TouchableOpacity>
              ))}
            </View>
          </View>
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
            title="Tải avatar"
            type={type}
            isOpen={modalVisibleNoti}
            setIsOpen={setModalVisibleNoti}
          />
          {/* <PopupNotification
            title="Tải avatar"
            type={type}
            setModalVisible={setModalVisibleNoti}
          ></PopupNotification> */}
        </Modal>
      </Box>
    </Box>
  )
}
export default ProfileScreen
