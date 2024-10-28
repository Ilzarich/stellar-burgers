import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { TNewOrderResponse } from '@api';
import { RootState } from './store';

interface IOrderSliceState {
  success: boolean;
  order: TOrder | null;
  profileOrders: TOrder[] | null;
  name: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: IOrderSliceState = {
  success: false,
  order: null,
  profileOrders: null,
  name: null,
  isLoading: false,
  error: null
};

export const fetchOrderDetails = createAsyncThunk(
  'order/fetchOrderDetails',
  async (orderNumber: number, thunkAPI) => {
    try {
      const response = await getOrderByNumberApi(orderNumber);
      const order = response.orders.find(
        (order) => order.number === orderNumber
      );

      if (!order) {
        return thunkAPI.rejectWithValue('Order not found');
      }

      return order;
    } catch (error) {
      console.log('Ошибка при получении заказов', error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchOrderRequest = createAsyncThunk<TNewOrderResponse, string[]>(
  'order/fetchOrderRequest',
  async (data: string[], thunkAPI) => {
    try {
      const response = await orderBurgerApi(data);
      return response;
    } catch (error) {
      console.error('Ошибка при создании заказа', error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchOrdersProfile = createAsyncThunk(
  'order/fetchOrdersProfile',
  async (_, thunkAPI) => {
    try {
      const response = await getOrdersApi();
      return response;
    } catch (error) {
      console.log('Ошибка при получении заказов', error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrderModal: (state) => {
      state.order = null;
      state.success = false;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.order = action.payload;
      })

      .addCase(fetchOrderDetails.rejected, (state, action) => {
        (state.isLoading = false),
          (state.success = true),
          (state.error = action.payload as string);
      })

      .addCase(fetchOrderRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchOrderRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.order = action.payload.order;
        state.name = action.payload.name;
      })

      .addCase(fetchOrderRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error = action.payload as string;
      })

      .addCase(fetchOrdersProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchOrdersProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.profileOrders = action.payload;
      })

      .addCase(fetchOrdersProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error = action.payload as string;
      });
  }
});

export default orderSlice.reducer;

export const selectorOrderSlice = (state: RootState) => state.orderSlise;
export const orderSelector = createSelector(
  selectorOrderSlice,
  (state) => state.order
);

export const orderProfile = (state: RootState): TOrder[] =>
  state.orderSlise.profileOrders ?? [];
export const { resetOrderModal } = orderSlice.actions;
