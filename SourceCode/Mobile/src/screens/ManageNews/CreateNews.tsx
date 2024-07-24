import React, {useEffect, useState} from "react";
import {Dimensions, Modal, Platform, ScrollView, TextInput, TouchableOpacity,} from "react-native";
import RenderHtml from "react-native-render-html";
import {Box, Flex, Text} from "../../rebass";
import {Header, NotificationIcon} from "../../components/Header";
import {Devider} from "../../components/Devider";
import {CardAttachmentsUpload} from "../../components/CardAttachmentsUpload";
import {useNavigation} from "@react-navigation/native";
import {NavLink} from "../../platform/links";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {useAppDispatch, useAppSelector} from "../../hooks/ReduxHook";
import {addNewsContent} from "../../Redux/NewsContent";
import {generateApiService} from "../../services/ApiService";
import {useGoBack} from "../../platform/go-back";
import {NewsApi} from "../../services/api/News/NewsApi";
import {UploadFileApi} from "../../services/api/UploadFile/UploadFileApi";
import {ActivityHistoriesApi} from "../../services/api/ActivityHistories/ActivityHistoriesApi";
import {FastImage} from "components-base";
import {PAGE_SIZE} from "../../constants";
import PopupCloseAutomatically from "../../components/PopupCloseAutomatically";

const {width, height} = Dimensions.get("screen");

