import React, {useState} from "react";
import {
    Dimensions,
    Keyboard,
    Modal,
    Platform,
    ScrollView,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from "react-native";
import {Box, Text} from "../../../rebass";
import {Icon} from "../../../components/svg-icon";
import {generateApiService} from "../../../services/ApiService";
import {useGoBack} from "../../../platform/go-back";
import dayjs from "dayjs";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {NotificationApi} from "../../../services/api/Notification/NotificationApi";

const {width, height} = Dimensions.get("screen");

export const ModalAdd = (props: {
    data?: any;
    setModalVisible: any;
    getData: any;
    setTitleEdit: any;
    setType: any;
    setModalVisibleNoti: any;
    listNotification: any;
    setListNotification?: any;
}) => {
    const goBack = useGoBack();
    const {
        data,
        setModalVisible,
        getData,
        setTitleEdit,
        setType,
        setModalVisibleNoti,
        listNotification,
        setListNotification,
    } = props;
    var utc = require("dayjs/plugin/utc");
    dayjs.extend(utc);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [items, setItems] = useState([
        {label: "Sinh viên", value: "value1"},
        {label: "Giảng viên", value: "value2"},
        {label: "Tất cả", value: "value3"},
    ]);
    const [modalChoose, setModalChoose] = useState(false);
    const [value, setValue] = useState({
        value: items[0].value,
        label: items[0].label,
    });
    const [errorTitle, setErrorTitle] = useState("");
    const [errorContent, setErrorContent] = useState("");
    const [errorDescriptionText, setErrorDescriptionText] = useState("");
    const [errorChoseFile, setErrorChoooseFile] = useState("");
    const [errorChoseFileBaner, setErrorChoooseFileBaner] = useState("");
    const [chooseFileBaner, setChooseFileBaner] = useState(false);
    const [choose, setChoose] = useState(false);
    const [student, setStudent] = useState(false);
    const [event, setEvent] = useState(false);
    const [startDate, setStartDate] = useState<any>("");
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const [errorTime, setErrorTime] = useState("");
    const [typeChoose, setTypeChoose] = useState<boolean>(false);
    const showDatePicker = () => {
        setErrorTime("");
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
        if (Platform.OS === "android") {
            setStartDate(null), hideDatePicker();
        } else {
            setStartDate(null), setTypeChoose(false), hideDatePicker();
        }
    };
    const TimePickerCancel = () => {
        setStartDate(null), hideTimePicker();
    };
    const handleConfirm = async (date: any) => {
        if (Platform.OS === "android") {
            setStartDate(date);
            await hideDatePicker();
            setTimePickerVisibility(true);
        } else {
            setTypeChoose(true);
            setStartDate(date);
        }
    };
    const TimeHandleConfirm = (time: any) => {
        if (Platform.OS === "android") {
            let newStartDate = dayjs(startDate)
                .utc()
                .hour(time.getHours())
                .minute(time.getMinutes());
            setStartDate(newStartDate);
            hideTimePicker();
        } else {
            let newStartDate = dayjs(startDate)
                .utc()
                .hour(time.getHours())
                .minute(time.getMinutes());
            setStartDate(newStartDate);
            setTypeChoose(false);

            setDatePickerVisibility(false);
        }
    };
    const uploadFile = async () => {
        if (checkValidateTitle()) {
            if (checkValidateContent()) {
                let authorities: any = [];
                if (value.value === "value1") {
                    authorities = [
                        {
                            name: "ROLE_STUDENT",
                        },
                    ];
                } else if (value.value === "value2") {
                    authorities = [
                        {
                            name: "ROLE_LECTURER",
                        },
                    ];
                } else if (value.value === "value3") {
                    authorities = [
                        {
                            name: "ROLE_LECTURER",
                        },
                        {
                            name: "ROLE_STUDENT",
                        },
                    ];
                }
                let dataNotificationUpload;

                if (event) {
                    dataNotificationUpload = {
                        notificationTitle: title,
                        notificationContent: content,
                        authorities: authorities,
                        notificationTimeEvent: startDate,
                    };
                } else {
                    dataNotificationUpload = {
                        notificationTitle: title,
                        notificationContent: content,
                        authorities: authorities,
                    };
                }
                let updateNoti = await generateApiService.post(
                    NotificationApi.getAllNotifications(),
                    dataNotificationUpload
                );

                let newDataNoti = [updateNoti, ...listNotification];
                setListNotification(newDataNoti);
                setModalVisible(false);
                setTitleEdit("Thêm thông báo thành công !");
                setType("success");
                setModalVisibleNoti(true);
            }
        }
    };

    function checkValidateTitle(): boolean {
        let check = true;
        if (!title) {
            check = false;
            setErrorTitle("Tiêu đề thông báo không để trống!");
        } else {
            check = true;
            setErrorTitle("");
        }
        return check;
    }

    function checkValidateContent(): boolean {
        let check = true;
        if (!content) {
            check = false;
            setErrorContent("Mô tả nội dung thông báo không để trống!");
        } else {
            check = true;
            setErrorContent("");
        }
        return check;
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <Box
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 22,
                }}
            >
                <Box
                    style={{
                        maxHeight: height * 0.9,
                        width: width * 0.9,
                        margin: 20,
                        backgroundColor: "white",
                        borderRadius: 20,
                        padding: 10,
                        alignItems: "center",
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5,
                    }}
                >
                    <Text
                        fontSize={16}
                        color="textColor"
                        fontWeight="bold"
                        mt={15}
                        mb={15}
                    >
                        THÊM THÔNG BÁO
                    </Text>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <Text fontSize={16} fontWeight="500" color={'#1C7988'} marginBottom={2}>
                            Tiêu đề<Text color="red">*</Text>
                        </Text>
                        <TextInput
                            //@ts-ignore
                            height={40}
                            borderWidth={1}
                            borderColor="rgba(99, 99, 99, 0.2)"
                            borderRadius={8}
                            width={width * 0.8}
                            marginBottom={14}
                            onFocus={() => setErrorTitle("")}
                            onChangeText={(value) => setTitle(value)}
                            style={{ paddingHorizontal : 5}}
                        />
                        {errorTitle ? (
                            <Text fontSize={14} color="#f3a908" mb={1}>
                                {errorTitle}
                            </Text>
                        ) : null}
                        <Text fontSize={16} fontWeight="500" color={'#1C7988'} marginBottom={2}>
                            Nội dung thông báo<Text color="red">*</Text>
                        </Text>
                        <TextInput
                            textAlignVertical="top"
                            //@ts-ignore
                            height={150}
                            borderWidth={1}
                            borderColor="rgba(99, 99, 99, 0.2)"
                            borderRadius={8}
                            width={width * 0.8}
                            marginBottom={14}
                            multiline={true}
                            onFocus={() => setErrorContent("")}
                            onChangeText={(value) => setContent(value)}
                            style={{ paddingHorizontal : 5}}
                        />
                        {errorContent ? (
                            <Text fontSize={14} color="#f3a908" mb={1}>
                                {errorContent}
                            </Text>
                        ) : null}
                        <Text fontSize={16} fontWeight="500" color={'#1C7988'} marginBottom={2}>
                            Đối tượng thông báo<Text color="red">*</Text>
                        </Text>

                        <TouchableOpacity
                            onPress={() => setModalChoose(true)}
                            style={{width: width * 0.8}}
                        >
                            <Box
                                borderRadius={10}
                                borderWidth={1}
                                borderColor="rgba(125, 125, 125, 0.3)"
                                width="100%"
                                mb={2}
                                height={40}
                                justifyContent="space-between"
                                flexDirection="row"
                                alignItems="center"
                                padding={1}
                            >
                                <Text>{value?.label}</Text>
                                <Icon name="moreMember"></Icon>
                            </Box>
                        </TouchableOpacity>

                        {/* <TouchableOpacity
                            onPress={() => setEvent(!event)}
                            style={{width: width * 0.8}}
                        >
                            <Box
                                borderRadius={10}
                                borderWidth={1}
                                borderColor="rgba(125, 125, 125, 0.3)"
                                width="100%"
                                mb={2}
                                height={40}
                                flexDirection="row"
                                alignItems="center"
                                padding={1}
                            >
                                <Box
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        marginBottom: 10,
                                    }}
                                >
                                    <Box
                                        height={19}
                                        width={19}
                                        borderColor={event ? "#1C7988" : "#DADADA"}
                                        borderRadius={50}
                                        borderWidth={1}
                                        ml={2}
                                        alignItems="center"
                                        justifyContent="center"
                                        mt={2}
                                    >
                                        <Box
                                            height={12}
                                            width={12}
                                            borderColor="#DADADA"
                                            borderRadius={50}
                                            backgroundColor={event ? "#1C7988" : "null"}
                                        ></Box>
                                    </Box>
                                </Box>
                                <Text ml={2} color="seen" fontSize={15}>
                                    Thêm thông báo vào lịch
                                </Text>
                            </Box>
                        </TouchableOpacity> */}
                        {event ? (
                            <Box
                                width="45%"
                                borderRadius={10}
                                borderWidth={1}
                                borderColor="rgba(125, 125, 125, 0.3)"
                                alignItems="center"
                            >
                                <TouchableOpacity onPress={() => showDatePicker()}>
                                    <Text style={{padding: 8}}>
                                        {startDate
                                            ? dayjs(startDate).format("HH:mm-DD-MM-YYYY")
                                            : "dd/mm/yy"}
                                    </Text>
                                </TouchableOpacity>
                            </Box>
                        ) : null}
                        <Box flexDirection="row">
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Box
                                    borderRadius={5}
                                    borderWidth={1}
                                    borderColor="deleteColor"
                                    mt={2}
                                    mr={2}
                                    width={width * 0.4}
                                    alignItems="center"
                                >
                                    <Text style={{padding: 10}} color="deleteColor">
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
                                    borderColor="buttonColor"
                                    mt={2}
                                    backgroundColor="buttonColor"
                                    width={width * 0.4}
                                    alignItems="center"
                                >
                                    <Text
                                        style={{padding: 10, color: "#ffffff", right: 0}}
                                        numberOfLines={1}
                                    >
                                        Lưu
                                    </Text>
                                </Box>
                            </TouchableOpacity>
                        </Box>
                    </ScrollView>
                </Box>
                <Modal animationType="slide" transparent={true} visible={modalChoose}>
                    <Box
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 22,
                        }}
                    >
                        <Box
                            style={{
                                maxHeight: height * 0.7,
                                width: width * 0.9,
                                margin: 20,
                                backgroundColor: "white",
                                borderRadius: 20,
                                padding: 10,
                                alignItems: "center",
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 4,
                                elevation: 5,
                            }}
                        >
                            <ScrollView>
                                {items.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        delayPressIn={0}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",

                                            marginBottom: 10,
                                            borderWidth: 1,
                                            height: 40,
                                            borderRadius: 8,
                                            borderColor: "#636363",
                                            width: width * 0.8,
                                        }}
                                        onPress={() => {
                                            setValue({value: item.value, label: item.label}),
                                                setModalChoose(false);
                                        }}
                                    >
                                        <Box
                                            height={19}
                                            width={19}
                                            borderColor={  value.value === item.value ? "#1C7988" :"#DADADA"}
                                            borderRadius={50}
                                            borderWidth={1}
                                            ml={2}
                                            justifyContent="center"
                                            alignItems="center"
                                        >
                                            <Box
                                                height={12}
                                                width={12}
                                                borderColor="#DADADA"
                                                borderRadius={50}

                                                backgroundColor={
                                                    value.value === item.value ? "#1C7988" : "null"
                                                }
                                            ></Box>
                                        </Box>
                                        <Text ml={2} color="seen" fontSize={15}>
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </Box>
                    </Box>
                </Modal>
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    locale="vi"
                    mode={!typeChoose ? "date" : "time"}
                    onConfirm={!typeChoose ? handleConfirm : TimeHandleConfirm}
                    onCancel={DatePickerCancel}
                />
                <DateTimePickerModal
                    isVisible={isTimePickerVisible}
                    locale="vi"
                    mode="time"
                    onConfirm={TimeHandleConfirm}
                    onCancel={TimePickerCancel}
                />
            </Box>
        </TouchableWithoutFeedback>
    );
};
