import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NotFound from './pages/NotFound';
import NotRole from './pages/NotRole';
import DefaultLayout, { HeaderOnly } from './layouts';
import AdminLayout from './layouts/admin';
import { publicRoutes, privateRoutes } from './routes';

function App() {
    return (
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
                            errorElement={<NotFound />}
                        />
                    );
                })}
                {privateRoutes.map((route, index) => {
                    const Page = route.component;
                    let Layout = AdminLayout;

                    const authorized = true;

                    if (authorized) {
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                                errorElement={<NotFound />}
                            />
                        );
                    } else {
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <HeaderOnly>
                                        <NotRole />
                                    </HeaderOnly>
                                }
                            />
                        );
                    }
                })}
            </Routes>
        </Router>
    );
}

export default App;
