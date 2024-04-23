import config from '../config';

// Layouts
import { HeaderOnly } from '../layouts';

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
];

// Public routes
const privateRoutes = [];

export { publicRoutes, privateRoutes };
