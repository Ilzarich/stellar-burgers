import orderReducer, { resetOrderModal, fetchOrderDetails } from './orderSlice';
import { TOrder } from '@utils-types';

describe('Тесты синхронных экшенов orderSlice', () => {
  test("'Проверяем сброс модального окна заказа", () => {
    const initialState = {
      success: true,
      order: {
        _id: '1',
        status: 'done',
        name: 'Test Order',
        createdAt: '',
        updatedAt: '',
        number: 1,
        ingredients: []
      } as TOrder,
      profileOrders: null,
      name: 'Test Name',
      isLoading: false,
      error: null
    };

    const newState = orderReducer(initialState, resetOrderModal());

    expect(newState).toEqual({
      success: false,
      order: null,
      profileOrders: null,
      name: 'Test Name',
      isLoading: false,
      error: null
    });
  });
});

describe('Тесты асинхронных экшенов fetchOrderDetails', () => {
  test('Тестируем pending состояние', () => {
    const initialState = {
      success: false,
      order: null,
      profileOrders: null,
      name: null,
      isLoading: false,
      error: null
    };

    const newState = orderReducer(
      initialState,
      fetchOrderDetails.pending('pending', 1)
    );

    expect(newState.isLoading).toBeTruthy();
    expect(newState.error).toBeNull();
  });

  test('Тестируем rejected состояние', () => {
    const initialState = {
      success: false,
      order: null,
      profileOrders: null,
      name: null,
      isLoading: true,
      error: null
    };

    const error = new Error('Order not found');

    const newState = orderReducer(
      initialState,
      fetchOrderDetails.rejected(error, 'rejected', 1)
    );

    expect(newState.isLoading).toBeFalsy();
    expect(newState.success).toBeFalsy();
    expect(newState.error).toBe(error.message);
  });

  test('Тестируем fulfilled состояние', () => {
    const initialState = {
      success: false,
      order: null,
      profileOrders: null,
      name: null,
      isLoading: true,
      error: null
    };

    const order: TOrder = {
      _id: '1',
      status: 'done',
      name: 'Test Order',
      createdAt: '',
      updatedAt: '',
      number: 1,
      ingredients: []
    };

    const newState = orderReducer(
      initialState,
      fetchOrderDetails.fulfilled(order, 'fulfilled', 1)
    );

    expect(newState.isLoading).toBeFalsy();
    expect(newState.success).toBeTruthy();
    expect(newState.order).toEqual(order);
    expect(newState.error).toBeNull();
  });
});
