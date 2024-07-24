import {
  useNavigation
} from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import {
  FONT_SIZE,
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
import { AndroidLayerType } from "react-native-webview/lib/WebViewTypes";
import { Header, NotificationIcon } from "../../components/Header";
import { useGoBack } from "../../platform/go-back";
import { Box, Text } from "../../rebass";
import { generateApiService } from "../../services/ApiService";
import { UploadFileApi } from "../../services/api/UploadFile/UploadFileApi";
import { TextInput } from "react-native";

const dataItem = [
  { label: "10", value: "1" },
  { label: "13", value: "2" },
  { label: "16", value: "3" },
  { label: "18", value: "4" },
  { label: "24", value: "5" },
  { label: "32", value: "6" },
  { label: "48", value: "7" },
];

const CreateLesson = (props: { id?: string, route?: any }) => {
  const data = props.route.params.descriptionText || "";
  const { height } = Dimensions.get("window");
  let HEIGHT: any = null;
  // const [data, setData] = useState();
  const [fontSizeValue, setFontSizeValue] = useState(dataItem[1])
  const typeCreate = props.route.params.typeCreate;
  const [androidLayerType, setAndroidLayerType] = useState<AndroidLayerType>("software")
  const richText = React.useRef<RichEditor>(null);
  const [contentValue, setContent] = useState("");
  const goBack = useGoBack();
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);

  const contentRef = useRef(data);

  // editor change data
  const handleChange = useCallback((html: string) => {
    // save html to content ref;
    contentRef.current = html;
  }, []);


  const goBackEssay = () => {
    navigation.navigate("/tao-bai-thi-tu-luan", { newQuestion: contentRef.current });
  };
  const goBackLesson = () => {
    navigation.navigate("/tao-bai-giang", { dataContent: contentRef.current });
  };

  const openGalleryClickProfile = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      let localUri = result.assets[0].uri;
      let filename = localUri.split("/").pop();
      let match = /\.(\w+)$/.exec(filename ?? "");
      let type = match ? `image/${match[1]}` : `image`;
      if (type === `image/jpg`) {
        type = `image/jpeg`;
      }
      const imageData = { uri: localUri, name: filename, type };
      onPressAddImage(imageData);
    }
  }

  const onPressAddImage = async (imageData: any) => {
    // insert URLư
    const data = new FormData();
    data.append("file", {
      ...imageData,
      uri:
        Platform.OS === "android"
          ? imageData.uri
          : imageData.uri.replace("file://", ""),
      name: imageData.name,
      type: imageData.mimeType, // it may be necessary in Android.
    });
    let res = await generateApiService.postImage(
      UploadFileApi.UploadFile(),
      data
    );
    richText.current?.insertImage(
      `${res}`,
      'background: gray; width: "100%"; height: "100%"',
    );
    richText.current?.insertText("\n")
  }
  const handleFontSize = useCallback((value: number) => {

    richText.current?.setFontSize(value as FONT_SIZE);
  }, []);

  useEffect(() => {
    // setData(props.route.params.descriptionText ?? "")
    setTimeout(() => {
      setAndroidLayerType("hardware");
    }, 500);
  }, [props]);

  const editorInitializedCallback = useCallback(() => {
    // richText.current.registerToolbar(function (items) {
    // console.log('Toolbar click, selected items (insert end callback):', items);
    // });
  }, []);

  // editor height change
  const handleHeightChange = useCallback((height: number) => {
    console.log('editor height change:', height);
  }, []);
  const handlePaste = useCallback((data: any) => {
    console.log('Paste:', data);
  }, []);

  // @deprecated Android keyCode 229
  const handleKeyUp = useCallback(() => {
    // console.log('KeyUp:', data);
  }, []);

  // @deprecated Android keyCode 229
  const handleKeyDown = useCallback(() => {
    // console.log('KeyDown:', data);
  }, []);

  const handleInput = useCallback(() => {
    // console.log(inputType, data)
  }, []);

  const handleFocus = useCallback(() => {
    HEIGHT = height * 0.6;
    console.log('editor focus');
  }, []);

  const handleBlur = useCallback(() => {
    HEIGHT = height * 0.9;
    console.log('editor blur');
  }, []);

  const handleCursorPosition = useCallback((scrollY: number) => {
    // Positioning scroll bar
    console.log("scrollY" ,scrollY);
    
    // scrollViewRef.current!.scrollTo({ y: scrollY - 30, animated: true });
  }, []);

  const onKeyHide = useCallback(() => { }, []);

  const onKeyShow = useCallback(() => {
    TextInput.State.currentlyFocusedInput();
  }, []);

  useEffect(() => {
    let listener = [
      // Appearance.addChangeListener(themeChange),
      Keyboard.addListener('keyboardDidShow', onKeyShow),
      Keyboard.addListener('keyboardDidHide', onKeyHide),
    ];
    return () => {
      listener.forEach(it => it.remove());
    };
  }, [onKeyHide, onKeyShow]);

  return (
    <KeyboardAvoidingView
      behavior={"padding"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      enabled={Platform.OS === "ios"}
    >
      <TouchableWithoutFeedback
        onPress={() => richText.current?.dismissKeyboard()}
      >
        <Box bg="defaultBackground" position="relative" height="100%">
          <Box height="100%" mt={2}>
            <Header
              title={
                typeCreate == "essayTest" ? "Tạo câu hỏi" : "Tạo bài giảng"
              }
              search
              leftButton="back"
            >
              <NotificationIcon />
            </Header>
            <Box height={1} bg="#636363" opacity={0.3} mt={2} />
            <View style={styles.container}>
              <RichToolbar
                selectedIconTint={"#2095F2"}
                disabledIconTint={"#bfbfbf"}
                editor={richText}
                iconTint="#312921"
                onPressAddImage={openGalleryClickProfile}
                // insertHTML={handleInsertHTML}
                // insertVideo={handleInsertVideo}
                actions={[
                  actions.keyboard,
                  actions.fontSize,
                  actions.setBold,
                  actions.setItalic,
                  actions.insertImage,
                  // actions.insertVideo,
                  actions.insertBulletsList,
                  actions.insertOrderedList,
                  actions.insertLink,
                  actions.setStrikethrough,
                  actions.setUnderline,
                  // actions.removeFormat,
                  actions.undo,
                  actions.redo,
                  actions.alignLeft,
                  actions.alignRight,
                  actions.alignCenter,
                  actions.heading1,
                  actions.heading2,
                  actions.heading3,
                  // "insertHTML",
                ]}
                iconMap={{
                  [actions.fontSize]: ({ tintColor }: any) => (
                    <Dropdown
                      style={styles.dropdown}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      iconStyle={styles.iconStyle}
                      renderItem={(
                        item: {
                          label: string;
                          value: string;
                        },
                        selected: boolean
                      ) => {
                        return (
                          <Box
                            height={30}
                            justifyContent={"center"}
                            alignItems={"center"}
                          >
                            <Text>{item.label}</Text>
                          </Box>
                        );
                      }}
                      data={dataItem}
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder="Chọn font size"
                      value={fontSizeValue}
                      onChange={(item) => {
                        setFontSizeValue(item);

                        handleFontSize(Number(item.value));
                      }}
                    />
                  ),
                  [actions.heading1]: ({ tintColor }: any) => (
                    <Text style={[{ color: tintColor }]}>H1</Text>
                  ),
                  [actions.heading2]: ({ tintColor }: any) => (
                    <Text style={[{ color: tintColor }]}>H2</Text>
                  ),
                  [actions.heading3]: ({ tintColor }: any) => (
                    <Text style={[{ color: tintColor }]}>H3</Text>
                  ),
                  // insertHTML: htmlIcon,
                }}
                style={styles.richTextToolbarStyle}
              />
            </View>
            {/* <Box> */}
            <ScrollView
              contentContainerStyle={{ flex: 1 }}
              ref={scrollViewRef}
              onContentSizeChange={() => {
                scrollViewRef?.current?.scrollToEnd({ animated: false });
              }}
              // onTouchEnd={(e) => {
              //   if (!data) {
              //     richText.current?.focusContentEditor();
              //   }
              // }}
              keyboardDismissMode={"none"}
              nestedScrollEnabled={true}
              // scrollEventThrottle={20}
            >
              <TouchableWithoutFeedback onPress={() => {}}>
                <RichEditor
                  // initialFocus={true}
                  initialFocus={false}
                  firstFocusEnd={false}
                  disabled={false}
                  ref={richText}
                  style={{ ...styles.rich }}
                  useContainer={false}
                  // initialHeight={400}
                  enterKeyHint={"done"}
                  // containerStyle={{borderRadius: 24}}
                  placeholder={"Nhập nội dung bài giảng"}
                  initialContentHTML={data}
                  editorInitializedCallback={editorInitializedCallback}
                  onChange={handleChange}
                  onHeightChange={handleHeightChange}
                  onPaste={handlePaste}
                  onKeyUp={handleKeyUp}
                  onKeyDown={handleKeyDown}
                  onInput={handleInput}
                  // onMessage={handleMessage}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onCursorPosition={handleCursorPosition}
                  pasteAsPlainText={true}
                />
              </TouchableWithoutFeedback>
            </ScrollView>
            {/* </Box> */}
            <Box height={1} bg="#636363" opacity={0.3} mt={2} />
            <Box flexDirection="row" justifyContent="center">
              <TouchableOpacity
                onPress={() => {
                  goBack();
                }}
              >
                <Box
                  borderRadius={5}
                  borderWidth={1}
                  borderColor="buttonColor"
                  mt={2}
                  mr={2}
                >
                  <Text
                    style={{ padding: 10, minWidth: 100, textAlign: "center" }}
                    color="deleteColor"
                  >
                    Hủy
                  </Text>
                </Box>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (typeCreate == "essayTest") {
                    goBackEssay();
                  } else {
                    goBackLesson();
                  }
                }}
              >
                <Box
                  borderRadius={5}
                  borderWidth={1}
                  borderColor="rgba(125, 125, 125, 0.3)"
                  mt={2}
                  backgroundColor="buttonColor"
                >
                  <Text
                    style={{
                      padding: 10,
                      color: "#ffffff",
                      right: 0,
                      minWidth: 100,
                      textAlign: "center",
                    }}
                  >
                    Xác nhận
                  </Text>
                </Box>
              </TouchableOpacity>
            </Box>
            <Box height={30}></Box>
          </Box>
        </Box>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
export default CreateLesson;
const styles =  StyleSheet.create({
  container: {

  },

  headerStyle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#312921",
    marginBottom: 10,
  },

  htmlBoxStyle: {
    height: 200,
    width: 330,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
  },

  rich: {
   
    height: "100%",

    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#e3e3e3',
  },

  richTextContainer: {
    // display: "flex",
    // flexDirection: "column-reverse",
    // width: "100%",
    // marginBottom: 10,
  },

  richTextEditorStyle: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1,
    borderColor: "#c6c3b3",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    fontSize: 20,
  },
  richTextToolbarStyle: {
    backgroundColor: "#fff",
    borderColor: "#c6c3b3",
    borderWidth: 1,
  },
  errorTextStyle: {
    color: "#FF0000",
    marginBottom: 10,
  },

  saveButtonStyle: {
    backgroundColor: "#c6c3b3",
    borderWidth: 1,
    borderColor: "#c6c3b3",
    borderRadius: 10,
    padding: 10,
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    fontSize: 20,
  },

  textButtonStyle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#312921",
  },
  dropdown: {

    width: 38,
    marginLeft: 2,

  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    marginLeft: -1
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