import Svg, { Path } from "react-native-svg";
import { baseColors } from "../../themes";

interface IProps {
  width?: number;
  height?: number;
  color?: string;
}

const ICDoubleRight = ({
  width = 23,
  height = 16,
  color = '#00A8B5',
}: IProps) => {
  return (
      <Svg
          width={width}
          height={height}
          viewBox="0 0 23 16"
          fill="none"

      >
        <Path
            d="M7.655 15.14c-.261.486-.934.86-1.494.86H.63c-.56 0-.784-.374-.522-.86L3.62 8.978c.262-.486.262-1.27 0-1.756L.11 1.057C-.153.57.07.197.632.197H6.16c.56 0 1.233.374 1.494.86l3.512 6.164c.261.485.261 1.27 0 1.756L7.655 15.14z"
            fill={color}
        />
        <Path
            d="M18.863 15.14c-.262.486-.934.86-1.495.86H11.84c-.56 0-.784-.374-.523-.86l3.512-6.163c.261-.486.261-1.27 0-1.756l-3.512-6.164c-.261-.486-.037-.86.523-.86h5.53c.56 0 1.232.374 1.494.86l3.511 6.164c.262.485.262 1.27 0 1.756l-3.511 6.164z"
            fill={color}
        />
      </Svg>
  );
};

export default ICDoubleRight;
