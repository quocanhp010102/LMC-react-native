import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { formatStringtoDate } from "../../../hooks/formatStringToDate";
import { Box, Text } from "../../../rebass";
import { generateApiService } from "../../../services/ApiService";
import { UserApi } from "../../../services/api/Keycloak/UserApi";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { DepartmentApi } from "../../../services/api/Departments/DepartmentApi";
import { Modal } from "react-native";
const { width } = Dimensions.get("screen");
interface IDataSelection {
  label: string;
  value: any;
}

const dataItem = [
  { label: "Nam", value: "0" },
  { label: "Nữ", value: "1" },
];
const dataRole = [
  { label: "Sinh viên", value: "ROLE_STUDENT" },
  { label: "Giảng viên", value: "ROLE_LECTURER" },
];
export const ModalView = (props: {
  data?: any;
  setModalVisible: any;
  setModalVisibleNotifi: any;
  setType: any;
  onRefresh: () => void;
}) => {
  const { data, setModalVisible, setModalVisibleNotifi, setType, onRefresh } =
    props;
  const responseData = useRef<any>(data);
  const [gender, setGender] = useState<IDataSelection>(dataItem[0]);
  const [role, setRole] = useState<IDataSelection>(dataRole[0]);
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [id, setID] = useState<string>("");
  const [classList, setClassList] = useState<string>("");
  const [userCode, setUserCode] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const textRefFirstName = useRef<TextInput>(null);
  const textRefEmail = useRef<TextInput>(null);
  const textRefUserCode = useRef<TextInput>(null);
  const [editor, setEditor] = useState<boolean>(false);
  const textRefYearOfBirth = useRef<TextInput>(null);
  const textRefPhoneNumber = useRef<TextInput>(null);

  const [yearOfBirth, setYearOfBirth] = useState<string>("");
  const [modalChoose, setModalChoose] = useState(false);
  const [page, setPage] = useState<number>(0);
  const [items, setItems] = useState<any>([]);
 
  const getDataDepartment = async (page: number) => {
    const dataDepartments = await generateApiService.get(
      DepartmentApi.getAllDepartments(page)
    );
    if (dataDepartments) {
      setItems([...items, ...dataDepartments.content]);
    }
  };
  const checkEmpty = (value: string) => {
    if (value?.trim()) {
      return "";
    }
    return "Không được bỏ trống";
  };

  const setErrorShow = (value: string, refCheck: RefObject<TextInput>) => {
    if (value) {
      refCheck?.current?.setNativeProps({
        text: value,
        style: {
          opacity: 1,
        },
      });
    } else {
      refCheck?.current?.setNativeProps({
        text: "",
        style: {
          opacity: 0,
        },
      });
    }
  };

  const checkUserCodeValue = (value: string) => {
    const emptyValue = checkEmpty(value);
    if (emptyValue) {
      return emptyValue;
    } else {
      return "";
    }
  };

  const validateEmailValue = (value: string) => {
    const emptyValue = checkEmpty(value);
    if (emptyValue) {
      return emptyValue;
    } else {
      if (
        !value
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          )
      ) {
        return "Không đúng định dạng";
      } else {
        return "";
      }
    }
  };

  const postNewUser = async () => {
    let [day, month, year] = yearOfBirth.split("/");
    const dateObj = new Date(+year, +month - 1, +day);
    console.log("asd" , gender);
    
    try {
      const dataPost = {
        email: email.trim(),
        fullName: firstName.trim(),
        yearOfBirth: dayjs(dateObj).format("YYYY-MM-DD"),
        gender: gender.value,
        code: userCode.trim(),
        role: role.value,
        id: userCode.trim(),
        phoneNumber : phoneNumber.trim()
      };

      const response = await generateApiService.put(
        UserApi.putUser(id),
        dataPost
      );
      if (response !== 400) {
        setModalVisible(false);
        setType("success");
        onRefresh();
        setTimeout(() => {
          setModalVisibleNotifi(true);
        }, 500);
      } else {
        setModalVisible(false);
        setType("error");
        setTimeout(() => {
          setModalVisibleNotifi(true);
        }, 500);
      }
    } catch (error) {
      setModalVisible(false);
      setType("error");
      setTimeout(() => {
        setModalVisibleNotifi(true);
      }, 500);
    }
  };

  const checkValidate = () => {
    const checkFirstName = checkEmpty(firstName);
    let checkYearOfBirth = checkEmpty(yearOfBirth);
    const checkEmail = validateEmailValue(email);
    const checkUserCode = checkUserCodeValue(userCode);
    const checkDate = dayjs(yearOfBirth, "DD/MM/YYYY", true).isValid();
    if (!checkDate && !checkYearOfBirth) {
      checkYearOfBirth = "Không đúng định dạng";
    }
    setErrorShow(checkFirstName, textRefFirstName);
    setErrorShow(checkEmail, textRefEmail);
    setErrorShow(checkUserCode, textRefUserCode);
    setErrorShow(checkYearOfBirth, textRefYearOfBirth);

    if (!checkFirstName && !checkEmail && !checkUserCode && !checkYearOfBirth) {
      postNewUser();
    }
  };

  const focusInput = (refCheck: RefObject<TextInput>) => {
    // refCheck?.current?.focus()
    refCheck?.current?.setNativeProps({
      text: "",
      style: {
        opacity: 0,
      },
    });
  };

  const getUserById = async (code: string, role: string) => {
    const response = await generateApiService.get(
      UserApi.getUserById(code, role)
    );
    if (response) {
      responseData.current = response;

      setFirstName(response.fullName);
      if (response.birthday) {
        const birthday = new Date(response.birthday);
        setYearOfBirth(dayjs(birthday).format("DD/MM/YYYY"));
      }
      if(response.classroom) {
      setClassList(response.classroom.map((res: any) => res.name).join(","))
      }
      setPhoneNumber(response.phone);
      setUserCode(response.code);
      setEmail(response.email);
      setID(response.id);
      if (response.gender) {
        console.log(response);
        dataItem.map((itemCheck: any, index: number) => {
        
          if (itemCheck.value === response.gender) {
            setGender(itemCheck);
          }
        });
      }
      if (response.role) {
        dataRole.map((itemCheck: any, index: number) => {
          if (itemCheck.value === response.role) {
            setRole(itemCheck);
          }
        });
      }
    }
  };

  useEffect(() => {
    if (data) {
      getUserById(data.userCode, data.authorities);
    }
  }, [data]);

  const LoadMoreClass = () => {
    setPage((current) => current + 1);
  };

  useEffect(() => {
    getDataDepartment(page);
  }, [page]);

  const styleTextInput = useMemo(() => {
    return {
      height: 34,
      borderWidth: 1,
      fontSize: 14,
      borderColor: editor ? "rgba(99, 99, 99, 0.2)" : "transparent",
      borderRadius: 8,
      width: "90%",
      marginBottom: 2,
      paddingHorizontal: 5,
      color: "black",
    };
  }, [editor]);

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
          maxHeight: "90%",
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
          CHI TIẾT NGƯỜI DÙNG
        </Text>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          enableAutomaticScroll
          enableOnAndroid
          // enableResetScrollToCoords
          extraHeight={150}
        >
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
              <TextInput
                style={{
                  ...styleTextInput,
                  paddingLeft: 5,
                  paddingRight: 5,
                }}
                editable={editor}
                value={firstName}
                onChangeText={(value) => {
                  setFirstName(value);
                }}
                onFocus={() => {
                  focusInput(textRefFirstName);
                }}
                keyboardType={
                  Platform.OS == "ios" ? "ascii-capable" : "visible-password"
                }
              />
              <TextInput
                ref={textRefFirstName}
                style={{ color: "red", marginBottom: 10 }}
                editable={false}
              />
              <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                Giới tính
              </Text>
              <Dropdown
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                style={[
                  styles.dropdown,
                  {
                    borderColor: editor
                      ? "rgba(99, 99, 99, 0.2)"
                      : "transparent",
                  },
                ]}
                itemTextStyle={{ fontSize: 14 }}
                iconStyle={[styles.iconStyle, { height: editor ? 20 : 0 }]}
                disable={!editor}
                data={dataItem}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Chọn giới tính"
                value={gender}
                onChange={(item) => {
                  setGender(item);
                }}
              />
              <TextInput
                style={{ color: "red", marginBottom: 10 }}
                value={""}
                editable={false}
              ></TextInput>
              <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                Số điện thoại:
              </Text>
              <TextInput
                style={{
                  ...styleTextInput,
                  paddingLeft: 5,
                  paddingRight: 5,
                }}
                keyboardType="numeric"
                value={phoneNumber}
                editable={editor}
                onChangeText={(value) => {
                  setPhoneNumber(value);
                }}
                onFocus={() => {
                  focusInput(textRefPhoneNumber);
                }}
              />
              <TextInput
                ref={textRefPhoneNumber}
                style={{ color: "red", marginBottom: 10 }}
                value={""}
                editable={false}
              />
            </Box>
            <Box width="50%">
              <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                Ngày sinh:
              </Text>
              <TextInput
                style={{
                  ...styleTextInput,
                  paddingLeft: 5,
                  paddingRight: 5,
                }}
                editable={editor}
                value={yearOfBirth}
                keyboardType="numeric"
                maxLength={10}
                onChangeText={(value) => {
                  const newValue = formatStringtoDate(value, 10);
                  setYearOfBirth(newValue);
                }}
                onFocus={() => {
                  focusInput(textRefYearOfBirth);
                }}
              />
              <TextInput
                ref={textRefYearOfBirth}
                style={{ color: "red", marginBottom: 10, marginTop: 2 }}
                editable={false}
              ></TextInput>
              <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                Phân quyền
              </Text>
              <Dropdown
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                style={[
                  styles.dropdown,
                  {
                    borderColor: editor
                      ? "rgba(99, 99, 99, 0.2)"
                      : "transparent",
                  },
                ]}
                itemTextStyle={{ fontSize: 14 }}
                iconStyle={[styles.iconStyle, { height: editor ? 20 : 0 }]}
                disable={!editor}
                data={dataRole}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Chọn quyền"
                value={role}
                onChange={(item) => {
                  setRole(item);
                }}
              />
              <TextInput
                style={{ color: "red", marginBottom: 10 }}
                editable={false}
              ></TextInput>
              <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                Mã sinh viên/ giảng viên
              </Text>
              <TextInput
                style={[
                  styleTextInput,
                  {
                    width: "95%",
                    paddingLeft: 5,
                    paddingRight: 5,
                  },
                ]}
                editable={true}
                value={userCode}
                onChangeText={(value) => {
                  setUserCode(value);
                }}
                onFocus={() => {
                  focusInput(textRefUserCode);
                }}
              ></TextInput>
            </Box>
            <Box width="100%">
              <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                Lớp học:
              </Text>
              <Text
                style={{
                  minHeight: 34,
                  width: "95%",
                  paddingLeft: 5,
                  paddingRight: 5,
                }}
                // onChangeText={(value) => {
                //   setUserCode(value);
                // }}
                // onFocus={() => {
                //   focusInput(textRefUserCode);
                // }}
              >
                {classList}
              </Text>
              {/* <TextInput
                style={{ color: "red", marginBottom: 10 }}
                editable={false}
              ></TextInput> */}
            </Box>
            <Box width="100%" mt={2}>
              <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                Email
              </Text>
              <TextInput
                editable={editor}
                style={[
                  styleTextInput,
                  { width: "95%", paddingLeft: 5, paddingRight: 5 },
                ]}
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                }}
                onFocus={() => {
                  focusInput(textRefEmail);
                }}
                keyboardType={
                  Platform.OS == "ios" ? "ascii-capable" : "visible-password"
                }
              />
              <TextInput
                ref={textRefEmail}
                style={{ color: "red", marginBottom: 10 }}
                editable={false}
              />
            </Box>
          </Box>
          <Box flexDirection="row">
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Box
                borderRadius={5}
                borderWidth={1}
                borderColor="#059DCE"
                mt={2}
                mr={2}
                width={width * 0.4}
                alignItems="center"
              >
                <Text style={{ padding: 10, color: "#059DCE" }}>Quay lại</Text>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                editor ? checkValidate() : setEditor(true);
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
                  style={{ padding: 10, color: "#ffffff", right: 0 }}
                  numberOfLines={1}
                >
                  {editor ? "Lưu" : "Chỉnh sửa"}
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>
        </KeyboardAwareScrollView>
        <Modal animationType="slide" transparent={true} visible={modalChoose}>
          {/* <ClassListModal
          data={items}
          setValue={setValue}
          value={value}
          setModalChoose={setModalChoose}
          loadMore={LoadMoreClass}
        /> */}
        </Modal>
      </Box>
    </Box>
  );
};
const styles = StyleSheet.create({
  dropdown: {
    height: 34,
    borderWidth: 1,
    borderColor: "rgba(99, 99, 99, 0.2)",
    borderRadius: 8,
    width: "90%",
    marginBottom: 2,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
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
    fontSize: 14,
    borderColor: "rgba(99, 99, 99, 0.2)",
    borderRadius: 8,
    width: "90%",
    marginBottom: 2,
  },
});
