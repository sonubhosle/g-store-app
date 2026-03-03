import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoutes = ({ children, requiredRole }) => {
    const { user, jwt, loading } = useSelector(state => state.auth);
    const location = useLocation();

    if (loading && !user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                <p className="mt-4 text-gray-600">Checking authentication...</p>
            </div>
        );
    }

    if (!jwt && !localStorage.getItem("jwt")) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!user) {
        return null;
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoutes;