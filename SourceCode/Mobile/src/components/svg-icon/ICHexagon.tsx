import Svg, { Path } from "react-native-svg";
import { baseColors } from "../../themes";

interface IProps {
  width?: number;
  height?: number;
  color?: string;
}

const ICHexagon = ({
  width = 77,
  height = 68,
  color = '#00A8B5',
}: IProps) => {
  return (
      <Svg
          width={width}
          height={height}
          viewBox="0 0 77 68"
          fill="none"
      >
        <Path
            d="M17.736 65.894L.526 36.106a4.485 4.485 0 010-4.212l17.21-29.788C18.438.802 19.838 0 21.34 0H55.66c1.501 0 2.902.802 3.602 2.106l17.212 29.788c.7 1.304.7 2.908 0 4.212L59.264 65.894C58.563 67.197 57.162 68 55.66 68H21.34c-1.501 0-2.902-.802-3.602-2.106z"
            fill={color}
        />
      </Svg>
  );
};

export default ICHexagon;
