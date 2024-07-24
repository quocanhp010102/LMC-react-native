import React, { useState, useEffect, memo } from "react";
import {
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { Box, Flex, Text } from "../../../rebass";
import { Icon } from "../../../components/svg-icon";
import { NavLink } from "../../../platform/links";
import { generateApiService } from "../../../services/ApiService";
import { NewsApi } from "../../../services/api/News/NewsApi";
const { width, height } = Dimensions.get("screen");

interface Props {
  choose: ( id : number) => void;
  isSelected: boolean;
  data: any;
  index: number;
  setTypeModal: ( value : string) => void;
  setModalVisible: ( value : boolean) => void;
  setNewsChoose: (value : any) => void;
}
const genericMemo: <T>(component: T) => T = memo;
export const NewsList: React.FC<Props> = genericMemo((props: Props) => {
  const {
    data,
    choose,
    index,
    isSelected,
    setTypeModal,
    setModalVisible,
    setNewsChoose,
  } = props;
  const date = new Date(
    data.news_created_date ? data.news_created_date : data.news_date
  );
  const [star, setStar] = useState<number>(data.news_isDisplay);

  const obChangeStar = async (data: any, star: number) => {
    if (star == 0) {
      const new_data = { ...data, ["news_isDisplay"]: 1 };
      const res = await generateApiService.put(
        NewsApi.updateNews(new_data.id),
        {
          new_data,
        }
      );
      setStar(1);
    } else {
      const new_data = { ...data, ["news_isDisplay"]: 0 };
      const res = await generateApiService.put(
        NewsApi.updateNews(new_data.id),
        {
          new_data,
        }
      );
      setStar(0);
    }
  };
  useEffect(() => {
    setStar(data.news_isDisplay);
  }, [data.news_isDisplay]);
  return (
    <Box
      key={data.id}
      style={{
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start",
      
      }}
    >
      <TouchableOpacity
        onPress={() => {
          choose(data.id);
        }}
        style={{
          width: "10%",
          flexDirection: "row",
        }}
      >
        <Box
          height={40}
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {isSelected ? (
            <Icon name="chooseBox"></Icon>
          ) : (
            <Icon name="CheckBox"></Icon>
          )}
        </Box>
      </TouchableOpacity>
      <Box
        style={{
          width: "10%",
          flexDirection: "row",
        }}
      >
        <Box
          style={{
            width: 1,
            backgroundColor: "#D4D4D4",
          }}
        ></Box>
        <Box
          height={40}
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {star != 0 ? (
            <TouchableOpacity
              onPress={() => {
                obChangeStar(data, star);
              }}
              style={{
                height: "100%",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <Icon name="starNews"></Icon>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                obChangeStar(data, star);
              }}
              style={{
                height: "100%",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <Icon name="starNews2"></Icon>
            </TouchableOpacity>
          )}
        </Box>
      </Box>
      <Box
        style={{
          width: "55%",
          flexDirection: "row",
        }}
      >
        <Box
          style={{
            width: 1,
            backgroundColor: "#D4D4D4",
          }}
        ></Box>
        <NavLink
          {...{
            route: "/chi-tiet-tin-tuc",
            params: {
              data: data,
              type: "update",
            },
          }}
        >
          <Box
            height={40}
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Text
              style={{
                color: "#636363",
                fontSize: 12,
                textAlign: "center",
              }}
              numberOfLines={2}
            >
              {data.news_title}
            </Text>
          </Box>
        </NavLink>
      </Box>
      <Box
        style={{
          width: "25%",
          flexDirection: "row",
        }}
      >
        <Box
          style={{
            width: 1,
            backgroundColor: "#D4D4D4",
          }}
        ></Box>
        <Box
          height={40}
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#636363",
              fontSize: 12,

              textAlign: "center",
            }}
          >
            {date.getDate() +
              "/" +
              (date.getMonth() + 1) +
              "/" +
              date.getFullYear()}
          </Text>
          <Text
            style={{
              color: "#636363",
              fontSize: 12,

              textAlign: "center",
            }}
          >
            {date.getHours() + ":" + date.getMinutes()}
          </Text>
        </Box>
      </Box>
    </Box>
  );
});
