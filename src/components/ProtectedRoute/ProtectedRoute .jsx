import { Navigate } from 'react-router-dom';

import { useSelector } from 'react-redux';

function ProtectedRoute(props) {
    const isAuthenticated = useSelector((state) => state.account.isAuthenticated);

    return <>{isAuthenticated === true ? <>{props.children}</> : <Navigate to="/auth" replace />}</>;
}

export default ProtectedRoute;
