import {
  userSlice,
  setUser,
  setCheckAuth,
  registerUser,
  postLoginUser,
  updateUser,
  logout
} from './userSlice';
import { TUser } from '@utils-types';

jest.mock('../../utils/cookie', () => ({
  ...jest.requireActual('../../utils/cookie'),
  setCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock
});

const testUser: TUser = {
  name: 'Test User',
  email: 'test@test.ru'
};

const initialState = {
  success: false,
  isCheckAuth: false,
  user: null,
  isLoading: false,
  error: null
};

describe('userSlice', () => {
  test('Тест должн вернуть начальное состояние', () => {
    expect(userSlice.reducer(undefined, { type: 'undefined' })).toEqual(
      initialState
    );
  });

  test('Тест должн установить пользователя при вызове setUser', () => {
    const nextState = userSlice.reducer(initialState, setCheckAuth(true));
    expect(nextState.isCheckAuth).toBe(true);
  });

  test('Тест должн установить isCheckAuth при вызове setCheckAuth', () => {
    const nextState = userSlice.reducer(initialState, setCheckAuth(true));
    expect(nextState.isCheckAuth).toBe(true);
  });

  describe('Тест extraReducers', () => {
    test('Тест должн сбросить ошибку при registerUser.pending', () => {
      const action = { type: registerUser.pending.type };
      const nextState = userSlice.reducer(initialState, action);

      expect(nextState.error).toBe(null);
    });

    test('Тест должн установить пользователя при registerUser.fulfilled', () => {
      const action = {
        type: registerUser.fulfilled.type,
        payload: {
          user: testUser,
          accessToken: 'fakeAccessToken',
          refreshToken: 'fakeRefreshToken'
        }
      };

      const nextState = userSlice.reducer(initialState, action);
      expect(nextState.user).toEqual(testUser);
      expect(localStorage.getItem('refreshToken')).toBe('fakeRefreshToken');
    });
  });

  test('Тест должн установить ошибку при registerUser.rejected', () => {
    const action = {
      type: registerUser.rejected.type,
      payload: 'Error message'
    };

    const nextState = userSlice.reducer(initialState, action);
    expect(nextState.error).toBe('Error message');
  });

  test('Тест должн установить пользователя при postLoginUser.fulfilled', () => {
    const action = {
      type: postLoginUser.fulfilled.type,
      payload: {
        user: testUser
      }
    };

    const nextState = userSlice.reducer(initialState, action);
    expect(nextState.user).toEqual(testUser);
  });

  test('Тест должн установить ошибку при postLoginUser.rejected', () => {
    const action = {
      type: postLoginUser.rejected.type,
      payload: 'Login error'
    };

    const nextState = userSlice.reducer(initialState, action);
    expect(nextState.error).toBe('Login error');
  });

  test('Тест должн обновить пользователя при updateUser.fulfilled', () => {
    const updatedUser = { ...testUser, name: 'Updated User' };
    const action = {
      type: updateUser.fulfilled.type,
      payload: { user: updatedUser }
    };
    const nextState = userSlice.reducer(
      { ...initialState, user: testUser },
      action
    );
    expect(nextState.user).toEqual(updatedUser);
  });

  test('Тест должн очистить пользователя при logout.fulfilled', () => {
    const action = { type: logout.fulfilled.type };
    const nextState = userSlice.reducer(
      { ...initialState, user: testUser },
      action
    );
    expect(nextState.user).toBe(null);
  });
});
