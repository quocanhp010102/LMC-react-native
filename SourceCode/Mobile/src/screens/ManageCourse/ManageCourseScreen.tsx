import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  RefreshControl
} from "react-native";
import { Devider } from "../../components/Devider";
import { Header, NotificationIcon } from "../../components/Header";
import { InputWithIcon } from "../../components/InputWithIcon";
import { Box, Flex, Text } from "../../rebass";
import CardManageCourseDetail from "./components/CardManageCourseDetail";
import { useManageCourseScreen } from "./hooks/useManageCourseScreen";

const ManageCourseScreen = () => {
  const {
    keyExtractor,
    onEndReached,
    courses,
    onRefresh,
    queryInput,
    setQueryInput,
    checkVadidate,
  } = useManageCourseScreen();

  

  return (
    <Box bg="defaultBackground" position="relative" height="100%">
      <Box height="100%">
        <Header logo search>
          <NotificationIcon />
        </Header>
        <Box height={1} bg="#636363" opacity={0.3} mt={2} />
        <FlatList
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={onRefresh} />
          }
          data={courses.data}
          renderItem={(course: ListRenderItemInfo<any>) => {
            return (
              <CardManageCourseDetail
                index={course.index}
                course={course.item}
              ></CardManageCourseDetail>
            );
          }}
          keyExtractor={keyExtractor}
          onEndReached={onEndReached}
          ListHeaderComponent={
            <Box>
              <Flex px={2}>
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
                      mt={17}
                    >
                      QUẢN LÝ KHÓA HỌC
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
              <Flex
                mb={2}
                p={2}
                flexDirection="row"
                alignItems="center"
                borderBottomColor="tabBar"
              >
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
              </Flex>
              {!courses.isRefreshing && courses.isEmpty && (
                <Box
                  style={{ alignItems: "center", justifyContent: "center" }}
                  mt={3}
                >
                  <Text>Không có kết quả tương ứng</Text>
                </Box>
              )}
            </Box>
          }
          ListFooterComponent={
            <Box height={50}>
              {courses.isLoadMore && (
                <ActivityIndicator size={"small"}></ActivityIndicator>
              )}
            </Box>
          }
        />
      </Box>
    </Box>
  );
};
export default ManageCourseScreen;


