import React, { useEffect, useState, useCallback } from "react";
import {
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Devider } from "../../components/Devider";
import { Header, NotificationIcon } from "../../components/Header";
import { Box, Flex, Text } from "../../rebass";
import { API } from "../../services";
import { generateApiService } from "../../services/ApiService";
import { useRoute, useFocusEffect } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");
const ONE_LOAD_SIZE = 10;
const HistoryActionScreen = () => {
  const [currentDateHisActList, setCurrentDateHisActList] = useState<any[]>([]);
  const [sizeCurrentDate, setSizeCurrentDate] = useState<number>(0);
  const [totalDateList, setTotalDateList] = useState<number>(0);
  const [currentMonthHisActList, setCurrentMonthHisActList] = useState<any[]>(
    []
  );
  const [sizeCurrentMonth, setSizeCurrentMonth] = useState<number>(0);
  const [totalMonthList, setTotalMonthList] = useState<number>(0);
  const [active, setActive] = useState<boolean>(true);


  const getDatasDateActivityHistory = async (page: number) => {
    generateApiService
      .get(
        `${API.PUBLIC}services/lmstrainingmanagementtest/api/activity-histories/getBycurrentDate?page=${page}&size=${ONE_LOAD_SIZE}`
      )
      .then((dat) => {
        setCurrentDateHisActList([...currentDateHisActList, ...dat.content]);
        setTotalDateList(dat.totalElements);
      })
      .catch((err) => console.log(err));
  };

  const getDatasMonthActivityHistory = async (page: number) => {
    generateApiService
      .get(
        `${API.PUBLIC}services/lmstrainingmanagementtest/api/activity-histories/getBycurrentMonth?page=${page}&size=${ONE_LOAD_SIZE}`
      )
      .then((dat) => {
        setCurrentMonthHisActList([...currentMonthHisActList, ...dat.content]);
        setTotalMonthList(dat.totalElements);
      })
      .catch((err) => console.log(err));
  };

  const loadMoreDate = () => {
    getDatasDateActivityHistory(sizeCurrentDate + 1);
    setSizeCurrentDate(sizeCurrentDate + 1);
  };

  const loadMoreMonth = () => {
    getDatasMonthActivityHistory(sizeCurrentMonth + 1);
    setSizeCurrentMonth(sizeCurrentMonth + 1);
  };
  useFocusEffect(
    React.useCallback(() => {
      getDatasDateActivityHistory(sizeCurrentDate);
      getDatasMonthActivityHistory(sizeCurrentMonth);
    }, [])
  );
  return (
    <Box bg="defaultBackground" position="relative">
      <Box height="100%">
        <Header logo search>
          <NotificationIcon />
        </Header>
        <Box height={1} bg="#636363" opacity={0.3} mt={2} />
        <Flex mx={2} mb={2}>
          <Devider />
          <Text
            fontWeight="bold"
            fontSize={20}
            color="textColor"
            style={{
              textTransform: "uppercase",
            }}
          >
            Danh sách lịch sử
          </Text>
        </Flex>
        <Flex flexDirection="row" justifyContent="flex-start" mx={2} mb={2}>
          <TouchableOpacity onPress={() => setActive(!active)}>
            <Flex
              flexDirection="row"
              width={80}
              height={40}
              bg={active === true ? "buttonColor" : "#E1E1E1"}
              borderRadius={6}
              justifyContent="center"
              alignItems="center"
              mr={2}
            >
              <Flex>
                <Text color={active == true ? "#fff" : "#636363"} fontSize={14}>
                  Hôm nay
                </Text>
              </Flex>
            </Flex>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActive(!active)}>
            <Flex
              flexDirection="row"
              width={80}
              height={40}
              bg={!active === true ? "buttonColor" : "#E1E1E1"}
              borderRadius={6}
              justifyContent="center"
              alignItems="center"
            >
              <Flex>
                <Text
                  color={!active == true ? "#fff" : "#636363"}
                  fontSize={14}
                >
                  Tháng này
                </Text>
              </Flex>
            </Flex>
          </TouchableOpacity>
        </Flex>
        <ScrollView>
          {(active
            ? currentDateHisActList ?? []
            : currentMonthHisActList ?? []
          ).map((node: any, index: number) => (
            <HistoryActionItem
              key={index}
              node={node}
              index={index}
              active={active}
            />
          ))}

          {active
            ? currentDateHisActList.length < totalDateList && (
                <TouchableOpacity onPress={() => loadMoreDate()}>
                  <Flex
                    alignItems="center"
                    justifyContent="center"
                    mt={2}
                    mb={3}
                  >
                    <Text fontSize={15} fontWeight="500">
                      Xem thêm
                    </Text>
                  </Flex>
                </TouchableOpacity>
              )
            : currentMonthHisActList.length < totalMonthList && (
                <TouchableOpacity onPress={() => loadMoreMonth()}>
                  <Flex
                    alignItems="center"
                    justifyContent="center"
                    mt={2}
                    mb={3}
                  >
                    <Text fontSize={15} fontWeight="500">
                      Xem thêm
                    </Text>
                  </Flex>
                </TouchableOpacity>
              )}
        </ScrollView>
      </Box>
    </Box>
  );
};

const HistoryActionItem = (props: {
  node: any;
  index: number;
  active: boolean;
}) => {
  return (
    <Flex
      alignItems="center"
      flexDirection="row"
      mx={2}
      bg={props.index % 2 == 0 ? "rgba(99, 99, 99, 0.05)" : ""}
    >
      <Flex
        // bg="#C4C4C4"
        overflow="hidden"
        position="relative"
        borderRadius={4}
        justifyContent="center"
        alignItems="center"
        width={width * 0.7}
        height={70}
      >
        <Text color="normalText" fontSize={2} numberOfLines={2} width="80%">
          {props.node.historyName?.replace('null', '')}
        </Text>
      </Flex>
      <Text>
        {props.active
          ? parseInt(props.node.historyTime.slice(0, 2)) > 0
            ? `${parseInt(props.node.historyTime.slice(0, 2))} giờ trước`
            : `${parseInt(props.node.historyTime.slice(3, 5))} phút trước`
          : props.node.historyTime == "0"
          ? "Hôm nay"
          : `${props.node.historyTime} ngày trước`}
      </Text>
    </Flex>
  );
};

export default HistoryActionScreen;
