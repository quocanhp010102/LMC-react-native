import React, { memo, useEffect, useRef, useState } from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { Icon } from "../../../components/svg-icon";
import { Box, Text } from "../../../rebass";
const { width, height } = Dimensions.get("screen");

interface Props {
  choose: (id : number) => void;
  isSelectedAll?: boolean;
  data: any;
  index: number;
  setModalAdd: (value : boolean) => void;
  setModalVisible: (value : boolean) => void;
  setUserChoose?: () => void;
}
const genericMemo: <T>(component: T) => T = memo;

export const RefFncSelectedAll = React.createRef<any[]>()

export const StudentList: React.FC<Props> = genericMemo((props: Props) => {
  const {
    data,
    choose, 
    index
  } = props;
  

  const refIconTicker =  useRef<any>()
  const refIcon = useRef<any>()
  const isSelected = useRef<boolean>(false)
  
  if(!RefFncSelectedAll.current) {
      //@ts-ignore
    RefFncSelectedAll.current = []
  }

  const setIsSelected = (value: boolean) => {
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
  };

  RefFncSelectedAll.current[index] = { setIsSelected: setIsSelected };
  
  return (
    <Box
      key={data.id}
      style={{
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start",
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
            <View style={{ position: "absolute" , opacity : 0 }} ref={refIconTicker}>
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
          <Text
            style={{
              color: "#636363",
              fontSize: 12,
              textAlign: "center",
            }}
          >
            {data.student_code}
          </Text>
        </Box>
      </Box>
      <Box
        style={{
          width: "50%",
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
          <Box
          // onPress={() => {
          //   setUserChoose(data), setTypeModal("view"), setModalVisible(true);
          // }}
          >
            <Text
              style={{
                color: "#636363",
                fontSize: 12,
                textAlign: "center",
              }}
            >
              {`${data.student_fullname}`}
            </Text>
          </Box>
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
            backgroundColor: "#D4D4D4",
          }}
        ></Box>
      </Box>
    </Box>
  );
});
