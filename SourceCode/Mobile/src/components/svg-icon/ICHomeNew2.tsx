import Svg, {Path} from "react-native-svg";
import {baseColors} from "../../themes";

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

const ICHomeNew2 = ({
                        width = 43,
                        height = 70,
                        color = baseColors.green,
                    }: IProps) => {
    return (<Svg
            width={width}
            height={height}
            viewBox="0 0 43 70"
            fill="none"

        >
            <Path
                d="M42 1H1v68.422h41V1z"
                stroke="#56C8C8"
                strokeMiterlimit={10}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M37.97 5.023H5.06V65.37H37.97V5.023z"
                stroke="#56C8C8"
                strokeMiterlimit={10}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M33.911 9.076H9.117v52.242h24.794V9.076z"
                stroke="#56C8C8"
                strokeMiterlimit={10}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M29.853 13.128H13.147v44.166h16.706V13.128z"
                stroke="#56C8C8"
                strokeMiterlimit={10}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M25.794 17.151h-8.588v36.062h8.588V17.15zM21.5 49.19V21.203"
                stroke="#56C8C8"
                strokeMiterlimit={10}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

export default ICHomeNew2;
