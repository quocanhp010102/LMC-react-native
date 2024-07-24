import React, {useState} from "react";
import {Dimensions, ScrollView, TouchableOpacity} from "react-native";
import {Box, Text, TextInput} from "../../../rebass";

const {width, height} = Dimensions.get("screen");
export const ModalConfirm = (props: {
    getFile?: any;
    setModalVisible: any;
    uploadFile?: any;
    addFile?: any;
    uploadType?: string;
}) => {
    const {getFile, setModalVisible, uploadFile, addFile, uploadType} = props;
    const [nameFile, setNameFile] = useState<string>("");

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
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Box alignItems="center" mt={3}>
                        {/* <Icon name="UploadFile" size={50}></Icon> */}

                        <Text fontSize={18} color="seen" textAlign="center" mt={2}>
                            {getFile.type === "success"
                                ? uploadType === "upload"
                                    ? " Xác nhận upload file !"
                                    : "Nhập tên cho file !"
                                : "Bạn chưa chọn file"}
                        </Text>
                        <Text fontSize={18} color="seen" textAlign="center" mt={1} mb={3}>
                            {getFile.name}
                        </Text>
                    </Box>
                    {getFile.type === "success" ? (
                        <Box>
                            <Text color="seen" fontSize={15} mb={1}>
                                {" "}
                                Nhập tên file
                            </Text>
                            <TextInput
                                height={50}
                                borderWidth={1}
                                borderRadius={8}
                                borderColor="rgba(125, 125, 125, 0.3)"
                                mb={2}
                                onChangeText={(value) => {
                                    setNameFile(value);
                                }}
                            ></TextInput>
                        </Box>
                    ) : null}
                    <Box flexDirection="row">
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Box
                                borderRadius={5}
                                borderWidth={1}
                                borderColor="buttonColor"
                                mt={2}
                                mr={2}
                                width={width * 0.4}
                                alignItems="center"
                                backgroundColor="rgba(99, 99, 99, 0.1)"
                            >
                                <Text style={{padding: 10}} color="deleteColor">
                                    Hủy
                                </Text>
                            </Box>
                        </TouchableOpacity>
                        {getFile.type === "success" ? (
                            <TouchableOpacity
                                onPress={() => {
                                    uploadType === "upload"
                                        ? uploadFile(nameFile.length > 0 ? nameFile : getFile.name)
                                        : addFile(
                                            getFile,
                                            nameFile.length > 0 ? nameFile : getFile.name
                                        ),
                                        setModalVisible(false);
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
                                        Xác nhận
                                    </Text>
                                </Box>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                onPress={() => {
                                    setModalVisible(false);
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
                                        Xác nhận
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
