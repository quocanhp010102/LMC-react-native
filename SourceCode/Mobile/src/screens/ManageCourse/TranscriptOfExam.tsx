import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Box, Flex, Text } from "../../rebass";
import { Header, NotificationIcon } from "../../components/Header";
import { SearchBar } from "../../components/SearchBar";
import { CardHistoryExam } from "../../components/CardHistoryExam";
import { Icon } from "../../components/svg-icon";
import { MemberCourse } from "../../components/MemberCourse";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { NavLink } from "../../platform/links";
import { Devider } from "../../components/Devider";
import { generateApiService } from "../../services/ApiService";
import { ExamsApi } from "../../services/api//Exams/ExamsApi";
import { StudentList } from "./components/StudentList";
const { width, height } = Dimensions.get("screen");
const TranscriptOfExam = (props: any) => {
  const { id_exam, data, id_course } = props.route.params;
  const [listExams, setListExams] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const onGetExams = async () => {
    setLoading(true);
    const dataExams = await generateApiService.get(
      ExamsApi.getTranscriptOfExam(id_exam)
    );

    setListExams(dataExams.content);
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      onGetExams();
    }, [])
  );
  return (
    <Box bg="defaultBackground" position="relative" height="100%">
      <Box height="100%" mt={2}>
        <Header title="Tiến độ bài thi" search leftButton="back">
          <NotificationIcon />
        </Header>
        <Box height={1} bg="#636363" opacity={0.3} mt={2} />
        <ScrollView>
          <Flex flex={1} px={2}>
            <Devider></Devider>
            <Flex
              flexDirection="row"
              alignItems="flex-start"
              justifyContent="center"
            >
              <Flex flex={1}>
                <Text
                  fontWeight={700}
                  fontSize={20}
                  style={{ textTransform: "uppercase" }}
                  color="textColor"
                >
                  {data.examName}
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Box alignItems="center"></Box>
          <Box style={{ padding: 10 }}>
            <Text fontSize={20} color="#32813D">
              BÀI THI ĐÃ NỘP
            </Text>
          </Box>
          <Box
            style={{
              flex: 1,
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
            ml="2.5%"
            width={width * 0.95}
          >
            <Box mt={2} borderWidth={1} borderRadius={8} borderColor="#D4D4D4">
              <Box
                style={{
                  flex: 1,
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                }}
              >
                <Box
                  style={{
                    width: "10%",
                  }}
                >
                  <Box
                    height={40}
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <Text>STT</Text>
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
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      MÃ SINH VIÊN
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
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      TÊN SINH VIÊN
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
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      XEM BÀI THI
                    </Text>
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
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      ĐIỂM
                    </Text>
                  </Box>
                </Box>
              </Box>
              {loading ? (
                <Box
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                  mb={1}
                >
                  <ActivityIndicator size="large" color="#00A8B5" />
                </Box>
              ) : listExams.length > 0 ? (
                listExams.map((Exams : any, index : number) => {
                  return (
                    <StudentList
                      key={String(index)}
                      data={Exams}
                      index={index}
                      id_course={id_course}
                      id_exam={id_exam}
                      typeExam={data?.typeOfExams?.id}
                    ></StudentList>
                  );
                })
              ) : (
                <Box>
                  <Box height={1} backgroundColor="#D4D4D4" width="100%"></Box>
                  <Box
                    alignItems="center"
                    justifyContent="center"
                    backgroundColor="rgba(100, 116, 139, 0.05)"
                    height={40}
                  >
                    <Text mt={2} color="seen" fontSize={15} mb={1}>
                      Không có sinh viên
                    </Text>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
          <Box height={20} />
        </ScrollView>
      </Box>
    </Box>
  );
};
export default TranscriptOfExam;
