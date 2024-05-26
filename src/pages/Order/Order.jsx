import { useEffect, useState } from 'react';
import {
    Col,
    Divider,
    InputNumber,
    Row,
    Empty,
    Button,
    Steps,
    Result,
    Form,
    Input,
    Radio,
    message,
    notification,
} from 'antd';
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import styles from './Order.module.scss';
import { doUpdateCartAction, doDeleteItemCartAction, doPlaceOrderAction } from '../../redux/order/orderSlice';
import * as orderService from '../../services/orderService';

const ENV = import.meta.env;

const Order = () => {
    const [form] = Form.useForm();
    const carts = useSelector((state) => state.order.carts);
    const user = useSelector((state) => state.account.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [totalPrice, setTotalPrice] = useState(0);
    const [currentSteps, setCurrentSteps] = useState(0);
    const [valueRadio, setValueRadio] = useState(1);
    const [isSubmit, setIsSubmit] = useState(false);

    useEffect(() => {
        if (carts && carts.length > 0) {
            let sum = 0;
            carts.map((item) => {
                sum += item.quantity * item.detail.price;
            });
            setTotalPrice(sum);
        } else {
            setTotalPrice(0);
        }
    }, [carts]);

    const handleOnChangeInput = (value, book) => {
        if (!value || value < 1) return;
        if (!isNaN(value)) {
            dispatch(doUpdateCartAction({ quantity: value, detail: book, id: book.id }));
        }
    };

    const onFinish = async (values) => {
        setIsSubmit(true);
        const detailOrder = carts.map((item) => {
            return {
                bookName: item.detail.title,
                quantity: item.quantity,
                id: item.id,
            };
        });

        const data = {
            userID: user.id,
            name: values.name,
            deliveryAddress: values.address,
            phone: values.phone,
            totalPrice: totalPrice,
            detail: detailOrder,
        };

        const res = await orderService.placeOrder(data);
        if (res && res.data) {
            message.success('Đặt hàng thành công!🎉');
            dispatch(doPlaceOrderAction());
            setCurrentSteps(2);
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.errMessage,
            });
        }
        setIsSubmit(false);
    };

    return (
        <div className={clsx(styles.container)} style={{ background: '#efefef', padding: '20px 0' }}>
            <div className={clsx(styles.order_container)}>
                <div className={clsx(styles.steps)}>
                    <Steps
                        size="small"
                        current={currentSteps}
                        status="finish"
                        items={[
                            {
                                title: 'Đơn hàng',
                                // description: 'Chọn sản phẩm',
                            },
                            {
                                title: 'Đặt hàng',
                                // description: 'Chỉnh số lượng sản phẩm',
                            },
                            {
                                title: 'Thanh toán',
                                // description: 'Chọn phương thức thanh toán',
                            },
                        ]}
                    />
                </div>
                {currentSteps === 0 && (
                    <Row gutter={[20, 20]}>
                        <Col md={18} xs={24}>
                            {carts?.map((item) => {
                                const currentBookPrice = item?.detail?.price * item.quantity ?? 0;
                                return (
                                    <div className={clsx(styles.order_book)} key={item.id}>
                                        <div className={clsx(styles.book_content)}>
                                            <img
                                                className={clsx(styles.img)}
                                                src={`${ENV.VITE_BASE_URL_BACKEND}/images/books/${item.detail.thumbnail}`}
                                            />
                                            <div className={clsx(styles.title)}>{item.detail.title}</div>
                                            <div className={clsx(styles.price)}>{item.detail.price}</div>
                                        </div>
                                        <div className={clsx(styles.action)}>
                                            <div className={clsx(styles.quantity)}>
                                                <InputNumber
                                                    value={item.quantity}
                                                    onChange={(value) => handleOnChangeInput(value, item)}
                                                />
                                            </div>
                                            <div className={clsx(styles.sum)}>
                                                Tổng:{' '}
                                                {new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                }).format(currentBookPrice)}
                                            </div>
                                            <DeleteOutlined
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => dispatch(doDeleteItemCartAction({ id: item.id }))}
                                                twoToneColor="#eb2f96"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                            {carts.length === 0 && (
                                <Empty
                                    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                                    imageStyle={{ height: 60 }}
                                    description={<span>Không có sản phẩm nào trong giỏ hàng</span>}
                                >
                                    <Button type="primary" onClick={() => navigate('/')}>
                                        Thêm sản phẩm
                                    </Button>
                                </Empty>
                            )}
                        </Col>
                        <Col md={6} xs={24}>
                            <div className={clsx(styles.order_sum)}>
                                <div className={clsx(styles.calculate)}>
                                    <span> Tạm tính</span>
                                    <span>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                            totalPrice || 0,
                                        )}
                                    </span>
                                </div>
                                <Divider style={{ margin: '10px 0' }} />
                                <div className={clsx(styles.calculate)}>
                                    <span> Tổng tiền</span>
                                    <span className={clsx(styles.sum_final)}>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                            totalPrice || 0,
                                        )}
                                    </span>
                                </div>
                                <Divider style={{ margin: '10px 0' }} />
                                <button onClick={() => setCurrentSteps(1)}>Mua Hàng ({carts?.length ?? 0})</button>
                            </div>
                        </Col>
                    </Row>
                )}
                {currentSteps === 1 && (
                    <Row gutter={[20, 20]}>
                        <Col md={18} xs={24}>
                            {carts?.map((item) => {
                                const currentBookPrice = item?.detail?.price * item.quantity ?? 0;
                                return (
                                    <div className={clsx(styles.order_book)} key={item.id}>
                                        <div className={clsx(styles.book_content)}>
                                            <img
                                                className={clsx(styles.img)}
                                                src={`${ENV.VITE_BASE_URL_BACKEND}/images/books/${item.detail.thumbnail}`}
                                            />
                                            <div className={clsx(styles.title)}>{item.detail.title}</div>
                                            <div className={clsx(styles.price)}>{item.detail.price}</div>
                                        </div>
                                        <div className={clsx(styles.action)}>
                                            <div className={clsx(styles.quantity)}>
                                                <InputNumber
                                                    value={item.quantity}
                                                    onChange={(value) => handleOnChangeInput(value, item)}
                                                />
                                            </div>
                                            <div className={clsx(styles.sum)}>
                                                Tổng:{' '}
                                                {new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                }).format(currentBookPrice)}
                                            </div>
                                            <DeleteOutlined
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => dispatch(doDeleteItemCartAction({ id: item.id }))}
                                                twoToneColor="#eb2f96"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                            {carts.length === 0 && (
                                <Empty
                                    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                                    imageStyle={{ height: 60 }}
                                    description={<span>Không có sản phẩm nào trong giỏ hàng</span>}
                                >
                                    <Button type="primary" onClick={() => navigate('/')}>
                                        Thêm sản phẩm
                                    </Button>
                                </Empty>
                            )}
                        </Col>
                        <Col md={6} xs={24}>
                            <div className={clsx(styles.order_sum)}>
                                <Form form={form} name="payment" onFinish={onFinish} layout="vertical">
                                    <Form.Item
                                        label="Tên người nhận"
                                        name="name"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập tên người nhận!',
                                            },
                                        ]}
                                        hasFeedback
                                        initialValue={user.fullname}
                                    >
                                        <Input placeholder="Họ tên" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Số điện thoại"
                                        name="phone"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập số điện thoại người nhận!',
                                            },
                                            {
                                                len: 10,
                                                message: 'Số điện thoại không hợp lệ!',
                                            },
                                        ]}
                                        hasFeedback
                                        initialValue={user.phone}
                                    >
                                        <Input type="number" placeholder="Số điện thoại" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Địa chỉ nhận hàng"
                                        name="address"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập địa chỉ nhận hàng!',
                                            },
                                        ]}
                                        hasFeedback
                                    >
                                        <Input.TextArea />
                                    </Form.Item>
                                </Form>

                                <p>Hình thức thanh toán</p>
                                <Radio.Group value={valueRadio}>
                                    <Radio value={1}>Thanh toán khi nhận hàng</Radio>
                                </Radio.Group>
                                <Divider style={{ margin: '10px 0' }} />
                                <div className={clsx(styles.calculate)}>
                                    <span> Tổng tiền</span>
                                    <span className={clsx(styles.sum_final)}>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                            totalPrice || 0,
                                        )}
                                    </span>
                                </div>
                                <Divider style={{ margin: '10px 0' }} />
                                <button onClick={() => form.submit()} disabled={isSubmit}>
                                    {isSubmit && (
                                        <span>
                                            <LoadingOutlined /> &nbsp;
                                        </span>
                                    )}
                                    Mua Hàng ({carts?.length ?? 0})
                                </button>
                            </div>
                        </Col>
                    </Row>
                )}
                {currentSteps === 2 && (
                    <Result
                        status="success"
                        title="Đặt hàng thành công!!🎉🎉"
                        subTitle="Febooks sẽ liên hệ với bạn sớm nhất có thể"
                        extra={[
                            <Button type="primary" key="console" onClick={() => navigate('/')}>
                                Tiếp Tục Mua Hàng
                            </Button>,
                            <Button key="buy">Xem Lịch Sử Đơn Hàng</Button>,
                        ]}
                    />
                )}
            </div>
        </div>
    );
};

export default Order;
