import { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import NotFound from './components/NotFound';
import DefaultLayout from './layouts';
import AdminLayout from './layouts/admin';
import { publicRoutes, privateRoutes } from './routes';
import { callFetchAccount } from './services/authServices';
import { doGetAccount } from './redux/account/accountSlice';
import ProtectedRoute from './components/ProtectedRoute';
import Loading from './components/Loading';
import RoleBaseRoute from './components/RoleBaseRoute';

function App() {
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.account.isLoading);

    const getAccount = async () => {
        if (window.location.pathname === '/auth') return;

        const res = await callFetchAccount();
        if (res.errCode === 0 && res.data.user?.email) {
            dispatch(doGetAccount(res.data));
        }
    };

    useEffect(() => {
        getAccount();
    }, []);

    return (
        <>
            {isLoading === false || window.location.pathname === '/auth' || window.location.pathname === '/' ? (
                <Router>
                    <Routes>
                        {publicRoutes.map((route, index) => {
                            const Page = route.component;
                            let Layout = DefaultLayout;

                            if (route.layout) {
                                Layout = route.layout;
                            } else if (route.layout === null) {
                                Layout = Fragment;
                            }

                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    }
                                />
                            );
                        })}
                        {privateRoutes.map((route, index) => {
                            const Page = route.component;
                            let Layout = AdminLayout;

                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <ProtectedRoute>
                                            <RoleBaseRoute>
                                                <Layout>
                                                    <Page />
                                                </Layout>
                                            </RoleBaseRoute>
                                        </ProtectedRoute>
                                    }
                                />
                            );
                        })}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Router>
            ) : (
                <Loading />
            )}
        </>
    );
}

export default App;
