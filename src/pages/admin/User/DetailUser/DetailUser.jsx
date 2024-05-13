import { Drawer, Badge, Descriptions, Tag, Avatar } from 'antd';
import moment from 'moment/moment';

const ENV = import.meta.env;

function DetailUser({ show, onClose, data }) {
    const items = [
        {
            key: '1',
            label: 'Id',
            children: data?.key,
        },
        {
            key: '2',
            span: 2,
            label: 'Họ Tên',
            children: data?.fullname,
        },
        {
            key: '3',
            label: 'E-Mail',
            children: data?.email,
        },
        {
            key: '4',
            label: 'Số điện thoại',
            children: data?.phone,
        },
        {
            key: '5',
            label: 'Giới Tính',
            children: data?.gender,
        },
        {
            key: '6',
            label: 'Trạng thái',
            children: data?.active ? (
                <Badge status="processing" text="Hoạt động" />
            ) : (
                <Badge status="error" text="Dừng" />
            ),
        },
        {
            key: '7',
            label: 'Vai trò',
            span: 2,
            children:
                data?.role === 'admin' ? (
                    <Tag color="geekblue">{'Quản trị viên'.toUpperCase()}</Tag>
                ) : (
                    <Tag color="green">{'Người dùng'.toUpperCase()}</Tag>
                ),
        },
        {
            key: '8',
            label: 'Tạo tại',
            children: moment(data?.createdAt).format('DD-MM-YYYY hh:mm:ss'),
        },
        {
            key: '9',
            label: 'Cập nhật',
            span: 2,
            children: moment(data?.updatedAt).format('DD-MM-YYYY hh:mm:ss'),
        },
        {
            key: '10',
            label: 'Ảnh đại diện',
            children: (
                <Avatar
                    shape="square"
                    size="large"
                    src={`${ENV.VITE_BASE_URL_BACKEND}/images/accounts/${data?.avatar}`}
                />
            ),
        },
        {
            key: '11',
            label: 'Địa chỉ',
            span: 2,
            children: data?.address,
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
