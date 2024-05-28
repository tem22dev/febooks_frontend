import { useState } from 'react';
import { Badge, Descriptions, Divider, Drawer, Modal, Upload, Tag, Table } from 'antd';
import moment from 'moment';

function DetailOrder({ data, show, onClose }) {
    const columnsData = [
        {
            title: '#',
            dataIndex: '#',
            render: (name, record, index) => index + 1,
        },
        {
            title: 'Mã sách',
            dataIndex: 'bookID',
        },
        {
            title: 'Tên sách',
            dataIndex: 'bookName',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
        },
    ];

    return (
        <>
            <Drawer title="Xem chi tiết" placement="right" closable={true} onClose={onClose} open={show} width={'50vw'}>
                <Descriptions title="Thông tin đơn hàng" bordered layout="vertical">
                    <Descriptions.Item span={1} label="Id">
                        {data?.idOrder}
                    </Descriptions.Item>

                    <Descriptions.Item span={2} label="Người đặt">
                        {data?.fullname}
                    </Descriptions.Item>

                    <Descriptions.Item label="Số điện thoại" span={1}>
                        {data?.phone}
                    </Descriptions.Item>

                    <Descriptions.Item label="Ngày đặt" span={1}>
                        {moment(data?.createdAt).format('DD-MM-YYYY hh:mm:ss')}
                    </Descriptions.Item>

                    <Descriptions.Item label="Trạng thái" span={1}>
                        {data?.status === 0 ? (
                            <Tag color="#f50">Huỷ đơn</Tag>
                        ) : data?.status === 1 ? (
                            <Tag color="#108ee9">Chờ nhận hàng</Tag>
                        ) : (
                            <Tag color="#87d068">Đã giao hàng</Tag>
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item label="Tổng đơn hàng" span={1}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                            data?.totalPrice,
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item label="Địa chỉ" span={2}>
                        {data?.deliveryAddress}
                    </Descriptions.Item>
                </Descriptions>
                <Divider orientation="left"></Divider>

                <Table columns={columnsData} rowKey={(record) => record?.id} dataSource={data?.orderDetail} />
            </Drawer>
        </>
    );
}

export default DetailOrder;
