import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';
import { RootState } from '../store';

interface IUserState {
  success: boolean;
  isCheckAuth: boolean;
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: IUserState = {
  success: false,
  isCheckAuth: false,
  user: null,
  isLoading: false,
  error: null
};

export const registerUser = createAsyncThunk(
  'register/poseUser',
  async (user: TRegisterData, thunkAPI) => {
    try {
      const response = await registerUserApi(user);
      return response;
    } catch (error) {
      console.log('Ошибка регистрации пользователя', error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const postLoginUser = createAsyncThunk(
  'login/postUser',
  async (loginData: TLoginData, thunkAPI) => {
    try {
      const response = await loginUserApi(loginData);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response;
    } catch (error) {
      console.log('Ошибка входа', error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user: TRegisterData, thunkAPI) => {
    try {
      const response = await updateUserApi(user);
      setCookie('user', JSON.stringify(response.user));
      return response;
    } catch (error) {
      console.log('Ошибка получения данных пользователя', error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUser',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      try {
        const response = await getUserApi();
        dispatch(setUser(response.user));
        dispatch(setCheckAuth(true));
      } catch (error) {
        console.error('Error during user authentication:', error);
        dispatch(setCheckAuth(false));
      } finally {
        dispatch(setCheckAuth(true));
      }
    } else {
      dispatch(setCheckAuth(true));
    }
  }
);

export const logout = createAsyncThunk('user/login', async (_, thunkAPI) => {
  try {
    const response = await logoutApi();
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken');
    deleteCookie('accessToken');
    console.log('Выход из системы выполнен');
    return response;
  } catch (error) {
    console.log('Ошибка выхода из системы', error);
    return thunkAPI.rejectWithValue(error);
  }
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser | null>) => {
      state.user = action.payload;
    },
    setCheckAuth: (state, action) => {
      //: PayloadAction<boolean>
      console.log('Проверка ghbdtnm');
      state.isCheckAuth = action.payload;
      state.error = null;
      console.log('Проверка авторизации' + state.isCheckAuth);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        setCookie('accessToken', action.payload.accessToken);
        state.user = action.payload.user;
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(postLoginUser.pending, (state) => {
        state.success = false;
        state.isLoading = true;
        state.error = null;
      })

      .addCase(postLoginUser.fulfilled, (state, action) => {
        state.success = true;
        state.isLoading = false;
        state.user = action.payload.user;
      })

      .addCase(postLoginUser.rejected, (state, action) => {
        state.success = false;
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(updateUser.pending, (state) => {
        state.success = false;
        state.isLoading = true;
        state.error = null;
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        state.success = true;
        state.isLoading = false;
        state.user = action.payload.user;
      })

      .addCase(updateUser.rejected, (state, action) => {
        state.success = true;
        state.error = action.payload as string;
      })

      .addCase(checkUserAuth.fulfilled, (state) => {
        state.success = true;
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  }
});

export default userSlice.reducer;

export const selectorUser = (state: RootState) => state.userSlice.user;
export const selectorUserName = createSelector(
  [selectorUser],
  (user) => user?.name
);

export const selectorIsLoading = (state: RootState) =>
  state.userSlice.isLoading;
export const { setUser, setCheckAuth } = userSlice.actions;
export const selectorRegisterUser = (state: RootState) => state.userSlice.user;
export const selectIsCheckAuth = (state: RootState) =>
  state.userSlice.isCheckAuth;
