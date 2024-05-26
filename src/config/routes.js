const routes = {
    home: '/',
    auth: '/auth',
    bookDetail: '/book/:slug',
    orderPub: '/book/order',
    history: '/book/history',
    // Admin
    dash: 'admin/dash',
    book: 'admin/dash/books',
    addBook: 'admin/dash/books/add',
    editBook: 'admin/dash/books/edit',
    user: 'admin/dash/users',
    order: 'admin/dash/orders',
    // dashAuth: 'admin/auth/login',
};

export default routes;
