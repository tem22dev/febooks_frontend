import { useDispatch, useSelector } from 'react-redux';
import { Button, Layout, Avatar, Space, Dropdown, theme, message } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, DownOutlined } from '@ant-design/icons';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';

import styles from './Header.module.scss';
import images from '../../../../assets/images';
import { toggleSidebar } from '../../../../redux/app/appSlice';
import { callLogout } from '../../../../services/authServices';
import { doLogoutAction } from '../../../../redux/account/accountSlice';

const ENV = import.meta.env;

function Header() {
    const { Header } = Layout;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.account.user);

    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const app = useSelector((state) => state.app);

    const items = [
        {
            label: <label style={{ cursor: 'pointer' }}>Quản lý tài khoản</label>,
            key: 'account',
        },
        {
            label: (
                <Link to="/" style={{ cursor: 'pointer' }}>
                    Trang chủ
                </Link>
            ),
            key: 'home',
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

    const handleLogout = async () => {
        const res = await callLogout();

        if (!!res && res.errCode === 0) {
            dispatch(doLogoutAction());
            message.success('Đăng xuất thành công', 3);
            navigate('/auth');
        }
    };

    return (
        <Header style={{ padding: 0, background: colorBgContainer }} className={clsx(styles.header)}>
            <Button
                type="text"
                icon={app.isCollapsedSidebar ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => dispatch(toggleSidebar())}
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                }}
            />
            <Space size={16} className={clsx(styles.wrapper)}>
                <Dropdown menu={{ items }} trigger={['click']}>
                    <div className={clsx(styles.account)} onClick={(e) => e.preventDefault()}>
                        <Avatar
                            shape="circle"
                            size="default"
                            src={`${ENV.VITE_BASE_URL_BACKEND}/images/accounts/${user.avatar}`}
                            className={clsx(styles.avatar)}
                        />
                        <div className={clsx(styles.name)}>{user?.fullname}</div>
                        <DownOutlined />
                    </div>
                </Dropdown>
            </Space>
        </Header>
    );
}

export default Header;
