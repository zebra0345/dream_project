import { Navigate, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import useAuth from '../../hooks/useAuth';
import { authLoadingState } from '../../recoil/atoms/authLoadingState';
import Loading from './Loading';


const PrivateRoute = ({ children }) => {
  const { checkAuth } = useAuth();
  const location = useLocation();
  const isLoading = useRecoilValue(authLoadingState);
  
  if (isLoading) {
    return <Loading />;
  }

  if (!checkAuth()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;