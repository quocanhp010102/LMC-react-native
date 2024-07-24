import React, {useState} from "react";
//@ts-ignore
import {Dimensions, Picker, Platform, ScrollView, TextInput, TouchableOpacity,} from "react-native";
import {Box, Text} from "../../../rebass";
import {Icon} from "../../../components/svg-icon";

const {width, height} = Dimensions.get("screen");
export const ModalAdd = (props: {
    data?: any;
    setModalVisible: any;
    getData: any;
}) => {
    const {data, setModalVisible, getData} = props;
    const [items, setItems] = useState([
        {label: "Hoc sinh", value: "value1"},
        {label: "Giảng viên", value: "value2"},
        {label: "Tất cả", value: "value3"},
    ]);
    const [value, setValue] = useState({
        value: items[0].value,
        label: items[0].label,
    });
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
                    height: "70%",
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
                    THÊM THÔNG BÁO
                </Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text fontSize={14} fontWeight="bold"  marginBottom={2}>
                        Tiêu đề
                    </Text>
                    <TextInput
                        //@ts-ignore
                        height={40}
                        borderWidth={1}
                        borderColor="rgba(99, 99, 99, 0.2)"
                        borderRadius={8}
                        width="100%"
                        marginBottom={14}
                        padding={2}
                    ></TextInput>
                    <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                        Nội dung thông báo
                    </Text>
                    <TextInput
                        textAlignVertical="top"
                        //@ts-ignore
                        height={150}
                        borderWidth={1}
                        borderColor="rgba(99, 99, 99, 0.2)"
                        borderRadius={8}
                        width="100%"
                        marginBottom={14}
                        padding={2}
                    ></TextInput>
                    <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                        Đối tượng thông báo
                    </Text>
                    {Platform.OS === "android" ? (
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
                                onValueChange={(items: any) => {
                                    setValue(items);
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
                        <TouchableOpacity onPress={() => setModalVisible(true)}>
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
                                borderColor="rgba(125, 125, 125, 0.3)"
                                mt={2}
                                mr={2}
                                width={width * 0.4}
                                alignItems="center"
                                backgroundColor="rgba(99, 99, 99, 0.1)"
                            >
                                <Text style={{padding: 10}}>Hủy</Text>
                            </Box>
                        </TouchableOpacity>
                        <TouchableOpacity>
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
                    </Box>
                </ScrollView>
            </Box>
        </Box>
    );
};
