import React, { memo } from "react";
import { Dimensions, TouchableOpacity } from "react-native";
import { NavLink } from "../../../platform/links";
import { Box, Text } from "../../../rebass";
import dayjs from "dayjs";

const { width, height } = Dimensions.get("screen");

interface Props {
  choose?: () => void;
  isSelected?: boolean;
  data: any;
  index: number;
  setTypeModal?: () => void;
  setModalVisible?: () => void;
  setUserChoose?: () => void;
  idStudent?: any;
  onGetExamsById?: any;
}

const genericMemo: <T>(component: T) => T = memo;
export const ExamsList: React.FC<Props> = genericMemo((props: Props) => {
  const { data, index, idStudent, onGetExamsById } = props;
  const day = dayjs(data.examsDateSubmit).format("DD/MM/YY");

  return (
    <Box
      key={data.id}
      style={{
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start",
        backgroundColor: index % 2 === 0 ? "#E5F3F8" : "white",
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
              numberOfLines={2}
            >
              {data.examsName}
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
            {day}
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
          {data.typeOfExams == "2" ? (
            onGetExamsById ? (
              <TouchableOpacity
                onPress={() => onGetExamsById(idStudent, data.examsId)}
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
              </TouchableOpacity>
            ) : (
              <NavLink
                {...{
                  route: "/chi-tiet-bai-thi-sinh-vien",
                  params: {
                    id_exam: data.examsId,
                    id_course: data.courseId,
                    id_student: idStudent,
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
                opacity: 0.5,
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
            {data.examsPoint !== null ? data.examsPoint : "Chưa chấm"}
          </Text>
        </Box>
      </Box>
    </Box>
  );
});
