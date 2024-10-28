import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';
import { RootState } from './store';

interface ConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    setBun(state, action: PayloadAction<TConstructorIngredient | null>) {
      state.bun = action.payload;
    },

    setIngredient(state, action: PayloadAction<TConstructorIngredient>) {
      const ingredient = action.payload;
      if (ingredient.type === 'bun') {
        state.bun = ingredient;
      } else {
        state.ingredients.push(ingredient);
      }
    },

    removeIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter(
        (el) => el.id !== action.payload
      );
    },

    clearConstructor(state) {
      state.bun = null;
      state.ingredients = [];
    },

    moveIngredient(
      state,
      action: PayloadAction<{ id: string; option: 'up' | 'down' }>
    ) {
      const { id, option } = action.payload;
      const index = state.ingredients.findIndex(
        (ingredient) => ingredient.id === id
      );
      if (option === 'up' && index > 0) {
        [state.ingredients[index], state.ingredients[index - 1]] = [
          state.ingredients[index - 1],
          state.ingredients[index]
        ];
      }
      if (option === 'down' && index > 0) {
        [state.ingredients[index], state.ingredients[index + 1]] = [
          state.ingredients[index + 1],
          state.ingredients[index]
        ];
      }
    }
  }
});

export const {
  setBun,
  setIngredient,
  removeIngredient,
  clearConstructor,
  moveIngredient
} = constructorSlice.actions;

export default constructorSlice.reducer;

export const selectConstructorSlice = (state: RootState) =>
  state.constructorSlice;

export const selectorBun = createSelector(
  [selectConstructorSlice],
  (burgerConstructor) => burgerConstructor.bun
);

export const selectorIngredients = createSelector(
  [selectConstructorSlice],
  (burgerConstructor) => burgerConstructor.ingredients
);
