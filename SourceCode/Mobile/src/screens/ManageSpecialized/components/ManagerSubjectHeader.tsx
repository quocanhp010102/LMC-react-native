import React, { memo } from "react"
import { View, StyleSheet, Text } from "react-native"
import { Colors } from "../../../constants"
import Checkbox from "../../../components/Checkbox"

type Props = {
  isCheckAll: boolean
  onCheckAll: () => void
}

const ManagerSubjectHeader = ({ isCheckAll, onCheckAll }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.checkBoxColumn}>
        <Checkbox onChange={onCheckAll} isChecked={isCheckAll} color="white" />
      </View>
      <View style={styles.nameColumn}>
        <Text style={columnStyle.textStyle}>TÊN MÔN HỌC</Text>
      </View>
      <View style={styles.countColumn}>
        <Text style={columnStyle.textStyle}>SL KHÓA HỌC</Text>
      </View>
    </View>
  )
}

export default memo(ManagerSubjectHeader)

const columnStyle = StyleSheet.create({
  columnStyle: {
    borderLeftWidth: 1,
    borderLeftColor: Colors.br_D4D4D4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.secondary,
  },
  textStyle: {
    color: Colors.text_white,
  },
})

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: Colors.br_D4D4D4,
    backgroundColor: Colors.secondary,
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
})
