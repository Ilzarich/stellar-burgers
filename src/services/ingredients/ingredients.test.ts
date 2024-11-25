import exp from 'constants';
import ingredientsReducer, {
  setSelectedIngredient,
  clearSelectedIngredietn,
  fetchAllIngredients,
  selectedAllIngredietns
} from './ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('Тест ingredientsSlice', () => {
  const initialState = {
    items: [],
    status: 'idle' as 'idle',
    error: null,
    selectedIngredient: null
  };

  const mockIngredient: TIngredient = {
    _id: '1',
    name: 'Bun',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 200,
    price: 50,
    image: 'image_url',
    image_large: 'image_large_url',
    image_mobile: 'image_mobile_url'
  };

  test('Тест должен возврощать начальное состояние', () => {
    expect(ingredientsReducer(undefined, { type: '@@INIT' })).toEqual(
      initialState
    );
  });

  test('Тест setSelectedIngredient', () => {
    const state = ingredientsReducer(
      initialState,
      setSelectedIngredient(mockIngredient)
    );
    expect(state.selectedIngredient).toEqual(mockIngredient);
  });

  test('Тест clearSelectedIngredietn', () => {
    const stateWithSelected = {
      ...initialState,
      selectedAllIngredietns: mockIngredient
    };

    const state = ingredientsReducer(
      stateWithSelected,
      clearSelectedIngredietn()
    );
    expect(state.selectedIngredient).toBeNull();
  });

  test('Тест fetchAllIngredients.pending', () => {
    const state = ingredientsReducer(
      initialState,
      fetchAllIngredients.pending('', undefined)
    );
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  test('Тест fetchAllIngredients.fulfilled', () => {
    const mockIngredients = [mockIngredient];
    const state = ingredientsReducer(
      initialState,
      fetchAllIngredients.fulfilled(mockIngredients, '', undefined)
    );

    expect(state.status).toBe('successded');
    expect(state.items).toEqual(mockIngredients);
  });

  test('Тест fetchAllIngredients.rejected', () => {
    const mockError = 'Failed to fetch ingredients';
    const state = ingredientsReducer(
      initialState,
      fetchAllIngredients.rejected(
        new Error(mockError),
        '',
        undefined,
        mockError
      )
    );

    expect(state.status).toBe('failed');
    expect(state.error).toBe(mockError);
  });
});
