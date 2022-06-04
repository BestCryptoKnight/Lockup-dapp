import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import toggleMode from '../actions/ToggleMode';

export const store = configureStore({
  reducer: {
    mode: toggleMode
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
