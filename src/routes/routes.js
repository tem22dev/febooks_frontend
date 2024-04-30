import config from '../config';

// Layouts
import { HeaderOnly } from '../layouts';
import { NoLayout } from '../layouts';
import Dashboard from '../pages/admin/Dashboard';
import Login from '../pages/admin/Login';

// Pages
import Home from '../pages/Home';
import Auth from '../pages/Auth';
import Checkout from '../pages/Checkout';
import BookDetail from '../pages/BookDetail';

// Public routes
const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.auth, component: Auth, layout: HeaderOnly },
    { path: config.routes.checkout, component: Checkout, layout: HeaderOnly },
    { path: config.routes.bookDetail, component: BookDetail },
    // { path: config.routes.dashAuth, component: Login, layout: NoLayout },
];

// Public routes
const privateRoutes = [{ path: config.routes.dash, component: Dashboard }];

export { publicRoutes, privateRoutes };
