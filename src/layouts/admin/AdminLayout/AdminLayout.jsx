import { Layout } from 'antd';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const { Content } = Layout;

function DefaultLayout({ children }) {
    return (
        <Layout>
            <Sidebar />
            <Layout>
                <Header />
                <Content>{children}</Content>
            </Layout>
        </Layout>
    );
}

export default DefaultLayout;
