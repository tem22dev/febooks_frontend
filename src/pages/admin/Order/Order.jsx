import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Layout, Table, Select, Tag, message, notification } from 'antd';
import qs from 'qs';
import moment from 'moment';

import DetailOrder from './DetailOrder';
import styles from './Order.module.scss';
import * as orderService from '../../../services/orderService';

function Order() {
    const { Content } = Layout;
    const [openDetailOrder, setOpenDetailOrder] = useState(false);
    const [dataOrder, setDataOrder] = useState([]);
    const [order, setOrder] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDataOrder = async () => {
            setLoading(true);
            const res = await orderService.getAllOrder();
            if (res && res.data) {
                const data = res.data.map((item) => ({
                    idOrder: item.id,
                    idUser: item.UserID,
                    updatedAt: item.updatedAt,
                    totalPrice: item.totalPrice,
                    status: item.status,
                    phone: item.phone,
                    deliveryAddress: item.deliveryAddress,
                    fullname: item.User.fullname,
                    createdAt: item.createdAt,
                    orderDetail: item.OrderDetails,
                }));

                setDataOrder(data);
            }
            setLoading(false);
        };

        fetchDataOrder();
    }, []);

    // Update status order
    const handleChangeStatusOrder = async (value, record) => {
        const data = {
            status: value,
            id: record.idOrder,
        };

        const res = await orderService.updateStatusOrder(data);
        if (res && res.errCode === 0) {
            message.success(res.message);
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.errMessage,
            });
        }
        console.log(res);
    };

    const columns = [
        {
            title: '#',
            dataIndex: '#',
            render: (name, record, index) => index + 1,
        },
        {
            title: 'Mã đơn',
            width: '8%',
            dataIndex: 'idOrder',
            render: (text, record) => (
                <a
                    onClick={() => {
                        setOpenDetailOrder(true);
                        setOrder(record);
                    }}
                >
                    {text}
                </a>
            ),
        },
        {
            title: 'Người đặt',
            dataIndex: 'fullname',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'deliveryAddress',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
        },
        {
            title: 'Tổng đơn hàng',
            dataIndex: 'totalPrice',
            render: (text) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (text, record) => (
                <Select
                    defaultValue={text}
                    style={{ width: '140px' }}
                    onChange={(value) => handleChangeStatusOrder(value, record)}
                    options={[
                        { value: 0, label: <Tag color="#f50">Huỷ đơn</Tag> },
                        { value: 1, label: <Tag color="#108ee9">Chờ nhận hàng</Tag> },
                        { value: 2, label: <Tag color="#87d068">Đã giao hàng</Tag> },
                        { value: 3, label: <Tag color="#2db7f5">Chờ xác nhận</Tag> },
                    ]}
                />
            ),
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'createdAt',
            defaultSortOrder: 'descend',
            sorter: {
                compare: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
                multiple: 1,
            },
            render: (date) => moment(date).format('DD-MM-YYYY hh:mm:ss'),
        },
    ];

    return (
        <>
            <Content className={clsx(styles.wrapper)}>
                <div className={clsx(styles.wrapper_table)}>
                    <Table
                        columns={columns}
                        rowKey={(record) => record.idOrder}
                        dataSource={dataOrder}
                        loading={loading}
                        pagination={{
                            showSizeChanger: true,
                            showTotal: (total, range) => (
                                <div>
                                    {range[0]}-{range[1]} trên {total} dòng
                                </div>
                            ),
                        }}
                        title={() => <h1 style={{ fontSize: '1.6rem', margin: 0 }}>Danh sách đơn hàng</h1>}
                    />
                </div>
            </Content>
            <DetailOrder data={order} show={openDetailOrder} onClose={() => setOpenDetailOrder(false)} />
        </>
    );
}

export default Order;
