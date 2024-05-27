import clsx from 'clsx';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaReact } from 'react-icons/fa';
import { FiShoppingCart } from 'react-icons/fi';
import { IoSearchOutline } from 'react-icons/io5';
import { Divider, Badge, Drawer, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, message, Avatar, Popover } from 'antd';
import { useNavigate } from 'react-router';

import styles from './Header.module.scss';
import { callLogout } from '../../../services/authServices';
import { doLogoutAction } from '../../../redux/account/accountSlice';
import ManaAccount from '../../../components/ManaAccount';

const ENV = import.meta.env;

function Header() {
    const [openDrawer, setOpenDrawer] = useState(false);
    const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
    const user = useSelector((state) => state.account.user);
    const carts = useSelector((state) => state.order.carts);
    const [isModalOpen, setIsModalOpen] = useState(false);
    let total = 0;

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

    let items = [
        {
            label: (
                <label style={{ cursor: 'pointer' }} onClick={() => setIsModalOpen(true)}>
                    Quản lý tài khoản
                </label>
            ),
            key: 'account',
        },
        {
            label: (
                <label style={{ cursor: 'pointer' }} onClick={() => navigate('/book/history')}>
                    Lịch sử mua hàng
                </label>
            ),
            key: 'history',
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

    if (user?.role === 'admin') {
        items.unshift({
            label: (
                <Link to="admin/dash" style={{ cursor: 'pointer' }}>
                    Trang quản trị
                </Link>
            ),
            key: 'admin',
        });
    }

    if (carts?.length > 0) {
        for (const item of carts) {
            total += item.quantity;
        }
    }

    const contentPopover = () => {
        return (
            <div className={clsx(styles.pop_cart_body)}>
                <div className={clsx(styles.pop_cart_content)}>
                    {carts?.map((item) => {
                        return (
                            <div className={clsx(styles.book)} key={item.id}>
                                <div className={clsx(styles.img_book)}>
                                    <img
                                        src={`${ENV.VITE_BASE_URL_BACKEND}/images/books/${item.detail.thumbnail}`}
                                        alt={item.detail.title}
                                    />
                                </div>
                                <div className={clsx(styles.content)}>
                                    <div className={clsx(styles.title)}>{item.detail.title}</div>
                                    <span className={clsx(styles.price_item)}>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                            item?.detail?.price,
                                        )}{' '}
                                        x {item.quantity}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className={clsx(styles.pop_cart_footer)}>
                    <div className={clsx(styles.price_total)}>
                        <span>Tổng cộng</span>
                        <strong className={clsx(styles.price)}>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(1000000)}{' '}
                        </strong>
                    </div>
                    <button className={clsx(styles.btn_cart)} onClick={() => navigate('/book/order')}>
                        Xem giỏ hàng
                    </button>
                </div>
            </div>
        );
    };

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
                            <li className={clsx(styles.navigation_item)} onClick={() => navigate('/book/order')}>
                                <Popover
                                    className={clsx(styles.popover_carts)}
                                    placement="bottom"
                                    rootClassName="popover-cart"
                                    title="Sản phẩm mới thêm"
                                    content={contentPopover}
                                    arrow={true}
                                >
                                    <Badge count={total} size={'small'} showZero>
                                        <FiShoppingCart className={clsx(styles.icon_cart)} />
                                    </Badge>
                                </Popover>
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
                                                <Avatar
                                                    shape="circle"
                                                    size="default"
                                                    src={`${ENV.VITE_BASE_URL_BACKEND}/images/accounts/${user.avatar}`}
                                                    className={clsx(styles.avatar)}
                                                />
                                                {user?.fullname}
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
            <ManaAccount isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </>
    );
}

export default Header;
