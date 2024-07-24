import React, { useEffect, useState } from "react"
import {
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native"
import {
  DrawerContentComponentProps,
  DrawerContentOptions,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer"
import Stomp from "stompjs"
import { useAppDispatch, useAppSelector } from "../hooks/ReduxHook"
import { generateApiService } from "../services/ApiService"
import { ProfileApi } from "../services/api/Profile/ProfileApi"
import { deleteUser, updateUser } from "../Redux/counterSlice"
import { FastImage } from "components-base"
import ICLogout from "../components/svg-icon/ICLogout"
import { lightColors } from "../themes"
import { useNavigation } from "@react-navigation/native"
import { KEYS } from "../constants/key"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { UserProps } from "../components/Header"
import { API } from "../services"
import SockJS from "sockjs-client"
import { addNoteRealTime, addNumberNotification } from "../Redux/NoteRealTime"
import { NotificationApi } from "../services/api/Notification/NotificationApi"
import { DrawerItemListCustom } from "./CustomDrawerList"
import { AuthServices } from "../services/keycloak/authServic"

const CustomDrawer = (
  props: DrawerContentComponentProps<DrawerContentOptions>
) => {
  const { doLogout } = AuthServices()
  const user = useAppSelector((state) => state.users.userList[0])
  const role: any = user.role
  const dispatch = useAppDispatch()


  const dataUser = useAppSelector((state) => state.users.profile)

  const navigation = useNavigation()

  const getNumberNotifycaition = async () => {
    const response = await generateApiService.get(
      NotificationApi.getNumberNotifycation()
    )
    if (response) {
      await dispatch(addNumberNotification(response))
    }
  }

  useEffect(() => {
    getNumberNotifycaition()
 
  }, [])

  useEffect(() => {
    if (dataUser) {
      var sock = new SockJS(
        `${API.PUBLIC}services/lmstrainingmanagementtest/ws`
      )
      let stompClient = Stomp.over(sock)
      sock.onopen = function () {}
      stompClient.connect({}, function (frame) {
        stompClient.subscribe(
          `/topic/notificaiton/${dataUser.id}`,
          async function (greeting) {
            let newData = await JSON.parse(greeting.body)
            if (newData.noteId) {
              await dispatch(
                addNoteRealTime({
                  noteId: newData.noteId,
                  noteContentId: newData.noteContentId,
                  noteContentTitle: newData.noteContentTitle,
                  noteContentContent: newData.noteContentContent,
                  noteContentDate: newData.noteContentDate,
                  noteDate: newData.noteDate,
                })
              )
            }
            getNumberNotifycaition()
          }
        )
      })
    }
  }, [dataUser])

  const logout = async () => {
    //@ts-ignore
    dispatch(deleteUser({ role }))
    dispatch(addNumberNotification(0))
    await AsyncStorage.setItem(KEYS.TOKEN, "")
    await AsyncStorage.setItem(KEYS.REFRESH_TOKEN, "")
    //@ts-ignore
    navigation.replace("login")
  }

  return (
    <View style={styles.flex_1}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.bgTransparent}
      >
        <ImageBackground
          source={{
            uri: "https://img5.thuthuatphanmem.vn/uploads/2021/12/17/background-tinh-te-chuyen-nghiep_012036209.png",
          }}
          style={styles.p_20}
        >
          <TouchableOpacity style={styles.w_85}>
            <FastImage
              source={{ uri: dataUser?.avatarUrlCustom }}
              style={styles.imageAvatar}
            />
          </TouchableOpacity>
          <Text style={styles.textName}>{dataUser?.name}</Text>
          <View style={styles.flexRow}>
            <Text style={styles.textEmail}>{dataUser?.email}</Text>
          </View>
        </ImageBackground>
        <View style={styles.groupLogout}>
          <DrawerItemListCustom {...props} />
          <DrawerItem
            icon={() => {
              return <ICLogout color={lightColors._FF3B2F}></ICLogout>
            }}
            inactiveTintColor={lightColors._FF3B2F}
            label="Đăng xuất"
            onPress={() => {
              logout()
            }}
          />
        </View>
      </DrawerContentScrollView>
    </View>
  )
}
export default CustomDrawer

const styles = StyleSheet.create({
  imageAvatar: {
    height: 80,
    width: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 0.3,
    borderColor: "#014F59",
  },
  textName: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 5,
    marginTop: 20,
  },
  textEmail: {
    color: "#fff",
    marginRight: 5,
  },
  flexRow: { flexDirection: "row" },
  groupLogout: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10,
    paddingBottom: 20,
  },
  bgTransparent: {
    backgroundColor: "transparent",
  },
  p_20: {
    padding: 20,
  },
  w_85: {
    width: 85,
  },
  flex_1: {
    flex: 1,
  },
})
