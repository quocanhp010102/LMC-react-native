import {useNavigation} from "@react-navigation/native";
import React, {useEffect, useState} from "react";
import {Dimensions, Linking, Modal, Platform, ScrollView, TouchableOpacity,} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RenderHtml from "react-native-render-html";
import Swipeout from "react-native-swipeout";
import {CardAttachments} from "../../components/CardAttachments";
import {CardAttachmentsUpload} from "../../components/CardAttachmentsUpload";
import {Devider} from "../../components/Devider";
import {Header, NotificationIcon} from "../../components/Header";
import {useAppDispatch, useAppSelector} from "../../hooks/ReduxHook";
import {useGoBack} from "../../platform/go-back";
import {NavLink} from "../../platform/links";
import {Box, Flex, Text, TextInput} from "../../rebass";
import {generateApiService} from "../../services/ApiService";
import {ActivityHistoriesApi} from "../../services/api/ActivityHistories/ActivityHistoriesApi";
import {LessonApi} from "../../services/api/Lesson/LessonApi";
import {UploadFileApi} from "../../services/api/UploadFile/UploadFileApi";
import {ModalDelete} from "./components/ModalDelete";
import PopupCloseAutomatically from "../../components/PopupCloseAutomatically";

const {width, height} = Dimensions.get("screen");
const CreateLesson = (props: {
    id_course?: string;
    id?: string;
    data?: any;
    edit: true;
    title: string;
    dataContent?: string;
}) => {
    const role = useAppSelector((state) => state.users.userList[0].role);
    //@ts-ignore
    const {id_course, id, data, edit, title, dataContent} = props.route.params;
    const dispatch = useAppDispatch();
    const [modalVisibleNoti, setModalVisibleNoti] = useState(false);
    const [type, setType] = useState<string>("");
    const [state, _setState] = useState({
        timeChoose: "",
        startDate: "",
        endDate: "",
        dateType: "",
        isDatePickerVisible: false,
        isTimePickerVisible: false,
        attachments:
            edit && data.lesson_file
                ? [{file: {name: data.lesson_file, link: "link"}}]
                : [],
        filesOfLessons: [],
        attendance: false,
        linkFile: edit ? data.lesson_file : null,
        subgroup: false,
        title: edit ? data.lesson_name : null,
        notification: edit ? data.lesson_notification : null,
        getFile: null,
        fileChoose: null,
        modalVisible: false,
    });
    const setState = (data: any) => {
        _setState({
            ...state,
            ...data,
        });
    };
    const [loading, setLoading] = useState(false);
    const goback = useGoBack();
    const navigation = useNavigation();
    const richText = React.useRef();
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [errorTitle, setErrorTitle] = useState("");
    const [errorNotification, setErrorNotification] = useState("");
    const [errorDescriptionText, setErrorDescriptionText] = useState("");
    const [errorChoseFile, setErrorChoooseFile] = useState("");
    const [choose, setChoose] = useState(false);
    const [descriptionText, setDescriptionText] = useState(
        edit ? data.lesson_content : ""
    );

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            let DataLesson = await generateApiService.get(
                LessonApi.getLesson(data.id)
            );
            setState({filesOfLessons: DataLesson.filesOfLessons});
            setLoading(false);
        };
        if (edit) {
            getData();
        }
    }, []);
    useEffect(() => {
        if (dataContent) {
            setDescriptionText(dataContent);
        }
    }, [dataContent]);
    const showDatePicker = (e: any) => {
        setState({
            dateType: e,
            isDatePickerVisible: true,
        });
        setDatePickerVisibility(true);
    };
    const showTimePicker = () => {
        setState({
            isTimePickerVisible: true,
        });
    };
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    const hideTimePicker = () => {
        setState({
            isTimePickerVisible: false,
        });
    };
    const DatePickerCancel = () => {
        if (state.dateType === "start") {
            setState({
                startDate: null,
            });
            setDatePickerVisibility(false);
        } else {
            setState({
                endDate: null,
            });
            setDatePickerVisibility(false);
        }
    };
    const TimePickerCancel = () => {
        setState({
            timeChoose: null,
            isTimePickerVisible: false,
        });
    };
    const handleConfirm = (date: any) => {
        if (state.dateType === "start") {
            setState({
                startDate: date,
                isDatePickerVisible: false,
            });
            hideDatePicker();
        } else {
            setState({
                endDate: date,
                isDatePickerVisible: false,
            });
            hideDatePicker();
        }
    };
    const TimeHandleConfirm = (time: any) => {
        if (state.dateType === "start") {
            let newtime;
            setState({
                startDate: time,
                isDatePickerVisible: false,
            });
            hideDatePicker();
        } else {
            setState({
                endDate: time,
                isDatePickerVisible: false,
            });
            hideDatePicker();
        }
        setState({
            timeChoose: time,
            isTimePickerVisible: false,
        });
    };

    function checkValidateTitle(): boolean {
        let check = true;
        if (!state.title) {
            check = false;
            setErrorTitle("Tiêu đề bài giảng không để trống!");
        } else {
            check = true;
            setErrorTitle("");
        }
        return check;
    }

    function checkValidateNotification(): boolean {
        let check = true;
        if (!state.notification) {
            check = false;
            setErrorNotification("Thông báo không để trống!");
        } else {
            check = true;
            setErrorNotification("");
        }
        return check;
    }

    function checkValidateDesc(): boolean {
        let check = true;
        if (!descriptionText) {
            check = false;
            setErrorDescriptionText("Nội dung bài giảng không để trống!");
        } else {
            check = true;
            setErrorDescriptionText("");
        }
        return check;
    }

    function checkValidateFile(): boolean {
        let check = true;
        if (!choose) {
            check = false;
            setErrorChoooseFile("Bạn chưa chọn file");
        } else {
            check = true;
            setErrorChoooseFile("");
        }
        return check;
    }

    const setModalVisible = async (value: any) => {
        await setState({modalVisible: value});
    };
    const uploadFile = async (nameFile?: any) => {
        let res;
        if (checkValidateTitle()) {
            if (checkValidateNotification()) {
                if (checkValidateDesc()) {
                    // if (checkValidateFile()) {
                    if (!edit) {
                        if (state.attachments.length > 0) {
                            const data = new FormData();
                            for await (const file  of state.attachments as any) {
                                data.append("files", {
                                    ...file.file,
                                    //@ts-ignore
                                    uri:
                                        Platform.OS === "android"

                                            ? file.file.uri
                                            : file.file.uri.replace("file://", ""),
                                    name: file.file.name,
                                    type: file.file.mimeType, // it may be necessary in Android.
                                });
                            }
                            res = await generateApiService.postImage(
                                UploadFileApi.UploadMultiFile(),
                                data
                            );
                        }
                        const arrayUrl = res ? JSON.parse(res) : null;
                        const dataLesson = {
                            lesson_name: state.title,
                            lesson_notification: state.notification,
                            lesson_content: descriptionText,
                            lesson_timeStart: state.startDate,
                            lesson_timeEnd: state.endDate,
                            course: {
                                //@ts-ignore
                                id: props.route.params.id_course,
                            },
                            lesson_file: arrayUrl ? arrayUrl[0] : null,
                        };
                        let updateCourse = await generateApiService.post(
                            LessonApi.postLesson(),
                            dataLesson
                        );
                        setType("success");
                        setModalVisibleNoti(true);
                        navigation.navigate("/chi-tiet-khoa-hoc-gv", {
                            id_course: updateCourse.course.id,
                            newLesson: updateCourse,
                        });
                        const bodyHistory = {
                            name: " bài giảng " + state.title,
                            method: "POST",
                        };
                        const history = await generateApiService.post(
                            ActivityHistoriesApi.postHistories(),
                            bodyHistory
                        );
                    } else {
                        let res;
                        if (state.attachments.length > 0) {
                            if (state.attachments[0].file.link) {
                                res = [state.attachments[0].file.name];
                            } else {
                                const data = new FormData();
                                for await (const file  of state.attachments ) {
                                    data.append("files", {
                                        ...file.file,
                                        //@ts-ignore
                                        uri:
                                            Platform.OS === "android"
                                                ? file.file.uri
                                                : file.file.uri.replace("file://", ""),
                                        name: file.file.name,
                                        type: file.file.mimeType, // it may be necessary in Android.
                                    });
                                }
                                let fileLink = await generateApiService.postImage(
                                    UploadFileApi.UploadMultiFile(),
                                    data
                                );
                                res = JSON.parse(fileLink);
                            }
                        }
                        const dataLesson = {
                            id: data.id,
                            lesson_name: state.title,
                            lesson_notification: state.notification,
                            lesson_content: descriptionText,
                            timeEnd: null,
                            course: {
                                id: id_course,
                            },
                            lesson_file: res ? res[0] : null,
                        };

                        let updateCourse = await generateApiService.put(
                            LessonApi.getLesson(data.id),
                            dataLesson
                        );
                        setType("success");
                        setModalVisibleNoti(true);
                        setChoose(false);
                        navigation.navigate("/chi-tiet-khoa-hoc-gv", {
                            id_course: updateCourse.course.id,
                            newLesson: updateCourse,
                        });
                    }
                }
            }
        }
    };
    const addFile = (file: any, filename: string) => {
        if (file.type === "success") {
            setChoose(true);
            setErrorChoooseFile("");
            setState({attachments: [{file, filename}]});
        } else if (file.type === "cancel") {
            setChoose(false);
            setErrorChoooseFile("Bạn chưa chọn file");
        }
    };
    const updateFileOfLesson = async (file: any) => {
        if (file.type === "success") {
            const dataUpload = new FormData();

            dataUpload.append("files", {
                ...file,
                uri:
                    Platform.OS === "android"
                        ? file.uri
                        : file.uri.replace("file://", ""),
                name: file.name,
                type: file.mimeType, // it may be necessary in Android.
            });

            let fileLink = await generateApiService.postImage(
                UploadFileApi.UploadMultiFile(),
                dataUpload
            );
            let res = JSON.parse(fileLink);

            let uploadFile = {
                files_path: res[0],
                files_name: file.name,
                lesson: {
                    id: data.id,
                },
            };

            let DataLesson = await generateApiService.post(
                LessonApi.filesOfLessons(""),
                uploadFile
            );

            setState({filesOfLessons: [DataLesson, ...state.filesOfLessons]});
        } else if (file.type === "cancel") {
        }
    };
    const deleteAttachments = (index: any) => {
        const newAttachment = state.attachments;
        newAttachment.splice(index, 1);
        setState({attachments: newAttachment});
    };
    const deleteFilesOfLessons = async (id: any, index: number) => {
        try {
            let DataLesson = await generateApiService.delete(
                LessonApi.filesOfLessons(id)
            );
            const newFilesOfLessons = state.filesOfLessons;
            newFilesOfLessons.splice(index, 1);
            setState({filesOfLessons: newFilesOfLessons, modalVisible: false});
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Box bg="defaultBackground" position="relative" height="100%">
            <Box height="100%" mt={2}>
                <Header
                    title={edit ? "Sửa bài giảng " : "Tạo Bài Giảng"}
                    search
                    leftButton="back"
                >
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
                                    lineHeight={30}
                                    color="textColor"
                                    fontWeight="bold"
                                    fontSize={17}
                                    style={{textTransform: "uppercase"}}
                                >
                                    {title}
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Box alignItems="center">


                        <Box width="95%" mt={2}>
                            <Text fontSize={16} color="seen" ml={1} mb={1}>
                                Tiêu đề bài giảng <Text color="red">*</Text>
                            </Text>
                            <Box alignItems="center">
                                <TextInput
                                    textAlignVertical="center"
                                    width={width * 0.95}
                                    style={{
                                        minHeight: 50,
                                        padding: 4,
                                        marginBottom: 10,
                                    }}
                                    borderRadius={10}
                                    borderWidth={1}
                                    borderColor="rgba(125, 125, 125, 0.3)"
                                    fontSize={16}
                                    value={state.title}
                                    onFocus={() => setErrorTitle("")}
                                    onChangeText={(value) => setState({title: value})}
                                ></TextInput>
                            </Box>
                            {errorTitle ? (
                                <Text fontSize={14} color="#f3a908" ml={2}>
                                    {errorTitle}
                                </Text>
                            ) : null}

                            <Text fontSize={16} color="seen" ml={1} mt={2} mb={1}>
                                Thông báo chung <Text color="red">*</Text>
                            </Text>
                            <Box alignItems="center">
                                <TextInput
                                    multiline={true}
                                    textAlignVertical="top"
                                    width={width * 0.95}

                                    style={{minHeight: 50, padding: 4, marginBottom: 10}}
                                    borderRadius={10}
                                    borderWidth={1}
                                    borderColor="rgba(125, 125, 125, 0.3)"
                                    fontSize={16}
                                    value={state.notification}
                                    onFocus={() => setErrorNotification("")}
                                    onChangeText={(value) => setState({notification: value})}
                                ></TextInput>
                            </Box>
                            {errorNotification ? (
                                <Text fontSize={14} color="#f3a908" ml={2}>
                                    {errorNotification}
                                </Text>
                            ) : null}

                            <Text fontSize={16} color="seen" ml={1} mt={2} mb={1}>
                                Nội dung bài giảng
                                <Text color="red">*</Text>
                            </Text>
                            <NavLink
                                {...{
                                    route: "/tao-noi-dung-bai-giang",
                                    params: {descriptionText: descriptionText},
                                }}
                            >
                                <Box
                                    borderRadius={10}
                                    borderWidth={1}
                                    borderColor="rgba(125, 125, 125, 0.3)"
                                    width={width * 0.95}
                                    minHeight={200}
                                >
                                    <Box p={2}>
                                        {descriptionText && descriptionText.length > 0 ? (
                                            <RenderHtml
                                                contentWidth={width * 0.95}
                                                // contentHeight={height}
                                                //@ts-ignore
                                                androidHardwareAccelerationDisabled={true}
                                                source={{
                                                    html: descriptionText,
                                                }}
                                            />

                                        ) : null}
                                    </Box>
                                </Box>
                            </NavLink>
                            {descriptionText ? null : (
                                <Text fontSize={14} color="#f3a908" ml={2} mt={2}>
                                    {errorDescriptionText}
                                </Text>
                            )}
                        </Box>

                        <Box width="95%" mt={2}>
                            <Text fontSize={16} color="seen" ml={1} mb={1}>
                                Đính kèm bài giảng có sẵn
                            </Text>
                        </Box>
                        <Box
                            borderRadius={10}
                            borderWidth={1}
                            borderColor="rgba(125, 125, 125, 0.3)"
                            width="95%"
                        >
                            <Box
                                padding={2}
                                flexDirection="row"
                                alignItems="center"
                                width={170}
                            >
                                <CardAttachmentsUpload
                                    addFile={addFile}
                                    title="Tải lên bài giảng"
                                    // setModalVisible={setState}
                                    // uploadType="multiFile"
                                ></CardAttachmentsUpload>

                            </Box>
                            {errorChoseFile ? (
                                <Text fontSize={14} color="#f3a908" ml={2} mb={2}>
                                    {errorChoseFile}
                                </Text>
                            ) : null}
                            {(state.attachments ? state.attachments : []).map(
                                (attachments :any, idx : number) => {
                                    let swipeoutBtns = [
                                        {
                                            component: (
                                                <Box height={40} mr={2} mt={1}>
                                                    <TouchableOpacity
                                                        onPress={() => deleteAttachments(idx)}
                                                        style={{
                                                            flex: 1,
                                                            backgroundColor: "red",
                                                            width: "100%",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            borderRadius: 8,
                                                        }}
                                                    >
                                                        <Text color="white" fontSize={14} fontWeight="bold">
                                                            Xóa
                                                        </Text>
                                                    </TouchableOpacity>
                                                </Box>
                                            ),
                                            backgroundColor: "white",
                                            disabled: true,
                                        },
                                    ];
                                    return (
                                        //@ts-ignore
                                        <Swipeout
                                            right={swipeoutBtns}
                                            backgroundColor={"white"}
                                            key={idx}
                                            style={{borderRadius: 8}}
                                        >
                                            <TouchableOpacity
                                                key={attachments.id}
                                                onPress={() => Linking.openURL(state.linkFile)}
                                                onLongPress={() => deleteAttachments(idx)}
                                            >
                                                <Box alignItems="center" mb={2}>
                                                    <CardAttachments
                                                        key={attachments.id}
                                                        title={attachments.file.name
                                                            .split("\\")
                                                            .pop()
                                                            .split("/")
                                                            .pop()}
                                                        checkFile={attachments.file.name.split(".").pop()}
                                                    />
                                                </Box>
                                            </TouchableOpacity>
                                        </Swipeout>
                                    );
                                }
                            )}
                        </Box>

                        <Box flexDirection="row">
                            <TouchableOpacity onPress={goback}>
                                <Box
                                    borderRadius={5}
                                    borderWidth={1}
                                    borderColor="buttonColor"
                                    mt={2}
                                    mr={2}
                                >
                                    <Text style={{padding: 10}} color="deleteColor">
                                        Hủy bài giảng
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
                                >
                                    <Text style={{padding: 10, color: "#ffffff", right: 0}}>
                                        Upload bài giảng
                                    </Text>
                                </Box>
                            </TouchableOpacity>
                        </Box>
                    </Box>
                    <DateTimePickerModal
                        isVisible={state.isDatePickerVisible}
                        locale="vi"
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={DatePickerCancel}
                    />
                    <DateTimePickerModal
                        isVisible={state.isTimePickerVisible}
                        locale="vi"
                        mode="time"
                        onConfirm={TimeHandleConfirm}
                        onCancel={TimePickerCancel}
                    />
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisibleNoti}
                        onRequestClose={() => {
                            setModalVisibleNoti(!modalVisibleNoti);
                        }}
                    >
                        <PopupCloseAutomatically
                            title={edit ? "Sửa bài giảng" : "Tạo bài giảng"}
                            type={type}
                            isOpen={modalVisibleNoti}
                            setIsOpen={setModalVisibleNoti}
                        />
                        {/* <PopupNotification
              title={edit ? "Sửa bài giảng" : "Tạo bài giảng"}
              type={type}
              setModalVisible={setModalVisibleNoti}
            ></PopupNotification> */}
                    </Modal>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={state.modalVisible}
                    >
                        <ModalDelete
                            getFile={state.fileChoose}
                            confirmDelete={deleteFilesOfLessons}
                            setModalVisible={setModalVisible}
                            modalType={"delete"}
                        ></ModalDelete>
                    </Modal>
                    <Box height={30}/>
                </ScrollView>
            </Box>
        </Box>
    );
};
export default CreateLesson;
