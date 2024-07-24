import { RefObject, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { formatStringtoDate } from "../../../hooks/formatStringToDate";
import { Box, Text } from "../../../rebass";
import { generateApiService } from "../../../services/ApiService";
import { UserApi } from "../../../services/api/Keycloak/UserApi";
import { Modal } from "react-native";
import ClassListModal from "./ClassListModal";
import { DepartmentApi } from "../../../services/api/Departments/DepartmentApi";
import { Icon } from "../../../components/svg-icon";
import { ClassApi } from "../../../services/api/Class/ClassApi";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
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
export const ModalAdd = (props: {
  data?: any;
  setModalVisible: any;
  setModalVisibleNotifi: any;
  setType: any;
  onRefresh: () => void;
}) => {
  const { setModalVisible, setModalVisibleNotifi, setType, onRefresh } = props;
  const [gender, setGender] = useState<IDataSelection>(dataItem[0]);
  const [role, setRole] = useState<IDataSelection>(dataRole[0]);
  const [email, setEmail] = useState<string>("");
  const [queryInput, setQueryInput] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [yearOfBirth, setYearOfBirth] = useState<string>("");
  const [modalChoose, setModalChoose] = useState(false);
  const textRefFirstName = useRef<TextInput>(null);
  const textRefCode = useRef<TextInput>(null);
  const textRefEmail = useRef<TextInput>(null);
  const textRefLogin = useRef<TextInput>(null);
  const textRefPhoneNumber = useRef<TextInput>(null);
  const textRefYearOfBirth = useRef<TextInput>(null);
  const textRefPassword = useRef<TextInput>(null);
  const textRefClass = useRef<TextInput>(null);
  const [page, setPage] = useState<number>(0);
  const [items, setItems] = useState<any>([]);
  const [value, setValue] = useState<any>({
    value: "",
    label: "",
  });
  const getDataDepartment = async (page: number) => {
    const dataDepartments = await generateApiService.get(
      ClassApi.getAllClass(page, 20)
    );
    if (dataDepartments) {
      setItems([...items, ...dataDepartments.content]);
    }
  };
  const checkEmpty = (value: string) => {
    if (value && value.toString()?.trim()) {
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

  const checkPhoneNumberValue = (value: string) => {
    const emptyValue = checkEmpty(value);
    if (emptyValue) {
      return emptyValue;
    } else {
      if (
        !value.match(/^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/im)
      ) {
        return "Không đúng định dạng";
      } else {
        return "";
      }
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
    try {
      let [day, month, year] = yearOfBirth.split("/");
      const dateObj = new Date(+year, +month - 1, +day);
      const dataPost = {
        email: email.trim(),
        code: code.trim(),
        login: login.trim(),
        password: password.trim(),
        fullName: firstName.trim(),
        yearOfBirth: dayjs(dateObj).format("YYYY-MM-DD"),
        gender: gender.value,
        phoneNumber: phoneNumber.trim(),
        role: role.value,
        // classroom: { id: value.value },
      };
      const response = await generateApiService
        .post(UserApi.postStudent(), dataPost)
        

      if (response) {
        setModalVisible(false);
        setType("success");
        onRefresh();
        setTimeout(() => {
          setModalVisibleNotifi(true);
        }, 500);
      } else {
        setType("warning");
      }
    } catch (error: any) {      
      switch (error.title) {
        case 'CODE_INVALID':
          setErrorShow("Mã đã tồn tại!", textRefCode);
          break;
          case 'LOGIN_INVALID':
            setErrorShow("Tên tài khoản đã tồn tại!", textRefLogin);
            break;
        default:
          setModalVisible(false);
          setType("error");
          setTimeout(() => {
            setModalVisibleNotifi(true);
          }, 500);
          break;
      }
    }
  };

  const checkValidate = () => {
    const checkFirstName = checkEmpty(firstName);
    const checkCode = checkEmpty(code);
    const checkEmail = validateEmailValue(email);
    const checkLogin = checkEmpty(login);
    const checkPassword = checkEmpty(password);
    let checkYearOfBirth = checkEmpty(yearOfBirth);
    const checkDate = dayjs(yearOfBirth, "DD/MM/YYYY", true).isValid();
    if (!checkDate && !checkYearOfBirth) {
      checkYearOfBirth = "Không đúng định dạng";
    }
    // const checkClass = checkEmpty(value.value);
    const checkPhoneNumber = checkPhoneNumberValue(phoneNumber);
    setErrorShow(checkFirstName, textRefFirstName);
    setErrorShow(checkCode, textRefCode);
    setErrorShow(checkEmail, textRefEmail);
    setErrorShow(checkLogin, textRefLogin);
    setErrorShow(checkPassword, textRefPassword);
    // setErrorShow(checkClass, textRefClass);
    setErrorShow(checkYearOfBirth, textRefYearOfBirth);
    setErrorShow(checkPhoneNumber, textRefPhoneNumber);
    if (
      !checkFirstName &&
      !checkEmail &&
      !checkLogin &&
      !checkPassword &&
      !checkYearOfBirth &&
      !checkPhoneNumber &&
      !checkCode
    ) {
      postNewUser();
    }
  };

  const focusInput = (refCheck: RefObject<TextInput>) => {
    refCheck?.current?.setNativeProps({
      text: "",
      style: {
        opacity: 0,
      },
    });
  };

  const LoadMoreClass = () => {
    setPage((current) => current + 1);
  };

  useEffect(() => {
    getDataDepartment(page);
  }, [page]);

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
          THÊM NGƯỜI DÙNG
        </Text>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          enableAutomaticScroll
          enableOnAndroid
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
                  ...styles.textInputStyle,
                  paddingLeft: 5,
                  paddingRight: 5,
                }}
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
              ></TextInput>
              <TextInput
                ref={textRefFirstName}
                style={{ color: "red", marginBottom: 10 }}
                editable={false}
              />
              <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                Giới tính:
              </Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                itemTextStyle={{ fontSize: 14 }}
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
              />
              <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                Số điện thoại:
              </Text>
              <TextInput
                style={{
                  ...styles.textInputStyle,
                  paddingLeft: 5,
                  paddingRight: 5,
                }}
                keyboardType="numeric"
                value={phoneNumber}
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
                Mã sinh viên/ giảng viên
              </Text>
              <TextInput
                style={{
                  ...styles.textInputStyle,
                  paddingLeft: 5,
                  paddingRight: 5,
                }}
                value={code}
                onChangeText={(value) => {
                  setCode(value);
                }}
                onFocus={() => {
                  focusInput(textRefCode);
                }}
                keyboardType={
                  Platform.OS == "ios" ? "ascii-capable" : "visible-password"
                }
              />
              <TextInput
                ref={textRefCode}
                style={{ color: "red", marginBottom: 10 }}
                value={""}
                editable={false}
              />

              <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                Phân quyền:
              </Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                itemTextStyle={{ fontSize: 14 }}
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
              />
              <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                Ngày sinh:
              </Text>
              <TextInput
                style={{
                  ...styles.textInputStyle,
                  paddingLeft: 5,
                  paddingRight: 5,
                }}
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
              />
            </Box>
            <Box width="100%">
              {/* <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                Lớp học:
              </Text>
              <TouchableOpacity
                onPress={() => setModalChoose(true)}
                style={{ width: "95%" }}
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
                  <Text>{value?.label || "Chọn lớp học"}</Text>
                  <Icon name="moreMember"></Icon>
                </Box>
              </TouchableOpacity> */}
              {/* <TextInput
                ref={textRefClass}
                style={{ color: "red", marginBottom: 10 }}
                editable={false}
              ></TextInput> */}
              <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                Email:
              </Text>
              <TextInput
                style={[
                  styles.textInputStyle,
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
              ></TextInput>

              <TextInput
                ref={textRefEmail}
                style={{ color: "red", marginBottom: 10 }}
                editable={false}
              ></TextInput>
            </Box>
            <Box width={"50%"}>
              <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                Tài khoản:
              </Text>
              <TextInput
                style={{
                  ...styles.textInputStyle,
                  paddingLeft: 5,
                  paddingRight: 5,
                }}
                value={login}
                onChangeText={(value) => {
                  setLogin(value);
                }}
                onFocus={() => {
                  focusInput(textRefLogin);
                }}
                keyboardType={
                  Platform.OS == "ios" ? "ascii-capable" : "visible-password"
                }
              ></TextInput>
              <TextInput
                ref={textRefLogin}
                style={{ color: "red", marginBottom: 10 }}
                editable={false}
              ></TextInput>
            </Box>
            <Box width={"50%"}>
              <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                Mật khẩu:
              </Text>
              <TextInput
                style={{
                  ...styles.textInputStyle,
                  paddingLeft: 5,
                  paddingRight: 5,
                }}
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                }}
                onFocus={() => {
                  focusInput(textRefPassword);
                }}
                keyboardType={
                  Platform.OS == "ios" ? "ascii-capable" : "visible-password"
                }
              ></TextInput>
              <TextInput
                ref={textRefPassword}
                style={{ color: "red", marginBottom: 10 }}
                editable={false}
              ></TextInput>
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
                checkValidate();
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
                  Lưu
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>
        </KeyboardAwareScrollView>
      </Box>
      <Modal animationType="slide" transparent={true} visible={modalChoose}>
        <ClassListModal
          queryInput={queryInput}
          setQueryInput={setQueryInput}
          data={items}
          setValue={setValue}
          value={value}
          setModalChoose={setModalChoose}
          loadMore={LoadMoreClass}
        />
      </Modal>
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
    fontSize: 14,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 14,
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
    fontSize: 14,
    borderWidth: 1,
    borderColor: "rgba(99, 99, 99, 0.2)",
    borderRadius: 8,
    width: "90%",
    marginBottom: 2,
    paddingHorizontal: 5,
  },
});
