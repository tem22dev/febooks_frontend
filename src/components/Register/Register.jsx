import clsx from 'clsx';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

import styles from './Register.module.scss';

function Register() {
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };

    return (
        <Form name="register" initialValues={{ remember: true }} onFinish={onFinish}>
            <Form.Item
                name="fullname"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập họ tên!',
                    },
                ]}
            >
                <Input prefix={<UserOutlined />} placeholder="Fullname" />
            </Form.Item>
            <Form.Item
                name="email"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập họ email!',
                    },
                ]}
            >
                <Input prefix={<MailOutlined />} type="email" placeholder="Email" />
            </Form.Item>
            <Form.Item
                name="phone"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập số điện thoại!',
                    },
                ]}
            >
                <Input prefix={<PhoneOutlined />} type="number" placeholder="Số điện thoại" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập mật khẩu!',
                    },
                ]}
            >
                <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
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
