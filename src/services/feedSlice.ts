import { getFeedsApi } from '@api';
import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { TFeedsResponse } from '@api';
import { TOrder } from '@utils-types';
import { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface FeedsState {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: FeedsState = {
  success: false,
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk(
  'feed/fetchFeeds',
  async (_, thunkAPI) => {
    try {
      const response = await getFeedsApi();
      return response;
    } catch (error) {
      console.log('Ошибка при получении данных', error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const feedsSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(
        fetchFeeds.fulfilled,
        (state, action: PayloadAction<TFeedsResponse>) => {
          state.isLoading = false;
          state.success = action.payload.success;
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
        }
      )

      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export default feedsSlice.reducer;

export const selectorFeedsState = (state: RootState) => state.feedsSlice;
export const selectorAllOrders = createSelector(
  [selectorFeedsState],
  (feedsState) => feedsState.orders
);

export const selectorTotal = createSelector(
  [selectorFeedsState],
  (feedsState) => feedsState.total
);

export const selectorTotalToday = createSelector(
  [selectorFeedsState],
  (feedsState) => feedsState.totalToday
);

export const selectorIsLoading = createSelector(
  [selectorFeedsState],
  (feedsState) => feedsState.isLoading
);
