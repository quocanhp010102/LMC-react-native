import React, { memo } from "react";
import { Dimensions, TouchableOpacity } from "react-native";
import { NavLink } from "../../../platform/links";
import { Box, Text } from "../../../rebass";
import dayjs from "dayjs";
const { width, height } = Dimensions.get("screen");

interface Props {
  data: any;
  index: number;
  id_course: number;
  id_exam: number;
  typeExam: any;
}

const genericMemo: <T>(component: T) => T = memo;
export const StudentList: React.FC<Props> = genericMemo((props: Props) => {
  const { data, index, id_course, id_exam, typeExam } = props;

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
      </Box>
      <Box
        style={{
          width: "25%",
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
          <TouchableOpacity>
            <Text
              style={{
                color: "#636363",
                fontSize: 12,
                textAlign: "center",
              }}
            >
              {data.code ? data.code : ""}
            </Text>
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
            }}
          >
            {data.fullname ? data.fullname : ""}
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
          {typeExam == "2" ? (
            data.point && data.point == "Chưa thi" ? (
              <Text
                style={{
                  color: "#636363",
                  fontSize: 12,
                  textAlign: "center",
                  opacity: 0.5,
                }}
              >
                Xem
              </Text>
            ) : (
                //@ts-ignore
              <NavLink
                {...{
                  route: "/chi-tiet-bai-thi-sinh-vien",
                  params: {
                    id_exam: id_exam,
                    id_course: id_course,
                    id_student: data.id,
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
                  Xem
                </Text>
                <Box height={1} bg="#636363"></Box>
              </NavLink>
            )
          ) : (
            <Text
              style={{
                color: "#636363",
                fontSize: 12,
                textAlign: "center",
                opacity: 0.3,
              }}
            >
              Xem
            </Text>
          )}
        </Box>
      </Box>
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
            {data.point ? data.point : ""}
          </Text>
        </Box>
      </Box>
    </Box>
  );
});
