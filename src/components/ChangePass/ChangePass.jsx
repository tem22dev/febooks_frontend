import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Form, Input, Button, message, notification, Row, Col, Upload, Avatar, Select } from 'antd';
import { UploadOutlined, SaveOutlined, LockOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';

import * as userService from '../../services/userService';
import styles from './ChangePass.module.scss';
import { doLoginAccount } from '../../redux/account/accountSlice';

const ENV = import.meta.env;

function ChangePass() {
    const [form] = Form.useForm();
    const idUser = useSelector((state) => state.account.user.id);

    // Handle submit form
    const onFinish = async (values) => {
        values.id = idUser;
        const res = await userService.updatePassUser(values);
        console.log(res);
        if (res && res.errCode === 0) {
            form.setFieldValue('password', '');
            form.setFieldValue('newPassword', '');
            form.setFieldValue('confirmPass', '');
            message.success(res.message);
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.errMessage,
            });
        }
    };

    return (
        <div style={{ marginLeft: '30px' }}>
            <Form form={form} layout="vertical" name="update-pass-user" onFinish={onFinish}>
                <Row gutter={16}>
                    <Col span={16}>
                        <Form.Item
                            label="Mật khẩu hiện tại"
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
                            initialValue=""
                        >
                            <Input.Password prefix={<LockOutlined />} type="password" placeholder="Password" />
                        </Form.Item>
                    </Col>
                    <Col span={16}>
                        <Form.Item
                            label="Mật khẩu mới"
                            name="newPassword"
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
                            initialValue=""
                        >
                            <Input.Password prefix={<LockOutlined />} type="password" placeholder="Mật khẩu hiện tại" />
                        </Form.Item>
                    </Col>
                    <Col span={16}>
                        <Form.Item
                            label="Xác nhận mật khẩu"
                            name="confirmPass"
                            dependencies={['newPassword']}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng xác nhận mật khẩu!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu mới bạn nhập không khớp!'));
                                    },
                                }),
                            ]}
                            hasFeedback
                            initialValue=""
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" type="password" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                            <Button
                                style={{ marginLeft: 'auto' }}
                                type="primary"
                                htmlType="submit"
                                icon={<SaveOutlined />}
                            >
                                Cập nhật
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}

export default ChangePass;
