import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useLocation, useParams } from 'react-router-dom';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { selectorIngredients } from '../../services/constructor/constructorSlice';
import { setSelectedIngredient } from '../../services/ingredients/ingredientsSlice';
import { TIngredient } from '@utils-types';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const dispatch = useDispatch();

  const allIngredients = useSelector(
    (state: RootState) => state.ingredientsSlice.items
  );

  useEffect(() => {
    if (location.state?.ingredient) {
      dispatch(setSelectedIngredient(location.state.ingredient));
    } else {
      const selectedIngredient = allIngredients.find(
        (ingredient) => ingredient._id === id
      );
      dispatch(setSelectedIngredient(selectedIngredient || null));
    }
  }, [id, location.state, dispatch, allIngredients]);

  const ingredientData = allIngredients.find(
    (ingredient) => ingredient._id === id
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
