import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';

import { getIngredients } from 'src/services/slices/ingridientsSlice';
import { useSelector } from 'src/services/store';

export const IngredientDetails: FC = () => {
  const ingradients = useSelector(getIngredients)
  const { id } = useParams();
  /** TODO: взять переменную из стора */
  const ingredientData = ingradients.find((ingradient) => ingradient._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
