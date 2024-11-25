import { configureStore } from '@reduxjs/toolkit';
import store, { rootReducer, AppDispatch, RootState } from './store';
import {
  setIngredient,
  setBun,
  removeIngredient
} from './constructor/constructorSlice';
import { fetchAllIngredients } from './ingredients/ingredientsSlice';
import { initialState as ingredientsInitialState } from './ingredients/ingredientsSlice';
import { initialState as constructorInitialState } from './constructor/constructorSlice';
import { initialState as orderInitialState } from './order/orderSlice';
import { initialState as userInitialState } from './user/userSlice';
import { initialState as feedsInitialState } from './feed/feedSlice';

type TestRootState = ReturnType<typeof rootReducer>;

describe('Redux Store', () => {
  test('Тест на правильно настроеное хранилище', () => {
    expect(store).toBeDefined();
    expect(store.getState()).toBeDefined();
  });

  test('Тест должен содержать правильные ключи состояния', () => {
    const state: RootState = store.getState();
    expect(state).toHaveProperty('ingredientsSlice');
    expect(state).toHaveProperty('constructorSlice');
    expect(state).toHaveProperty('feedsSlice');
    expect(state).toHaveProperty('orderSlise');
    expect(state).toHaveProperty('userSlice');
  });

  test('Тест должен корректно обрабатывать действия constructorSlice', () => {
    const testIngredient = {
      id: 'testId',
      _id: 'testId',
      name: 'Test Ingredient',
      type: 'main',
      proteins: 10,
      fat: 5,
      carbohydrates: 15,
      calories: 100,
      price: 200,
      image: '',
      image_large: '',
      image_mobile: ''
    };

    store.dispatch(setIngredient(testIngredient)); // Тест на добавление
    let state = store.getState() as TestRootState;

    expect(state.constructorSlice.ingredients).toContainEqual(testIngredient);

    store.dispatch(removeIngredient('testId')); //Тест на удаление
    state = store.getState() as TestRootState;

    expect(state.constructorSlice.ingredients).not.toContainEqual(
      testIngredient
    );
  });

  test('Тест должен корректно обрабатывать действия ingredientsSlice', async () => {
    const mockApiResponse = {
      success: true,
      data: [
        {
          _id: '1',
          name: 'Bun',
          type: 'bun',
          proteins: 10,
          fat: 5,
          carbohydrates: 15,
          calories: 100,
          price: 50,
          image: '',
          image_large: '',
          image_mobile: ''
        }
      ]
    };

    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockApiResponse),
      ok: true
    } as unknown as Response);

    await store.dispatch(fetchAllIngredients());

    const state = store.getState() as TestRootState;
    expect(state.ingredientsSlice.items).toEqual(mockApiResponse.data);

    jest.restoreAllMocks();
  });

  describe('rootReducer', () => {
    test('rootReducer возвращает корректное начальное состояние', () => {
      const expectedInitialState = {
        ingredientsSlice: ingredientsInitialState,
        constructorSlice: constructorInitialState,
        feedsSlice: feedsInitialState,
        orderSlise: orderInitialState,
        userSlice: userInitialState
      };

      const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

      expect(state).toEqual(expectedInitialState);
    });

    test('rootReducer корректно обрабатывает неизвестный экшен', () => {
      const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
      const newState = rootReducer(initialState, { type: 'UNKNOWN_ACTION' });
      expect(newState).toEqual(initialState);
    });
  });
});
