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
import Author from '../pages/Admin/Author';
import Genre from '../pages/Admin/Genre';
import Language from '../pages/Admin/Language';
import Publisher from '../pages/Admin/Publisher';
import Supplier from '../pages/Admin/Supplier';
import Slider from '../pages/Admin/Slider';
import Following from '../pages/Admin/Following';
import Visits from '../pages/Admin/Visits';
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
    { path: config.routes.author, component: Author },
    { path: config.routes.genre, component: Genre },
    { path: config.routes.language, component: Language },
    { path: config.routes.publisher, component: Publisher },
    { path: config.routes.supplier, component: Supplier },
    { path: config.routes.slider, component: Slider },
    { path: config.routes.following, component: Following },
    { path: config.routes.visits, component: Visits },
];

export { publicRoutes, privateRoutes };