const CreateNews = (props: {
    id?: string
}) => {
    const richText = React.useRef();
    const [attachments, setAttachments] = useState<any>([
        {
            file: {
                uri: "https://www.madeireiraestrela.com.br/images/joomlart/demo/default.jpg",
            },
        },
    ]);
    const [timeChoose, setTimeChoose] = useState<any>("");
    const dispatch = useAppDispatch();
    const [startDate, setStartDate] = useState<any>("");
    const [endDate, setEndDate] = useState<any>("");
    const [dateType, setDateType] = useState("");
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const [subgroup, setSubgroup] = useState(false);
    const [modalVisibleNoti, setModalVisibleNoti] = useState(false);
    const [type, setType] = useState<string>("");
    const [titleNoti, setTitleNoti] = useState("");
    const [errorTitle, setErrorTitle] = useState("");
    const [errorContent, setErrorContent] = useState("");
    const [errorDescriptionText, setErrorDescriptionText] = useState("");
    const [errorChoseFile, setErrorChoooseFile] = useState("");
    const [errorChoseFileBaner, setErrorChoooseFileBaner] = useState("");
    const [chooseFileBaner, setChooseFileBaner] = useState(false);
    const [choose, setChoose] = useState(false);
    const navigation = useNavigation();
    useEffect(() => {
        dispatch(
            //@ts-ignore
            addNewsContent({
                id: "1",
                content: "",
            })
        );
    }, []);
    const descriptionText = useAppSelector((state) =>
        state.NewsContent.NewsContentList[0]
            ? state.NewsContent.NewsContentList[0].content
            : ""
    );
    const goBack = useGoBack();
    const [title, setTitle] = useState("");

    const [description, setDescription] = useState("");
    const showDatePicker = (e: any) => {
        setDateType(e);
        setDatePickerVisibility(true);
    };
    const showTimePicker = () => {
        setTimePickerVisibility(true);
    };
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    };
    const DatePickerCancel = () => {
        if (dateType === "start") {
            setStartDate(null), hideDatePicker();
        } else dateType === "end";
        {
            setEndDate(null), hideDatePicker();
        }
    };
    const TimePickerCancel = () => {
        setTimeChoose(null);
        hideTimePicker();
    };
    const handleConfirm = (date: any) => {
        if (dateType === "start") {
            setStartDate(date);
            hideDatePicker();
        } else {
            setEndDate(date);
            hideDatePicker();
        }
    };
    const TimeHandleConfirm = (time: any) => {
        setTimeChoose(time);
        hideTimePicker();
    };
    const addFile = (file: any, filename: string) => {
        const newAttachment: any = attachments;

        if (file.type === "success") {
            setChooseFileBaner(true);
            setErrorChoooseFileBaner("");
            newAttachment[attachments.length] = {file, filename};
            setAttachments([{file, filename}]);
        } else if (file.type === "cancel") {
            setChooseFileBaner(false);
            setErrorChoooseFileBaner("Bạn chưa chọn file ảnh bìa!");
        }
    };
    const uploadFile = async () => {
        if (checkValidateTitle()) {
            if (checkValidateContent()) {
                if (checkValidateDesc()) {
                    if (checkValidateFileImage()) {
                        try {
                            if (attachments[0].file.type === "success") {
                                const data = new FormData();
                                for await (const file of attachments) {
                                    data.append("files", {
                                        ...file.file,
                                        uri:
                                            Platform.OS === "android"
                                                ? file.file.uri
                                                : file.file.uri.replace("file://", ""),
                                        name: file.file.name,
                                        type: file.file.mimeType, // it may be necessary in Android.
                                    });
                                }
                                let res = await generateApiService.postImage(
                                    UploadFileApi.UploadMultiFile(),
                                    data
                                );
                                const arrayUrl = JSON.parse(res);
                                const dataNewsUpload = {
                                    news_title: title,
                                    news_date: new Date(),
                                    news_description: description,
                                    news_image: arrayUrl[0],
                                    news_content: descriptionText,
                                    news_isDisplay: 0,
                                };

                                let updateNews = await generateApiService.post(
                                    NewsApi.getNews(0, PAGE_SIZE),
                                    dataNewsUpload
                                );
                                setTitleNoti("Tạo tin tức thành công");
                                setType("success");
                                setModalVisibleNoti(true);
                                navigation.navigate("/quan-ly-tin-tuc", {
                                    news: updateNews,
                                });
                                const bodyHistory = {
                                    name: " tin tức " + title,
                                    method: "POST",
                                };
                                const history = await generateApiService.post(
                                    ActivityHistoriesApi.postHistories(),
                                    bodyHistory
                                );
                            } else {
                                setTitleNoti("Chưa upload ảnh tin tức!");
                                setType("warning");
                                setModalVisibleNoti(true);
                            }
                        } catch (error) {
                            setTitleNoti("Tạo tin tức thất bại");
                            setType("error");
                            setModalVisibleNoti(true);
                        }
                    }
                }
            }
        }
    };

    function checkValidateTitle(): boolean {
        let check = true;
        if (!title) {
            check = false;
            setErrorTitle("Tiêu đề tin tức không để trống!");
        } else {
            check = true;
            setErrorTitle("");
        }
        return check;
    }

    function checkValidateContent(): boolean {
        let check = true;
        if (!description) {
            check = false;
            setErrorContent("Mô tả tin tức không để trống!");
        } else {
            check = true;
            setErrorContent("");
        }
        return check;
    }

    function checkValidateDesc(): boolean {
        let check = true;
        if (!descriptionText) {
            check = false;
            setErrorDescriptionText("Nội dung tin tức không để trống!");
        } else {
            check = true;
            setErrorDescriptionText("");
        }
        return check;
    }

    function checkValidateFileImage(): boolean {
        let check = true;
        if (!chooseFileBaner) {
            check = false;
            setErrorChoooseFileBaner("Bạn chưa chọn file ảnh bìa!");
        } else {
            check = true;
            setErrorChoooseFileBaner("");
        }
        return check;
    }

    return (
        <Box bg="defaultBackground" position="relative" height="100%">
            <Box height="100%" mt={2}>
                <Header title="Tạo tin tức" search leftButton="back">
                    <NotificationIcon/>
                </Header>
                <Box height={1} bg="#636363" opacity={0.3} mt={2}/>
                <ScrollView nestedScrollEnabled={true}>
                    <Flex flex={1} px={2}>
                        <Devider></Devider>
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
                                    style={{textTransform: "uppercase"}}
                                >
                                    TẠO TIN TỨC MỚI
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Box alignItems="center">
                        <Box width="95%" mt={2}>
                            <Text fontSize={16} color="seen" ml={2}>
                                Tiêu đề tin tức <Text color="red">*</Text>
                            </Text>
                            <Box alignItems="center">
                                <TextInput

                                    multiline={true}
                                    textAlignVertical="top"
                                    //@ts-ignore
                                    width={width * 0.9}
                                    minHeight={height * 0.1}
                                    borderRadius={10}
                                    borderWidth={1}
                                    borderColor="rgba(125, 125, 125, 0.3)"
                                    padding={4}
                                    fontSize={16}
                                    marginBottom={10}
                                    onFocus={() => setErrorTitle("")}
                                    onChangeText={(value) => setTitle(value)}
                                ></TextInput>
                            </Box>
                            {errorTitle ? (
                                <Text fontSize={14} color="#f3a908" mb={1} ml={2}>
                                    {errorTitle}
                                </Text>
                            ) : null}
                            <Text fontSize={16} color="seen" ml={2}>
                                Mô tả <Text color="red">*</Text>
                            </Text>
                            <Box alignItems="center">
                                <TextInput
                                    multiline={true}
                                    textAlignVertical="top"
                                    //@ts-ignore
                                    width={width * 0.9}
                                    minHeight={height * 0.1}
                                    borderRadius={10}
                                    borderWidth={1}
                                    borderColor="rgba(125, 125, 125, 0.3)"
                                    padding={4}
                                    fontSize={16}
                                    marginBottom={10}
                                    onFocus={() => setErrorContent("")}
                                    onChangeText={(value) => setDescription(value)}
                                ></TextInput>
                            </Box>
                            {errorContent ? (
                                <Text fontSize={14} color="#f3a908" mb={1} ml={2}>
                                    {errorContent}
                                </Text>
                            ) : null}
                            <Text fontSize={16} color="seen" ml={2}>
                                Nội dung tin tức <Text color="red">*</Text>
                            </Text>
                            <NavLink
                                {...{
                                    route: "/tao-noi-dung-tin-tuc",
                                    params: {descriptionText: descriptionText},
                                }}
                            >
                                <Box
                                    ml={2}
                                    borderRadius={10}
                                    borderWidth={1}
                                    borderColor="rgba(125, 125, 125, 0.3)"
                                    width={width * 0.9}
                                    minHeight={height * 0.3}
                                    overflow={"hidden"}

                                >
                                    {descriptionText && descriptionText.length > 0 ? (
                                        <RenderHtml
                                            contentWidth={width * 0.9}
                                            source={{
                                                html: descriptionText,
                                            }}
                                        />
                                    ) : null}
                                </Box>
                            </NavLink>
                            {
                                /* {
                                descriptionText ? "" : (
                                  <Text fontSize={14} color="#f3a908" mb={1} ml={2}>
                                    {errorDescriptionText}
                                  </Text>
                                )
                              } */
                                <Text fontSize={14} color="#f3a908" ml={2} mt={2}>
                                    {descriptionText ? "" : errorDescriptionText}
                                </Text>
                            }
                        </Box>

                        <Box width="95%" mt={2}>
                            <Text fontSize={16} color="seen" ml={2} mb={1}>
                                Tải ảnh tin tức <Text color="red">*</Text>
                            </Text>
                        </Box>
                        <Box
                            borderRadius={10}
                            borderWidth={1}
                            borderColor="rgba(125, 125, 125, 0.3)"
                            width="90%"
                        >
                            <Box padding={2}>
                                <Box width={150}>
                                    <CardAttachmentsUpload
                                        addFile={addFile}
                                        title="Tải lên hình ảnh"
                                        typeFile="image"
                                    ></CardAttachmentsUpload>
                                </Box>
                                <Text ml={1} color="seen" fontSize={15} mt={2} mb={2}>
                                    Xem trước ảnh tải lên
                                </Text>
                                <FastImage
                                    source={{
                                        uri: attachments[0].file.uri,
                                    }}
                                    style={{
                                        height: attachments[0].file.height
                                            ? (attachments[0].file.height /
                                                attachments[0].file.width) *
                                            width *
                                            0.85
                                            : 200,
                                        width: width * 0.85,
                                        resizeMode: "stretch",
                                    }}
                                ></FastImage>

                            </Box>
                            <Text fontSize={14} color="#f3a908" ml={2} mb={2}>
                                {errorChoseFileBaner}
                            </Text>
                        </Box>
                        <Box flexDirection="row">
                            <TouchableOpacity onPress={goBack}>
                                <Box
                                    borderRadius={5}
                                    borderWidth={1}
                                    borderColor="buttonColor"
                                    mt={2}
                                    mr={2}
                                    minWidth={120}
                                    alignItems="center"
                                    backgroundColor=" rgba(99, 99, 99, 0.1)"
                                >
                                    <Text
                                        style={{
                                            padding: 10,
                                            fontSize: 18,
                                            color: "#CC0000",
                                        }}
                                    >
                                        Hủy
                                    </Text>
                                </Box>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    uploadFile();
                                }}
                            >
                                <Box
                                    borderRadius={5}
                                    borderWidth={1}
                                    borderColor="rgba(125, 125, 125, 0.3)"
                                    mt={2}
                                    backgroundColor="buttonColor"
                                    minWidth={120}
                                    alignItems="center"
                                >
                                    <Text
                                        style={{
                                            padding: 10,
                                            color: "#ffffff",
                                            right: 0,

                                            fontSize: 18,
                                        }}
                                    >
                                        Đăng Tin
                                    </Text>
                                </Box>
                            </TouchableOpacity>
                        </Box>
                    </Box>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        locale="vi"
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={DatePickerCancel}
                    />
                    <DateTimePickerModal
                        isVisible={isTimePickerVisible}
                        locale="vi"
                        mode="time"
                        onConfirm={TimeHandleConfirm}
                        onCancel={TimePickerCancel}
                    />
                    <Box height={20}/>
                </ScrollView>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisibleNoti}
                    onRequestClose={() => {
                        setModalVisibleNoti(!modalVisibleNoti);
                    }}
                >
                    <PopupCloseAutomatically
                        titleEdit={titleNoti}
                        title="Tạo tin tứu"
                        type={type}
                        isOpen={modalVisibleNoti}
                        setIsOpen={setModalVisibleNoti}
                    />
                    {/* <PopupNotification
            titleEdit={titleNoti}
            title="Tạo tin tứu"
            type={type}
            setModalVisible={setModalVisibleNoti}
          ></PopupNotification> */}
                </Modal>
            </Box>
        </Box>
    );
};
export default CreateNews;
