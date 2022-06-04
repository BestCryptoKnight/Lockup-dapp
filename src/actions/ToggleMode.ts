import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

export interface ModeState {
    isToggled: boolean;
    currentTitle: string;
}

const initialState: ModeState = {
  isToggled: false,
  currentTitle: '',
};


export const mode = createSlice({
  name: 'mode',
  initialState,
  reducers: {
    setToggle:(state) => {
        state.isToggled = !state.isToggled;
    },
    setCurrentTitle: (state, action) => {
      state.currentTitle = action.payload;
    }
  },
  
});

export const { setToggle, setCurrentTitle } = mode.actions;

export const getToggle = (state: RootState) => state.mode.isToggled;
export const getCurrentTitle = (state: RootState) => state.mode.currentTitle;


export default mode.reducer;
