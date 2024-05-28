import { useEffect, useState } from 'react';
import { Layout, theme, Card, Row, Col, Statistic } from 'antd';
import clsx from 'clsx';
import CountUp from 'react-countup';

import * as siteService from '../../../services/siteService';
import styles from './Dashboard.module.scss';

function Dashboard() {
    const { Content } = Layout;
    const [counterOrder, setCounterOrder] = useState(0);
    const [counterGenre, setCounterGenre] = useState(0);
    const [counterUser, setCounterUser] = useState(0);
    const formatter = (value) => <CountUp end={value} separator="," />;

    useEffect(() => {
        const fetchCounter = async () => {
            const resCounterOrder = await siteService.counterOrder();
            const resCounterGenre = await siteService.counterGenre();
            // const resCounterFollow = await siteService.counterFollow();
            const resCounterUser = await siteService.counterUser();

            if (resCounterUser) setCounterUser(resCounterUser.data);
            if (resCounterOrder) setCounterOrder(resCounterOrder.data);
            if (resCounterGenre) setCounterGenre(resCounterGenre.data);
        };

        fetchCounter();
    }, []);

    return (
        <Content className={clsx(styles.wrapper)}>
            <Row gutter={[12, 12]}>
                <Col span={6}>
                    <Card bordered={false}>
                        <Statistic title="Tổng Đơn Hàng" value={counterOrder} formatter={formatter} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false}>
                        <Statistic title="Thể Loại Sách" value={counterGenre} formatter={formatter} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false}>
                        <Statistic title="Lượng Theo Dõi" value={112893} formatter={formatter} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false}>
                        <Statistic title="Tổng Người Dùng" value={counterUser} formatter={formatter} />
                    </Card>
                </Col>
            </Row>
        </Content>
    );
}

export default Dashboard;
