import { Preloader } from '@ui';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectIsCheckAuth, selectorUser } from '../../services/userSlice';

type ProtectedRouteProps = {
  onlyAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  onlyAuth,
  children
}) => {
  const user = useSelector(selectorUser);
  const isCheckAuth = useSelector(selectIsCheckAuth);
  const location = useLocation();

  if (!isCheckAuth) {
    return <Preloader />;
  }

  if (onlyAuth && user) {
    const { from } = location.state ?? { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  if (!onlyAuth && !user) {
    return <Navigate to={'/login'} state={{ from: location }} />;
  }

  return children;
};
