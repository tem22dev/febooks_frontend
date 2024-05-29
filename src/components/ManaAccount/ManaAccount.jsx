import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { Form, Input, Button, message, notification, Modal, Tabs } from 'antd';
import { LockOutlined, InfoCircleOutlined } from '@ant-design/icons';

import styles from './ManaAccount.module.scss';
import UpdateInfo from '../UpdateInfo';
import ChangePass from '../ChangePass';

function ManaAccount(props) {
    const { isModalOpen, setIsModalOpen } = props;

    const items = [
        {
            key: 1,
            label: 'Cập nhật thông tin',
            children: <UpdateInfo />,
            icon: <InfoCircleOutlined />,
        },
        {
            key: 2,
            label: 'Đổi mật khẩu',
            children: <ChangePass />,
            icon: <LockOutlined />,
        },
    ];

    return (
        <Modal
            centered={true}
            title="Quản lý tài khoản"
            open={isModalOpen}
            maskClosable={false}
            footer={null}
            onCancel={() => setIsModalOpen(false)}
            width={600}
        >
            <Tabs defaultActiveKey="1" items={items} />
        </Modal>
    );
}

export default ManaAccount;
