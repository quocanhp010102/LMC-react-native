import React from 'react';
import {NativeSyntheticEvent, TextInputChangeEventData, TouchableOpacity} from 'react-native';
import {useTheme} from 'styled-components/native';
import {BackgroundColorProps, FlexProps} from 'styled-system';
import {Box, Flex, Input, InputProps, Text} from '../rebass';
import {Icon, ICON_GRADIENT_1, IconColor, IconName} from './svg-icon';
import {lightColors} from '../themes';

export interface InputWithButtonProps extends InputProps {
    text?: string;
    textColor?: string;
    textSize?: number;
    icon?: IconName;
    iconColor?: IconColor;
    iconSize?: number;
    gradient?: boolean;
    border?: boolean;
    borderRadius?: number;
    onPress?: () => void;
    disabled?: boolean;
    height?: number;
    maxLength?: number;
    autoFocus?: boolean;
    borderColor? : string;
}

export const InputWithIcon = ({
                                  text,
                                  textColor,
                                  textSize,
                                  border,
                                  borderRadius,
                                  icon,
                                  iconColor,
                                  iconSize,
                                  onPress,
                                  gradient,
                                  disabled,
                                  bg,
                                  backgroundColor,
                                  height,
                                  flex,
                                  placeholderTextColor,
                                  maxLength,
                                  borderColor,
                                  autoFocus = false,
                                  ...inputProps
                              }: InputWithButtonProps & BackgroundColorProps & FlexProps) => {
    const theme = useTheme();
    const handleInputChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
        // Your logic here
    };
    return (
        <Box
            // backgroundColor={bg || backgroundColor || 'alternativeBackground'}
            height={height ?? 48}
            alignItems="center"
            borderRadius={borderRadius || 8}
            borderColor={border ? borderColor ? borderColor : "inputColor" : "transparent"}
            borderWidth={border ? 1 : 0}
            overflow="hidden"
            justifyContent="space-between"
            flex={flex}
            flexDirection="row"
        >
            <Flex
                flexDirection="row"
                flex={1}
                height="100%"
                justifyContent="center"
                alignItems="center"
            >
                {icon && (
                    <TouchableOpacity onPress={onPress} disabled={disabled}>
                        <Box ml={5}>
                            <Icon
                                name={icon}
                                size={iconSize || 20}
                                color={gradient ? ICON_GRADIENT_1 : iconColor || "normalText"}
                            />
                        </Box>
                    </TouchableOpacity>
                )}
                <Input
                    px={3}
                    fontSize={2}
                    width={"100%"}
                    height={"100%"}
                    color={lightColors.normalText}
                    placeholder={inputProps.placeholder}
                    placeholderTextColor={
                        placeholderTextColor ? placeholderTextColor : theme.colors.primary
                    }

                    editable={!disabled}
                    underlineColorAndroid="transparent"
                    selectionColor={theme.colors.primary}
                    value={inputProps.value}
                    //@ts-ignore
                    onChange={inputProps.onChange}
                    onChangeText={inputProps.onChangeText}
                    secureTextEntry={inputProps.secureTextEntry}
                    maxLength={maxLength}
                    autoFocus={autoFocus}
                    // onEndEditing={inputProps.onEndEditing}
                />
            </Flex>
            {text && (
                <TouchableOpacity onPress={onPress} disabled={disabled}>
                    <Box p={3}>
                        <Text fontSize={textSize || 20} color={textColor || "white"}>
                            {text}
                        </Text>
                    </Box>
                </TouchableOpacity>
            )}
        </Box>
    );
};
