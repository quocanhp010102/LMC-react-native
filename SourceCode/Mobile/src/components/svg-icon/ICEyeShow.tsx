import React from "react";
import Svg, {Circle, Path} from "react-native-svg";
import {baseColors} from "../../themes";

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

const ICEyeShow = ({
                       width = 24,
                       height = 17,
                       color = baseColors.green,
                   }: IProps) => {
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 24 17"
            fill="none"
        >
            <Path
                d="M0 7.951c3.833-6 14-14.4 24 0-3 5.5-13.5 15-24 0z"
                fill="#56C8C8"
            />
            <Circle cx={12} cy={8} r={5} fill="#fff"/>
            <Circle cx={12} cy={8} r={2} fill="#56C8C8"/>
        </Svg>
    );
};

export default ICEyeShow;
