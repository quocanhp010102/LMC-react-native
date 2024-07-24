import React, { useEffect } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { CardManageCourse } from "../../components/CardManageCourse";
import { Devider } from "../../components/Devider";
import { Header, NotificationIcon } from "../../components/Header";
import { InputWithIcon } from "../../components/InputWithIcon";
import { NavLink } from "../../platform/links";
import { useNavigation } from "@react-navigation/native";
import { Box, Flex, Text } from "../../rebass";
import { generateApiService } from "../../services/ApiService";
import { CourseApi } from "../../services/Course/CourseApi";
const ManageExamsCreated = (props) => {
  const [queryInput, setQueryInput] = React.useState<string>();
  const [exams, setExams] = React.useState<any>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const checkVadidate = (inputValue: any) => {
    if (inputValue.length <= 255) {
      setQueryInput(inputValue);
    } else {
      setQueryInput("");
    }
  };
  const navigation = useNavigation();
  const { route } = props;
  const onGetExamsCreated = async () => {
    const response = await generateApiService.get(
      CourseApi.getExamCreated(route.params.courseId)
    );
    if (response) {
      setExams(response.content);
    }
  };
  useEffect(() => {
    onGetExamsCreated();
  }, [route.params]);
  const formatStatus = (status: string, check: string) => {
    if (check == 0) {
      return (
        <Text color="seen" fontSize={18} mt={4} width="45%">
          Chưa nộp bài nào
        </Text>
      );
    }
    if (status === "0") {
      return (
        <Text color="#d12c2c" fontSize={18} mt={4} width="45%">
          Chấm Điểm
        </Text>
      );
    }
    if (status === "1") {
      return (
        <Text color="#32813D" fontSize={18} mt={4} width="45%">
          Đã Chấm Điểm
        </Text>
      );
    }
    return false;
  };

  return (
    <Box bg="defaultBackground" position="relative" height="100%">
      <Box height="100%">
        <Header title="Danh sách bài thi" search leftButton="back">
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
                  fontWeight="bold"
                  fontSize={20}
                  color="textColor"
                  lineHeight={30}
                >
                  DANH SÁCH CÁC BÀI THI ĐÃ TẠO
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Flex
            mb={2}
            p={2}
            flexDirection="row"
            alignItems="center"
            // borderBottomWidth={1}
            borderBottomColor="tabBar"
          >
            {/* <Icon name="search" size={20} /> */}
            {/* <InputWithIcon
              border
              backgroundColor="#fff"
              icon="search"
              flex={1}
              value={queryInput}
              onChangeText={(e) => checkVadidate(e)}
              iconColor="inputClose"
              iconSize={16}
              onPress={() => setQueryInput("")}
            /> */}
          </Flex>
          {exams.map((exam: any, index: any) => {
            let checkSubmit = true;
            if (exam.examTotalStudentSubmitted <= 0 || exam.examStatus == "1") {
              checkSubmit = false;
            }
            return (
              // <NavLink
              //   key={String(index)}
              //   {...{
              //     route: "/chi-tiet-bai-thi-sinh-vien",

              //     params: {
              //       id_exam: exam.id,
              //       id_course: route.params.courseId,
              //     },
              //   }}
              // >
              <Box mb={1} ml={2}>
                <CardManageCourse title={exam.examName}>
                  <Box
                    flex={1}
                    flexDirection="row"
                    flexWrap="wrap"
                    alignItems="center"
                    px={2}
                    py={2}
                  >
                    <Text
                      color="seen"
                      fontSize={18}
                      fontWeight="bold"
                      ml={2}
                      width="55%"
                    >
                      Học Viên Nộp Bài
                    </Text>
                    <Text color="seen" fontSize={18} mt={4} width="40%">
                      {`${exam.examTotalStudentSubmitted}/${exam.examTotalStudent}`}
                    </Text>
                    <Text
                      color="seen"
                      fontSize={18}
                      fontWeight="bold"
                      mt={4}
                      ml={2}
                      width="55%"
                    >
                      {`Số bài đã chấm`}
                    </Text>
                    <Text color="seen" fontSize={18} mt={4} width="40%">
                      {`${
                        exam.examTotalStudentSubmitted -
                        exam.examTotalIsNotGraded
                      }/${exam.examTotalStudentSubmitted}`}
                    </Text>
                    <Text
                      color="seen"
                      fontSize={18}
                      fontWeight="bold"
                      mt={4}
                      ml={2}
                      width="55%"
                    >
                      Trạng Thái
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        if (checkSubmit) {
                          navigation.navigate("/chi-tiet-bai-thi-sinh-vien", {
                            id_exam: exam.id,
                            id_course: route.params.courseId,
                          });
                        }
                      }}
                      style={{ width: "40%", marginTop: 20 }}
                    >
                      <Text color="seen" fontSize={18}>
                        {formatStatus(
                          exam.examStatus,
                          exam.examTotalStudentSubmitted
                        )}
                      </Text>
                    </TouchableOpacity>

                    <Text
                      color="seen"
                      fontSize={18}
                      fontWeight="bold"
                      mt={4}
                      ml={2}
                      width="55%"
                    >
                      Danh Sách Điểm
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("/danh-sach-diem", {
                          id_exam: exam.id,
                          data: exam,
                          id_course: route.params.courseId,
                        });
                      }}
                      style={{ width: "40%", marginTop: 20 }}
                    >
                      <Text color="seen" fontSize={18}>
                        Xem
                      </Text>
                      <Box height={1} bg="#636363" width={40}></Box>
                    </TouchableOpacity>
                  </Box>
                </CardManageCourse>
              </Box>
              // </NavLink>
            );
          })}
        </ScrollView>
      </Box>
    </Box>
  );
};

export default ManageExamsCreated;

const styles = StyleSheet.create({});
