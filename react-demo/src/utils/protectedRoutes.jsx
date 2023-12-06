import { Navigate, Outlet, useLocation } from 'react-router-dom';

import getCookies from '../cookieReader';

const cookies = getCookies();
const useAuth = () => {
	return cookies['User'] && cookies['jwt'] && cookies['jwt'] !== undefined;
};

const ProtectedRoutes = () => {
	const isAuth = useAuth();
	const location = useLocation();
	return isAuth ? <Outlet /> : <Navigate to="/" replace state={{ from: location }} />;
};

export default ProtectedRoutes;
