import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './ingredients/ingredientsSlice';
import constructorReducer from './constructor/constructorSlice';
import orderSlise from './order/orderSlice';
import userSlice from './user/userSlice';
import feedsSlice from './feed/feedSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

export const rootReducer = combineReducers({
  ingredientsSlice: ingredientsReducer,
  constructorSlice: constructorReducer,
  feedsSlice: feedsSlice,
  orderSlise: orderSlise,
  userSlice: userSlice
}); // Заменить на импорт настоящего редьюсера

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
