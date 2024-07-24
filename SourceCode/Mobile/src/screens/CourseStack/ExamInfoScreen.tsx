import { useEffect, useState } from "react";
import { Dimensions, RefreshControl, ScrollView } from "react-native";
import { CardHistoryExam } from "../../components/CardHistoryExam";
import { Header, NotificationIcon } from "../../components/Header";
import { Icon } from "../../components/svg-icon";
import { Box, Flex, Text } from "../../rebass";

import dayjs from "dayjs";
import { Devider } from "../../components/Devider";
import { NavLink } from "../../platform/links";
import { generateApiService } from "../../services/ApiService";
import { ExamsApi } from "../../services/api/Exams/ExamsApi";
import { ProfileApi } from "../../services/api/Profile/ProfileApi";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
const { width, height } = Dimensions.get("screen");
const ExamInfoScreen = (props: any) => {
  var utc = require("dayjs/plugin/utc");
  dayjs.extend(utc);
  const navigation = useNavigation()

  const { title, id, id_course } = props.route?.params;
  const [data, setData] = useState<any>();
  const [historyExam, setHistoryExam] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [realTime, setRealTime] = useState<any>(null);
  const [checkExamp, setCheckExams] = useState<boolean>(false)

  const isFocused = useIsFocused()


  const getData = async () => {
    setLoading(true);
    try {
      const dataExam = await generateApiService.get(
        ExamsApi.getExamsBeforePass(id)
      );
      const getRealTime = new Date().getTime();
      setRealTime(getRealTime);
      const dataUser = await generateApiService.get(
        ProfileApi.getInfoStudent()
      );
      setData(dataExam);
      const dataExamHistory = await generateApiService.get(
        ExamsApi.getAllExamStudentInCourse(id_course, dataUser.id)
      );
      setHistoryExam(dataExamHistory.content);

      const checkExampData = dataExamHistory?.content?.find(
        (data : any) => data.examsId === id
      );
      setCheckExams(checkExampData ? true : false);

      setLoading(false);
    } catch (e) {
      console.log("error", e);

      setLoading(false);
    }
  };

  const postHistoryExam = async () => {
    try {
      data.typeOfExams.id == 1
        ? navigation.navigate("/bai-thi-trac-nghiem", {
          id_exams: data?.id,
          title: title,
        })
        : navigation.navigate("/bai-thi-tu-luan", {
          id_exams: data?.id,
          title: title,
        });
    } catch (e) { }
  };

  useEffect(() => {
    if (isFocused && id) {
      getData();
    }
  }, [isFocused, id]);

  

  return (
    <Box bg="defaultBackground" position="relative" height="100%">
      <Box height="100%" mt={2}>
        <Header title="Thông tin bài thi" search leftButton="back">
          <NotificationIcon />
        </Header>
        <Box height={1} bg="#636363" opacity={0.3} mt={2} />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => {
                getData();
              }}
            ></RefreshControl>
          }
        >
          <Flex flex={1} px={2}>
            <Flex
              flexDirection="row"
              alignItems="flex-start"
              justifyContent="center"
            >
              <Flex flex={1}>
                <Text
                  lineHeight={30}
                  color="#1C7988"
                  fontWeight="bold"
                  fontSize={17}
                  mt={17}
                  style={{ textTransform: "uppercase" }}
                >
                  {title}
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Box alignItems="center">
            <Box
              width="95%"
              borderRadius={10}
              borderWidth={1}
              borderColor="rgba(125, 125, 125, 0.3)"
              mt={2}
            >
              <Text
                fontWeight={500}
                fontSize={16}
                color="buttonColor"
                padding={2}
                style={{ textTransform: 'uppercase' }}
              >
                {data && data?.typeOfExams?.id == 1 ? `TRẮC NGHIỆM: ${data.examName}` : data?.typeOfExams?.id == 2 ? `tỰ LUẬN: ${data.examName}` : null}
              </Text>
            </Box>
            <Box
              width="95%"
              backgroundColor="#FFF9F9"
              borderRadius={10}
              borderWidth={1}
              borderColor="rgba(125, 125, 125, 0.3)"
              mt={2}
            >
              <Box flexDirection="row" ml={3} mt={2}>
                <Icon name="NotificationCourse" size={20} color="headerText" />
                <Text fontWeight={500} fontSize={16} color="#636363">
                  Thông báo chung
                </Text>
              </Box>

              <Box ml={2} padding={2}>
                <Text color="#636363" fontSize={12} >
                  {"\u2B24"}
                  {"   "}
                  <Text color="#636363">
                    Thời gian mở bài :{" "}
                    {data
                      ? dayjs(data.examOpenTime).format("h:mm A-DD-MM-YYYY")
                      : null}
                  </Text>
                </Text>
              </Box>
              <Box ml={2} padding={2}>
                <Text color="#636363" fontSize={12} >
                  {"\u2B24"}
                  {"   "}
                  <Text color="#636363">
                    Thời gian đóng bài :{" "}
                    {data
                      ? dayjs(data.examCloseTime).format("h:mm A-DD-MM-YYYY")
                      : null}
                  </Text>
                </Text>
              </Box>
              <Box ml={2} padding={2}>
                <Text fontSize={12} color="#636363">
                  {"\u2B24"}
                  {"   "}
                  Thời gian làm bài :{" "}
                  <Text color="#636363">
                    {data ? data.examLimittedWorkingTime : null} phút
                  </Text>
                </Text>
              </Box>
            </Box>
            {loading ? (
              <Text mt={2} fontSize={18}>
                Đang tải ...
              </Text>
            ) : data ? (
              !checkExamp ? (
                  (realTime / 1000 <= dayjs(data.examCloseTime).unix()) &&
                  realTime / 1000 >= dayjs(data.examOpenTime).unix() ? (
                  <TouchableOpacity
                    onPress={() => {
                      postHistoryExam();
                    }}
                  >
                    <Box
                      style={{
                        width: width * 0.5,
                        height: 50,
                        backgroundColor: "#00A8B5",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 5,
                        marginTop: 15,
                      }}
                    >
                      <Text
                        color="#FFFFFF"
                        fontWeight={700}
                        padding={2}

                        lineHeight={24}
                      >
                        BẮT ĐẦU LÀM BÀI
                      </Text>
                    </Box>
                  </TouchableOpacity>
                ) : (
                  <Box

                    style={{
                      width: width * 0.5,
                      height: 50,
                      backgroundColor: "#00A8B5",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 5,
                      marginTop: 15,
                    }}
                  >
                    <Text color="#FFFFFF" fontWeight={700}>
                      NGOÀI GIỜ LÀM BÀI THI
                    </Text>
                  </Box>
                )
              ) : (
                <Box
               
                  style={{
                    width: width * 0.5,
                    height: 50,
                    backgroundColor: "#00A8B5",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 5,
                    marginTop: 15,
                  }}
                >
                  <Text color="#FFFFFF" fontWeight={700}>
                    BẠN ĐÃ NỘP BÀI
                  </Text>
                </Box>
              )
            ) : null}
            <Box
              width="95%"
              borderRadius={10}
              borderWidth={1}
              borderColor="rgba(125, 125, 125, 0.3)"
              mt={2}
            >
              <Box flexDirection="row" padding={2}>
                <Icon name="ic_update" size={20} color="white" />
                <Text fontSize={16} color="#636363" ml={1}>
                  Lịch sử làm bài
                </Text>
              </Box>
              {historyExam &&
                historyExam.map((info) => (
                  <Box alignItems="center" mb={2} key={info.examsId}>
                    <CardHistoryExam
                      subject={info.examsName}
                      status={"Hoàn thành"}
                      submittedTime={info.examsDateSubmit}
                      points={info.examsPoint}
                    ></CardHistoryExam>
                  </Box>
                ))}
            </Box>
          </Box>
          <Box height={20} />
        </ScrollView>
      </Box>
    </Box>
  );
};
export default ExamInfoScreen;
