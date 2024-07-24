import React, { memo, useCallback, useEffect, useRef } from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { Icon } from "../../../components/svg-icon";
import { Box, Text } from "../../../rebass";
import { borderBottom, borderLeft, borderRadius } from "styled-system";
const { width, height } = Dimensions.get("screen");

interface Props {
  choose: (id?: number) => void;
  data: any;
  index: number;
  setTypeModal: ( value : string) => void;
  setModalVisible: (value : boolean) => void;
  setUserChoose: (value : any) => void;
  length : number ; 
  setTitleNoti : (value : string) => void;
  allNew : boolean
}




export const UserList = React.memo((props: Props) => {
  const {
    data,
    choose,
    index,
    setTypeModal,
    setModalVisible, 
    setTitleNoti ,
    setUserChoose,
    length ,
    allNew
  } = props;


  

  const refIconTicker =  useRef<View>(null)
  const refIcon = useRef<View>(null)
  const isSelected = useRef<boolean>(false)

  const setIsSelected =  useCallback((value: boolean) => {
    refIconTicker.current?.setNativeProps({
      style: {
        opacity: value ? 1 : 0,
      },
    });
    refIcon.current?.setNativeProps({
      style: {
        opacity: !value ? 1 : 0,
      },
    });
    isSelected.current = value;
  }, []);

  const formatRole = (roles: any) => {
    if (roles === "ROLE_LECTURER") {
      return "Giảng Viên";
    }
    if (roles === "ROLE_STUDENT") {
      return "Học Viên";
    }
    return roles;
  };
  useEffect(() => {
    setIsSelected(allNew);
  }, [allNew]);

  return (
    <Box
      key={data?.id}
      style={{
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start",
        backgroundColor:
          index % 2 === 0 ? "#E5F3F8" : "white",
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderColor: "#D4D4D4",
        // borderBottomWidth: index === length - 1 ? 1 : 0,
        // borderBottomLeftRadius: index === length - 1 ? 8 : 0,
        // borderBottomRightRadius: index === length - 1 ? 8 : 0,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          setIsSelected(!isSelected.current);
          choose(data.id);
        }}
        style={{
          width: "10%",
          flexDirection: "row",
        }}
      >
        <Box
          height={40}
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <View style={{ position: "relative" }}>
            <View
              style={{ position: "absolute", opacity: 0 }}
              ref={refIconTicker}
            >
              <Icon name="chooseBox"></Icon>
            </View>
            <View ref={refIcon}>
              <Icon name="CheckBox"></Icon>
            </View>
          </View>
        </Box>
      </TouchableOpacity>
      <Box
        style={{
          width: "25%",
          flexDirection: "row",
        }}
      >
        <Box
          style={{
            width: 1,
            backgroundColor: "#D4D4D4",
          }}
        ></Box>
        <Box
          height={40}
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Text
            style={{
              color: "#636363",
              fontSize: 12,
              textAlign: "center",
            }}
            numberOfLines={2}
          >
            {data.userCode}
          </Text>
        </Box>
      </Box>
      <TouchableOpacity
        onPress={() => {
          setTitleNoti("Sửa người dùng"), setTypeModal("view");
          setUserChoose(data), setModalVisible(true);
        }}
        style={{
          width: "40%",
          flexDirection: "row",
        }}
      >
        <Box
          style={{
            width: 1,
            backgroundColor: "#D4D4D4",
          }}
        ></Box>

        <Box
          height={40}
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Box>
            <Text
              style={{
                color: "#636363",
                fontSize: 12,

                textAlign: "center",
              }}
            >
              {data.userName}
            </Text>
            <Box height={1} bg="#636363"></Box>
          </Box>
        </Box>
      </TouchableOpacity>

      <Box
        style={{
          width: "25%",
          flexDirection: "row",
        }}
      >
        <Box
          style={{
            width: 1,
            backgroundColor: "#D4D4D4",
          }}
        ></Box>
        <Box
          height={40}
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            key={String(index)}
            style={{
              color: "#636363",
              fontSize: 12,

              textAlign: "center",
            }}
          >
            {formatRole(data.authorities)}
          </Text>
        </Box>
      </Box>
    </Box>
  );
});
