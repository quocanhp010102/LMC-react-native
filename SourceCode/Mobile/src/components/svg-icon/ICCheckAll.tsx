import Svg, { Path } from "react-native-svg";
import { baseColors } from "../../themes";

interface IProps {
  width?: number;
  height?: number;
  color?: string;
}

const ICCheckAll = ({
  width = 22,
  height = 16,
  color = baseColors.green,
}: IProps) => {
  return (
    <Svg
    width={width}
    height={height}
    viewBox="0 0 14 16"
    fill="none"
  >
    <Path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M0 6.7L4.6 11.3L14 2L12 0L4.6 7.4L2 4.8L0 6.7ZM14 14H0V16H14V14Z"
      fill="#32813D"
    />
  </Svg>
  );
};

export default ICCheckAll;
