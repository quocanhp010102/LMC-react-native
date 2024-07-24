import React, {useEffect, useState} from "react";
import {ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, RefreshControl,} from "react-native";
import {CardCourse} from "../../components/CardCourse";
import {Devider} from "../../components/Devider";
import {Header, NotificationIcon} from "../../components/Header";
import {InputWithIcon} from "../../components/InputWithIcon";
import {useAppSelector} from "../../hooks/ReduxHook";
import {NavLink} from "../../platform/links";
import {Box, Flex, Text} from "../../rebass";
import {CourseApi} from "../../services/api/Course/CourseApi";
import {generateApiService} from "../../services/ApiService";
import ICDoubleRight from "../../components/svg-icon/ICDoubleRight";

const CourseScreen = (props: any) => {
    const [newData, setNewData] = useState<any>([]);
    const [historyCourse, setHistoryCourse] = useState<any>([]);
    const role = useAppSelector((state) => state.users.userList[0].role);
    const [queryInput, setQueryInput] = useState<string>("");
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
    const [dataSearch, setDataSearch] = useState<boolean>(false);
    const [allData, setAllData] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    let timeOut;
    const newCourse = props.route.params?.newCourse;

    const getHistory = async () => {
        setLoading(true);
        if (role == "0") {
            const history = await generateApiService.get(
                CourseApi.getHistoryStudent()
            );
            setHistoryCourse(history);
            setLoading(false);
        } else if (role == "1") {
            const history = await generateApiService.get(
                CourseApi.getHistoryLecturer()
            );
            setHistoryCourse(history);
            setLoading(false);
        }
    };
    const getData = async (page: number, size: number) => {
        setLoadingSearch(true);
        try {
            if (role == "0") {
                const dataCourse = await generateApiService.get(
                    CourseApi.getCourseStudent(page, size)
                );
                setTotalPages(dataCourse.totalPages);
                setNewData(dataCourse.content);
                setLoadingSearch(false);
            } else if (role == "1") {
                const dataCourse = await generateApiService.get(
                    CourseApi.getCourseLecturer(page, size)
                );
                setTotalPages(dataCourse.totalPages);
                setNewData(dataCourse.content);
                setLoadingSearch(false);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingSearch(false);
        }
    };
    const LoadMore = async (page: number, size: number) => {
        setLoadingSearch(true);
        if (role == "0") {
            const dataCourse = await generateApiService.get(
                CourseApi.getCourseStudent(page, size)
            );
            setNewData([...newData, ...dataCourse.content]);
            setLoadingSearch(false);
        } else if (role == "1") {
            const dataCourse = await generateApiService.get(
                CourseApi.getCourseLecturer(page, size)
            );
            setNewData([...newData, ...dataCourse.content]);
            setLoadingSearch(false);
        }
    };
    useEffect(() => {
        getData(0, 10);
        setPage(0);
        getHistory();
    }, []);
    const checkVadidate = (inputValue: any) => {
        if (inputValue.length <= 255) {
            setQueryInput(inputValue);
        } else {
            setQueryInput("");
        }
    };
    const isCloseToBottom = ({
                                 layoutMeasurement,
                                 contentOffset,
                                 contentSize,
                             }: any) => {
        const paddingToBottom = 20;
        return (
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom
        );
    };
    useEffect(() => {
        try {
            if (queryInput) {
                setLoadingSearch(true);
                setDataSearch(true);
                const timeout = setTimeout(async () => {
                    setQueryInput(queryInput);
                    if (role == "0") {
                        const dataCourse = await generateApiService.get(
                            CourseApi.studentSearch(queryInput)
                        );
                        setNewData(dataCourse.content);
                    } else {
                        const dataCourse = await generateApiService.get(
                            CourseApi.teacherSearch(queryInput)
                        );
                        setNewData(dataCourse.content);
                    }
                    setLoadingSearch(false);
                }, 800);
                return () => {
                    clearTimeout(timeout);
                };
            } else {
                setLoadingSearch(false);
                setDataSearch(false);
                getData(0, 10);
                setPage(0);
            }
        } catch (error) {
            setLoadingSearch(false);
        }
    }, [queryInput]);
    useEffect(() => {
        if (newCourse) {
            getHistory();
        }
    }, [newCourse]);

    return (
        <KeyboardAvoidingView
            behavior={"padding"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            enabled={Platform.OS === "ios"}
        >
            <Box bg="defaultBackground" position="relative" height="100%">
                <Box height="100%">
                    <Header logo search>
                        <NotificationIcon/>
                    </Header>
                    <Box height={1} bg="#636363" opacity={0.3} mt={2}/>

                    <FlatList
                        data={newData}
                        numColumns={2}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={() => {
                                    getData(0, 10), setPage(0), getHistory(), setQueryInput("");
                                }}
                            />
                        }
                        ListHeaderComponent={
                            <HeaderCourseComponent
                                loading={loading}
                                setQueryInput={setQueryInput}
                                historyCourse={historyCourse}
                                role={role}
                                queryInput={queryInput}
                                checkVadidate={checkVadidate}
                            ></HeaderCourseComponent>
                        }
                        onScroll={({nativeEvent}) => {
                            if (isCloseToBottom(nativeEvent)) {
                                if (page < totalPages && !loadingSearch && !dataSearch) {
                                    LoadMore(page + 1, size);
                                    setPage(page + 1);
                                }
                            }
                        }}
                        scrollEventThrottle={400}
                        renderItem={(items: any) => {
                            return role == "0" ? (
                                <NavLink
                                    key={items.item.courseId}
                                    {...{
                                        route: "/chi-tiet-khoa-hoc",
                                        params: {
                                            id_course: items.item.courseId,
                                        },
                                    }}
                                >
                                    <CardCourse
                                        percent={items.item.percent}
                                        title={items.item.courseName}
                                        image={items.item.courseImage}
                                    />
                                </NavLink>
                            ) : (
                                <NavLink
                                    key={items.item.id}
                                    {...{
                                        route: "/chi-tiet-khoa-hoc-gv",
                                        params: {
                                            id_course: items.item.id,
                                        },
                                    }}
                                >
                                    <CardCourse
                                        class={items.item.courseCode}
                                        title={items.item.courseName}
                                        image={items.item.courseImage}
                                    />
                                </NavLink>
                            );
                        }}
                        ListFooterComponent={
                            <>
                                {loadingSearch ? (
                                    <Box
                                        style={{
                                            flex: 1,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginTop: 22,
                                        }}
                                    >
                                        <ActivityIndicator size="large" color="#00A8B5"/>
                                    </Box>
                                ) : null}
                                <Box height={30}></Box>
                            </>
                        }
                    />
                </Box>
            </Box>
        </KeyboardAvoidingView>
    );
};

interface HeaderCourseComponentProps {
    loading: boolean;
    role: string | number | undefined;
    historyCourse: any[];
    queryInput: string;
    checkVadidate: (value: string) => void;
    setQueryInput: (value: string) => void;
}

const HeaderCourseComponent = React.memo(
    (props: HeaderCourseComponentProps) => {


        const {
            loading,
            role,
            historyCourse,
            queryInput,
            checkVadidate,
            setQueryInput,
        } = props;


        return (
            <>
                <Flex flex={1} px={2}>
                    <Flex
                        flexDirection="row"
                        alignItems="flex-start"
                        justifyContent="center"
                    >
                        <Flex flex={1} flexDirection={'row'} alignItems={'center'} mt={17}>
                            <ICDoubleRight></ICDoubleRight>
                            <Text
                                fontWeight="bold"
                                fontSize={20}
                                color="textColor"
                                lineHeight={30}
                                ml={1}
                            >
                                TRUY CẬP GẦN ĐÂY
                            </Text>
                        </Flex>
                    </Flex>
                </Flex>
                {loading ? (
                    <Box
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 22,
                        }}
                    >
                        <ActivityIndicator size="large" color="#00A8B5"/>
                    </Box>
                ) : null}
                <Flex
                    flex={1}
                    flexDirection="row"
                    flexWrap="wrap"
                    alignItems="flex-start"
                >
                    {role == 0
                        ? (historyCourse ?? []).map((node, index) => (
                            <NavLink
                                key={node.courseId}
                                {...{
                                    route: "/chi-tiet-khoa-hoc",
                                    params: {
                                        id_course: node.courseId,
                                        percent: node.percent,
                                    },
                                }}
                            >
                                <CardCourse
                                    percent={node.percent}
                                    title={node.courseName}
                                    image={node.courseImage}
                                />
                            </NavLink>
                        ))
                        : (historyCourse ?? []).map((node) => (
                            <NavLink
                                key={node.courseId}
                                {...{
                                    route: "/chi-tiet-khoa-hoc-gv",
                                    params: {
                                        id_course: node.courseId,
                                    },
                                }}
                            >
                                <CardCourse
                                    class={node.courseCode}
                                    title={node.courseName}
                                    image={node.courseImage}
                                />
                            </NavLink>
                        ))}
                </Flex>
                <Flex flex={1} px={2} mt={3}>
                    <Flex
                        flexDirection="row"
                        alignItems="flex-start"
                        justifyContent="center"
                    >
                        <Flex flex={1} flexDirection={'row'} alignItems={'center'} mt={17}>
                            <ICDoubleRight></ICDoubleRight>
                            <Text
                                fontWeight="bold"
                                fontSize={20}
                                color="textColor"
                                lineHeight={30}
                                ml={1}
                            >
                                {role == 0 ? "KHÓA HỌC CỦA TÔI" : "DANH SÁCH KHÓA HỌC"}
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
                    <InputWithIcon
                        icon="search"
                        flex={1}
                        value={queryInput}
                        onChangeText={(e) => checkVadidate(e)}
                        iconColor="#56C8C8"
                        placeholderTextColor="black"
                        iconSize={16}
                        onPress={() => setQueryInput("")}
                        border
                        borderColor={'#56C8C8'}
                    />
                </Flex>
            </>
        );
    }
);
export default CourseScreen;
