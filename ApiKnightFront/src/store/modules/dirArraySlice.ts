import { ArrayItem } from '@/types/arrayToTree'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface DirArray {
  value: Array<ArrayItem>
}

const initialState: DirArray = {
  value: [],
}

export const dirArraySlice = createSlice({
  name: 'dirArray',
  initialState,
  reducers: {
    increment: (state, action: PayloadAction<ArrayItem>) => {
      state.value.push(action.payload)
    },
    assign: (state, action: PayloadAction<Array<ArrayItem>>) => {
      state.value = action.payload
    },
    remove: (state, action: PayloadAction<string>) => {
      state.value = state.value.filter(
        (item) => item.key !== action.payload && item.pid !== action.payload,
      )
    },
  },
})

// Action creators are generated for each case reducer function
export const { increment, assign, remove } = dirArraySlice.actions

export default dirArraySlice.reducer
