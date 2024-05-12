import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Layout, Table } from 'antd';
import qs from 'qs';

import DetailOrder from './DetailOrder';
import styles from './Order.module.scss';

function Order() {
    const { Content } = Layout;

    const [openDetailOrder, setOpenDetailOrder] = useState(false);

    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    const closeDetailOrder = () => {
        setOpenDetailOrder(false);
    };

    // Handle Detail Order
    const showDetailOrder = () => {
        setOpenDetailOrder(true);
    };

    const columns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'name',
            sorter: true,
            render: (name) => (
                <a onClick={showDetailOrder}>
                    {name.first} {name.last}
                </a>
            ),
        },
        {
            title: 'Người đặt',
            dataIndex: 'gender',
            filters: [
                { text: 'Male', value: 'male' },
                { text: 'Female', value: 'female' },
            ],
            width: '20%',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
        },
        {
            title: 'Tổng đơn hàng',
            dataIndex: 'sumPrice',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'sumPrice',
        },
        {
            title: 'Giao hàng',
            dataIndex: 'sumPrice',
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'createAt',
        },
    ];

    const getRandomuserParams = (params) => ({
        results: params.pagination?.pageSize,
        page: params.pagination?.current,
        ...params,
    });

    const fetchData = () => {
        setLoading(true);
        fetch(`https://randomuser.me/api?${qs.stringify(getRandomuserParams(tableParams))}`)
            .then((res) => res.json())
            .then(({ results }) => {
                setData(results);
                setLoading(false);
                setTableParams({
                    ...tableParams,
                    pagination: {
                        ...tableParams.pagination,
                        total: 200,
                        // 200 is mock data, you should read it from server
                        // total: data.totalCount,
                    },
                });
            });
    };

    useEffect(() => {
        fetchData();
    }, [tableParams.pagination?.current, tableParams.pagination?.pageSize]);

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });

        // `dataSource` is useless since `pageSize` changed
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };

    return (
        <>
            <Content className={clsx(styles.wrapper)}>
                <div className={clsx(styles.wrapper_table)}>
                    <Table
                        columns={columns}
                        rowKey={(record) => record.login.uuid}
                        dataSource={data}
                        pagination={tableParams.pagination}
                        loading={loading}
                        onChange={handleTableChange}
                        title={() => 'Danh sách đơn hàng'}
                    />
                </div>
            </Content>
            <DetailOrder show={openDetailOrder} onClose={closeDetailOrder} />
        </>
    );
}

export default Order;
