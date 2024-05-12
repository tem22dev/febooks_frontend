import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import clsx from 'clsx';
import { Form, Input, Button, Checkbox, message, notification } from 'antd';
import { LockOutlined, MailOutlined, LoginOutlined } from '@ant-design/icons';

import * as authServices from '../../services/authServices';
import { doLoginAccount } from '../../redux/account/accountSlice';
// eslint-disable-next-line no-unused-vars
import styles from './Login.module.scss';

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isSubmit, setIsSubmit] = useState(false);

    const onFinish = (values) => {
        const { email, password } = values;
        setIsSubmit(true);

        const fetchApiLogin = async () => {
            const result = await authServices.login({ email, password });
            setIsSubmit(false);

            if (!!result && result.errCode === 0) {
                localStorage.setItem('access_token', result.data.accessToken);
                dispatch(doLoginAccount(result.data.user));

                navigate('/');
                message.success(result.message, 3);
            } else if (result.errCode !== 0) {
                notification.error({
                    message: 'Không thể đăng nhập',
                    description: result.errMessage,
                    duration: 5,
                });
            }
        };

        fetchApiLogin();
    };

    return (
        <Form name="login" initialValues={{ remember: true }} onFinish={onFinish} layout="vertical">
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
                label="Mật khẩu"
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập mật khẩu!',
                    },
                ]}
                hasFeedback
            >
                <Input.Password prefix={<LockOutlined />} type="password" placeholder="Password" />
            </Form.Item>
            <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>
                        Ghi nhớ tôi<i></i>
                    </Checkbox>
                </Form.Item>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" block loading={isSubmit} icon={<LoginOutlined />}>
                    Đăng nhập
                </Button>
            </Form.Item>
        </Form>
    );
}

export default Login;
