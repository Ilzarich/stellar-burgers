import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from 'react-redux';
import { selectorUserName } from '../../services/user/userSlice';

export const AppHeader: FC = () => {
  const userName = useSelector(selectorUserName);
  return <AppHeaderUI userName={userName} />;
};
