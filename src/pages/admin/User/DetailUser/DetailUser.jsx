import { Drawer, Badge, Descriptions, Tag } from 'antd';

function DetailUser({ show, onClose }) {
    const items = [
        {
            key: '1',
            label: 'Id',
            children: '1',
        },
        {
            key: '2',
            span: 2,
            label: 'Họ Tên',
            children: 'Nguyễn Trung Em',
        },
        {
            key: '3',
            label: 'E-Mail',
            children: 'bakhia@gmail.com',
        },
        {
            key: '4',
            label: 'Số điện thoại',
            children: '0912312332',
        },
        {
            key: '5',
            label: 'Giới Tính',
            children: 'Nam',
        },
        {
            key: '6',
            label: 'Trạng thái',
            children: <Badge status="processing" text="Hoạt động" />,
        },
        {
            key: '7',
            label: 'Vai trò',
            span: 2,
            children: <Tag color="geekblue">{'Quản trị viên'.toUpperCase()}</Tag>,
        },
        {
            key: '8',
            label: 'Order time',
            children: '2018-04-24 18:00:00',
        },
        {
            key: '9',
            label: 'Usage Time',
            span: 2,
            children: '2019-04-24 18:00:00',
        },
        {
            key: '10',
            label: 'Ảnh đại diện',
            children: 'Ảnh đại diện',
        },
        {
            key: '11',
            label: 'Địa chỉ',
            span: 2,
            children: (
                <>
                    Data disk type: MongoDB
                    <br />
                    Database version: 3.4
                    <br />
                    Package: dds.mongo.mid
                    <br />
                </>
            ),
        },
    ];

    return (
        <>
            <Drawer title="Xem chi tiết" placement="right" closable={true} onClose={onClose} open={show} width={540}>
                <Descriptions title="Thông tin người dùng" layout="vertical" bordered items={items} />
            </Drawer>
        </>
    );
}

export default DetailUser;
