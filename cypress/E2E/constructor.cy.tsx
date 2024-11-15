import * as authToken from '../fixtures/token.json';
import * as orderData from '../fixtures/order.json';

const burgerCollect =
  '.constructor-element > .constructor-element__row > .constructor-element__text';
const bun = `[data-cy = bun]`;
const main = `[data-cy = main]`;
const sauce = `[data-cy = sauce]`;
const commonButtom = `.common_button`;

describe('E2E тесты для страницы конструктора', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('/');
  });

  describe('Тестирование загрузки инградиентов и добавление их в конструктор', () => {
    it('Добавление булок и инградиентов в заказ', () => {
      cy.get(`${bun} > ${commonButtom}`).first().click();
      cy.get(`${main} > ${commonButtom}`).first().click();
      cy.get(`${sauce} > ${commonButtom}`).first().click();

      const burgerConstructor = {
        bunTop: cy.get(burgerCollect).first(),
        mainIngredient: cy.get(burgerCollect).eq(1),
        sauceIngredient: cy.get(burgerCollect).eq(2),
        bunbutton: cy.get(burgerCollect).last()
      };

      burgerConstructor.bunTop.contains('Краторная булка N-200i (верх)');
      burgerConstructor.mainIngredient.contains(
        'Биокотлета из марсианской Магнолии'
      );
      burgerConstructor.sauceIngredient.contains('Соус Spicy-X');
      burgerConstructor.bunbutton.contains('Краторная булка N-200i (низ)');
    });
  });
});
