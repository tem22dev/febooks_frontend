import { useEffect, useState } from 'react';
import { Layout, Card, Row, Col, Statistic } from 'antd';
import clsx from 'clsx';
import CountUp from 'react-countup';
import { Line } from '@ant-design/charts';

import * as siteService from '../../../services/siteService';
import styles from './Dashboard.module.scss';

function Dashboard() {
    const { Content } = Layout;
    const [counterOrder, setCounterOrder] = useState(0);
    const [counterGenre, setCounterGenre] = useState(0);
    const [counterUser, setCounterUser] = useState(0);
    const [counterFollow, setCounterFollow] = useState(0);
    const [revenueData, setRevenueData] = useState([]);

    const formatter = (value) => <CountUp end={value} separator="," />;

    useEffect(() => {
        const fetchCounter = async () => {
            const resCounterOrder = await siteService.counterOrder();
            const resCounterGenre = await siteService.counterGenre();
            const resCounterFollow = await siteService.counterFollow();
            const resCounterUser = await siteService.counterUser();

            if (resCounterUser) setCounterUser(resCounterUser.data);
            if (resCounterOrder) setCounterOrder(resCounterOrder.data);
            if (resCounterGenre) setCounterGenre(resCounterGenre.data);
            if (resCounterFollow) setCounterFollow(resCounterFollow.data);
        };

        const fetchRevenueData = async () => {
            const resRevenueData = await siteService.getRevenue();
            if (resRevenueData && resRevenueData.errCode === 0) {
                const formattedData = resRevenueData.data.map((item) => ({
                    month: item.month,
                    total_revenue: parseFloat(item.total_revenue), // đảm bảo giá trị là số
                }));
                setRevenueData(formattedData);
            }
        };

        fetchCounter();
        fetchRevenueData();
    }, []);

    const revenueConfig = {
        data: revenueData,
        xField: 'month',
        yField: 'total_revenue',
        label: {
            formatter: (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value),
        },
        point: {
            size: 5,
            shape: 'diamond',
        },
        // tooltip: {
        //     showMarkers: false,
        //     fields: ['total_revenue'], // Chỉ định trường được sử dụng trong tooltip
        //     formatter: (datum) => ({
        //         name: 'Total Revenue',
        //         value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
        //             datum.total_revenue,
        //         ),
        //     }),
        // },
        state: {
            active: {
                style: {
                    shadowBlur: 4,
                    stroke: '#000',
                    fill: 'red',
                },
            },
        },
        interactions: [{ type: 'marker-active' }],
    };

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
                        <Statistic title="Lượng Theo Dõi" value={counterFollow} formatter={formatter} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false}>
                        <Statistic title="Tổng Người Dùng" value={counterUser} formatter={formatter} />
                    </Card>
                </Col>
                <Col span={24}>
                    <Card bordered={false}>
                        <Line {...revenueConfig} />
                    </Card>
                </Col>
            </Row>
        </Content>
    );
}

export default Dashboard;

// import { useEffect, useState } from 'react';
// import { Layout, Card, Row, Col, Statistic } from 'antd';
// import clsx from 'clsx';
// import CountUp from 'react-countup';
// import { Line } from '@ant-design/charts';

// import * as siteService from '../../../services/siteService';
// import styles from './Dashboard.module.scss';

// function Dashboard() {
//     const { Content } = Layout;
//     const [counterOrder, setCounterOrder] = useState(0);
//     const [counterGenre, setCounterGenre] = useState(0);
//     const [counterUser, setCounterUser] = useState(0);
//     const [counterFollow, setCounterFollow] = useState(0);
//     const [revenueData, setRevenueData] = useState([]);

//     const formatter = (value) => <CountUp end={value} separator="," />;

//     useEffect(() => {
//         const fetchCounter = async () => {
//             const resCounterOrder = await siteService.counterOrder();
//             const resCounterGenre = await siteService.counterGenre();
//             const resCounterFollow = await siteService.counterFollow();
//             const resCounterUser = await siteService.counterUser();

//             if (resCounterUser) setCounterUser(resCounterUser.data);
//             if (resCounterOrder) setCounterOrder(resCounterOrder.data);
//             if (resCounterGenre) setCounterGenre(resCounterGenre.data);
//             if (resCounterFollow) setCounterFollow(resCounterFollow.data);
//         };

//         const fetchRevenueData = async () => {
//             const resRevenueData = await siteService.getRevenue();
//             if (resRevenueData && resRevenueData.errCode === 0) {
//                 const formattedData = resRevenueData.data.map((item) => ({
//                     month: item.month,
//                     total_revenue: parseFloat(item.total_revenue), // đảm bảo giá trị là số
//                 }));
//                 setRevenueData(formattedData);
//             }
//         };

//         fetchCounter();
//         fetchRevenueData();
//     }, []);

//     const revenueConfig = {
//         data: revenueData,
//         xField: 'month',
//         yField: 'total_revenue',
//         label: {
//             formatter: (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value),
//         },
//         point: {
//             size: 5,
//             shape: 'diamond',
//         },
//         tooltip: {
//             showMarkers: false,
//             formatter: (datum) => ({
//                 name: 'Total Revenue',
//                 value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(datum),
//             }),
//         },
//         state: {
//             active: {
//                 style: {
//                     shadowBlur: 4,
//                     stroke: '#000',
//                     fill: 'red',
//                 },
//             },
//         },
//         interactions: [{ type: 'marker-active' }],
//     };

//     return (
//         <Content className={clsx(styles.wrapper)}>
//             <Row gutter={[12, 12]}>
//                 <Col span={6}>
//                     <Card bordered={false}>
//                         <Statistic title="Tổng Đơn Hàng" value={counterOrder} formatter={formatter} />
//                     </Card>
//                 </Col>
//                 <Col span={6}>
//                     <Card bordered={false}>
//                         <Statistic title="Thể Loại Sách" value={counterGenre} formatter={formatter} />
//                     </Card>
//                 </Col>
//                 <Col span={6}>
//                     <Card bordered={false}>
//                         <Statistic title="Lượng Theo Dõi" value={counterFollow} formatter={formatter} />
//                     </Card>
//                 </Col>
//                 <Col span={6}>
//                     <Card bordered={false}>
//                         <Statistic title="Tổng Người Dùng" value={counterUser} formatter={formatter} />
//                     </Card>
//                 </Col>
//                 <Col span={24}>
//                     <Card bordered={false}>
//                         <Line {...revenueConfig} />
//                     </Card>
//                 </Col>
//             </Row>
//         </Content>
//     );
// }

// export default Dashboard;
