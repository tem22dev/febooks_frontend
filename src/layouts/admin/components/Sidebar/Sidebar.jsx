import React from 'react';
import { useSelector } from 'react-redux';
import { DashboardOutlined, BookOutlined, UsergroupAddOutlined, DollarOutlined } from '@ant-design/icons';
import { Layout, Menu, Avatar, Space } from 'antd';
import clsx from 'clsx';

import styles from './Sidebar.module.scss';
import images from '../../../../assets/images';
import { Link } from 'react-router-dom';

function Sidebar() {
    const { Sider } = Layout;
    const app = useSelector((state) => state.app);

    const items = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: <Link to="/admin/dash">Bảng điều khiển</Link>,
        },
        {
            key: 'book',
            icon: <BookOutlined />,
            label: 'Quản lý sách',
            children: [
                {
                    key: 'book-sub-1',
                    label: <Link to="/admin/dash/books">CRUD Books</Link>,
                },
            ],
        },
        {
            key: 'user',
            icon: <UsergroupAddOutlined />,
            label: 'Quản lý người dùng',
            children: [
                {
                    key: 'user-sub-1',
                    label: <Link to="/admin/dash/users">CRUD Users</Link>,
                },
            ],
        },
        {
            key: 'order',
            icon: <DollarOutlined />,
            label: 'Quản lý đơn hàng',
            children: [
                {
                    key: 'order-sub-1',
                    label: <Link to="/admin/dash/orders">CRUD Orders</Link>,
                },
            ],
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
                    <Avatar shape="square" size="default" src={images.logo} />
                </Space>
                {app.isCollapsedSidebar || <p className={styles.heading}>Febooks Admin</p>}
            </div>
            <Menu theme="light" mode="inline" defaultSelectedKeys={['dashboard']} items={listItem} />
        </Sider>
    );
}

export default Sidebar;
