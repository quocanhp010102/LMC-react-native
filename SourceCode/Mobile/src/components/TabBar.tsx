import { LinearGradient } from "expo-linear-gradient";
import React, { PropsWithChildren, ReactNode, useContext } from "react";
import { TouchableOpacity } from "react-native";
import { FontSizeProps } from "styled-system";

import { Flex, Box } from "../rebass";
import { Icon, IconColor, IconName } from "./svg-icon";

type TabBarIndicatorType = undefined | "short" | "long";
interface TabBarContextType extends FontSizeProps {
  indicator?: TabBarIndicatorType;
  activeColor?: IconColor;
  inactiveColor?: IconColor;
}
const TabBarContext = React.createContext<TabBarContextType | null>(null);

const TabBar = ({
  children: c,
  ...props
}: PropsWithChildren<TabBarContextType>) => {
  const children = c as ReactNode[];
  return (
    <TabBarContext.Provider value={props}>
      <Flex flexDirection="row" alignItems="center" position="relative">
        {props.indicator === "long" && (
          <Flex
            width="100%"
            position="absolute"
            height={4}
            bg="separator"
            bottom={0}
            borderRadius={2}
            overflow="hidden"
          />
        )}
        {children.map((c, idx) => (
          <Flex key={idx} width={1 / children.length}>
            {c}
          </Flex>
        ))}
      </Flex>
    </TabBarContext.Provider>
  );
};
const Item = (props: {
  title: string;
  icon?: IconName;
  isActive?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
}) => {
  const context = useContext(TabBarContext);
  if (!context) return null;
  const color: IconColor = props.isActive
    ? context.activeColor ?? "#009900"
    : context.inactiveColor ?? "rgba(52, 52, 52, 0)";
  const iconChoose = props.isActive
    ? context.activeColor ?? props.icon + "1"
    : context.inactiveColor ?? props.icon;
  return (
    <Box>
      <Box backgroundColor="rgba(52, 52, 52, 0)" alignItems="center">
        <Box
          height={2}
          width="80%"
          style={{
            backgroundColor: color,
            borderBottomLeftRadius: 2,
            borderBottomRightRadius: 2,
          }}
        ></Box>
      </Box>

      <TouchableOpacity onPress={props.onPress} onLongPress={props.onLongPress}>
        <Flex alignItems="center" pt={2} pb={context.indicator ? 0 : 2}>
          {!!props.icon && (
            <Box>
              <Flex style={{ marginBottom: 4 }}>
                <Icon name={iconChoose} color={color} size={20} />
              </Flex>
            </Box>
          )}
          {!!context.indicator && (
            <Flex
              width={context.indicator === "long" ? "100%" : 30}
              height={4}
              overflow="hidden"
              borderRadius={2}
              mt={2}
            >
              {!!props.isActive && (
                <LinearGradient
                  colors={["#38EF7D", "#11998E"]}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={{ height: "100%" }}
                />
              )}
            </Flex>
          )}
        </Flex>
      </TouchableOpacity>
    </Box>
  );
};
TabBar.Item = Item;

export { TabBar };
