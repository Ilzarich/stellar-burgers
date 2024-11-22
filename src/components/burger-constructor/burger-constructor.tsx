import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector } from 'react-redux';
import {
  clearConstructor,
  selectorBun,
  selectorIngredients
} from '../../services/constructor/constructorSlice';
import { selectorUser } from '../../services/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { RootState } from '../../services/store';
import {
  fetchOrderRequest,
  resetOrderModal
} from '../../services/order/orderSlice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */

  const buns = useSelector(selectorBun);
  const ingredients = useSelector(selectorIngredients);
  const user = useSelector(selectorUser);
  const navigate = useNavigate();
  const constructorItems = {
    bun: buns,
    ingredients: ingredients || []
  };

  const orderRequest = useSelector(
    (state: RootState) => state.orderSlise.isLoading
  );
  const orderModalData = useSelector(
    (state: RootState) => state.orderSlise.order
  );
  const dispatch = useDispatch();

  const getIngredientsIds = () => {
    const bunId = constructorItems.bun ? constructorItems.bun._id : '';
    const ingredientsIds = constructorItems.ingredients.map(
      (ingredient) => ingredient._id
    );

    return [bunId, ...ingredientsIds];
  };

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      navigate('/login');
      return;
    }

    const ingredientIds = getIngredientsIds();
    dispatch(fetchOrderRequest(ingredientIds));
  };
  const closeOrderModal = () => {
    dispatch(resetOrderModal());
    closeOrderModal();
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  // return null;

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
