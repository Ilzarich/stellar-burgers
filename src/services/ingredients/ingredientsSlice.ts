import { TIngredient } from '@utils-types';
import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { RootState } from '../store';
import { PayloadAction } from '@reduxjs/toolkit';

interface IngredietnsState {
  items: Array<TIngredient>;
  status: 'idle' | 'loading' | 'successded' | 'failed';
  error: string | null;
  selectedIngredient: TIngredient | null; //для модалки
}

export const initialState: IngredietnsState = {
  items: [],
  status: 'idle',
  error: null,
  selectedIngredient: null
};

export const fetchAllIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async (_, thunkAPI) => {
    try {
      const response = await getIngredientsApi();
      return response;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setSelectedIngredient: (
      state,
      action: PayloadAction<TIngredient | null>
    ) => {
      state.selectedIngredient = action.payload;
    },
    clearSelectedIngredietn: (state) => {
      state.selectedIngredient = null;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAllIngredients.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(fetchAllIngredients.fulfilled, (state, action) => {
        (state.status = 'successded'), (state.items = action.payload);
      })

      .addCase(fetchAllIngredients.rejected, (state, action) => {
        (state.status = 'failed'), (state.error = action.payload as string);
      });
  }
});

export const { setSelectedIngredient, clearSelectedIngredietn } =
  ingredientsSlice.actions;

export const selectedAllIngredietns = (state: RootState) =>
  state.ingredientsSlice.items;

export const selectorBuns = createSelector(
  [selectedAllIngredietns],
  (items: TIngredient[]) => items.filter((items) => items.type === 'bun')
);

export const selectorMains = createSelector(
  [selectedAllIngredietns],
  (items: TIngredient[]) => items.filter((items) => items.type === 'main')
);

export const selectorSauces = createSelector(
  [selectedAllIngredietns],
  (items: TIngredient[]) => items.filter((items) => items.type === 'sauce')
);

export default ingredientsSlice.reducer;
