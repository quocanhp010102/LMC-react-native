import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import axios from "axios"
import { FastImage } from "components-base"
import React, { useRef, useState } from "react"
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native"
import { addnewUser, updateProfile } from "../../Redux/counterSlice"
import { Icon } from "../../components/svg-icon"
import ICEyeHidden from "../../components/svg-icon/ICEyeHidden"
import ICEyeShow from "../../components/svg-icon/ICEyeShow"
import { KEYS } from "../../constants/key"
import { useAppDispatch } from "../../hooks/ReduxHook"
import { Box, Text, TextInput } from "../../rebass"
import HeaderLogo from "./components/HeaderLogo"
import { AuthServices } from "../../services/keycloak/authServic"
import ICLogoHCM from "../../components/svg-icon/ICLogoHCM"
import { generateApiService } from "../../services/ApiService"
import { ProfileApi } from "../../services/api/Profile/ProfileApi"
import { avatarUrl } from "../../components/calendar/const"

const { width } = Dimensions.get("screen")
const ImageBannerLogin = require("../../../assets/bannerLogin.png")

export const Auth = () => {
  const [visible, setVisible] = useState(false)
  const disabled = useRef<boolean>(false)
  const [isSelected, setSelected] = useState(false)
  const [validate, setValidate] = useState(false)
  const navigation = useNavigation()
  const [username, setUserName] = useState<string>()
  const [password, setPassword] = useState<string>()
  const dispatch = useAppDispatch()
  const { doLoginGoogle, keycloak } = AuthServices()

  const handleLoginGGWithKeycloak = () => {
    doLoginGoogle(() => {
      if (keycloak?.token) {
        handleToken(keycloak?.token)
      }
    })
  }

  const getRemember = async () => {
    try {
      const value = await AsyncStorage.getItem(KEYS.REMEMBER)
      if (value !== null) {
        const data = JSON.parse(value)
        setUserName(data.username)
        if (data.isSelected) {
          setPassword(data.password)
          setSelected(data.isSelected)
        }
      }
    } catch (error) {}
  }

  useFocusEffect(
    React.useCallback(() => {
      getRemember()
      return () => {}
    }, [])
  )

  var jwtDecode = require("jwt-decode")
  const handleSigning = async () => {
    disabled.current = true
    const params: any = {
      grant_type: "password",
      client_id: "hcm",
      client_secret: "hcm",
      username: username?.trim(),
      password: password?.trim(),
    }
    const data = Object.keys(params)
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join("&")
    const options: any = {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data,
      url: "https://hanquochoc.edu.vn/auth/realms/hcm/protocol/openid-connect/token",
    }
    try {
      const res = await axios(options)
      if (res.status === 200 || res.status === 201) {
        handleToken(res?.data.access_token)
      }
      disabled.current = false
    } catch (e: any) {
      disabled.current = false
      const status = e.response?.status
      if (status === 401) {
        setValidate(true)
      }
    }
  }

  const handleToken = async (token: string) => {
    disabled.current = false
    var decoded = await jwtDecode(token)
    if (decoded.roles.includes("ROLE_ADMIN")) {
      await AsyncStorage.setItem(KEYS.TOKEN, token)
      await AsyncStorage.setItem(KEYS.REFRESH_TOKEN, token)
      let dataUser = {
        username: username?.trim(),
        password: password?.trim(),
        isSelected: isSelected,
      }
      AsyncStorage.setItem(KEYS.REMEMBER, JSON.stringify(dataUser))
      await dispatch(
        addnewUser({
          id: "2",
          role: "2",
          username: "daotao",
        })
      )
      handleGetProfile("2")
      //@ts-ignore
      setTimeout(() => {
        navigation.replace("main")
      }, 500)
    } else if (decoded.roles.includes("ROLE_LECTURER")) {
      await AsyncStorage.setItem(KEYS.TOKEN, token)
      await AsyncStorage.setItem(KEYS.REFRESH_TOKEN, token)
      let dataUser = {
        username: username?.trim(),
        password: password?.trim(),
        isSelected: isSelected,
      }
      AsyncStorage.setItem(KEYS.REMEMBER, JSON.stringify(dataUser))
      await dispatch(
        addnewUser({
          id: "1",
          role: "1",
          username: "giaovien",
        })
      )
      handleGetProfile("1")
      //@ts-ignore
      setTimeout(() => {
        navigation.replace("main")
      }, 500)
    } else if (decoded.roles.includes("ROLE_STUDENT")) {
      await AsyncStorage.setItem(KEYS.TOKEN, token)
      await AsyncStorage.setItem(KEYS.REFRESH_TOKEN, token)

      let dataUser = {
        username: username?.trim(),
        password: password?.trim(),
        isSelected: isSelected,
      }
      AsyncStorage.setItem(KEYS.REMEMBER, JSON.stringify(dataUser))
      await dispatch(
        addnewUser({
          id: "0",
          role: "0",
          username: "sinhvien",
        })
      )
      handleGetProfile("0")
      //@ts-ignore
      setTimeout(() => {
        navigation.replace("main")
      }, 500)
    }
  }

  const handleGetProfile = async (role: any) => {
    const listRole = {
      "0": () => generateApiService.get(ProfileApi.getInfoStudent()),
      "1": () => generateApiService.get(ProfileApi.getInfoLecturer()),
      "2": () => generateApiService.get(ProfileApi.getInfoAdmin()),
    }
    const apiCall = listRole[role as "0"]
    apiCall().then((response) => {
      console.log("response" ,response);
      
      dispatch(
        updateProfile({
          ...response,
          avatarUrlCustom:
            response?.student_avatar ??
            response?.lecturer_avatar ??
            response?.admin_avatar ??
            avatarUrl,
          name:
            response?.admin_fullname ??
            response?.student_fullname ??
            response?.lecturer_fullname ??
            "",
          email:
            response?.admin_email ??
            response?.student_email ??
            response?.lecturer_email ??
            "",
          phone:
            response?.admin_phone ??
            response?.student_phone ??
            response?.lecturer_phone ??
            "",
          gender:
            response?.admin_gender ??
            response?.student_gender ??
            response?.lecturer_gender,
          code:
            response?.admin_code ??
            response?.student_code ??
            response?.lecturer_code,
          birthday:
            response?.admin_birthday ??
            response?.student_birthday ??
            response?.lecturer_birthday,
        })
      )
    })
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={"padding"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      enabled={Platform.OS === "ios"}
    >
      <Box style={{ flex: 1 }}>
        <HeaderLogo />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Box>
            <FastImage
              source={ImageBannerLogin}
              style={{
                height: 257,
                width: Dimensions.get("screen").width,
                resizeMode: "contain",
              }}
            />
          </Box>
          <Box
            bg="defaultBackground"
            position="relative"
            height={"100%"}
            px={20}
          >
            <Box ml={2} mt={40}>
              <Text color="#00A8B5" fontSize={18}>
                Mã sinh viên/ giảng viên <Text color="cancelColor">*</Text>
              </Text>
              <TextInput
                width={width * 0.85}
                height={59}
                borderWidth={1}
                borderColor="#CBD5E1"
                padding={1}
                borderRadius={10}
                fontSize={16}
                marginBottom={2}
                marginTop={1}
                placeholder="example@gmail.com"
                defaultValue={username}
                onChangeText={(value) => setUserName(value)}
                onFocus={() => setValidate(false)}
              ></TextInput>
              {validate ? (
                <Text color="red" mb={2}>
                  Tài khoản hoặc mật khẩu không chính xác{" "}
                </Text>
              ) : null}
              <Text color="#00A8B5" mb={1} fontSize={18}>
                Mật khẩu <Text color="cancelColor">*</Text>
              </Text>
              <Box
                flexDirection="row"
                borderWidth={1}
                borderColor="#CBD5E1"
                height={59}
                width={width * 0.85}
                alignItems="center"
                mb={2}
                borderRadius={10}
              >
                <TextInput
                  width={width * 0.75}
                  height={59}
                  padding={1}
                  fontSize={16}
                  marginBottom={10}
                  placeholder="********"
                  marginTop={10}
                  defaultValue={password}
                  secureTextEntry={!visible ? true : false}
                  onChangeText={(value) => setPassword(value)}
                  onFocus={() => setValidate(false)}
                ></TextInput>
                <TouchableOpacity
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => setVisible(!visible)}
                >
                  {!visible ? (
                    <ICEyeShow height={24} width={24}></ICEyeShow>
                  ) : (
                    <ICEyeHidden height={24} width={24}></ICEyeHidden>
                  )}
                </TouchableOpacity>
              </Box>
            </Box>
            <Box padding={2} flexDirection="row">
              <TouchableOpacity
                onPress={() => {
                  setSelected(!isSelected)
                }}
              >
                {isSelected ? (
                  <Icon name="chooseBox"></Icon>
                ) : (
                  <Icon name="CheckBox"></Icon>
                )}
              </TouchableOpacity>
              <Text
                color="seen"
                ml={1}
                numberOfLines={2}
                fontSize={18}
                textAlign="center"
              >
                Nhớ tôi trên thiết bị này
              </Text>
            </Box>
            <Box style={{ alignItems: "center", justifyContent: "center" }}>
              <TouchableOpacity
                style={{
                  backgroundColor: "#00A8B5",
                  width: width * 0.8,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 59,
                  marginTop: 19,
                  borderRadius: 10,
                }}
                onPress={() => {
                  if (!disabled.current) {
                    handleSigning()
                  }
                }}
              >
                <Text fontSize={24} color="white" fontWeight={700}>
                  Đăng nhập
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#059DCE",
                  width: width * 0.8,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 59,
                  marginTop: 14,
                  borderRadius: 10,
                }}
                onPress={() => {
                  handleLoginGGWithKeycloak()
                }}
              >
                <Text fontSize={24} color="white" fontWeight={400}>
                  Google +
                </Text>
              </TouchableOpacity>
              <Box
                flexDirection={"row"}
                justifyContent={"center"}
                alignItems={"center"}
                paddingX={52}
                mt={60}
              >
                <ICLogoHCM height={51} width={50}></ICLogoHCM>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 16,
                    marginLeft: 14,
                    fontWeight: "700",
                    color: "#484848",
                  }}
                >
                  ĐỀ ÁN XD TĐH TRỌNG ĐIỂM VỀ HÀN QUỐC HỌC TẠI VN
                </Text>
              </Box>
            </Box>
          </Box>
        </ScrollView>
      </Box>
    </KeyboardAvoidingView>
  )
}
