import * as React from "react";
import { ScrollView, StatusBar, StyleSheet } from "react-native";
import Calendar from "../../components/calendar/Calendar";
import { DefaultTheme } from "../../components/calendar/theme";
import { Header, NotificationIcon } from "../../components/Header";
import { Box, Flex } from "../../rebass";

const CalendarScreenItem = () => {
  const [value, setValue] = React.useState(new Date());
  return (
    <Box bg="defaultBackground" position="relative" px={2}>
      <Flex mt={1}>
        <Calendar date={value} />
      </Flex>
    </Box>
  );
};

export default function CalendarScreen() {


  return (
    <Box bg="defaultBackground" position="relative" height="100%" width="100%">
      <Box height="100%">
        <Header logo search>
          <NotificationIcon />
        </Header>
        <Box height={1} bg="#636363" opacity={0.3} mt={2} />
        <ScrollView>
          <CalendarScreenItem />
        </ScrollView>
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    marginTop: StatusBar.currentHeight,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
  },
  jumpToDateCard: {
    marginTop: 12,
    padding: 12,
  },
  textinput: {
    marginVertical: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: DefaultTheme.border,
    textAlign: "center",
    borderRadius: 8,
  },
  title: {
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
  col: { flex: 1, margin: 4 },
  row: { flexDirection: "row", flex: 1 },
});
