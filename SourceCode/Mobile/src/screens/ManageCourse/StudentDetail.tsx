import React, {useState} from "react";
import {ActivityIndicator, Dimensions, ScrollView,} from "react-native";
import {Box, Flex, Text} from "../../rebass";
import {Header, NotificationIcon} from "../../components/Header";
import {Icon} from "../../components/svg-icon";
import {useFocusEffect} from "@react-navigation/native";
import {Devider} from "../../components/Devider";
import {generateApiService} from "../../services/ApiService";
import {ExamsApi} from "../../services/api//Exams/ExamsApi";
import {ExamsList} from "./components/ExamsList";

const {width, height} = Dimensions.get("screen");
const StudentDetail = (props: any) => {
    const {id, courseId, data} = props.route.params;

    const [listExams, setListExams] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const onGetExams = async () => {
        setLoading(true);
        const dataExams = await generateApiService.get(
            ExamsApi.getAllExamStudentInCourse(courseId, id)
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
                    <NotificationIcon/>
                </Header>
                <Box height={1} bg="#636363" opacity={0.3} mt={2}/>
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
                                    style={{textTransform: "uppercase"}}
                                    color="#1C7988"
                                >
                                    {data.courseName}
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
                            mt={3}
                        >
                            <Text
                                fontWeight={500}
                                fontSize={20}
                                color="textColor"
                                padding={2}
                                style={{textTransform: "uppercase"}}
                            >
                                Học viên : {data.studentName}
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
                                <Icon name="NotificationCourse" size={20} color="#00A8B5"/>
                                <Text fontWeight={500} fontSize={16} color="#1C7988" ml={2}>
                                    Thông tin chung
                                </Text>
                            </Box>

                            <Box ml={2} padding={2}>
                                <Text fontSize={12} color="#636363">
                                    {"\u2B24"}
                                    {"       "}
                                    <Text color="#636363" ml={2}>Lớp: {data.courseName}</Text>
                                </Text>
                            </Box>
                            <Box ml={2} padding={2}>
                                <Text fontSize={12} color="#636363">
                                    {"\u2B24"}
                                    {"       "}
                                    <Text color="#636363">Tiến độ bài học: {data.percent}%</Text>
                                </Text>
                            </Box>
                            {/* <Box ml={2} padding={2}>
                <Text color="#636363" fontSize={12} color="#636363">
                  {"\u2B24"}
                  {"   "}
                  <Text color="#636363">
                    Tiến độ bài thi: {data.percentExams}%
                  </Text>
                </Text>
              </Box> */}
                        </Box>
                    </Box>
                    <Box style={{padding: 10}}>
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
                                    backgroundColor: '#00A8B5',
                                    borderTopLeftRadius: 8,
                                    borderTopRightRadius: 8
                                }}
                            >
                                <Box
                                    style={{
                                        width: "10%",
                                    }}
                                >
                                    <Box
                                        height={40}
                                        style={{alignItems: "center", justifyContent: "center"}}
                                    >
                                        <Text color={'white'}>STT</Text>
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
                                            backgroundColor: "#6363631A",
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
                                            TÊN BÀI THI
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
                                            backgroundColor: "#6363631A",
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
                                            NGÀY NỘP
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
                                            backgroundColor: "#6363631A",
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
                                            backgroundColor: "#6363631A",
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
                                    <ActivityIndicator size="large" color="#00A8B5"/>
                                </Box>
                            ) : listExams.length > 0 ? (
                                listExams.map((data: any, index: number) => {
                                    return (
                                        <ExamsList
                                            key={String(index)}
                                            data={data}
                                            index={index}
                                            idStudent={id}
                                        ></ExamsList>
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
                                            Chưa nộp bài nào
                                        </Text>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Box>
                    <Box height={20}/>
                </ScrollView>
            </Box>
        </Box>
    );
};
export default StudentDetail;
