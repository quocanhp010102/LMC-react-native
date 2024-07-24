import { Box ,TextInput } from "../rebass";
import { Icon } from "./svg-icon";

export const SearchBar = () => {
  return (
    <Box flexDirection="row" justifyContent="space-between" px={20} mt={5}>
      <Box
        height={50}
        backgroundColor="white"
        flex={1}
        flexDirection="row"
        alignItems="center"
        p={2}
        borderRadius={5}
        borderWidth="1"
        borderColor="rgba(125, 125, 125, 0.3)"
      >
        <Icon name="search" size={20} color="secondary" />
        <TextInput width="100%" />
      </Box>
    </Box>
  );
};
