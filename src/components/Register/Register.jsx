import clsx from 'clsx';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

import * as authServices from '../../services/authServices';
import styles from './Register.module.scss';

function Register() {
    const onFinish = (values) => {
        const fetchApi = async () => {
            const result = await authServices.register(values);
            console.log(result);
        };

        fetchApi();
    };

    return (
        <Form name="register" initialValues={{ remember: true }} onFinish={onFinish} layout="vertical">
            <Form.Item
                label="Họ tên"
                name="fullname"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập họ tên!',
                    },
                ]}
                hasFeedback
            >
                <Input prefix={<UserOutlined />} placeholder="Họ tên" />
            </Form.Item>
            <Form.Item
                label="E-mail"
                name="email"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập email!',
                    },
                    {
                        type: 'email',
                        message: 'Không phải email hợp lệ!',
                    },
                ]}
                hasFeedback
            >
                <Input prefix={<MailOutlined />} type="email" placeholder="Email" />
            </Form.Item>
            <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập số điện thoại!',
                    },
                    {
                        len: 10,
                        message: 'Số điện thoại không hợp lệ!',
                    },
                ]}
                hasFeedback
            >
                <Input prefix={<PhoneOutlined />} type="number" placeholder="Số điện thoại" />
            </Form.Item>
            <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập mật khẩu!',
                    },
                    {
                        min: 6,
                        max: 32,
                        message: 'Độ dài mật khẩu từ 6 đến 32 ký tự!',
                    },
                ]}
                hasFeedback
            >
                <Input.Password prefix={<LockOutlined />} type="password" placeholder="Password" />
            </Form.Item>

            <Form.Item
                label="Xác nhận mật khẩu"
                name="confirmPass"
                dependencies={['password']}
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng xác nhận mật khẩu!',
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Mật khẩu mới bạn nhập không khớp!'));
                        },
                    }),
                ]}
                hasFeedback
            >
                <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" type="password" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" block>
                    Đăng ký
                </Button>
            </Form.Item>
        </Form>
    );
}

export default Register;
