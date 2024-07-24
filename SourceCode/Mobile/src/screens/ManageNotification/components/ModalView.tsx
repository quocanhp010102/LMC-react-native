import React, {useState} from "react";
//@ts-ignore
import {Dimensions, Modal, Picker, Platform, ScrollView, TextInput, TouchableOpacity,} from "react-native";
import {Box, Text} from "../../../rebass";
import {Icon} from "../../../components/svg-icon";
import {generateApiService} from "../../../services/ApiService";
import {NotificationApi} from "../../../services/api/Notification/NotificationApi";

const {width, height} = Dimensions.get("screen");

export const ModalView = (props: {
    data?: any;
    setModalVisible: any;
    getData: any;
    setTitleEdit: any;
    setType: any;
    setModalVisibleNoti: any;
    listNotification: any;
    setListNotification?: any;
}) => {
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
    const [edit, setEdit] = useState<boolean>(false);
    const [modalChoose, setModalChoose] = useState(false);
    const [items, setItems] = useState([
        {label: "Sinh viên", value: "value1"},
        {label: "Giảng viên", value: "value2"},
        {label: "Tất cả", value: "value3"},
    ]);
    const [value, setValue] = useState<any>({
        value: items[0].value,
        label: items[0].label,
    });
    const [title, setTitle] = useState(data.notificationTitle);
    const [content, setContent] = useState(data.notificationContent);

    const uploadFile = async () => {
        let authorities : any = [];
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
        const dataNotificationUpload = {
            notificationTitle: title,
            notificationContent: content,
            authorities: authorities,
            id: data.id,
        };

        let updateNoti = await generateApiService.put(
            NotificationApi.getNotificationById(data.id),
            dataNotificationUpload
        );
        console.log("updateNoti", dataNotificationUpload);
        
        setModalVisible(false);
        setTitleEdit("Sửa thông báo thành công !");
        setType("success");
        setModalVisibleNoti(true);
        var index = listNotification.findIndex(
            (pNoti : any) => pNoti.id == updateNoti.id
        );
        if (index >= 0) {
            let newDataNoti  = [...listNotification];
            newDataNoti[index] = updateNoti;
            setListNotification(newDataNoti);
        } else {
            setListNotification([...listNotification]);

        }
    };
    return (
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
                    width: "90%",
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
                <Text fontSize={16} color="textColor" fontWeight="bold" mt={15} mb={15}>
                    THÔNG BÁO
                </Text>
                <ScrollView showsVerticalScrollIndicator={false}
                            //@ts-ignore
                            width={"100%"}>
                    <Text fontSize={14} fontWeight="bold" color={"#1C7988"} marginBottom={2}>
                        Tiêu đề
                    </Text>
                    {!edit ? (
                        <Text marginBottom={14}  padding={1} color="seen">
                            {data.notificationTitle}
                        </Text>
                    ) : (
                        <TextInput
                            //@ts-ignore
                            height={40}
                         
                            borderWidth={1}
                            borderColor="rgba(99, 99, 99, 0.2)"
                            borderRadius={8}
                            width="100%"
                            padding={10}
                            marginBottom={14}
                            defaultValue={data.notificationTitle}
                            onChangeText={(value) => setTitle(value)}
                        ></TextInput>
                    )}
                    <Text fontSize={14} fontWeight="bold" color={"#1C7988"} marginBottom={2}>
                        Nội dung thông báo
                    </Text>
                    {!edit ? (
                        <Box height={150}>
                            <Text marginBottom={14} padding={1} color="seen">
                                {data.notificationContent}
                            </Text>
                        </Box>
                    ) : (
                        <TextInput
                            //@ts-ignore
                            height={150}
                            borderWidth={1}
                            borderColor="rgba(99, 99, 99, 0.2)"
                            borderRadius={8}
                            width="100%"
                            padding={10}
                            marginBottom={14}
                            defaultValue={data.notificationContent}
                            textAlignVertical="top"
                            multiline={true}
                            onChangeText={(value) => setContent(value)}
                        ></TextInput>
                    )}
                    <Text fontSize={14} fontWeight="bold" color={"#1C7988"} marginBottom={2}>
                        Đối tượng thông báo
                    </Text>
                    {!edit ? (
                        <Text marginBottom={14} color="seen">
                            {data.authorities
                                ? data.authorities.length === 2
                                    ? "Cả hai"
                                    : data.authorities.length === 1
                                        ? data.authorities[0].name === "ROLE_STUDENT"
                                            ? "Sinh viên"
                                            : "Giảng viên"
                                        : null
                                : null}
                        </Text>
                    ) : Platform.OS === "android" ? (
                        <Box
                            borderRadius={10}
                            borderWidth={1}
                            borderColor="rgba(125, 125, 125, 0.3)"
                            width="95%"
                            mb={2}
                            ml={2}
                        >
                            <Picker
                                itemStyle={{
                                    fontSize: 10,
                                    width: width * 0.9,
                                    color: "#636363",
                                    borderRadius: 10,
                                    borderWidth: 1,
                                    borderColor: "rgba(125, 125, 125, 0.3)",
                                }}
                                mode="dropdown"
                                style={{
                                    width: "100%",
                                    height: 40,
                                    color: "#636363",
                                    fontSize: 9,
                                }}
                                onValueChange={(items : any) => {
                                    setValue({value: items});
                                }}
                            >
                                {items.map((item, index) => (
                                    <Picker.Item
                                        key={index}
                                        color="#636363"
                                        label={item.label}
                                        value={item.value}
                                        index={index}
                                    />
                                ))}
                            </Picker>
                        </Box>
                    ) : (
                        <TouchableOpacity onPress={() => setModalChoose(true)}>
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
                    )}

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
                        {!edit ? (
                            <TouchableOpacity onPress={() => setEdit(true)}>
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
                        )}
                    </Box>
                </ScrollView>
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
                                {items.map((item) => (
                                    <TouchableOpacity
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
                                        borderColor={value.value === item.value ? "#1C7988" : "#DADADA"}
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
                                            backgroundColor={value.value === item.value ? "#1C7988" : "null"}
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
            </Box>
        </Box>
    );
};
