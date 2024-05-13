import { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { useSelector } from 'react-redux';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const { Content } = Layout;

function DefaultLayout({ children }) {
    const isCollapsedSidebar = useSelector((state) => state.app.isCollapsedSidebar);
    const [width, setWidth] = useState(isCollapsedSidebar ? '80px' : '220px');

    useEffect(() => {
        isCollapsedSidebar ? setWidth('80px') : setWidth('220px');
    }, [isCollapsedSidebar]);

    return (
        <Layout hasSider>
            <Sidebar />
            <Layout style={{ marginLeft: width }}>
                <Header />
                <Content>{children}</Content>
            </Layout>
        </Layout>
    );
}

export default DefaultLayout;
