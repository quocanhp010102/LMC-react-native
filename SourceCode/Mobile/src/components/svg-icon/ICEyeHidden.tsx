import React from "react";
import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";
import { baseColors } from "../../themes";

interface IProps {
  width?: number;
  height?: number;
  color?: string;
}

const ICEyeHidden = ({
  width = 22,
  height = 16,
  color = baseColors.green,
}: IProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <G
        stroke="#7E8B99"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        clipPath="url(#a)"
      >
        <Path d="M14.12 14.12a2.998 2.998 0 0 1-5.194-2.098A3 3 0 0 1 9.88 9.88m8.06 8.06A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94l11.88 11.88ZM9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.494 18.494 0 0 1-2.16 3.19L9.9 4.24ZM1 1l22 22" />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#7E8B99" d="M0 0h24v24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default ICEyeHidden;
