import React, {useEffect, useState} from "react";
import {Dimensions, StyleSheet} from "react-native";
import {Header, NotificationIcon} from "../../components/Header";
import {Box} from "../../rebass";
import {NewsApi} from "../../services/api/News/NewsApi";
import {generateApiService} from "../../services/ApiService";
import AutoHeightWebView from "react-native-autoheight-webview";

// const {width, height} = Dimensions.get("screen");

export interface DisplayNew {
    id: number;
    news_content?: string;
    news_created_date?: string;
    news_description?: string;
    news_image?: string;
    news_isDisplay?: string;
    news_title?: string;
}

const DisplayNew = ({route}: any) => {
    const {id} = route.params;
    const [displayNews, setDisplayNews] = useState<DisplayNew>();

    const getDisplayNews = async (id: number) => {
        const dataDisplayNews = await generateApiService.get(
            NewsApi.getNewById(id)
        );
        if (dataDisplayNews) {
            setDisplayNews(dataDisplayNews);

        }
    };
    useEffect(() => {
        getDisplayNews(id);
    }, [id]);


    return (
        <Box bg="defaultBackground" position="relative">
            <Box height="100%">
                <Box px={2}>
                    <Header search profile title="Tin tức" leftButton="back">
                        <NotificationIcon/>
                    </Header>
                </Box>
                <Box height={1} bg="#636363" opacity={0.3} mt={2}/>
                {displayNews ? (
                        // <ScrollView showsVerticalScrollIndicator={false}>
                        // <Box marginTop={1} justifyContent="center" px={16}>
                        //   <Box ml={1}>
                        //     <Devider mt={1} />
                        //   </Box>

                        //   <Text fontSize={20} fontWeight="bold" color="textColor" ml={1}>
                        //     {displayNews.news_title}
                        //    </Text>
                        // </Box>
                        // <Box marginTop={20} px={16}>
                        //   <Text fontSize={14} color="#636363">
                        //     {moment(displayNews.news_created_date).format("DD/MM/YYYY")}
                        //   </Text>
                        // </Box>
                        // <Box padding={16}>
                        //   <Text fontSize={16} fontWeight={400}>
                        //     {displayNews?.news_description}
                        //   </Text>
                        // </Box>

                        // <Image
                        //   style={{
                        //     minHeight: sizeImage.fixSizeHeight,
                        //     width: width * 0.9,
                        //     marginLeft: "5%",
                        //     borderRadius: 8,
                        //   }}
                        //   source={{
                        //     uri: displayNews.news_image,
                        //   }}
                        // />
                        // <Box alignItems="center" mt={3}>
                        //   <Text>Ảnh minh họa</Text>
                        // </Box>
                        // <View
                        //   style={{
                        //     height: 800,
                        //     paddingHorizontal: 16,
                        //     marginTop: 20,
                        //   }}
                        // >

                        // <RenderHtml
                        //   contentWidth={width}
                        //   imagesMaxWidth={width}
                        //   source={{
                        //     html: displayNews.news_content,
                        //   }}
                        // />
                        // <ScrollView>
                        <AutoHeightWebView
                            style={{
                                width: "95%",
                                marginLeft: 5,
                            }}
                            onMessage={(event) => {

                            }}
                            customScript={`document.body.style.background = 'white';`}
                            customStyle={`
      // * {
      //   font-family: 'Times New Roman';
      // }
      p {
        font-size: 16px;
      }
      span {
         font-size: 16px;
        
      }
      img {
    max-width: 100% !important;
    object-fit: contain;
    height: auto !important;
      }
      video {
          width: 100% !important;
      }
    `}
                            onSizeUpdated={(size) => {
                            }}
                            files={[
                                {
                                    href: "cssfileaddress",
                                    type: "text/css",
                                    rel: "stylesheet",
                                },
                            ]}
                            source={{
                                html: displayNews.news_content || "",
                            }}
                            scalesPageToFit={true}
                            viewportContent={"width=device-width, user-scalable=no"}
                            /*
                    other react-native-webview props
                    */
                        />
                    ) : // </ScrollView>
                    //   </View>
                    // </ScrollView>
                    undefined}
            </Box>
        </Box>
    );
};

export default DisplayNew;

const styles = StyleSheet.create({});
