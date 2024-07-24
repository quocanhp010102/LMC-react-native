import React, {useState} from "react";
import {Dimensions, ScrollView, TextInput, TouchableOpacity,} from "react-native";
import {Box, Text} from "../../../rebass";

const {width, height} = Dimensions.get("screen");
export const ModalView = (props: {
    data?: any;
    setModalVisible: any
}) => {
    const {data, setModalVisible} = props;
    const [edit, setEdit] = useState<boolean>(false);
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
                    THÊM NGƯỜI DÙNG
                </Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Box
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            flexWrap: "wrap",
                            alignItems: "flex-start",
                        }}
                        mt={2}
                    >
                        <Box width="50%">
                            <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                                Họ và tên
                            </Text>
                            {!edit && data.name ? (
                                <Text
                                    style={{
                                        height: 34,
                                        marginBottom: 14,
                                        textAlignVertical: "center",
                                    }}
                                    fontSize={14}
                                    color="#7D7D7D"
                                >
                                    {data.name}
                                </Text>
                            ) : (
                                <TextInput
                                    //@ts-ignore
                                    height={34}
                                    borderWidth={1}
                                    borderColor="rgba(99, 99, 99, 0.2)"
                                    borderRadius={8}
                                    width="90%"
                                    marginBottom={14}
                                    defaultValue={data.name}
                                ></TextInput>
                            )}

                            <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                                Giới tính
                            </Text>
                            {!edit && data.sex ? (
                                <Text
                                    style={{
                                        height: 34,
                                        marginBottom: 14,
                                        textAlignVertical: "center",
                                    }}
                                    fontSize={14}
                                    color="#7D7D7D"
                                >
                                    {data.sex}
                                </Text>
                            ) : (
                                <TextInput
                                    //@ts-ignore
                                    height={34}
                                    borderWidth={1}
                                    borderColor="rgba(99, 99, 99, 0.2)"
                                    borderRadius={8}
                                    width="90%"
                                    marginBottom={14}
                                    defaultValue={data.sex}
                                ></TextInput>
                            )}
                            <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                                Số điện thoại
                            </Text>
                            {!edit && data.phone ? (
                                <Text
                                    style={{
                                        height: 34,
                                        marginBottom: 14,
                                        textAlignVertical: "center",
                                    }}
                                    fontSize={14}
                                    color="#7D7D7D"
                                >
                                    {data.phone}
                                </Text>
                            ) : (
                                <TextInput
                                    //@ts-ignore
                                    height={34}
                                    borderWidth={1}
                                    borderColor="rgba(99, 99, 99, 0.2)"
                                    borderRadius={8}
                                    width="90%"
                                    marginBottom={14}
                                    defaultValue={data.phone}
                                ></TextInput>
                            )}
                        </Box>
                        <Box width="50%">
                            <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                                Mã người dùng
                            </Text>
                            {!edit && data.userCode ? (
                                <Text
                                    style={{
                                        height: 34,
                                        marginBottom: 14,
                                        textAlignVertical: "center",
                                    }}
                                    fontSize={14}
                                    color="#7D7D7D"
                                >
                                    {data.userCode}
                                </Text>
                            ) : (
                                <TextInput
                                    //@ts-ignore
                                    height={34}
                                    borderWidth={1}
                                    borderColor="rgba(99, 99, 99, 0.2)"
                                    borderRadius={8}
                                    width="90%"
                                    marginBottom={14}
                                    defaultValue={data.userCode}
                                ></TextInput>
                            )}
                            <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                                Ngày sinh
                            </Text>
                            {!edit && data.birthday ? (
                                <Text
                                    style={{
                                        height: 34,
                                        marginBottom: 14,
                                        textAlignVertical: "center",
                                    }}
                                    fontSize={14}
                                    color="#7D7D7D"
                                >
                                    {data.birthday}
                                </Text>
                            ) : (
                                <TextInput
                                    //@ts-ignore
                                    height={34}
                                    borderWidth={1}
                                    borderColor="rgba(99, 99, 99, 0.2)"
                                    borderRadius={8}
                                    width="90%"
                                    marginBottom={14}
                                    defaultValue={data.birthday}
                                ></TextInput>
                            )}
                            <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                                Phân quyền
                            </Text>
                            {!edit && data.role ? (
                                <Text
                                    style={{
                                        height: 34,
                                        marginBottom: 14,
                                        textAlignVertical: "center",
                                    }}
                                    fontSize={14}
                                    color="#7D7D7D"
                                >
                                    {data.role}
                                </Text>
                            ) : (
                                <TextInput
                                    //@ts-ignore
                                    height={34}
                                    borderWidth={1}
                                    borderColor="rgba(99, 99, 99, 0.2)"
                                    borderRadius={8}
                                    width="90%"
                                    marginBottom={14}
                                    defaultValue={data.role}
                                ></TextInput>
                            )}
                        </Box>
                        <Box width="100%">
                            <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                                Email
                            </Text>
                            {!edit && data.email ? (
                                <Text
                                    style={{
                                        height: 34,
                                        marginBottom: 14,
                                        textAlignVertical: "center",
                                    }}
                                    fontSize={14}
                                    color="#7D7D7D"
                                >
                                    {data.email}
                                </Text>
                            ) : (
                                <TextInput
                                    //@ts-ignore
                                    height={34}
                                    borderWidth={1}
                                    borderColor="rgba(99, 99, 99, 0.2)"
                                    borderRadius={8}
                                    width="95%"
                                    marginBottom={14}
                                    defaultValue={data.email}
                                ></TextInput>
                            )}
                        </Box>
                    </Box>
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
                                        Chỉnh sửa
                                    </Text>
                                </Box>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={() => setEdit(false)}>
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
            </Box>
        </Box>
    );
};
