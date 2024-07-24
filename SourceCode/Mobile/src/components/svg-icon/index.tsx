import { useTheme } from 'styled-components/native';

import { Flex } from '../../rebass';
import { Theme } from '../../themes';
import { SVG } from './svg';
import { IconName } from './types';

export const ICON_GRADIENT_1 = 'url(#paint0_linear)';
export const ICON_GRADIENT_2 = 'url(#paint1_linear)';

export type IconColor = keyof Theme['colors'] | 'url(#paint0_linear)' | 'url(#paint1_linear)'  | string;
export const Icon = (props: { name: IconName; size?: number; color?: IconColor }) => {
  const theme = useTheme();
  const color =
    props.color && theme.colors[props.color as keyof typeof theme.colors]
      ? theme.colors[props.color as keyof typeof theme.colors]
      : props.color || theme.colors.normalText;
  return (
    <Flex
      height={props.size}
      width={props.size}
      alignItems="center"
      justifyContent="center">
      <SVG
        name={props.name}
        size={props.size}
        color={color
        }
      />
    </Flex>
  );
};

export * from './types';
