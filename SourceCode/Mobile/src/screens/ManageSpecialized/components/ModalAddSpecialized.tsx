import {
  Dimensions,
  ScrollView,
  TouchableOpacity,
  StyleSheet ,
  TextInput,
} from "react-native";
import React, { RefObject, useRef } from "react";

import FastImageItem from "../../../components/FastImage";
import { Icon } from "../../../components/svg-icon";
import { Box, Text } from "../../../rebass";
import { Dropdown } from "react-native-element-dropdown";
import { lightColors } from "../../../themes";

interface IModalAddSpecialized {
  type: string;
  departmentName: string;
  setDepartmentName: (value: string) => void;
  pickDocument: () => void;
  file: any;
  handleEditDepartment: () => void;
  handleCreateDepartment: () => void;
  linkImage: string;
  onAddSpecialized: () => void;
  items : any
  value : any
  setValue : (item : any) => void
  setTypeProgram : (value : number) => void
}

const ModalAddSpecialized = (props: IModalAddSpecialized) => {
  const {
    type,
    departmentName,
    setDepartmentName,
    pickDocument,
    file,
    handleCreateDepartment,
    handleEditDepartment,
    onAddSpecialized,
    linkImage,
    items ,
    value ,
    setValue ,
    setTypeProgram
  } = props;
  const { height, width } = Dimensions.get("screen");

  const textRefTitle = useRef<TextInput>(null);
  const textRefFile = useRef<TextInput>(null);

  const checkEmpty = (value: string, refCheck: RefObject<TextInput>) => {
    if (value) {
        focusInput(refCheck)
      
      return true;
    }
    refCheck?.current?.setNativeProps({
      style: {
        opacity: 1,
        height: null,
      },
    });

    return false;
  };

   const checkValidate = () => {
     const checkTitle = checkEmpty(departmentName, textRefTitle);
     const checkFile = checkEmpty(file.uri || linkImage, textRefFile);

     if (checkTitle && checkFile) {
       type === "edit" ? handleEditDepartment() : handleCreateDepartment();
     }
   };

  const focusInput = (refCheck: RefObject<TextInput>) => {
    refCheck?.current?.setNativeProps({
      style: {
        opacity: 0,
        height: 0,
      },
    });
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
          height: 450,
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
        <Text fontSize={16} color="textColor" fontWeight="bold" mt={4}>
          {type === "edit" ? "SỬA CHUYÊN NGÀNH" : "TẠO MỚI CHUYÊN NGÀNH"}
        </Text>
        <ScrollView
          style={{ width: "100%" }}
          showsVerticalScrollIndicator={false}
        >
          <Box width="100% " mt={2}>
            <Text color={'#1C7988'}  fontSize={'16'} mt={1} >Tên chuyên ngành:</Text>
            <TextInput
              style={{
                width: " 100%",
                height: 50,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: lightColors.borderColor,
                fontSize: 16,
                marginTop : 5 ,
                paddingHorizontal : 5 
              }}
              onFocus={() => { focusInput(textRefTitle)}}
              value={departmentName}
              onChangeText={(value: string) => setDepartmentName(value)}
            ></TextInput>
            <TextInput
              ref={textRefTitle}
              style={{ color: "red", marginBottom: 20 ,  marginTop : 2, height : 0 , opacity : 0 }}
              value="Không được bỏ trống"
              editable={false}
            ></TextInput>
              <Text color={'#1C7988'}  fontSize={'16'}  >Chương trình đào tạo:</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={items}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Chọn quyền"
              value={value}
              onChange={(item) => {
                setTypeProgram(item.value);
                setValue(item);
              }}
            />

              <Text color={'#1C7988'}  fontSize={'16'}  mb={2} >Avatar chuyên ngành:</Text>
            <TouchableOpacity onPress={() => 
                {   focusInput(textRefFile)
                    pickDocument()}}>
              <Box
                borderRadius={5}
                borderWidth={1}
                borderColor="#56C8C8"
                mr={2}
                width={"100%"}
                alignItems="center"
                height={height * 0.1}
                flexDirection="row"
                justifyContent="center"
              >
                <Icon size={24} name="UploadFile" color={'#00A8B5'}></Icon>
                <Text
                  style={{
                    padding: 10,
                    fontSize: 16,
                  }}
                  fontWeight="bold"
                  color="#00A8B5"
                >
                  Tải lên
                </Text>
              </Box>
            </TouchableOpacity>
            <Box marginTop={1}>
              <TextInput
                ref={textRefFile}
                style={{ color: "red", marginBottom: 10 , marginTop : 2, height : 0 , opacity : 0 }}
                value="Không được bỏ trống"
                editable={false}
              ></TextInput>
              {file && type != "edit" ? (
                <FastImageItem
                  style={{ height: 150, width: "100%" }}
                  source={{ uri: file.uri }}
                ></FastImageItem>
              ) : linkImage ? (
                <FastImageItem
                  style={{ height: 150, width: "100%" }}
                  source={{ uri: file.uri ||  linkImage }}
                ></FastImageItem>
              ) : null}
            </Box>
          </Box>
        </ScrollView>
        <Box flexDirection="row">
          <TouchableOpacity
            onPress={() => {
              onAddSpecialized();
            }}
          >
            <Box
              borderRadius={5}
              borderWidth={1}
              borderColor="#CC0000"
              mt={2}
              mr={2}
              width={width * 0.4}
              alignItems="center"
            >
              <Text style={{ padding: 10, color: "#CC0000" }}>Hủy</Text>
            </Box>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
                checkValidate()
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
                style={{ padding: 10, color: "#ffffff", right: 0 }}
                numberOfLines={1}
              >
                {type === "edit" ? "Sửa chuyên ngành" : "Tạo chuyên ngành"}
              </Text>
            </Box>
          </TouchableOpacity>
        </Box>
      </Box>
    </Box>

  );
};

export default ModalAddSpecialized;
const styles = StyleSheet.create({
    dropdown: {
      height: 50,
      borderWidth: 1,
      borderColor: "rgba(99, 99, 99, 0.2)",
      borderRadius: 8,
      width: "100%",
      marginBottom: 20,
      marginTop : 5
    },
    icon: {
      marginRight: 5,
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: 16,
      marginLeft: 2,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 0,
    },
    textInputStyle: {
      height: 34,
      borderWidth: 1,
      borderColor: "rgba(99, 99, 99, 0.2)",
      borderRadius: 8,
      width: "90%",
      marginBottom: 2,
    },
  });
  