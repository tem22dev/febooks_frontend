import { Fragment, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { notification } from 'antd';

import NotFound from './components/NotFound';
import DefaultLayout from './layouts';
import AdminLayout from './layouts/admin';
import { publicRoutes, privateRoutes } from './routes';
import { callFetchAccount } from './services/authServices';
import { doGetAccount } from './redux/account/accountSlice';
import ProtectedRoute from './components/ProtectedRoute';
import Loading from './components/Loading';
import RoleBaseRoute from './components/RoleBaseRoute';
import * as siteService from './services/siteService';

function App() {
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.account.isLoading);

    // Xóa visitRecorded khỏi localStorage khi người dùng rời khỏi trang
    const removeVisitRecorded = () => {
        localStorage.removeItem('visitRecorded');
    };

    useEffect(() => {
        // Gán sự kiện cho sự kiện beforeunload hoặc unload
        window.addEventListener('beforeunload', removeVisitRecorded);
        // window.addEventListener('unload', removeVisitRecorded); // Có thể sử dụng unload thay thế

        // Xóa sự kiện khi component unmount (tức là khi người dùng rời khỏi trang web)
        return () => {
            window.removeEventListener('beforeunload', removeVisitRecorded);
            // window.removeEventListener('unload', removeVisitRecorded); // Có thể sử dụng unload thay thế
        };
    }, []);

    const getAccount = async () => {
        if (window.location.pathname === '/auth') return;

        const res = await callFetchAccount();
        if (res.errCode === 0 && res.data.user?.email) {
            dispatch(doGetAccount(res.data));
        }
    };

    const sendVisitData = async () => {
        if (localStorage.getItem('visitRecorded')) {
            return;
        }
        try {
            const response = await axios.get('https://api.ipify.org?format=json');
            console.log(response);
            const ip = response.data.ip;
            const userAgent = navigator.userAgent;

            const res = await siteService.createVisit({ ip, userAgent });
            if (res && res.errCode !== 1) {
                localStorage.setItem('visitRecorded', 'true');
                // notification.success({
                //     message: 'Success',
                //     description: 'Visit recorded successfully',
                // });
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Failed to record visit',
            });
        }
    };

    useEffect(() => {
        getAccount();
        sendVisitData();
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
