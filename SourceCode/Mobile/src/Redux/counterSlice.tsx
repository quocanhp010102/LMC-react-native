import { createSlice, PayloadAction } from "@reduxjs/toolkit"
//@ts-ignore
import { RootState } from "./../store"
import { userState } from "./types/types"

//Defining our initialState's type
type initialStateType = {
  userList: userState[]
  profile: any
}
const userList: userState[] = []

const initialState: initialStateType = {
  userList,
  profile: null,
}

export const counterSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addnewUser: (state, action: PayloadAction<userState>) => {
      state.userList = [action.payload]
    },
    updateUser: (state, action: PayloadAction<userState>) => {
      const {
        payload: { id, username, role },
      } = action
      state.userList = state.userList.map((user) =>
        user.id === id ? { ...user, username, role } : user
      )
    },
    deleteUser: (state, action: PayloadAction<{ id: string }>) => {
      state.userList = state.userList.filter(
        (user) => user.id !== action.payload.id
      )
    },
    updateProfile: (state, action: PayloadAction<any>) => {
      state.profile = action.payload
    },
    clearProfile: (state) => {
      state.profile = null
    },
  },
})
// To able to use reducers we need to export them.
export const {
  addnewUser,
  updateUser,
  deleteUser,
  updateProfile,
  clearProfile,
} = counterSlice.actions

export const selectUserList = (state: RootState) => state.user.userList

export default counterSlice.reducer
