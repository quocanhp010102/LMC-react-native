import React from "react";
import Svg, { Path } from "react-native-svg";
import { baseColors } from "../../themes";

interface IProps {
  width?: number;
  height?: number;
  color?: string;
}

const ICLogout = ({
  width = 26,
  height = 26,
  color = baseColors.green,
}: IProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15.017 7.39v-.934a3.685 3.685 0 00-3.685-3.685H6.455a3.685 3.685 0 00-3.684 3.685v11.13a3.685 3.685 0 003.684 3.686h4.885a3.675 3.675 0 003.676-3.674v-.944M21.81 12.021H9.769M18.882 9.106l2.928 2.915-2.928 2.916"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ICLogout;
