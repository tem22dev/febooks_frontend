import clsx from 'clsx';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaReact } from 'react-icons/fa';
import { FiShoppingCart } from 'react-icons/fi';
import { IoSearchOutline } from 'react-icons/io5';
import { Divider, Badge, Drawer, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, message } from 'antd';
import { useNavigate } from 'react-router';

import styles from './Header.module.scss';
import { callLogout } from '../../../services/authServices';
import { doLogoutAction } from '../../../redux/account/accountSlice';

function Header() {
    const [openDrawer, setOpenDrawer] = useState(false);
    const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
    const user = useSelector((state) => state.account.user);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        const res = await callLogout();

        if (!!res && res.errCode === 0) {
            dispatch(doLogoutAction());
            message.success('Đăng xuất thành công', 3);
            navigate('/');
        }
    };

    const items = [
        {
            label: <label style={{ cursor: 'pointer' }}>Quản lý tài khoản</label>,
            key: 'account',
        },
        {
            label: (
                <label style={{ cursor: 'pointer' }} onClick={() => handleLogout()}>
                    Đăng xuất
                </label>
            ),
            key: 'logout',
        },
    ];
    return (
        <>
            <div className={clsx(styles.container)}>
                <header className={clsx(styles.header)}>
                    <div className={clsx(styles.header_top)}>
                        <div
                            className={clsx(styles.header_toggle)}
                            onClick={() => {
                                setOpenDrawer(true);
                            }}
                        >
                            ☰
                        </div>
                        <div className={clsx(styles.header_logo)}>
                            <Link to="/">
                                <span className={clsx(styles.logo)}>
                                    <FaReact className={clsx(styles.rotate, styles.icon_react)} /> Febooks
                                </span>
                            </Link>
                            <Input
                                className={clsx(styles.input_search)}
                                placeholder="Basic usage"
                                prefix={<IoSearchOutline style={{ color: 'rgba(0,0,0,.25)' }} />}
                            />
                        </div>
                    </div>
                    <nav className={clsx(styles.header_bottom)}>
                        <ul id={clsx(styles.navigation)} className={clsx(styles.navigation)}>
                            <li className={clsx(styles.navigation_item)}>
                                <Badge count={5} size={'small'}>
                                    <FiShoppingCart className={clsx(styles.icon_cart)} />
                                </Badge>
                            </li>
                            <li className={clsx(styles.navigation_item, styles.mobile)}>
                                <Divider type="vertical" />
                            </li>
                            <li className={clsx(styles.navigation_item, styles.mobile)}>
                                {!isAuthenticated ? (
                                    <span onClick={() => navigate('/auth')} style={{ fontSize: '1.6rem' }}>
                                        Tài Khoản
                                    </span>
                                ) : (
                                    <Dropdown menu={{ items }} trigger={['click']}>
                                        <a onClick={(e) => e.preventDefault()}>
                                            <Space>
                                                Welcome {user?.fullname}
                                                <DownOutlined />
                                            </Space>
                                        </a>
                                    </Dropdown>
                                )}
                            </li>
                        </ul>
                    </nav>
                </header>
            </div>
            <Drawer title="Menu chức năng" placement="left" onClose={() => setOpenDrawer(false)} open={openDrawer}>
                <p>Quản lý tài khoản</p>
                <Divider />

                <p>Đăng xuất</p>
                <Divider />
            </Drawer>
        </>
    );
}

export default Header;
