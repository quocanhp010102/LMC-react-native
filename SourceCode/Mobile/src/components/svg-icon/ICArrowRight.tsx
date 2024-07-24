import React from "react";
import Svg, {Circle, Path} from "react-native-svg";
import {baseColors} from "../../themes";

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

const ICArrowRight = ({
                       width = 6,
                       height = 11,
                       color ="#00A8B5"
                   }: IProps) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 6 11" fill="none">
            <Path
                d="M0.5 0.666504L5.5 5.6665L0.5 10.6665V0.666504Z"
                fill={color}
                fill-opacity="0.54"
            />

        </Svg>
    );
};

export default ICArrowRight;
