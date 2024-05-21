import { useEffect, useState } from 'react';
import clsx from 'clsx';
import * as XLSX from 'xlsx';
import {
    LogoutOutlined,
    CloudDownloadOutlined,
    PlusCircleOutlined,
    ReloadOutlined,
    DeleteOutlined,
    EditOutlined,
    QuestionCircleOutlined,
} from '@ant-design/icons';
import { Layout, Button, Form, Space, Table, Tag, Popconfirm, message, notification } from 'antd';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { FaEdit } from 'react-icons/fa';

import SearchUser from './SearchUser';
import DetailUser from './DetailUser';
import UpdateUser from './UpdateUser';
import AddUser from './AddUser';
import ImportUser from './ImportUser';
import styles from './User.module.scss';
import * as userService from '../../../services/userService';

function User() {
    const { Content } = Layout;

    const [openDetailUser, setOpenDetailUser] = useState(false);
    const [dataDetailUser, setDataDetailUser] = useState({});

    const [openUpdateUser, setOpenUpdateUser] = useState(false);
    const [dataUpdate, setDataUpdate] = useState({});

    const [openAddUser, setOpenAddUser] = useState(false);

    const [openImportUser, setOpenImportUser] = useState(false);

    const [users, setUsers] = useState([]);
    const [loadingTable, setLoadingTable] = useState(false);

    // Handle search user
    const onFinishSearch = async (values) => {
        const { fullname, email, phone } = values;
        let params = {};
        if (fullname) {
            params = { fullname, ...params };
        }
        if (email) {
            params = { email, ...params };
        }
        if (phone) {
            params = { phone, ...params };
        }
        const listUser = await userService.searchUser(params);
        if (listUser.data.length === 0) {
            message.info('Không tìm thấy người dùng', 3);
            return;
        }
        setUsers(listUser.data);
    };

    // Handle export data user
    const handleExportData = () => {
        if (users.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(users);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            XLSX.writeFile(workbook, 'ExportUser.csv');
        }
    };

    // Handle Detail user
    const showDetailUser = (record) => {
        setDataDetailUser(record);
        setOpenDetailUser(true);
    };

    const closeDetailUser = () => {
        setOpenDetailUser(false);
    };

    // Handle delete user
    const handleDeleteUser = async (id) => {
        const res = await userService.deleteUser(id);
        if (res && res.errCode === 0) {
            message.success(res.message);
            fetchListUser();
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.errMessage,
            });
        }
    };

    // Columns table
    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            sorter: {
                compare: (a, b) => a.id - b.id,
            },
            sortDirections: ['descend', 'ascend'],
            defaultSortOrder: 'descend',
            render: (text, record) => {
                return <a onClick={() => showDetailUser(record)}>{text}</a>;
            },
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
                let color = text === false ? 'volcano' : 'green';
                let name = text === false ? 'Dừng' : 'Hoạt động';
                return (
                    <Tag color={color} key={text}>
                        {name.toUpperCase()}
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
                let color = text === 'admin' ? 'red' : 'blue';
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
            render: (_, record) => (
                <Space>
                    <Tag
                        color="#2db7f5"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            setOpenUpdateUser(true);
                            setDataUpdate(record);
                        }}
                    >
                        <FaEdit />
                    </Tag>
                    <Popconfirm
                        placement="topLeft"
                        title="Xác nhận xoá user"
                        description="Bạn có chắc chắn muốn xoá user này ?"
                        okText="Xác nhận"
                        cancelText="Huỷ"
                        onConfirm={() => handleDeleteUser(record.id)}
                        icon={<QuestionCircleOutlined style={{ color: 'red', cursor: 'pointer' }} />}
                    >
                        <Tag color="#f50" style={{ cursor: 'pointer' }}>
                            <RiDeleteBin5Fill />
                        </Tag>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Get list user
    const fetchListUser = async () => {
        setLoadingTable(true);
        const listUser = await userService.getAllUser();

        if (listUser && listUser.errCode === 0) {
            setUsers(listUser.data);
            setLoadingTable(false);
        }
    };

    useEffect(() => {
        fetchListUser();
    }, []);

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
                        <Button type="primary" icon={<LogoutOutlined />} onClick={handleExportData}>
                            Export
                        </Button>
                        <Button type="primary" icon={<CloudDownloadOutlined />} onClick={() => setOpenImportUser(true)}>
                            Import
                        </Button>
                        <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => setOpenAddUser(true)}>
                            Thêm mới
                        </Button>
                        <Button type="text" icon={<ReloadOutlined />} onClick={fetchListUser} />
                    </Space>
                </div>

                <Table
                    columns={columns}
                    dataSource={users}
                    loading={loadingTable}
                    onChange={onChangeTable}
                    rowKey="id"
                    pagination={{
                        showSizeChanger: true,
                        showTotal: (total, range) => (
                            <div>
                                {range[0]}-{range[1]} trên {total} dòng
                            </div>
                        ),
                    }}
                />

                <DetailUser show={openDetailUser} onClose={closeDetailUser} data={dataDetailUser} />

                <UpdateUser
                    openModal={openUpdateUser}
                    setOpenModel={setOpenUpdateUser}
                    dataUpdate={dataUpdate}
                    setDataUpdate={setDataUpdate}
                    fetchListUser={fetchListUser}
                />

                <AddUser
                    openModalCreate={openAddUser}
                    setOpenModalCreate={setOpenAddUser}
                    fetchListUser={fetchListUser}
                />

                <ImportUser
                    openImportUser={openImportUser}
                    setOpenImportUser={setOpenImportUser}
                    fetchListUser={fetchListUser}
                />
            </div>
        </Content>
    );
}

export default User;
