import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, ScrollView, Image } from "react-native";
import WebView from "react-native-webview";
import { Header, NotificationIcon } from "../../components/Header";
import { Box, Text } from "../../rebass";
import RenderHtml from "react-native-render-html";
import { NewsApi } from "../../services/api/News/NewsApi";
import { generateApiService } from "../../services/ApiService";
import { Devider } from "../../components/Devider";
import ButtonBack from "../../components/ButtonBack";
import { FastImage } from "components-base";

const { width, height } = Dimensions.get("screen");
export interface DisplayNew {
  id: number;
  news_content?: string;
  news_created_date?: string;
  news_description?: string;
  news_image?: string;
  news_isDisplay?: string;
  news_title?: string;
}
const DisplayNew = React.memo(({ route } : any) => {
  const { id } = route.params;
  const [displayNews, setDisplayNews] = useState<DisplayNew>();
  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const [sizeHeightImage, setSizeImage] = useState<any>();
  const getDisplayNews = useCallback(async (id: number) => {
    const dataDisplayNews = await generateApiService.get(
      NewsApi.getNewById(id)
    );
    if (dataDisplayNews) {
 
      
      setDisplayNews(dataDisplayNews);
      Image.getSize(
        dataDisplayNews.news_image,
        (widthImage, heightImage) => {
          const fixSizeHeight = (heightImage / widthImage) * width * 0.9;
          setSizeImage(fixSizeHeight);
        },
        (error) => {
          setLoadingImage(true);
          console.log("error", error);
        }
      );
    }
  }, []);


  useEffect(() => {
    getDisplayNews(id);
  }, [id]);
  return (
    <Box bg="defaultBackground" position="relative">
      <Box height="100%">
        <Box px={2}>
          <Header search profile title="Tin tức" leftButton="back">
            <NotificationIcon />
          </Header>
        </Box>

        <Box height={1} bg="#636363" opacity={0.3} mt={2} />
        {displayNews ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* <ButtonBack></ButtonBack> */}
            <Box marginTop={1} justifyContent="center" px={16}>
              <Text fontSize={20} fontWeight="bold" color="textColor" ml={1} mt={17}>
                {displayNews.news_title}
              </Text>
            </Box>
            <Box marginTop={20} px={16}>
              <Text fontSize={14} color="#636363">
                {moment(displayNews.news_created_date).format("DD/MM/YYYY")}{" "}
              </Text>
            </Box>
            <Box padding={16}>
              <Text fontSize={16} fontWeight={400}  color="textColor">
                {displayNews?.news_description?.trim()}
              </Text>
            </Box>
            <FastImage
              style={{
                height: sizeHeightImage ? sizeHeightImage : loadingImage ? 224 : 0,
                width: width * 0.9,
                marginLeft: "5%",
                borderRadius: 8,
                // aspectRatio: 1
              }}
              source={{
                uri: displayNews.news_image,
              }}
              resizeMode="contain"
            />
           
            <Box alignItems="center" mt={3}>
              <Text>Ảnh minh họa</Text>
            </Box>
            <View
              style={{ height: "100%", paddingHorizontal: 16, marginTop: 20 }}
            >
              {displayNews ? (
                <RenderHtml
                  contentWidth={width}
                  //@ts-ignore
                  imagesMaxWidth={width}
                  source={{
                    html: displayNews.news_content || "",
                  }}
                />
              ) : null}
            </View>
            <Box height={20}></Box>
          </ScrollView>
        ) : null}
      </Box>
    </Box>
  );
});

export default DisplayNew;

const styles = StyleSheet.create({});
