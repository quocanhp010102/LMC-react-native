import React, {useCallback, useEffect, useState} from "react";
import {Dimensions, RefreshControl, ScrollView, StyleSheet,} from "react-native";
import {CardSpecialized} from "../../components/CardSpecialized";
import {Header, Logo, NotificationIcon} from "../../components/Header";
import {Icon} from "../../components/svg-icon";
import {PageNewPaper} from "../../containers/page-newpaper";
import {NavLink} from "../../platform/links";
import {Box, Flex, Text} from "../../rebass";
import {DepartmentApi} from "../../services/api/Departments/DepartmentApi";
import {NewsApi} from "../../services/api/News/NewsApi";
import {generateApiService} from "../../services/ApiService";
import {HexagonImageNew} from "../../components/image/HexagonImageNew";
import {calculateTime} from "../../helpers/utils";
import ICHomeNew1 from "../../components/svg-icon/ICHomeNew1";
import ICHomeNew2 from "../../components/svg-icon/ICHomeNew2";
import {FastImage} from "components-base";
import ICArrowRight from "../../components/svg-icon/ICArrowRight";
import {HomeUserManualList} from "./HomeUserManualList";

const ImageBannerLogin = require("../../../assets/BackImageNew.png");
const ImageHD = require("../../../assets/ThumbHDHome.png");
const HomeScreen = React.memo(() => {
    const [highlightDepartments, setHighlightDepartments] = useState<any>([]);
    const [displayNews, setDisplayNews] = useState<any>([1, 2, 3, 4, 5]);
    const getHighlightDepartment = useCallback(async () => {
        const dataHighlightDepartment = await generateApiService.get(
            DepartmentApi.getHighlightDepartments()
        );
        if (dataHighlightDepartment) {
            setHighlightDepartments(dataHighlightDepartment.content);
        }
    }, []);
    const getDisplayNews = useCallback(async () => {
        const dataDisplayNews = await generateApiService.get(
            NewsApi.getNewsDisplay()
        );
        setDisplayNews(dataDisplayNews);
    }, []);
    useEffect(() => {
        getHighlightDepartment();
        getDisplayNews();
    }, []);
    return (
        <Box bg="defaultBackground" position="relative" height="100%">
            <Box height="100%">
                <Header logo search menu>
                    <NotificationIcon/>
                </Header>
                <Box height={1} bg="#636363" opacity={0.3} mt={2}/>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={() => {
                                getHighlightDepartment(), getDisplayNews();
                            }}
                        />
                    }
                >
                    <Box bg="defaultBackground">
                        <Box px={2}>
                            <Box mt={13}>
                                <Box
                                    flexDirection="row"
                                    justifyContent="space-between"
                                >
                                    <Flex
                                        flexDirection={"row"}
                                        alignItems={"center"}
                                        borderRadius={20}
                                        borderWidth={1}
                                        paddingX={1}
                                        borderColor={"#56C8C8"}
                                        flex={1}
                                        overflow={'hidden'}
                                    >
                                        <Box
                                            height={20}
                                            width={20}
                                            borderRadius={10}
                                            backgroundColor={"#56C8C8"}
                                        ></Box>

                                        <Text
                                            fontWeight="bold"
                                            fontSize={20}
                                            color="textColor"
                                            lineHeight={30}
                                            numberOfLines={1}
                                        >
                                            TIN TỨC MỚI VỀ HCMUSSH
                                        </Text>

                                    </Flex>
                                    <NavLink
                                        {...{
                                            route: "/danh-sach-tin-tuc",
                                        }}
                                    >
                                        <Box p={1} mr={1} flexDirection="row" alignItems="center">
                                            <Text
                                                color="#484848"
                                                marginRight={1}
                                                fontSize={14}
                                                fontWeight={"300"}
                                            >
                                                Xem thêm
                                            </Text>
                                            <Icon name="arrowRight" size={7}/>
                                        </Box>
                                    </NavLink>
                                </Box>
                            </Box>
                            <Box height={19}/>
                            <Box>
                                <Box>
                                    <ICHomeNew1></ICHomeNew1>
                                </Box>
                                <Box position={"absolute"} top={60} right={27}>
                                    <ICHomeNew2></ICHomeNew2>
                                </Box>
                                <Box position={"absolute"} bottom={0} left={1}>
                                    <FastImage
                                        source={ImageBannerLogin}
                                        style={{
                                            height: 49,
                                            width: 56,
                                            resizeMode: "stretch",
                                        }}
                                    />
                                </Box>
                                <HexagonImageNew
                                    height={Dimensions.get('screen').width * 0.9}
                                    width={Dimensions.get('screen').width * 0.9}
                                    uri={displayNews?.[1]?.news_image || ""}
                                />

                                <Box position={"absolute"} top={"55%"} left={50}>
                                    <Flex flexDirection="row" style={{paddingBottom: 9}}>
                                        <Box backgroundColor={"#ffffff"} borderRadius={4}>
                                            <Box px={1}>
                                                <Logo></Logo>
                                            </Box>
                                        </Box>
                                        <Flex
                                            flexDirection="row"
                                            justifyContent="center"
                                            alignItems="center"
                                            ml={1}
                                        >
                                            <Box
                                                height={5}
                                                width={5}
                                                bg="#FFFFFF"
                                                borderRadius={2.5}
                                            />
                                            <Text fontSize={2} color="white" ml={1}>
                                                {displayNews[1].news_created_date
                                                    ? calculateTime(displayNews[0].news_created_date)
                                                    : null}
                                            </Text>
                                        </Flex>
                                    </Flex>
                                    <NavLink
                                        {...{
                                            route: "/chi-tiet-tin",
                                            params: {
                                                id: displayNews?.[0].id,
                                            },
                                        }}
                                    >
                                        <Text
                                            fontSize={3}
                                            color="white"
                                            mb={2}
                                            width={Dimensions.get("screen").width * 0.6}
                                            numberOfLines={3}
                                        >
                                            {displayNews?.[0].news_title}
                                        </Text>
                                    </NavLink>
                                </Box>
                            </Box>
                            <Box height={16}/>
                            {displayNews.slice(1, 3).map((newItem: any) => {
                                return (
                                    <PageNewPaper node={newItem} key={newItem.id} hexagonal/>
                                );
                            })}
                        </Box>
                        <Box backgroundColor={"#56C8C8"} px={2} mt={15}>
                            <Flex flex={1}>
                                <Flex flexDirection="row" alignItems="flex-start" mt={25}>
                                    <Flex flex={1}>
                                        <Text
                                            fontWeight="bold"
                                            fontSize={20}
                                            color="white"
                                            lineHeight={30}
                                        >
                                            KHOA ĐÀO TẠO NỔI BẬT
                                        </Text>
                                    </Flex>
                                    <NavLink
                                        {...{
                                            route: "/tat-ca-khoa",
                                        }}
                                    >
                                        <Box p={1} mr={1} flexDirection="row" alignItems="center">
                                            <Text
                                                color="white"
                                                marginRight={1}
                                                fontWeight={"300"}
                                                fontSize={14}
                                            >
                                                Xem thêm
                                            </Text>
                                            <ICArrowRight color={"white"}/>
                                        </Box>
                                    </NavLink>
                                </Flex>
                            </Flex>
                            <Flex
                                flex={1}
                                flexDirection="row"
                                flexWrap="wrap"
                                alignItems="flex-start"
                                justifyContent="space-between"
                            >
                                {(highlightDepartments ?? []).map((node: any) => {
                                    return (
                                        <NavLink
                                            key={node.id}
                                            {...{
                                                route: "/chi-tiet-khoa",
                                                params: {
                                                    id_department: node.id,
                                                    name: node.department_name,
                                                },
                                            }}
                                        >
                                            <CardSpecialized
                                                title={node.department_name}
                                                image={node.department_image}
                                                course={node?.countCourse}
                                            ></CardSpecialized>
                                        </NavLink>
                                    );
                                })}
                            </Flex>
                            <Box height={36}></Box>
                        </Box>
                        <Box px={2}>
                            <FastImage
                                source={ImageHD}
                                style={{
                                    height: 256,
                                    width: 401,
                                    resizeMode: "stretch",
                                    marginTop: 15,
                                }}
                            />
                            <Text
                                fontWeight="bold"
                                fontSize={20}
                                color="textColor"
                                lineHeight={30}
                                mt={25}
                            >
                                HƯỚNG DẪN SỬ DỤNG HỆ THỐNG LMS - TUU
                            </Text>
                            <HomeUserManualList/>
                        </Box>

                        <Box height={30}/>
                    </Box>
                </ScrollView>
            </Box>
        </Box>
    );
});


export default HomeScreen;
