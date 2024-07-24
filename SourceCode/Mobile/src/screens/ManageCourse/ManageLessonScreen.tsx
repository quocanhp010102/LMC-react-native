import React, { useEffect } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Devider } from "../../components/Devider";
import { Header, NotificationIcon } from "../../components/Header";
import { InputWithIcon } from "../../components/InputWithIcon";
import { Icon } from "../../components/svg-icon";
import { Box, Flex, Text } from "../../rebass";
import { generateApiService } from "../../services/ApiService";
import { CourseApi } from "../../services/Course/CourseApi";
import { UserList } from "./components/UserList";
const { width } = Dimensions.get("screen");
const ManageLessonScreen = (props : any) => {
  const [queryInput, setQueryInput] = React.useState<string>();
  const [details, setDetails] = React.useState<any>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  let timeOut : any;
  const checkVadidate = (inputValue: any) => {
    if (inputValue.length <= 255) {
      searchStudent(inputValue);
      setQueryInput(inputValue);

      if (inputValue === "") {
        onGetStudent();
      }
    } else {
      setQueryInput("");
    }
  };
  const { navigation, route } = props;
  const onGetStudent = async () => {
    try {
      setLoading(true);
      const response = await generateApiService.get(
        CourseApi.getAllStudentCourse(route.params.course_id)
      );

      if (response) {
        setDetails(response.content);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  const searchStudent = async (inputValue: any) => {
    setLoading(true);
    clearTimeout(timeOut);
    timeOut = setTimeout(async () => {
      const dataCourse = await generateApiService.get(
        CourseApi.searchStudentInCourse(
          route.params.course_id,
          inputValue,
          0,
          20
        )
      );
      setDetails(dataCourse.content);
    }, 800);
    setLoading(false);
  };
  
  useEffect(() => {
    onGetStudent();
  }, [route.params]);
  return (
    <Box bg="defaultBackground" position="relative" height="100%">
      <Box height="100%">
        <Header title="Khóa học " search leftButton="back">
          <NotificationIcon />
        </Header>
        <Box height={1} bg="#636363" opacity={0.3} mt={2} />
        <ScrollView>
          <Flex flex={1} px={2}>
            <Flex
              flexDirection="row"
              alignItems="flex-start"
              justifyContent="center"
            >
              <Flex flex={1}>
                <Text
                  lineHeight={30}
                  color="textColor"
                  fontWeight="bold"
                  fontSize={17}
                  mt={17}
                  style={{ textTransform: "uppercase" }}
                >
                  {route.params.course_title}
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
            height={70}
            justifyContent="space-between"
          >
            <Box width="80%">
              <InputWithIcon
                border
                backgroundColor="#fff"
                icon="search"
                flex={1}
                value={queryInput}
                onChangeText={(e) => checkVadidate(e)}
                iconColor="inputClose"
                iconSize={16}
                onPress={() => setQueryInput("")}
              />
            </Box>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("/danh-sach-bai-thi", {
                  courseId: route.params.course_id,
                })
              }
              style={{
                backgroundColor: "rgba(100, 116, 139, 0.1)",
                width: 50,
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
              }}
            >
              <Icon name="editCourse"></Icon>
            </TouchableOpacity>
          </Flex>
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
          ) : (
            <Box
              width={width * 0.95}
              mt={2}
              ml="2.5%"
              borderWidth={1}
              borderRadius={8}
              borderColor="#D4D4D4"

            >
              <Box
                style={{
                  flex: 1,
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                  backgroundColor:'#00A8B5',
                  borderTopLeftRadius:8,
                  borderTopRightRadius:8
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
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 12,
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      STT
                    </Text>
                  </Box>

                  <Box
                    style={{
                      width: 1,
                      backgroundColor: "#63636333",
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
                        color: "white",
                        fontSize: 12,
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      MSV
                    </Text>
                  </Box>

                  <Box
                    style={{
                      width: 1,
                      backgroundColor: "#63636333",
                    }}
                  ></Box>
                </Box>
                <Box
                  style={{
                    width: "37.5%",
                  }}
                >
                  <Box
                    height={40}
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 12,
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Tên Sinh viên
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
                      backgroundColor: "#63636333",
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
                        color: "white",
                        fontSize: 12,
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                    Buổi học(%)
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
                      backgroundColor: "#63636333",
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
                        color: "white",
                        fontSize: 12,
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                    Bài thi(%)
                    </Text>
                  </Box>
                </Box>
              </Box>
              {details &&
                details.map((data : any, index : number) => {
                  return (
                    <UserList
                      key={String(index)}
                      data={data}
                      index={index}
                    ></UserList>
                  );
                })}
            </Box>
          )}

          <Box height={20} />
        </ScrollView>
      </Box>
    </Box>
  );
};
export default ManageLessonScreen;
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 300,
    padding: 16,
    paddingTop: 100,
    backgroundColor: "#fff",
  },
  cell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
  },
});
