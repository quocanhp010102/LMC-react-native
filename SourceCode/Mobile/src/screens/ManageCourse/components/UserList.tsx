import React, { memo } from "react";
import { Dimensions, TouchableOpacity } from "react-native";
import { NavLink } from "../../../platform/links";
import { Box, Text } from "../../../rebass";
const { width, height } = Dimensions.get("screen");

interface Props {
  choose?: () => void;
  isSelected?: boolean;
  data: any;
  index: number;
  setTypeModal?: () => void;
  setModalVisible?: () => void;
  setUserChoose?: () => void;
}
const genericMemo: <T>(component: T) => T = memo;
export const UserList: React.FC<Props> = genericMemo((props: Props) => {
  const { data, index } = props;

  console.log("data" ,data);
  

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
      {/* <Box
        style={{
          width: "10%",
          flexDirection: "row",
        }}
      >
        <Box
          height={40}
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
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
        <Box
          style={{
            width: 1,
            backgroundColor: "#D4D4D4",
          }}
        ></Box>
      </Box> */}
      <Box
        style={{
          width: "17.5%",
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
          <Text
            style={{
              color: "#636363",
              fontSize: 12,

              textAlign: "center",
            }}
          >
            {data.studentCode}
          </Text>
        </Box>

        <Box
          style={{
            width: 1,
            backgroundColor: "#D4D4D4",
          }}
        ></Box>
      </Box>
      <Box
        style={{
          width: "37.5%",
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
          <NavLink
            {...{
              route: "/danh-sach-bai-thi-sinh-vien",
              params: {
                id: data.studentId,
                courseId: data.courseId,
                data: data,
              },
            }}
          >
            <Text
              style={{
                color: "#636363",
                fontSize: 12,

                textAlign: "center",
              }}
            >
              {data.studentName}
            </Text>
            <Box height={1} bg="#636363"></Box>
          </NavLink>
        </Box>
      </Box>
      <Box
        style={{
          width: "22.5%",
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
            {data.percent}%
          </Text>
        </Box>
      </Box>
      <Box
        style={{
          width: "22.5%",
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
            {data.percentExams}%
          </Text>
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
            {data.percentExams}%
          </Text>
        </Box>
      </Box> */}
    </Box>
  );
});
