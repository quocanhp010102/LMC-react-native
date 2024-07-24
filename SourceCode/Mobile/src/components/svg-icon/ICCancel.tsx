import React from "react";
import Svg, { Path } from "react-native-svg";
import { baseColors } from "../../themes";

interface IProps {
  width?: number;
  height?: number;
  color?: string;
}

const ICCancel = ({
  width = 15,
  height = 15,
  color = baseColors.green,
}: IProps) => {
  return (
    <Svg
    width={width}
    height={height}
    viewBox="0 0 15 15"
    fill="none"
  >
    <Path
      d="M13.913 2.107A1.059 1.059 0 1012.416.609L7.228 5.798 2.039.609A1.059 1.059 0 00.542 2.107L5.73 7.295.542 12.483a1.059 1.059 0 101.497 1.498l5.189-5.188 5.188 5.188a1.059 1.059 0 101.497-1.498L8.725 7.295l5.188-5.188z"
      fill="#8D8D8D"
      fillOpacity={0.5}
    />
  </Svg>
  );
};

export default ICCancel;
