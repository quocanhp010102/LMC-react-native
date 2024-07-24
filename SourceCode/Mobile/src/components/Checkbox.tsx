import { TouchableOpacity } from "react-native"
import React, { memo } from "react"
import { Icon } from "./svg-icon"
import { Box } from "../rebass"

type Props = {
  onChange: () => void
  isChecked: boolean
  color?: "white" | "#333"
}

const Checkbox = ({ onChange, isChecked, color = "#333" }: Props) => {
  return (
    <Box height={50} style={{ alignItems: "center", justifyContent: "center" }}>
      <TouchableOpacity onPress={onChange}>
        {isChecked ? (
          <Icon name="chooseBox" color={color}></Icon>
        ) : (
          <Icon name="CheckBox" color={color}></Icon>
        )}
      </TouchableOpacity>
    </Box>
  )
}

export default memo(Checkbox)
