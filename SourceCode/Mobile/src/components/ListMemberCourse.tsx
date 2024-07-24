import {  LayoutAnimation, Platform, TouchableOpacity, UIManager ,StyleSheet } from "react-native";
import { Box, Text } from "../rebass";
import { MemberCourse } from "./MemberCourse";
import { Icon } from "./svg-icon";
import { useState } from "react";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface childrenItem  {
   name : string ;
   avatar : string
}

export const ListMemberCourse = ({
  title,
  children,
}: {
  title: string;
  children: childrenItem[];
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleOpen = () => {
    setIsOpen(value => !value);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }

  return (
    <Box>
      <TouchableOpacity  onPress={toggleOpen}>
        <Box flexDirection="row" alignItems="center" mb={2}>
          <Text fontSize={14} color="#1C7988" ml={3} mr={1}>
            {title}
          </Text>
          <Box style={{transform: [{rotateX:  isOpen  ? '180deg' : "0deg"}]}}>
          <Icon name="moreMember"  size={8} color="white" />
          </Box>
        </Box>
      </TouchableOpacity>
      <Box style={[styles.list, !isOpen ? styles.hidden : undefined]}>
      <Box ml={2}>
          {children?.map((item , index) => {
            return <MemberCourse key={index} name={item?.name} avatar={item?.avatar} />;
          })}
    
      </Box>
      </Box>
    </Box>
  );
};
const styles = StyleSheet.create({
  hidden: {
    height: 0,
  },
  list: {
    overflow: "hidden",
  },
});
