
'use client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
type Notif = { id: string, type: string, data?: any, read?: boolean }
const slice = createSlice({ name:'notif', initialState: [] as Notif[], reducers: {
  push(state, action: PayloadAction<Notif>) { state.unshift(action.payload) }
}})
export const { push } = slice.actions
export default slice.reducer
