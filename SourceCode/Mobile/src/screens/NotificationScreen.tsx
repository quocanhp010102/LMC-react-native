import React, {useEffect, useState} from "react";
import {ActivityIndicator, Dimensions, SafeAreaView, TouchableOpacity,} from "react-native";
import {FlatList} from "react-native-gesture-handler";
import {Devider} from "../components/Devider";
import {Box, Flex, Text} from "../rebass";
import {NotificationApi} from "../services/api/Notification/NotificationApi";
import {generateApiService} from "../services/ApiService";
import dayjs from "dayjs";
// import RealTime from "../containers/Real-time";
import {useAppDispatch} from "../hooks/ReduxHook";
import {FastImage} from "components-base";
import {decreaseNumberNotification,} from "../Redux/NoteRealTime";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const NotificationItem = React.memo(
    (props: {
        id: number;
        seen?: number;
        title: string;
        content: string;
        date?: string;
        image?: string | null;
        setIdNotification: any;
    }) => {
        const dispatch = useAppDispatch();

        var utc = require("dayjs/plugin/utc");
        dayjs.extend(utc);
        const [status, setStatus] = React.useState<boolean>(false);
        const updateNotification = async (id: number) => {
            props.setIdNotification(props.id);
            dispatch(decreaseNumberNotification(true));
            setStatus(!status);
            const data = {
                id: props.id,
                notificationContent: props.content,
                notificationStatus: "1",
                notificationTime: props.date,
                notificationTitle: props.title,
                receiverId: null,
            };
            const res = await generateApiService.put(
                NotificationApi.updateNBotification(id),
                {
                    data,
                }
            );
        };

        return (
            <TouchableOpacity
                onPress={() =>
                    props.seen == 0 ? updateNotification(props.id) : setStatus(!status)
                }
            >
                <Box flexDirection="row" alignItems="center" mt={16}>
                    {props.image && (
                        <FastImage
                            source={{uri: props.image}}
                            style={{width: 50, height: 50, borderRadius: 25}}
                            resizeMode="cover"
                        />

                    )}
                    <Box flexDirection="column" ml={2} flex={1}>
                        <Text color="lightText" fontSize={1} numberOfLines={3} mb={1}>
                            {props.title}
                        </Text>
                        <Flex
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Text color="seen" fontSize={1} opacity={0.6}>
                                {dayjs(props.date).format("HH:mm A - DD/MM/YYYY")}
                            </Text>
                            <Box width={10} mr={1}>
                                {props.seen == 0 && (
                                    <Box
                                        width={6}
                                        height={6}
                                        overflow="hidden"
                                        bg="#00A8B5"
                                        style={{borderRadius: 6}}
                                    />
                                )}
                            </Box>
                        </Flex>
                        {status && props.content && (
                            <Text fontSize={1}>{props.content}</Text>
                        )}
                    </Box>
                </Box>
            </TouchableOpacity>
        );
    }
);
export const NotificationScreen = React.memo(() => {
    const [newData, setNewData] = useState<any>([]);
    const [newDataRoot, setNewDataRoot] = useState<any[]>([]);
    const [allRead, setAllRead] = useState<boolean>(true);
    const [idNotification, setIdNotification] = useState<any>();
    const [page, setPage] = useState<number>(0);
    const [page2, setPage2] = useState<number>(0);
    const [loadingMore, setLoadingMore] = useState(false);
    const [totalPages, setTotalPages] = useState<number>();
    const [totalUnread, setTotalUnread] = useState<number>(0);

    const getData = async (page?: Number, size?: Number) => {
        const response = await generateApiService.get(
            NotificationApi.getAllNotificationsReceiver(page, size)
        );
        if (response) {
            const {totalPages, content, pageable, totalElements, size} = response;
            setNewData([...newData, ...content]);
            setNewDataRoot([...newDataRoot, ...content]);
            setTotalPages(totalPages);
            if (!allRead) {
                getUnRead([...newData, ...content]);
            }
        }
        setLoadingMore(false);
    };
    const getDataUnRead = async (page?: Number, size?: Number) => {
        const response = await generateApiService.get(
            NotificationApi.getNotificationUnRead(page2, size)
        );
        if (response) {
            const {totalPages, content, pageable, totalElements, size} = response;
            setNewData([...newData, ...content]);
            setNewDataRoot([...newDataRoot, ...content]);
            setTotalPages(totalPages);
        }
    };
    useEffect(() => {
        getData(page, 10);
    }, []);
    useEffect(() => {
        if (totalPages && page < totalPages) {
            setLoadingMore(true);
            getData(page, 10);
        }
    }, [page]);

    const loadMoreResults = async (info?: any) => {
        if (loadingMore) {
            return null;
        }
        if (totalPages) {
            if (page < totalPages) {
                setPage(page + 1);
            }
        }
    };
    useEffect(() => {
        let newNotifyPut: any = {};
        if (idNotification && newData.length >= 0) {
            const neweState = newData.map((item: any) => {
                if (item.id == idNotification) {
                    item = {
                        ...item,
                        ["notificationStatus"]: "1",
                    };
                    newNotifyPut = {...item};
                }
                return item;
            });
            const index = newDataRoot.findIndex((item: any, index: number) => {
                return item.id === idNotification;
            });

            setNewData(neweState);
            const newStateRoot = newDataRoot;
            newStateRoot[index] = newNotifyPut;
            setNewDataRoot(newStateRoot);
            setIdNotification(null);
        }
    }, [idNotification]);

    const getAllRead = () => {
        // setLoadingMore(true);
        setNewData(newDataRoot);
        setAllRead(true);
    };

    useEffect(() => {
        if (
            totalUnread !== 0 &&
            !allRead &&
            totalUnread > 10 &&
            newData.length < 10
        ) {
            loadMoreResults();
        }
    }, [totalUnread]);

    const getAllUnRead = async () => {
        setAllRead(false);
        getUnRead(newData);
        const response = await generateApiService.get(
            NotificationApi.getNumberNotifycation()
        );
        if (response) {
            setTotalUnread(response);
        }
    };

    const getUnRead = async (newDataValue: any[]) => {
        if (newDataValue.length > 0) {
            const newNotifyList = newDataValue.filter((notify: any) => {
                return notify.notificationStatus == 0;
            });
            setNewData(newNotifyList);
        }
    };
    const {top: statusBarHeight} = useSafeAreaInsets()
    return (
        <SafeAreaView>
            <Box height={1} bg="#636363" opacity={0.3} mt={2}/>
            <Box style={{paddingHorizontal: 12}}>
                <Flex mb={2}>
                    <Text
                        fontWeight="bold"
                        fontSize={20}
                        color="textColor"
                        lineHeight={30}
                        mt={24}
                    >
                        THÔNG BÁO
                    </Text>
                    <Flex flexDirection="row" justifyContent="flex-start" mt={3}>
                        <TouchableOpacity onPress={getAllRead}>
                            <Flex
                                flexDirection="row"
                                width={80}
                                height={40}
                                bg={allRead === true ? "buttonColor" : "#E1E1E1"}
                                borderRadius={6}
                                justifyContent="center"
                                alignItems="center"
                                mr={2}
                            >
                                <Flex>
                                    <Text
                                        color={allRead == true ? "#fff" : "#636363"}
                                        fontSize={14}
                                        fontWeight={"bold"}
                                    >
                                        Tất cả
                                    </Text>
                                </Flex>
                            </Flex>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={getAllUnRead}>
                            <Flex
                                flexDirection="row"
                                width={80}
                                height={40}
                                bg={!allRead === true ? "buttonColor" : "#E1E1E1"}
                                borderRadius={6}
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Flex>
                                    <Text
                                        color={!allRead == true ? "#fff" : "#636363"}
                                        fontSize={14}
                                        fontWeight={"bold"}
                                    >
                                        Chưa đọc
                                    </Text>
                                </Flex>
                            </Flex>
                        </TouchableOpacity>
                    </Flex>
                </Flex>
            </Box>
            <FlatList
                style={{
                    marginTop: 5,
                    backgroundColor: "#ffffff",
                    paddingHorizontal: 12,
                    height: Dimensions.get("window").height - statusBarHeight - 180,
                }}
                data={newData ?? []}
                initialNumToRender={10}
                onEndReachedThreshold={0}
                ListFooterComponent={
                    <>
                        {loadingMore ? (
                            <Box
                                flexDirection="row"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Text textAlign="center" color="lightText" py={4}>
                                    Đang tìm kiếm
                                </Text>
                                <ActivityIndicator size="small"/>
                            </Box>
                        ) : null}
                        <Box height={40}></Box>
                    </>
                }
                onEndReached={(info) => {
                    loadMoreResults(info);
                }}
                scrollEventThrottle={10}
                keyExtractor={(item, index) => String(item.id)}
                renderItem={({item}) => (
                    <Box key={item.id}>
                        {item && (
                            <NotificationItem
                                id={item.id}
                                seen={item.notificationStatus}
                                image="https://www.shareicon.net/data/512x512/2016/05/26/771188_man_512x512.png"
                                title={item.notificationTitle}
                                content={item.notificationContent}
                                date={item.notificationTime}
                                setIdNotification={setIdNotification}
                            />
                        )}
                    </Box>
                )}
            />
        </SafeAreaView>
    );
});
