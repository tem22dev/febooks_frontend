import { useState } from 'react';
import clsx from 'clsx';
import { Card } from 'antd';

import styles from './Auth.module.scss';
import Login from '../../components/Login';
import Register from '../../components/Register';

function Auth() {
    const [activeTabKey, setActiveTabKey] = useState('login');

    const tabList = [
        {
            key: 'login',
            label: 'Đăng nhập',
        },
        {
            key: 'register',
            label: 'Đăng ký',
        },
    ];

    const contentList = {
        login: <Login />,
        register: <Register setKey={setActiveTabKey} login={tabList[0].key} />,
    };

    const onTabChange = (key) => {
        setActiveTabKey(key);
    };

    return (
        <div className={clsx(styles.wrapper)}>
            <Card className={clsx(styles.card)} tabList={tabList} activeTabKey={activeTabKey} onTabChange={onTabChange}>
                {contentList[activeTabKey]}
            </Card>
        </div>
    );
}

export default Auth;
