import React, { memo } from "react";
import { Dimensions, TouchableOpacity } from "react-native";
import { Icon } from "../../../components/svg-icon";
import { Box, Text } from "../../../rebass";
const { width, height } = Dimensions.get("screen");

interface Props {
  choose: (id : number) => void;
  isSelected: boolean;
  data: any;
  index: number;
  setModalAdd: ( value : boolean) => void;
  setModalVisible: (value : boolean) => void;
}
const genericMemo: <T>(component: T) => T = memo;
export const UserList: React.FC<Props> = genericMemo((props: Props) => {
  const {
    data,
    choose,
    index,
    isSelected,
 
  } = props;
  return (
    <Box
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start",
      }}
    >
      <TouchableOpacity
        onPress={() => {
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
          {isSelected ? (
            <Icon name="chooseBox"></Icon>
          ) : (
            <Icon name="CheckBox"></Icon>
          )}
        </Box>
      </TouchableOpacity>

      <Box
        style={{
          width: "15%",
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
            {index + 1}
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
          <TouchableOpacity
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
          </TouchableOpacity>
        </Box>
      </Box>
   
    </Box>
  );
});
