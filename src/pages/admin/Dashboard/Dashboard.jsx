import { Layout, theme, Card, Row, Col, Statistic } from 'antd';
import clsx from 'clsx';

import CountUp from 'react-countup';

import styles from './Dashboard.module.scss';

function Dashboard() {
    const { Content } = Layout;
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const formatter = (value) => <CountUp end={value} separator="," />;

    return (
        <Content className={clsx(styles.wrapper)}>
            <Row gutter={[12, 12]}>
                <Col span={6}>
                    <Card bordered={false}>
                        <Statistic title="Tổng Đơn Hàng" value={123321} formatter={formatter} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false}>
                        <Statistic title="Thể Loại Sách" value={112893} formatter={formatter} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false}>
                        <Statistic title="Lượng Theo Dõi" value={112893} formatter={formatter} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false}>
                        <Statistic title="Tổng Người Dùng" value={112893} formatter={formatter} />
                    </Card>
                </Col>
            </Row>
        </Content>
    );
}

export default Dashboard;
