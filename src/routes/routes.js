import config from '../config';

// Layouts
import { HeaderOnly } from '../layouts';
// import { NoLayout } from '../layouts';

// Pages
import Home from '../pages/Home';
import Auth from '../pages/Auth';
import BookDetail from '../pages/BookDetail';
import OrderPub from '../pages/Order';
import History from '../pages/History';

import Dashboard from '../pages/Admin/Dashboard';
import Book from '../pages/Admin/Book';
import AddBook from '../pages/Admin/Book/AddBook';
import UpdateBook from '../pages/Admin/Book/UpdateBook';
import User from '../pages/Admin/User';
import Order from '../pages/Admin/Order';
// import Login from '../pages/Admin/Login';

// Public routes
const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.auth, component: Auth, layout: HeaderOnly },
    { path: config.routes.orderPub, component: OrderPub, layout: HeaderOnly },
    { path: config.routes.bookDetail, component: BookDetail },
    { path: config.routes.history, component: History, layout: HeaderOnly },
    // { path: config.routes.dashAuth, component: Login, layout: NoLayout },
];

// Private routes
const privateRoutes = [
    { path: config.routes.dash, component: Dashboard },
    { path: config.routes.book, component: Book },
    { path: config.routes.addBook, component: AddBook },
    { path: config.routes.editBook, component: UpdateBook },
    { path: config.routes.user, component: User },
    { path: config.routes.order, component: Order },
];

export { publicRoutes, privateRoutes };
