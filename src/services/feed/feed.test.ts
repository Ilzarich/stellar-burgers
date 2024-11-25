import feedsReducer, {
  fetchFeeds,
  selectorAllOrders,
  selectorTotal,
  selectorTotalToday,
  selectorIsLoading
} from './feedSlice';
import { TFeedsResponse, TOrder } from '@utils-types';

describe('Тест feedsSlice', () => {
  const initialState = {
    success: false,
    orders: [],
    total: 0,
    totalToday: 0,
    isLoading: false,
    error: null
  };

  test('Тест должен возвращать исходное состояние при вызове action', () => {
    const result = feedsReducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  describe('reducers', () => {
    test('Тест fetchFeeds.pending', () => {
      const action = { type: fetchFeeds.pending.type };
      const state = feedsReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: true,
        error: null
      });
    });

    test('Тест fetchFeeds.fulfilled', () => {
      const payload: TFeedsResponse = {
        success: true,
        orders: [
          {
            _id: '123',
            status: 'done',
            name: 'Test Order',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-02',
            number: 1,
            ingredients: ['ingredient1', 'ingredient2']
          }
        ],
        total: 100,
        totalToday: 10
      };
      const action = { type: fetchFeeds.fulfilled.type, payload };
      const state = feedsReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        success: payload.success,
        orders: payload.orders,
        total: payload.total,
        totalToday: payload.totalToday
      });
    });

    test('Тест fetchFeeds.rejected', () => {
      const error = 'Failed to fetch';
      const action = { type: fetchFeeds.rejected.type, payload: error };
      const state = feedsReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        error
      });
    });
  });

  describe('selectors', () => {
    const mockState = {
      feedsSlice: {
        success: true,
        orders: [
          {
            _id: '123',
            status: 'done',
            name: 'Test Order',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-02',
            number: 1,
            ingredients: ['ingredient1', 'ingredient2']
          }
        ],
        total: 100,
        totalToday: 10,
        isLoading: false,
        error: null
      }
    };

    test('Тест selectorAllOrders должен вернуть все orders', () => {
      const result = selectorAllOrders(mockState as any);
      expect(result).toEqual(mockState.feedsSlice.orders);
    });

    test('Тест selectorTotal должен вернуть total', () => {
      const result = selectorTotal(mockState as any);
      expect(result).toBe(100);
    });

    test('Тест selectorTotalToday должен вернут totalToday', () => {
      const result = selectorTotalToday(mockState as any);
      expect(result).toBe(10);
    });

    test('Тест selectorIsLoading должен вернут isLoading', () => {
      const result = selectorIsLoading(mockState as any);
      expect(result).toBe(false);
    });
  });
});
