import moment from "moment";
import { Platform } from "react-native";

export const isWeb = Platform.OS === "web";
export const isServerSide = isWeb ? !(process as any).browser : false;
export const isClientSide = isWeb ? !!(process as any).browser : true;
export const calculateTime = (dateString: Date) => {
  const date = new Date(dateString);
  //@ts-ignore
  var seconds = Math.floor((new Date() - date) / 1000);
  var interval = seconds / 31536000;
  if (seconds < 0) {
    return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
  }
  if (interval > 1) {
    return Math.floor(interval) + " năm trước";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " tháng trước";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " ngày trước";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " giờ trước";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " phút trước";
  }
  return Math.floor(seconds) + " giây trước";
};
