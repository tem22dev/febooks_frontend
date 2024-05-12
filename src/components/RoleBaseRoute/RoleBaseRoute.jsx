import { useSelector } from 'react-redux';

import NotRole from '../NotRole';

function RoleBaseRoute(props) {
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    const isRoleAdmin = useSelector((state) => state.account.user.role);

    if (isAdminRoute && isRoleAdmin === 'admin') {
        return <>{props.children}</>;
    } else {
        return <NotRole />;
    }
}

export default RoleBaseRoute;
