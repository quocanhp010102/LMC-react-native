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
  setModalAdd:React.Dispatch<any>;
  setModalVisible: React.Dispatch<any>;
  setUserChoose: React.Dispatch<any>;
}
const genericMemo: <T>(component: T) => T = memo;
export const UserList: React.FC<Props> = genericMemo((props: Props) => {
  const {
    data,
    choose,
    index,
    isSelected,
    setModalAdd,
    setModalVisible,
    setUserChoose,
  } = props;

  

  return (
    <Box
      key={data.id}
      style={{
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start",
        backgroundColor:
          index % 2 === 0 ? "#E5F3F8" : "white",
      }}
    >
      <Box
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
          <TouchableOpacity
            onPress={() => {
              choose(data.id);
            }}
          >
            {isSelected ? (
              <Icon name="chooseBox"></Icon>
            ) : (
              <Icon name="CheckBox"></Icon>
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
              paddingHorizontal : 4
            }}
          >
            {data.student_code}
          </Text>
        </Box>
      </Box>
      <Box
        style={{
          width: "60%",
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
                paddingHorizontal : 4,
                textAlign: "center",
              }}
            >
              {`${data.student_fullname}`}
            </Text>
          </Box>
        </Box>
      </Box>
      {/* <Box
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
      </Box> */}
    </Box>
  );
});
