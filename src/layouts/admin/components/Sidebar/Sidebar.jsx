import React from 'react';
import { useSelector } from 'react-redux';
import { Layout, Menu, Avatar, Space } from 'antd';
import clsx from 'clsx';
import { LiaUserEditSolid } from 'react-icons/lia';
import { TfiBookmarkAlt } from 'react-icons/tfi';
import { HiOutlineLanguage } from 'react-icons/hi2';
import { MdOutlineAddHomeWork } from 'react-icons/md';
import {
    DashboardOutlined,
    BookOutlined,
    UsergroupAddOutlined,
    DollarOutlined,
    TruckOutlined,
} from '@ant-design/icons';

import styles from './Sidebar.module.scss';
import images from '../../../../assets/images';
import { Link } from 'react-router-dom';

const ENV = import.meta.env;

function Sidebar() {
    const { Sider } = Layout;
    const app = useSelector((state) => state.app);

    const items = [
        {
            key: '/admin/dash',
            icon: <DashboardOutlined />,
            label: <Link to="/admin/dash">Bảng điều khiển</Link>,
        },
        {
            key: 'book',
            icon: <BookOutlined />,
            label: 'Quản lý sách',
            children: [
                {
                    key: '/admin/dash/books',
                    label: <Link to="/admin/dash/books">Sách</Link>,
                },
                {
                    key: '/admin/dash/books/add',
                    label: <Link to="/admin/dash/books/add">Thêm sách</Link>,
                },
            ],
        },
        {
            key: '/admin/dash/author',
            icon: <LiaUserEditSolid />,
            label: <Link to="/admin/dash/author">Tác giả</Link>,
        },
        {
            key: '/admin/dash/genre',
            icon: <TfiBookmarkAlt />,
            label: <Link to="/admin/dash/genre">Thể loại sách</Link>,
        },
        {
            key: '/admin/dash/language',
            icon: <HiOutlineLanguage />,
            label: <Link to="/admin/dash/language">Ngôn ngữ</Link>,
        },
        {
            key: '/admin/dash/publisher',
            icon: <MdOutlineAddHomeWork />,
            label: <Link to="/admin/dash/publisher">Nhà xuất bản</Link>,
        },
        {
            key: '/admin/dash/supplier',
            icon: <TruckOutlined />,
            label: <Link to="/admin/dash/supplier">Nhà cung cấp</Link>,
        },
        {
            key: '/admin/dash/orders',
            icon: <DollarOutlined />,
            label: <Link to="/admin/dash/orders">Quản lý đơn hàng</Link>,
        },
        {
            key: '/admin/dash/users',
            icon: <UsergroupAddOutlined />,
            label: <Link to="/admin/dash/users">Quản lý người dùng</Link>,
        },
    ];

    const listItem = items.map((item) => {
        if (!!item.children) {
            return {
                key: item.key,
                icon: item.icon,
                label: item.label,
                children: item.children.map((subItem) => {
                    return {
                        key: subItem.key,
                        label: subItem.label,
                    };
                }),
            };
        }
        return {
            key: item.key,
            icon: item.icon,
            label: item.label,
        };
    });

    return (
        <Sider
            trigger={null}
            width={220}
            collapsible
            collapsed={app.isCollapsedSidebar}
            theme="light"
            style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 }}
        >
            <div className={clsx(styles.logo)}>
                <Space wrap size={16}>
                    <Avatar
                        shape="square"
                        size="default"
                        src={`${ENV.VITE_BASE_URL_BACKEND}/images/accounts/febooks.png`}
                    />
                </Space>
                {app.isCollapsedSidebar || <p className={styles.heading}>Febooks Admin</p>}
            </div>
            <Menu
                theme="light"
                mode="inline"
                defaultSelectedKeys={['/admin/dash']}
                selectedKeys={[location.pathname]}
                items={listItem}
            ></Menu>
        </Sider>
    );
}

export default Sidebar;
