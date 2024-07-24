import Svg, {Path} from "react-native-svg";
import {baseColors} from "../../themes";

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

const ICHomeNew1 = ({
                        width = 51,
                        height = 27,
                        color = baseColors.green,
                    }: IProps) => {
    return (<Svg
            width={width}
            height={height}
            viewBox="0 0 51 27"
            fill="none"

        >
            <Path
                d="M51 20.637l-7.527-7.515L51 5.606V3.6l-9.538 9.523L51 22.645v-2.008z"
                fill="#06C2C7"
            />
            <Path
                d="M42.565 26.244h2.011L31.434 13.122 44.576 0h-2.01L29.422 13.122l13.142 13.122z"
                fill="#06C2C7"
            />
            <Path
                d="M48.597 26.244h2.01L37.466 13.122 50.607 0h-2.01L35.455 13.122l13.142 13.122zM0 25.827l.417.417h2.01L0 23.82v2.007zM0 19.805l6.449 6.439h2.01L0 17.798v2.007z"
                fill="#06C2C7"
            />
            <Path
                d="M51 14.615l-1.495-1.493L51 11.628V9.621l-3.506 3.5L51 16.623v-2.007zM0 13.807l12.456 12.437h2.01L1.324 13.122 14.466 0h-2.01L0 12.436v1.371zM0 8.446L8.46 0H6.448L0 6.438v2.008zM0 2.424L2.427 0H.417L0 .416v2.008zM30.526 26.244h2.01L19.396 13.122 32.537 0h-2.01L17.383 13.122l13.142 13.122z"
                fill="#06C2C7"
            />
            <Path
                d="M36.558 26.244h2.01L25.427 13.122 38.57 0h-2.01L23.415 13.122l13.142 13.122zM18.488 26.244h2.01L7.356 13.122 20.498 0h-2.01L5.345 13.122l13.143 13.122z"
                fill="#06C2C7"
            />
            <Path
                d="M24.52 26.244h1.985L13.388 13.122 26.505 0H24.52L11.377 13.122l13.142 13.122z"
                fill="#06C2C7"
            />
        </Svg>
    );
};

export default ICHomeNew1;
