import { useState } from 'react';
import clsx from 'clsx';
import {
    LogoutOutlined,
    CloudDownloadOutlined,
    PlusCircleOutlined,
    ReloadOutlined,
    DeleteOutlined,
    EditOutlined,
    QuestionCircleOutlined,
} from '@ant-design/icons';
import { Layout, Button, Form, Space, Table, Tag, Popconfirm } from 'antd';

import SearchUser from './SearchUser';
import DetailUser from './DetailUser';
import UpdateUser from './UpdateUser';
import AddUser from './AddUser';
import ImportUser from './ImportUser';
import styles from './User.module.scss';

function User() {
    const { Content } = Layout;

    const [openDetailUser, setOpenDetailUser] = useState(false);

    const [formUpdateUser] = Form.useForm();
    const [openUpdateUser, setOpenUpdateUser] = useState(false);
    const [confirmLoadingUpdateUser, setConfirmLoadingUpdateUser] = useState(false);

    const [formAddUser] = Form.useForm();
    const [openAddUser, setOpenAddUser] = useState(false);
    const [confirmLoadingAddUser, setConfirmLoadingAddUser] = useState(false);

    const [openImportUser, setOpenImportUser] = useState(false);
    const [confirmLoadingImportUser, setConfirmLoadingImportUser] = useState(false);

    // Event search
    const onFinishSearch = (values) => {
        console.log('Received values of form: ', values);
    };

    // Handle Detail user
    const showDetailUser = () => {
        setOpenDetailUser(true);
    };

    const closeDetailUser = () => {
        setOpenDetailUser(false);
    };

    // Handle update user
    const showModalUpdateUser = () => {
        setOpenUpdateUser(true);
    };

    const handleCancelUpdateUser = () => {
        formUpdateUser.resetFields();
        console.log('Clicked cancel button');
        setOpenUpdateUser(false);
    };

    const handleOkUpdateUser = () => {
        setConfirmLoadingUpdateUser(true);
        setTimeout(() => {
            setOpenUpdateUser(false);
            setConfirmLoadingUpdateUser(false);
        }, 1500);
    };

    // Handle add user
    const showModalAddUser = () => {
        setOpenAddUser(true);
    };

    const handleCancelAddUser = () => {
        formAddUser.resetFields();
        console.log('Clicked cancel button');
        setOpenAddUser(false);
    };

    const handleOkAddUser = () => {
        setConfirmLoadingAddUser(true);
        setTimeout(() => {
            setOpenAddUser(false);
            setConfirmLoadingAddUser(false);
        }, 1500);
    };

    // Handle import user
    const showModalImportUser = () => {
        setOpenImportUser(true);
    };

    const handleCancelImportUser = () => {
        console.log('Clicked cancel button');
        setOpenImportUser(false);
    };

    const handleOkImportUser = () => {
        setConfirmLoadingImportUser(true);
        setTimeout(() => {
            setOpenImportUser(false);
            setConfirmLoadingImportUser(false);
        }, 1500);
    };

    // Columns table
    const columns = [
        {
            title: 'Id',
            dataIndex: 'key',
            sorter: {
                compare: (a, b) => a.key - b.key,
            },
            sortDirections: ['descend'],
            render: (text) => <a onClick={showDetailUser}>{text}</a>,
        },
        {
            title: 'Tên hiển thị',
            dataIndex: 'fullname',
            sorter: {
                compare: (a, b) => a.fullname.length - b.fullname.length,
                multiple: 5,
            },
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: {
                compare: (a, b) => a.email.length - b.email.length,
                multiple: 4,
            },
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            sorter: {
                compare: (a, b) => a.phone - b.phone,
                multiple: 3,
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'active',
            sorter: {
                compare: (a, b) => a.active.length - b.active.length,
                multiple: 2,
            },
            render: (text) => {
                let color = text === 'Dừng' ? 'volcano' : 'green';
                return (
                    <Tag color={color} key={text}>
                        {text.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            sorter: {
                compare: (a, b) => a.role.length - b.role.length,
                multiple: 1,
            },
            render: (text) => {
                let color = text === 'admin' ? 'geekblue' : 'green';
                let name = text === 'admin' ? 'Quản trị viên' : 'Người dùng';
                return (
                    <Tag color={color} key={text}>
                        {name.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: 'Thao tác',
            dataIndex: 'action',
            render: () => (
                <Space>
                    <Tag color="warning" style={{ cursor: 'pointer' }} onClick={showModalUpdateUser}>
                        <EditOutlined />
                    </Tag>
                    <Popconfirm
                        placement="topLeft"
                        title="Xác nhận xoá user"
                        description="Bạn có chắc chắn muốn xoá user này ?"
                        okText="Xác nhận"
                        cancelText="Huỷ"
                        icon={<QuestionCircleOutlined style={{ color: 'red', cursor: 'pointer' }} />}
                    >
                        <Tag color="error" style={{ cursor: 'pointer' }}>
                            <DeleteOutlined />
                        </Tag>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Data table
    const data = [
        {
            key: '1',
            fullname: 'Trung Em',
            email: 'trungem@gmail.com',
            phone: '0912312311',
            active: 'Hoạt động',
            role: 'admin',
        },
        {
            key: '2',
            fullname: 'Nhật Đăng',
            email: 'dang@gmail.com',
            phone: '0912312314',
            active: 'Dừng',
            role: 'user',
        },
    ];

    // Event table
    const onChangeTable = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return (
        <Content className={clsx(styles.wrapper)}>
            <SearchUser onFinish={onFinishSearch} />

            <div className={clsx(styles.wrapper_table)}>
                <div className={clsx(styles.heading_table)}>
                    <h1 className={clsx(styles.title_table)}>Danh sách tài khoản</h1>
                    <Space className={clsx(styles.wrapper_btn)}>
                        <Button type="primary" icon={<LogoutOutlined />}>
                            Export
                        </Button>
                        <Button type="primary" icon={<CloudDownloadOutlined />} onClick={showModalImportUser}>
                            Import
                        </Button>
                        <Button type="primary" icon={<PlusCircleOutlined />} onClick={showModalAddUser}>
                            Thêm mới
                        </Button>
                        <Button type="text" icon={<ReloadOutlined />} />
                    </Space>
                </div>

                <Table columns={columns} dataSource={data} onChange={onChangeTable} />

                <DetailUser show={openDetailUser} onClose={closeDetailUser} />

                <UpdateUser
                    open={openUpdateUser}
                    form={formUpdateUser}
                    handleCancel={handleCancelUpdateUser}
                    handleOk={handleOkUpdateUser}
                    confirmLoading={confirmLoadingUpdateUser}
                />

                <AddUser
                    open={openAddUser}
                    form={formAddUser}
                    handleCancel={handleCancelAddUser}
                    handleOk={handleOkAddUser}
                    confirmLoading={confirmLoadingAddUser}
                />

                <ImportUser
                    open={openImportUser}
                    handleCancel={handleCancelImportUser}
                    handleOk={handleOkImportUser}
                    confirmLoading={confirmLoadingImportUser}
                />
            </div>
        </Content>
    );
}

export default User;
