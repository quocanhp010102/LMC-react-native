import {useNavigation} from "@react-navigation/native";
import {FastImage} from "components-base";
import React, {useEffect, useState} from "react";
import {Dimensions, Image, Modal, Platform, ScrollView, TextInput, TouchableOpacity,} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RenderHtml from "react-native-render-html";
import {addNewsContent} from "../../Redux/NewsContent";
import {CardAttachmentsUpload} from "../../components/CardAttachmentsUpload";
import {Devider} from "../../components/Devider";
import {Header, NotificationIcon} from "../../components/Header";
import {useAppDispatch, useAppSelector} from "../../hooks/ReduxHook";
import {useGoBack} from "../../platform/go-back";
import {NavLink} from "../../platform/links";
import {Box, Flex, Text} from "../../rebass";
import {generateApiService} from "../../services/ApiService";
import {ActivityHistoriesApi} from "../../services/api/ActivityHistories/ActivityHistoriesApi";
import {NewsApi} from "../../services/api/News/NewsApi";
import {UploadFileApi} from "../../services/api/UploadFile/UploadFileApi";
import PopupCloseAutomatically from "../../components/PopupCloseAutomatically";

const {width, height} = Dimensions.get("screen");
const ViewNews = (props: { id?: string; data?: any; type?: string }) => {
    //@ts-ignore
    const dataNews: any = props.route.params.data;
    const dispatch = useAppDispatch();
    const richText = React.useRef();
    const [sizeImage, setSizeImage] = useState<any>();
    const navigation = useNavigation();
    const [getFile, setGetFile] = useState<any>({
        uri: dataNews.news_image,
    });
    const [attachments, setAttachments] = useState<any>([
        {
            file: {
                uri: dataNews.news_image,
            },
        },
    ]);

    const [timeChoose, setTimeChoose] = useState<any>("");
    const [startDate, setStartDate] = useState<any>(dataNews.news_date);

    const NewsDelete = () => {
        dispatch(
            //@ts-ignore
            addNewsContent({
                id: "1",
                content: "",
            })
        );
    };

    const [endDate, setEndDate] = useState<any>("");
    const [dateType, setDateType] = useState("");
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const [subgroup, setSubgroup] = useState(false);
    const [edit, setEdit] = useState(false);
    const [modalVisibleNoti, setModalVisibleNoti] = useState(false);
    const [type, setType] = useState<string>("");
    const [titleNoti, setTitleNoti] = useState("");
    const [errorTitle, setErrorTitle] = useState("");
    const [errorContent, setErrorContent] = useState("");
    const [errorDescriptionText, setErrorDescriptionText] = useState("");

    const descriptionText = useAppSelector((state) =>
        state.NewsContent.NewsContentList[0]
            ? state.NewsContent.NewsContentList[0].content
            : ""
    );
    useEffect(() => {
        dispatch(
            //@ts-ignore
            addNewsContent({
                id: "1",
                content: dataNews.news_content ? dataNews.news_content : "",
            })
        );
        Image.getSize(dataNews.news_image, (widthImage, heightImage) => {
            const fixSizeHeight = (heightImage / widthImage) * width * 0.84;

            if (fixSizeHeight) {
                setSizeImage({width, fixSizeHeight});
            }
        });
    }, []);
    const goBack = useGoBack();
    const [title, setTitle] = useState(dataNews.news_title);
    const [modalVisible, setModalVisible] = useState(false);
    const [description, setDescription] = useState(dataNews.news_description);
    // const showDatePicker = (e : any) => {
    //   setDateType(e);
    //   setDatePickerVisibility(true);
    // };
    // const showTimePicker = () => {
    //   setTimePickerVisibility(true);
    // };
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
            newAttachment[attachments.length] = {file, filename};
            setAttachments([{file, filename}]);

            const fixSizeHeight = (file.height / file.width) * width * 0.85;
            setSizeImage({width, fixSizeHeight});
        }
    };

    const uploadFile = async () => {
        if (checkValidateTitle()) {
            if (checkValidateContent()) {
                if (checkValidateDesc()) {
                    try {
                        const data = new FormData();
                        let arrayUrl = [dataNews.news_image];

                        if (attachments[0].file.type === "success") {
                            for await (const file of attachments) {
                                data.append("files", {
                                    ...file.file,
                                    uri:
                                        Platform.OS === "android"
                                            ? file.file.uri
                                            : file.file.uri.replace("file://", ""),
                                    name: file.file.name,
                                    type: file.file.mimeType,
                                });
                            }
                            let res = await generateApiService.postImage(
                                UploadFileApi.UploadMultiFile(),
                                data
                            );
                            arrayUrl = JSON.parse(res);
                        }

                        const dataNewsUpload = {
                            id: dataNews.id,
                            news_title: title,
                            news_date: new Date(),
                            news_description: description,
                            news_image: arrayUrl[0],
                            news_content: descriptionText,
                            news_created_date: dataNews.startDate,
                            news_isDisplay: dataNews.news_isDisplay,
                        };
                        let updateNews = await generateApiService.put(
                            NewsApi.getNewById(dataNews.id),
                            dataNewsUpload
                        );
                        setTitleNoti("Sửa tin tức thành công");
                        setType("success");
                        setModalVisibleNoti(true);
                        goBack();
                        navigation.navigate("/quan-ly-tin-tuc", {
                            news: updateNews,
                        });
                        const bodyHistory = {
                            name: " tin tức " + title,
                            method: "PUT",
                        };
                        const history = await generateApiService.post(
                            ActivityHistoriesApi.postHistories(),
                            bodyHistory
                        );
                    } catch (e) {
                        setTitleNoti("Sửa tin tức thất bại");
                        setType("error");
                        setModalVisibleNoti(true);
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

    // @ts-ignore
    return (
        <Box bg="defaultBackground" position="relative" height="100%">
            <Box height="100%" mt={2}>
                <Header
                    title={!edit ? "Chi tiết tin tức" : "Chỉnh sửa tin tức"}
                    search
                    leftButton="back"
                >
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
                                    {!edit ? "CHI TIẾT TIN TỨC" : " CHỈNH SỬA TIN TỨC"}
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
                                    editable={edit ? true : false}
                                    defaultValue={dataNews.news_title}
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
                                    editable={edit ? true : false}
                                    defaultValue={dataNews.news_description}
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
                            {edit ? (
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
                                    >

                                        {descriptionText && descriptionText.length > 0 ? (
                                            <RenderHtml
                                                contentWidth={width * 0.9}
                                                source={{
                                                    html: descriptionText || "",
                                                }}
                                            />
                                        ) : null}
                                    </Box>
                                </NavLink>
                            ) : (
                                <Box
                                    ml={2}
                                    borderRadius={10}
                                    borderWidth={1}
                                    borderColor="rgba(125, 125, 125, 0.3)"
                                    width={width * 0.9}
                                    minHeight={height * 0.3}
                                >
                                    {descriptionText && descriptionText.length > 0 ? (
                                        <RenderHtml
                                            contentWidth={width}
                                            source={{
                                                html: descriptionText,
                                            }}
                                        />
                                    ) : null}
                                </Box>
                            )}
                            {
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
                                {edit ? (
                                    <Box width={150}>
                                        <CardAttachmentsUpload
                                            addFile={addFile}
                                            title="Tải lên hình ảnh "
                                            typeFile="image"
                                        ></CardAttachmentsUpload>
                                    </Box>
                                ) : null}

                                <Text ml={1} color="seen" fontSize={15} mt={2} mb={2}>
                                    Xem trước ảnh tải lên
                                </Text>

                                <FastImage
                                    source={{
                                        uri: attachments[0].file.uri,
                                    }}
                                    style={{
                                        height:
                                            attachments[0].file.uri && sizeImage
                                                ? sizeImage.fixSizeHeight
                                                : 200,
                                        width: width * 0.85,
                                        resizeMode: "stretch",
                                    }}
                                    onError={(e) => {
                                        setGetFile({
                                            uri: "https://www.madeireiraestrela.com.br/images/joomlart/demo/default.jpg",
                                        });
                                    }}
                                ></FastImage>
                            </Box>
                        </Box>

                        <Box flexDirection="row">
                            <TouchableOpacity onPress={goBack}>
                                <Box
                                    borderRadius={5}
                                    borderWidth={1}
                                    borderColor="#CC0000"
                                    mt={2}
                                    mr={2}
                                    minWidth={120}
                                    alignItems="center"
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
                            {/* {!edit ? (
                <TouchableOpacity onPress={() => setEdit(!edit)}>
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
                      Chỉnh sửa
                    </Text>
                  </Box>
                </TouchableOpacity>
              ) : (
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
                        fontWeight: "500",
                        fontSize: 18,
                      }}
                    >
                      Xác nhận
                    </Text>
                  </Box>
                </TouchableOpacity>
              )} */}
                        </Box>
                    </Box>
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
                            title="Sửa tin tức"
                            type={type}
                            isOpen={modalVisibleNoti}
                            setIsOpen={setModalVisibleNoti}
                        />
                        {/* <PopupNotification
              titleEdit={titleNoti}
              title="Sửa tin tức"
              type={type}
              setModalVisible={setModalVisibleNoti}
            ></PopupNotification> */}
                    </Modal>
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
                    <Box height={30}/>
                </ScrollView>
            </Box>
        </Box>
    );
};
export default ViewNews;
