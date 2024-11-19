import exp from 'constants';
import constructorSlice, {
  setBun,
  setIngredient,
  removeIngredient,
  clearConstructor,
  moveIngredient
} from './constructorSlice';
import { TConstructorIngredient } from '@utils-types';
import { feedsSlice } from '../feed/feedSlice';
import { cloneElement } from 'react';

describe('Тесты ConstructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  const filledState = {
    bun: {
      _id: 'bun-id',
      id: 'bun-id',
      name: 'Булочка',
      type: 'bun',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 150,
      price: 100,
      image: 'image-url',
      image_large: 'image-large-url',
      image_mobile: 'image-mobile-url'
    },

    ingredients: [
      {
        _id: 'ingredient-1',
        id: 'ingredient-1',
        name: 'Сыр',
        type: 'main',
        proteins: 15,
        fat: 10,
        carbohydrates: 5,
        calories: 200,
        price: 50,
        image: 'image-url',
        image_large: 'image-large-url',
        image_mobile: 'image-mobile-url'
      },
      {
        _id: 'ingredient-2',
        id: 'ingredient-2',
        name: 'Салат',
        type: 'main',
        proteins: 5,
        fat: 2,
        carbohydrates: 3,
        calories: 30,
        price: 20,
        image: 'image-url',
        image_large: 'image-large-url',
        image_mobile: 'image-mobile-url'
      }
    ]
  };

  test('Добавление булочки', () => {
    const bun: TConstructorIngredient = {
      ...filledState.bun,
      _id: 'new-bun-id',
      id: 'new-bun-id'
    };

    const newState = constructorSlice(initialState, setBun(bun));
    expect(newState.bun).toEqual(bun);
  });

  test('Добавление ингедиента', () => {
    const ingredient: TConstructorIngredient = {
      ...filledState.ingredients[0],
      _id: 'new-ingredient-id',
      id: 'new-ingredient-id'
    };

    const newState = constructorSlice(initialState, setIngredient(ingredient));
    expect(newState.ingredients.length).toBe(1);
    expect(newState.ingredients[0]).toEqual(ingredient);
  });

  test('Удаление ингредиента', () => {
    const newState = constructorSlice(
      filledState,
      removeIngredient('ingredient-1')
    );

    expect(newState.ingredients.length).toBe(1);
    expect(newState.ingredients[0].id).toBe('ingredient-2');
  });

  test('Очистка констркутора', () => {
    const newState = constructorSlice(filledState, clearConstructor());
    expect(newState).toEqual(initialState);
  }),
    test('Перемещение ингредиента вверх', () => {
      const newState = constructorSlice(
        filledState,
        moveIngredient({ id: 'ingredient-2', option: 'up' })
      );
      expect(newState.ingredients[0].id).toBe('ingredient-2');
      expect(newState.ingredients[1].id).toBe('ingredient-1');
    });

  test('Перемещение ингредиента вниз', () => {
    const newState = constructorSlice(
      filledState,
      moveIngredient({ id: 'ingredient-1', option: 'down' })
    );

    expect(newState.ingredients[0].id).toBe('ingredient-2');
    expect(newState.ingredients[1].id).toBe('ingredient-1');
  });
});
