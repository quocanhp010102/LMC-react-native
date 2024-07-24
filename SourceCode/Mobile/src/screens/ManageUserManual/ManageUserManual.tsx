import React, {useState} from "react";
import {Modal, NativeScrollEvent, Platform, RefreshControl, ScrollView, TouchableOpacity,} from "react-native";
import {CardVideo} from "../../components/CardVideo";
import {Devider} from "../../components/Devider";
import {Header, NotificationIcon} from "../../components/Header";
import {InputWithIcon} from "../../components/InputWithIcon";
import {Icon} from "../../components/svg-icon";
import {Box, Flex, Text} from "../../rebass";
import {API} from "../../services";
import {generateApiService} from "../../services/ApiService";
import {ActivityHistoriesApi} from "../../services/api/ActivityHistories/ActivityHistoriesApi";
import {TutourialsApi} from "../../services/api/Tutuorials/TutourialsApi";
import {ModalAdd} from "./components/ModalAdd";
import {ModalDelete} from "./components/ModalDelete";
import {ModalView} from "./components/ModalView";
import PopupCloseAutomatically from "../../components/PopupCloseAutomatically";

const ManageUserManual = ({navigation}: any) => {
    const [modalVisibleNoti, setModalVisibleNoti] = useState(false);
    const [type, setType] = useState<string>("");
    const [titleNoti, setTitleNoti] = useState<string>("");
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [queryInput, setQueryInput] = React.useState<string>("");
    const [typeModal, setTypeModal] = useState<string>();
    const [tutourials, setTutourials] = React.useState<any>([]);
    const [courseSelected, setCourseSelected] = useState<boolean>(false);
    const [selected, setSelected] = useState<any>([]);
    const [linkVideo, setLinkVideo] = useState<string>("");
    const [size, setSize] = useState<number>(5);
    const [tutorialSelected, setTutorialSelected] = useState<boolean>(false);
    const [editSelected, setEditSelected] = useState();
    const [chooseVideo, setChooseVideo] = useState(null);

    const checkVadidate = async (inputValue: any) => {
        if (inputValue.length <= 255) {
            setQueryInput(inputValue);
            if (inputValue.length !== 0) {
                const response = await generateApiService.get(
                    TutourialsApi.searchTutourials(inputValue)
                );
                if (response) {
                    setTutourials(response.content);
                }
            } else {
                onGetTutorials();
            }
        } else {
            setQueryInput("");
        }
    };
    const onGetTutorials = async () => {
        const response = await generateApiService.get(
            TutourialsApi.getTutourials()
        );

        if (response) {
            setTutourials(response.content);
        }
    };
    React.useEffect(() => {
        onGetTutorials();
    }, []);
    const choose = React.useCallback(
        (id: any) => {
            let newData = [...selected];
            if (selected.includes(id)) {
                newData = newData.filter((x) => x !== id);
            } else {
                newData.push(id);
            }
            setSelected(newData);
        },
        [selected]
    );
    const uploadFile = async (nameFile: any) => {
        const data = new FormData();
        data.append("file", {
            ...nameFile,
            uri:
                Platform.OS === "android"
                    ? nameFile.uri
                    : nameFile.uri.replace("file://", ""),
            name: nameFile.name,
            type: nameFile.type, // it may be necessary in Android.
        });
        let res = await generateApiService.postImage(
            `${API.PUBLIC}services/lmsbackendtest/api/uploadImage`,
            data
        );
        if (res) {
            await setLinkVideo(res);
        }
    };
    const uploadVideo = async (
        title: any,
        arrRole: any,
        fileVideo: any,
        fileImage: any
    ) => {
        try {
            if (title === "") {
                setType("warning");
                setTitleNoti("Chưa nhập thông tin!");
                setModalVisibleNoti(true);
            }
            let linkVideoUpload;
            let linkImageUpload;
            if (fileVideo) {
                if (fileVideo.type) {
                    const data = new FormData();
                    data.append("file", {
                        ...fileVideo,
                        uri:
                            Platform.OS === "android"
                                ? fileVideo.uri
                                : fileVideo.uri.replace("file://", ""),
                        name: fileVideo.name,
                        type: fileVideo.type, // it may be necessary in Android.
                    });
                    linkVideoUpload = await generateApiService.postImage(
                        `${API.PUBLIC}services/lmsbackendtest/api/uploadImage`,
                        data
                    );
                }
            }
            if (fileImage) {
                if (fileImage.type) {
                    const data = new FormData();
                    data.append("file", {
                        ...fileImage,
                        uri:
                            Platform.OS === "android"
                                ? fileImage.uri
                                : fileImage.uri.replace("file://", ""),
                        name: fileImage.name,
                        type: fileImage.type, // it may be necessary in Android.
                    });
                    linkImageUpload = await generateApiService.postImage(
                        `${API.PUBLIC}services/lmsbackendtest/api/uploadImage`,
                        data
                    );
                }
            }
            const dataUpload = {
                tutorial_title: title,
                tutorial_image: linkImageUpload,
                tutorial_video: linkVideoUpload,
                tutorial_createdDate: new Date(),
                tutorial_isDisplay: "1",
                authorities: arrRole,
            };
            const response = await generateApiService.post(
                TutourialsApi.getTutourials(),
                dataUpload
            );
            setModalVisible(false);
            setType("success");
            setTitleNoti("Tạo hướng dẫn sử dụng thành công !");
            setModalVisibleNoti(true);
            let newDataTutourials = [response, ...tutourials];
            setTutourials(newDataTutourials);
            const bodyHistory = {
                name: " HDSD " + title,
                method: "POST",
            };
            const history = await generateApiService.post(
                ActivityHistoriesApi.postHistories(),
                bodyHistory
            );
        } catch (error) {
        }
    };
    const handleDelete = async () => {
        try {
            const data = {
                ids: selected,
            };
            const response = await generateApiService.delete(
                TutourialsApi.deleteTutourials(data.ids.toString())
            );
            let titleDelete = "";
            for (let i = 0; i < selected.length; i++) {
                var listDelete = tutourials;
                var index = tutourials
                    .map((x : any) => {
                        return x.id;
                    })
                    .indexOf(selected[i]);
                titleDelete = titleDelete + listDelete[index].tutorial_title + " , ";
                listDelete.splice(index, 1);
            }
            const bodyHistory = {
                name: " HDSD " + titleDelete,
                method: "DELETE",
            };
            const history = await generateApiService.post(
                ActivityHistoriesApi.postHistories(),
                bodyHistory
            );
            setModalVisible(false);
            setCourseSelected(false);
            setType("success");
            setTitleNoti("Xóa hướng dẫn sử dụng thành công !");
            setModalVisibleNoti(true);
            setSelected([]);
        } catch (error) {
            setType("error");
            setTitleNoti("Xóa hướng dẫn sử dụng thất bại!");
            setModalVisibleNoti(true);
        }
    };
    const isCloseToBottom = ({
                                 layoutMeasurement,
                                 contentOffset,
                                 contentSize,
                             }: NativeScrollEvent) => {
        const paddingToBottom = 20;
        return (
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom
        );
    };
    const loadMore = async () => {
        let newSize = size + 5;
        const dataDepartments = await generateApiService.get(
            TutourialsApi.getTutourials()
        );
        if (dataDepartments) {
            setTutourials(dataDepartments.content);
            setSize(newSize);
        }
    };
    return (
        <Box bg="defaultBackground" position="relative" height="100%">
            <Box height="100%">
                <Header logo search profile>
                    <NotificationIcon/>
                </Header>
                <Box height={1} bg="#636363" opacity={0.3} mt={2}/>
                <Flex px={1}>

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
                                HƯỚNG DẪN SỬ DỤNG HCMUSSH - LMS
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
                        icon="search"
                        flex={1}
                        value={queryInput}
                        onChangeText={(e) => checkVadidate(e)}
                        iconColor="inputClose"
                        placeholderTextColor="black"
                        // placeholder="Nhập tìm kiếm"
                        iconSize={16}
                        onPress={() => setQueryInput("")}
                        border
                    />
                </Flex>
                <Box
                    flexDirection="row"
                    ml="2.5%"
                    mr="2.5%"
                    gap={10}
                >
                    <TouchableOpacity
                        onPress={() => {
                            setTypeModal("add"),
                                setModalVisible(true),
                                setTutorialSelected(false);
                            setCourseSelected(false);
                        }}
                        style={{
                            borderRadius: 8,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#00A8B5",
                            height: 40,
                            paddingHorizontal: 10
                        }}
                    >
                        <Icon name="addIcon"></Icon>
                        <Text ml={1} color="white">
                            Thêm
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setTutorialSelected(!tutorialSelected);
                            setTypeModal("edit");
                        }}
                        style={{
                            borderRadius: 8,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",

                            height: 40,

                        }}
                    >
                        <Icon name="editIcon"></Icon>
                        <Text ml={1} color="#00A8B5">
                            {!tutorialSelected ? "Sửa" : " Hủy"}
                        </Text>
                    </TouchableOpacity>
                    {!courseSelected ? (
                        <TouchableOpacity
                            style={{
                                borderRadius: 8,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",

                                height: 40,

                            }}
                            onPress={() => {
                                {
                                    setCourseSelected(true), setTutorialSelected(false);
                                }
                            }}
                        >
                            <Icon name="deleteIcon"></Icon>
                            <Text ml={1} color="deleteColor">
                                Xóa
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={{
                                borderRadius: 8,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "rgba(100, 116, 139, 0.1)",
                                height: 40,
                                width: "30%",
                            }}
                            onPress={() => {
                                setTypeModal("delete");
                                setModalVisible(true);
                            }}
                        >
                            <Icon name="deleteIcon"></Icon>
                            <Text ml={1} color="deleteColor">
                                Xác nhận
                            </Text>
                        </TouchableOpacity>
                    )}
                </Box>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onGetTutorials}
                        />
                    }
                    // onScroll={({ nativeEvent }) => {
                    //   if (isCloseToBottom(nativeEvent)) {
                    //     if (page < totalPages) {
                    //       LoadMore(page + 1, size);
                    //       setPage(page + 1);
                    //     }
                    //   }
                    // }}
                    scrollEventThrottle={400}
                >
                    {tutourials.map((item: any, index: string | undefined) => {
                        const isSelected = selected.includes(item.id);
                        var aDay = new Date(item.tutorial_createdDate);

                        function timeSince(date: any) {
                            //@ts-ignore
                            var seconds = Math.floor((new Date() - date) / 1000);
                            var interval = seconds / 31536000;
                            if (seconds < 0) {
                                return (
                                    date.getDate() +
                                    "/" +
                                    date.getMonth() +
                                    "/" +
                                    date.getFullYear()
                                );
                            }
                            if (interval > 1) {
                                return Math.floor(interval) + " năm trước";
                            }
                            interval = seconds / 2592000;
                            if (interval > 1) {
                                return Math.floor(interval) + " tháng trước";
                            }
                            interval = seconds / 86400;
                            if (interval > 1) {
                                return Math.floor(interval) + " ngày trước";
                            }
                            interval = seconds / 3600;
                            if (interval > 1) {
                                return Math.floor(interval) + " giờ trước";
                            }
                            interval = seconds / 60;
                            if (interval > 1) {
                                return Math.floor(interval) + " phút trước";
                            }
                            return Math.floor(seconds) + " giây trước";
                        }

                        return (
                            <Box flexDirection="row" alignItems="center">
                                {courseSelected ? (
                                    <TouchableOpacity
                                        onPress={() => {
                                            choose(item.id);
                                        }}
                                        style={{marginLeft: 10}}
                                    >
                                        {isSelected ? (
                                            <Icon name="chooseBox"></Icon>
                                        ) : (
                                            <Icon name="CheckBox"></Icon>
                                        )}
                                    </TouchableOpacity>
                                ) : null}
                                <Box
                                    borderRadius={10}
                                    borderWidth={1}
                                    borderColor="rgba(125, 125, 125, 0.3)"
                                    style={{
                                        marginTop: 17,
                                    }}
                                    width={courseSelected ? "87%" : "95%"}
                                    ml={"2.5%"}
                                    key={String(index)}
                                >
                                    <Box flex={1}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (tutorialSelected) {
                                                    setEditSelected(item), setModalVisible(true);
                                                } else {
                                                    setChooseVideo(item.id);
                                                }
                                            }}
                                            delayPressIn={tutorialSelected ? 0 : 150}
                                        >
                                            <CardVideo
                                                key={String(index)}
                                                image={item.tutorial_image}
                                                title={item.tutorial_title}
                                                link={item.tutorial_video}
                                                createdDate={item.tutorial_createdDate}
                                                id={item.id}
                                                choose={chooseVideo}
                                                navigation={navigation}
                                             ></CardVideo>
                                        </TouchableOpacity>
                                        <Box ml={2}>
                                            <Box>
                                                <Text
                                                    fontSize={14}
                                                    fontWeight="500"
                                                    color="#636363"
                                                    lineHeight={19}
                                                    numberOfLines={2}
                                                    mt={15}
                                                >
                                                    {item.tutorial_title}
                                                </Text>
                                                <Text fontSize={11} color="#636363" mt={2}>
                                                    Admin HCMUSSH - LMS
                                                </Text>
                                                <Box>
                                                    <Text fontSize={10} color="#636363" mt={1} mb={1}>
                                                        <Text fontSize={10} color="#636363">
                                                            {timeSince(aDay)}
                                                        </Text>
                                                    </Text>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        );
                    })}
                    <Box height={30}></Box>
                </ScrollView>

                <Modal animationType="slide" transparent={true} visible={modalVisible}>
                    {typeModal === "add" ? (
                        <ModalAdd
                            setModalVisible={setModalVisible}
                            uploadFile={uploadFile}
                            uploadVideo={uploadVideo}
                            // setModalVisibleNoti={setModalVisibleNoti}
                            // setType={setType}
                            // setTitleNoti={setTitleNoti}
                        ></ModalAdd>
                    ) : typeModal === "delete" ? (
                        <ModalDelete
                            handleDeleteTutorials={handleDelete}
                            setModalVisible={() => {
                                setModalVisible(false);
                                setCourseSelected(false);
                                setSelected([]);
                            }}
                            data={selected}
                            setModalVisibleNoti={setModalVisibleNoti}
                            setType={setType}
                            setTitleNoti={setTitleNoti}
                        ></ModalDelete>
                    ) : (
                        <ModalView
                            setModalVisible={setModalVisible}
                            uploadFile={uploadFile}
                            uploadVideo={uploadVideo}
                            data={editSelected}
                            tutourials={tutourials}
                            setTutourials={setTutourials}
                            onGetTutorials={onGetTutorials}
                            setModalVisibleNoti={setModalVisibleNoti}
                            setType={setType}
                            setTitleNoti={setTitleNoti}
                            setTutorialSelected={setTutorialSelected}
                        ></ModalView>
                    )}
                </Modal>
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={modalVisibleNoti}
                    onRequestClose={() => {
                        setModalVisibleNoti(!modalVisibleNoti);
                    }}
                >
                    <PopupCloseAutomatically
                        titleEdit={titleNoti}
                        title="Tạo hướng dẫn sử dụng"
                        type={type}
                        isOpen={modalVisibleNoti}
                        setIsOpen={setModalVisibleNoti}
                    />
                    {/* <PopupNotification
            titleEdit={titleNoti}
            title="Tạo hướng dẫn sử dụng"
            type={type}
            setModalVisible={setModalVisibleNoti}
          ></PopupNotification> */}
                </Modal>
            </Box>
        </Box>
    );
};
export default ManageUserManual;
