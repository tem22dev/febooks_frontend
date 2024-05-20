const routes = {
    home: '/',
    auth: '/auth',
    bookDetail: '/book-detail/:slug',
    checkout: '/checkout',
    // Admin
    dash: 'admin/dash',
    book: 'admin/dash/books',
    addBook: 'admin/dash/books/add',
    user: 'admin/dash/users',
    order: 'admin/dash/orders',
    // dashAuth: 'admin/auth/login',
};

export default routes;
