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
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.visit('/');
  });

  describe('Тестирование загрузки ингредиентов и добавление их в конструктор', () => {
    it('Добавление булок и ингредиентов в заказ', () => {
      cy.wait('@getIngredients');

      cy.get(burgerCollect).should('not.exist');

      cy.get(`${bun} > ${commonButtom}`).first().click();
      cy.get(`${main} > ${commonButtom}`).first().click();
      cy.get(`${sauce} > ${commonButtom}`).first().click();

      const burgerConstructor = {
        bunTop: cy.get(burgerCollect).first(),
        mainIngredient: cy.get(burgerCollect).eq(1),
        sauceIngredient: cy.get(burgerCollect).eq(2),
        bunBottom: cy.get(burgerCollect).last()
      };

      burgerConstructor.bunTop.contains('Краторная булка N-200i (верх)');
      burgerConstructor.mainIngredient.contains(
        'Биокотлета из марсианской Магнолии'
      );
      burgerConstructor.sauceIngredient.contains('Соус Spicy-X');
      burgerConstructor.bunBottom.contains('Краторная булка N-200i (низ)');
    });
  });

  describe('Тестирование работы модального окна для ингредиентов', () => {
    it('Открытие модального окна', () => {
      cy.get(bun).first().click();

      cy.get('#modals > div:first-child h3').should(
        'contain',
        'Краторная булка N-200i'
      );
    });

    it('Закрытие модального окна при нажатии на крестик', () => {
      cy.get(bun).first().click();

      const modal = cy.get('#modals > div:first-child').as('modal');
      const button = modal.get('div:first-child > button > svg').click();
    });

    it('Закрытие модального окна при клике на оверлей', () => {
      cy.get(bun).first().click();

      const modal = cy.get('#modals > div:first-child').as('modal');
      const overlay = modal.get('#modals > div:nth-child(2)');

      overlay.click({ force: true });

      cy.get('modal').should('not.exist');
    });
  });
});

describe('Тест создания заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
      'postOrder'
    );

    cy.setCookie('accessToken', authToken.accessToken);
    localStorage.setItem('refreshToken', authToken.refreshToken);

    cy.visit('/');
    cy.wait('@getUser');
  });

  it('Все этапы создания заказа', () => {
    cy.get(burgerCollect).should('not.exist');

    cy.get(`${bun} > ${commonButtom}`).first().click();
    cy.get(`${main} > ${commonButtom}`).first().click();
    cy.get(`${sauce} > ${commonButtom}`).first().click();

    cy.get(
      '#root > div > main > div > section:nth-child(2) > div > button'
    ).click();

    const orderModal = cy.get('#modals > div:first-child');
    // const orderNumber = orderModal.get('div:nth-child(2) > h2');

    // orderNumber.contains(orderData.order.number);

    orderModal.get('div:nth-child(2) > h2').should(
      'contain',
      orderData.order.number
    );

    orderModal.get('div:first-child > div:first-child > button > svg').click();
    cy.get('modal').should('not.exist');

    const burgerCunstructor = {
      constructorBunTop: cy.get('div > section:nth-child(2) > div'),
      constructoMainIngredient: cy.get('div > section:nth-child(2) > ul > div'),
      constructorBunBottom: cy.get(
        'div > section:nth-child(2) > div:nth-child(3)'
      )
    };

    burgerCunstructor.constructorBunTop.contains('Выберите булки');
    burgerCunstructor.constructoMainIngredient.contains('Выберите начинку');
    burgerCunstructor.constructorBunBottom.contains('Выберите булки');
  });

  afterEach(() => {
    cy.clearAllCookies();
    localStorage.removeItem('refreshToken');
  });
});
