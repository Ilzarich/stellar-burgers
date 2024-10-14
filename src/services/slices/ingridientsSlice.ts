import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '../../utils/burger-api';

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  getIngredientsApi
);

type TIngredientState = {
  ingredients: TIngredient[];
  isIngredientsLoading: boolean;
  IngredientsError: string | null;
};

export const initialState: TIngredientState = {
  ingredients: [],
  isIngredientsLoading: false,
  IngredientsError: null
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    getIngredients: (state) => state.ingredients,
    getIsIngredientsLoading: (state) => state.isIngredientsLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isIngredientsLoading = true;
        state.IngredientsError = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isIngredientsLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isIngredientsLoading = false;
        state.IngredientsError = action.error.message!;
      });
  }
});

export const { getIngredients, getIsIngredientsLoading } =
  ingredientsSlice.selectors;

export default ingredientsSlice.reducer;
