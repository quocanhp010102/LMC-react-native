import { FastImage } from "components-base";
import { useState } from "react";
import { Box, Text } from "../rebass";

export const MemberCourse = (props: { name?: string; avatar?: string }) => {
  const [imageUrl, setImageUrl] = useState(props.avatar);

  return (
    <Box flexDirection="row" alignItems="center" mb={2}>
      {props.avatar ? (
        <FastImage
          style={{
            height: 36,
            width: 36,
            borderRadius: 50,
          }}
          source={{
            uri: props.avatar,
          }}
          onError={() => {
            setImageUrl(
              "https://www.seekpng.com/png/detail/514-5147412_default-avatar-icon.png"
            );
          }}
        />
      ) : (
        <Box
          width={36}
          height={36}
          borderRadius={50}
          backgroundColor="buttonColor"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="#ffffff" fontSize={19} fontWeight="bold">
            {props?.name?.split(" ").slice(-1).join(" ").charAt(0)}
          </Text>
        </Box>
      )}
      <Text fontSize={12} color="#636363" ml={1} numberOfLines={1}>
        {props.name}
      </Text>
    </Box>
  );
};
