import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  ScrollView,
} from "react-native";
import { Header, NotificationIcon } from "../../components/Header";
import { Box, Flex, Text } from "../../rebass";
import { generateApiService } from "../../services/ApiService";
import { DepartmentApi } from "../../services/api/Departments/DepartmentApi";
import ICHexagon from "../../components/svg-icon/ICHexagon";
import { TouchableOpacity } from "react-native";
import { useAppSelector } from "../../hooks/ReduxHook";
import { useNavigation } from "@react-navigation/native";

export const HomeScreenBase = ({
  id_department,
  name,
}: {
  id_department: number;
  name: string;
}) => {
  const [displayNews, setDisplayNews] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation();
  const role = useAppSelector((state) => state.users.userList[0].role);

  const getDisplayNews = async () => {
    setLoading(true);
    try {
      const dataDisplayNews = await generateApiService.get(
        DepartmentApi.getDetailDepartment(id_department)
      );

      if (dataDisplayNews) {
        setDisplayNews(dataDisplayNews);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const goToCourse = (id: number) => {
    if (role == "0") {
      navigation.navigate("Khoá học của tôi", {
        screen: "/chi-tiet-khoa-hoc",
        params: {
          id_course: id,
          backToHome: true,
        },
      });
    }
    if (role == "1") {
      navigation.navigate("Trung tâm kiểm soát", {
        screen: "/chi-tiet-khoa-hoc-gv",
        params: {
            id_course: id,
            backToHome: true,
          },
      });
    }
  };

  useEffect(() => {
    getDisplayNews();
  }, []);

  const renderItem = (items: ListRenderItemInfo<any>) => {
    const { item, index } = items;
    return (
      <Box mb={21}>
        <TouchableOpacity
          onPress={() => {
            goToCourse(item.course_id);
          }}
        >
          <Box
            style={{
              flexDirection: "row",
              position: "absolute",
              top: 0,
              left: 60,
            }}
          >
            <Box
              style={{
                height: 58,
                width: "84%",
                backgroundColor: "#E5F3F8",
                justifyContent: "center",
              }}
            >
              <Text
                numberOfLines={2}
                ml={20}
                style={{ paddingVertical: 7 }}
                fontSize={18}
                fontWeight={500}
                color={"#1C7988"}
              >
                {item.course_name}
              </Text>
            </Box>
            <Box
              style={{
                width: 0,
                height: 0,
                backgroundColor: "transparent",
                marginLeft: -22,
                marginTop: 21,
                borderStyle: "solid",
                borderLeftWidth: 30,
                borderRightWidth: 30,
                borderBottomWidth: 16,
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                borderBottomColor: "#E5F3F8",
                transform: [{ rotate: "90deg" }],
              }}
            ></Box>
          </Box>
        </TouchableOpacity>

        <Box width={50}>
          <ICHexagon />
          <Box position={"absolute"} top={20}>
            <Text
              width={77}
              numberOfLines={1}
              color={"white"}
              fontSize={24}
              fontWeight={600}
              textAlign={"center"}
            >
              {index + 1 < 10 && "0"}
              {index + 1}
            </Text>
          </Box>
        </Box>
        <Box ml={80}>
          <Box flexDirection={"row"}>
            <Text fontSize={16} color={"#484848"}>
              Giảng viên
            </Text>
            <Text ml={26} fontSize={18} color="#00A8B5">
              {item.lecturer_fullname}
            </Text>
          </Box>
          <Box flexDirection={"row"} mt={20}>
            <Text fontSize={16} color={"#484848"}>
              Học kỳ
            </Text>
            <Text ml={55} fontSize={18} color="#00A8B5">
              {item.course_semester}
            </Text>
          </Box>
        </Box>
      </Box>
    );
  };
  return (
    <Box bg="defaultBackground" position="relative" px={2}>
      <Flex flex={1}>
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
              lineHeight={25}
              style={{
                textTransform: "uppercase",
              }}
              mt={17}
            >
              DANH SÁCH CÁC KHÓA HỌC CHUYÊN NGÀNH {name}
            </Text>
          </Flex>
        </Flex>
      </Flex>

      <Box height={16} />
      {loading ? <ActivityIndicator size="large" color="#00A8B5" /> : null}
      <FlatList data={displayNews} renderItem={renderItem} />

      <Box height={10} />
    </Box>
  );
};
const DepartmentDetail = (props: any) => {
  console.log("props", props.route.params);

  return (
    <Box bg="defaultBackground" position="relative" height="100%">
      <Box height="100%">
        <Header title="Chuyên ngành" search leftButton="back">
          <NotificationIcon />
        </Header>
        <Box height={1} bg="#636363" opacity={0.3} mt={2} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <HomeScreenBase
            id_department={props.route.params.id_department}
            name={props.route.params.name}
          />
        </ScrollView>
      </Box>
    </Box>
  );
};
export default DepartmentDetail;
