import { View, StyleSheet, Text } from "react-native";
import React, { memo, useMemo } from "react";
import { Colors } from "../../../constants";
import Checkbox from "../../../components/Checkbox";
import { ISubject } from "../../../../types";
import { useNavigation } from "@react-navigation/native";

type Props = {
  isChecked: boolean;
  onChecked: (id?: number) => void;
  data: ISubject;
  isEven: boolean;
};

const ManagerSubjectItem = ({ isChecked, onChecked, data, isEven }: Props) => {
  const navigation = useNavigation()
  const bgContainer = useMemo(() => {
    return {
      ...styles.container,
      backgroundColor: !isEven ? Colors.bg_E5F3F8 : Colors.text_white,
    };
  }, [isEven]);
  return (
    <View style={bgContainer}>
      <View style={styles.checkBoxColumn}>
        <Checkbox onChange={onChecked} isChecked={isChecked} />
      </View>
      <View
        style={styles.nameColumn}
        onTouchStart={() => {
           navigation.navigate('/quan-li-khoa-hoc' , { id_course : data.id })
        }}
      >
        <Text style={columnStyle.textStyle}>{data?.subject_name}</Text>
      </View>
      <View style={styles.countColumn}>
        <Text style={columnStyle.textStyle}>{data?.count_course}</Text>
      </View>
    </View>
  );
};

export default memo(ManagerSubjectItem);

const columnStyle = StyleSheet.create({
  columnStyle: {
    borderLeftWidth: 1,
    borderLeftColor: Colors.br_D4D4D4,
    alignItems: "center",
    justifyContent: "center",
  },
  textStyle: {
    color: Colors.text_4A4A4A,
    fontSize: 12,
  },
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: Colors.br_D4D4D4,
  },
  checkBoxColumn: {
    width: 50,
    ...columnStyle.columnStyle,
  },
  nameColumn: {
    flex: 1,
    ...columnStyle.columnStyle,
  },
  countColumn: {
    width: 150,
    borderRightWidth: 1,
    borderRightColor: Colors.br_D4D4D4,
    ...columnStyle.columnStyle,
  },
});
