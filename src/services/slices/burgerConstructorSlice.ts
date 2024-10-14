import { TConstructorIngredient, TIngredient } from '@utils-types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { IngredientsCategoryUI } from '@ui';

type TConstructorState = {
  bun: TConstructorIngredient | null;
  Ingredients: TConstructorIngredient[];
};

export const initialState: TConstructorState = {
  bun: null,
  Ingredients: []
};

export const burgerConstructorSlice = createSlice({
  name: 'butgerConstructor',
  initialState,
  reducers: {
    addItem: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.Ingredients.push(action.payload);
        }
      },

      prepare: (ingredients: TIngredient) => ({
        payload: { ...ingredients, id: uuidv4() }
      })
    },

    removeIngredient(state, action) {
      state.Ingredients = state.Ingredients.filter(
        (item) => item.id !== action.payload.id
      );
    },

    clearConstructor(state) {
      state.bun = null;
      state.Ingredients = [];
    },

    moveConstructorItem(state, action: PayloadAction<number>) {
      const index = action.payload;

      if (index > 0) {
        [state.Ingredients[index], state.Ingredients[index - 1]] = [
          state.Ingredients[index - 1],
          state.Ingredients[index]
        ];
      } else if (index < state.Ingredients.length - 1) {
        [state.Ingredients[index], state.Ingredients[index - 1]] = [
          state.Ingredients[index - 1],
          state.Ingredients[index]
        ];
      }
    }
  }
});

export const {
  addItem,
  removeIngredient,
  clearConstructor,
  moveConstructorItem
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
