import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Table, Tag } from 'antd';
import ReactJson from 'react-json-view';
import moment from 'moment';

import * as orderService from '../../services/orderService';
import styles from './History.module.scss';

function History() {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            const res = await orderService.getHistoryOrder();
            if (res && res?.data) {
                setHistory(res.data);
            }
        };

        fetchHistory();
    }, []);

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdAt',
            defaultSortOrder: 'descend',
            sorter: {
                compare: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
                multiple: 1,
            },
            render: (date) => moment(date).format('DD-MM-YYYY hh:mm:ss'),
        },
        {
            title: 'Tổng số tiền',
            dataIndex: 'totalPrice',
            sorter: {
                compare: (a, b) => a.totalPrice - b.totalPrice,
                multiple: 2,
            },
            render: (price) => `${new Intl.NumberFormat().format(price)} đ`,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (text) => {
                return text === 0 ? (
                    <Tag color="#f50">Huỷ đơn</Tag>
                ) : text === 1 ? (
                    <Tag color="#108ee9">Chờ nhận hàng</Tag>
                ) : text === 2 ? (
                    <Tag color="#87d068">Đã giao hàng</Tag>
                ) : (
                    <Tag color="#2db7f5">Chờ xác nhận</Tag>
                );
            },
        },
        {
            title: 'Chi tiết đơn hàng',
            dataIndex: 'OrderDetails',
            width: 500,
            render: (text) => {
                return <ReactJson src={text} collapsed={true} />;
            },
        },
    ];

    return (
        <div style={{ background: '#f5f5fa', padding: '16px 20px' }}>
            <div
                className={clsx(styles.book)}
                style={{ maxWidth: 1440, margin: '0 auto', minHeight: 'calc(100vh - 150px)' }}
            >
                <div style={{ padding: '20px', background: '#fff', borderRadius: 5 }}>
                    <h1 style={{ fontSize: '2rem', fontFamily: 'inherit' }}>Lịch sử mua hàng</h1>
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={history}
                        pagination={{
                            showSizeChanger: true,
                            showTotal: (total, range) => (
                                <div>
                                    {range[0]}-{range[1]} trên {total} dòng
                                </div>
                            ),
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default History;
