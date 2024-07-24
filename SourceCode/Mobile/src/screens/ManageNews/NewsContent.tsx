import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet,
  Text,
  TouchableOpacity, TouchableWithoutFeedback, View
} from "react-native";
import {
  FONT_SIZE,
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
import { AndroidLayerType } from "react-native-webview/lib/WebViewTypes";
import { addNewsContent } from "../../Redux/NewsContent";
import { Header, NotificationIcon } from "../../components/Header";
import { useAppDispatch } from "../../hooks/ReduxHook";
import { useGoBack } from "../../platform/go-back";
import { Box } from "../../rebass";
import { generateApiService } from "../../services/ApiService";
import { UploadFileApi } from "../../services/api/UploadFile/UploadFileApi";
import { Dropdown } from "react-native-element-dropdown";
const dataItem = [
  { label: "10", value: "1" },
  { label: "13", value: "2" },
  { label: "16", value: "3" },
  { label: "18", value: "4" },
  { label: "24", value: "5" },
  { label: "32", value: "6" },
  { label: "48", value: "7" },
];

interface RefLinkModal {
  setModalVisible: (visile: boolean) => void;
}

export default function CreateNews(props : any) {
  const { height } = Dimensions.get("window");
  const [data, setData] = useState("")
  const [fontSizeValue, setFontSizeValue] = useState(dataItem[1])
  let HEIGHT: any = null;
  const dispatch = useAppDispatch();
  const richText = React.useRef<RichEditor>(null);
  const linkModal = useRef<RefLinkModal>();
  const [contentValue, setContent] = useState("");
  const [androidLayerType, setAndroidLayerType] = useState<AndroidLayerType>("software")
  const goBack = useGoBack();

  const scrollViewRef = useRef<any>();


  const htmlIcon = require("../../../assets/html.png");

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

  let onPressAddImage = async (imageData: any) => {
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

  let handleInsertHTML = useCallback(() => {
    // this.richText.current?.insertHTML(
    //     `<span onclick="alert(2)" style="c olor: blue; padding:0 10px;" contenteditable="false">HTML</span>`,
    // );
    richText.current?.insertHTML(
      `<div style="padding:10px 0;" contentEditable="false">
               "<p style=\"text-align:justify;\">\n\t<span style=\"font-family:'times new roman', times, serif;\"><span style=\"color:rgb(33,37,41);font-size:16px;text-align:justify;\">Tối 4/7, Thúy Vân tiếp tục công bố key visual của dự án mới</span><em style=\"color:rgb(33,37,41);font-family:'Nunito-Regular';font-size:16px;text-align:justify;\"> 'Trái tim yêu thương'. </em><span style=\"color:rgb(33,37,41);font-size:16px;text-align:justify;\">Trước đó, ngay khi teaser dự án được giới thiệu, lượng người theo dõi trang fanpage của nàng hậu đã có dấu hiệu tăng đột biến.</span></span></p>\n<p style=\"text-align:justify;\">\n\t<span style=\"font-family:'times new roman', times, serif;\"><span style=\"color:rgb(33,37,41);font-size:16px;text-align:justify;\">Trong bộ ảnh mới nhất, cô tạo dáng đầy quyền lực trên một bông tulip tím khổng lồ giữa không gian vô cực. Á hậu 3 Hoa hậu Quốc tế 2015 diện hai chiếc đầm từ NTK Võ Thanh Can và Lê Thanh Hoà, kết hợp điểm nhấn là chiếc vương miện màu tím đến từ NTK Micae Vũ. Trước đó, trong đoạn teaser ngắn, người đẹp diện thiết kế bodysuit trắng trơn của Lê Thanh Hòa. </span></span></p>\n<p style=\"text-align:justify;\">\n\t<span style=\"font-family:'times new roman', times, serif;\"><span style=\"color:rgb(33,37,41);font-size:16px;text-align:justify;\"><img alt=\"\" src=\"http://imedia.imuzik.com.vn/media1/ckfinder/images/thv1.jpg\" style=\"width:642px;height:428px;\" /></span></span></p>\n<p style=\"text-align:justify;\">\n\t<span style=\"font-family:'times new roman', times, serif;\"><span style=\"color:rgb(33,37,41);font-size:16px;text-align:justify;\">Trước dự án</span><em style=\"color:rgb(33,37,41);font-family:'Nunito-Regular';font-size:16px;text-align:justify;\"> 'Trái tim yêu thương',</em><span style=\"color:rgb(33,37,41);font-size:16px;text-align:justify;\"> nữ giám khảo Miss Fitness từng cho ra mắt 2 sản phẩm là MV</span><em style=\"color:rgb(33,37,41);font-family:'Nunito-Regular';font-size:16px;text-align:justify;\"> 'My Vietnam'</em><span style=\"color:rgb(33,37,41);font-size:16px;text-align:justify;\"> khi tham gia cuộc thi Hoa hậu Quốc tế 2015 và</span><em style=\"color:rgb(33,37,41);font-family:'Nunito-Regular';font-size:16px;text-align:justify;\"> 'Con sẽ không về' </em><span style=\"color:rgb(33,37,41);font-size:16px;text-align:justify;\">để an ủi những khán giả không thể về quê vì ảnh hưởng của đại dịch Covid-19. </span></span></p>\n<p style=\"text-align:justify;\">\n\t<span style=\"font-family:'times new roman', times, serif;\"><em style=\"color:rgb(33,37,41);font-family:'Nunito-Regular';font-size:16px;text-align:justify;\">'Trái tim yêu thương'</em><span style=\"color:rgb(33,37,41);font-size:16px;text-align:justify;\"> sẽ được ra mắt tối 6/7 trên Youtube của Thúy Vân. Chiều cùng ngày, người đẹp cũng sẽ tổ chức họp báo để thông tin với truyền thông về dự án debut mà cô rất tâm huyết. </span></span></p>\n<p style=\"text-align:justify;\">\n\t<span style=\"font-family:'times new roman', times, serif;\"><span style=\"color:rgb(33,37,41);font-size:16px;text-align:justify;\"><img alt=\"\" src=\"http://imedia.imuzik.com.vn/media1/ckfinder/images/thv2.jpg\" style=\"width:642px;height:963px;\" /></span></span></p>\n<p style=\"text-align:justify;\">\n\t<span style=\"font-family:'times new roman', times, serif;\"><span style=\"color:rgb(33,37,41);font-size:16px;text-align:justify;\">Phạm Hồng Thúy Vân sinh năm 1993, giành ngôi Á khôi 1 tại cuộc thi Hoa khôi Áo dài Việt Nam 2014. Năm 2015, cô thi Hoa hậu Quốc tế và trở thành Á hậu 3. Năm 2019, cô tham gia Hoa hậu Hoàn vũ Việt Nam, giành danh hiệu Á hậu 2. Năm 2020, cô kết hôn và sinh con trai đầu lòng. Sau khi làm mẹ, á hậu vẫn hoạt động showbiz với vai trò MC, diễn giả… bên cạnh là CEO công ty truyền thông do cô sáng lập. Thúy Vân đang làm giám khảo cuộc thi Miss Fitness cùng Hoa hậu Kỳ Duyên và Siêu mẫu Minh Tú.  </span></span></p>\n<p style=\"text-align:justify;\">\n\t </p>\n<p style=\"text-align:justify;\">\n\t<span style=\"font-family:'times new roman', times, serif;\"><span style=\"color:rgb(15,15,15);font-size:16px;\">Theo PV/vtc.vn</span></span></p>"
            </div>`
    );
  }, []);
  let handleInsertVideo = useCallback(() => {
    richText.current?.insertVideo(
      "https://mdn.github.io/learning-area/html/multimedia-and-embedding/video-and-audio-content/rabbit320.mp4",
      "width: 100%;"
    );
  }, []);
  const NewsSave = () => {
    dispatch(
        //@ts-ignore
      addNewsContent({
        id: "1",
        content: contentValue,
      })
    );
  };
  const NewsDelete = () => {
    dispatch(
        //@ts-ignore
      addNewsContent({
        id: "1",
        content: "",
      })
    );
  };

  const handleCursorPosition = useCallback((scrollY: number) => {
    // Positioning scroll bar
    scrollViewRef.current!.scrollTo({ y: scrollY - 30, animated: true });
  }, []);

  const openModalFontSize = useCallback(() => {
    linkModal.current?.setModalVisible(true);
  }, []);

  const handleBlur = useCallback(() => {
    HEIGHT = height * 0.9;
 
  }, []);



  const handleFontSize = useCallback((value: number) => {
    console.log("value", value);

    richText.current?.setFontSize(value as FONT_SIZE);
  }, []);

  useEffect(() => {
    if (props?.route?.params?.descriptionText) {
      setData(props?.route?.params?.descriptionText);
      setTimeout(() => {
        setAndroidLayerType("hardware");
      }, 500);
    }
  }, [props?.route?.params?.descriptionText]);


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
          <Header title="Tạo nội dung" search leftButton="back">
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
              insertHTML={handleInsertHTML}
              insertVideo={handleInsertVideo}
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
                      //@ts-ignore
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
              // fontSize={openModalFontSize}
              style={styles.richTextToolbarStyle}
            />
          </View>

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
                      ref={richText}
                  initialFocus={false}
                  firstFocusEnd={false}
                  disabled={false}
                  androidLayerType={androidLayerType}
               
                  onChange={(value) => {
                    setContent(value);
                  }}
                  style={{ ...styles.rich }}
                  useContainer={false}
                  enterKeyHint={"done"}
                  placeholder={"Nhập nội dung tin tức"}
                  initialContentHTML={data}
                  onBlur={handleBlur}
                  onCursorPosition={handleCursorPosition}
                  pasteAsPlainText={true}
                />
            </TouchableWithoutFeedback>
          </ScrollView>
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
                minWidth={120}
                alignItems="center"
              >
                <Text
                  style={{
                    padding: 10,
                    fontSize: 18,
                    color: "#CC0000",
                  }}
                >
                  Hủy
                </Text>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                NewsSave(), goBack();
              }}
            >
              <Box
                borderRadius={5}
                borderWidth={1}
                borderColor="rgba(125, 125, 125, 0.3)"
                mt={2}
                backgroundColor="buttonColor"
                minWidth={120}
                alignItems="center"
              >
                <Text
                  style={{
                    padding: 10,
                    color: "#ffffff",
                    right: 0,
                    fontWeight: "500",
                    fontSize: 18,
                  }}
                >
                  Xác nhận
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>
          <Box height={30}></Box>
        </Box>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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