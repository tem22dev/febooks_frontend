import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Form, Input, Button, message, notification, Row, Col, Upload, Avatar, Select } from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';

import * as userService from '../../services/userService';
import styles from './UpdateInfo.module.scss';
import { doUpdateInfoAction } from '../../redux/account/accountSlice';

const ENV = import.meta.env;

function UpdateInfo() {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const idUser = useSelector((state) => state.account.user.id);
    const [dataAvatar, setDataAvatar] = useState([]);
    const [initForm, setInitForm] = useState(null);
    const [dataUpdate, setDataUpdate] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await userService.getUserById(idUser);
            if (res && res.errCode === 0) {
                setDataUpdate(res.data);
            }
        };

        fetchData();
    }, []);

    // Set fieldsValue
    useEffect(() => {
        if (dataUpdate?.id) {
            const arrAvatar = [
                {
                    uid: uuidv4(),
                    name: dataUpdate.avatar,
                    status: 'done',
                    url: `${ENV.VITE_BASE_URL_BACKEND}/images/accounts/${dataUpdate.avatar}`,
                },
            ];

            const init = {
                id: dataUpdate.id,
                fullname: dataUpdate.fullname,
                email: dataUpdate.email,
                phone: dataUpdate.phone,
                gender: dataUpdate?.gender ?? '',
                address: dataUpdate?.address ?? '',
            };
            setInitForm(init);
            setDataAvatar(arrAvatar);
            form.setFieldsValue(init);
        }
        return () => {
            form.resetFields();
        };
    }, [dataUpdate]);

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Bạn chỉ có thể tải lên tệp JPG/PNG!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Hình ảnh phải nhỏ hơn 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleUploadFileAvatar = async ({ file, onSuccess, onError }) => {
        const res = await userService.uploadAvatarImg(file);
        if (res && res.file) {
            setDataAvatar([
                {
                    name: res.file.filename,
                    uid: file.uid,
                    url: `${ENV.VITE_BASE_URL_BACKEND}/images/accounts/${res.file.filename}`,
                },
            ]);
            message.success('Tải ảnh thành công 🎉');
            onSuccess('ok');
        } else {
            onError('Đã có lỗi khi tải ảnh lên');
        }
    };

    // Handle submit form
    const onFinish = async (values) => {
        const avatar = dataAvatar[0]?.name;
        if (!!avatar) {
            values.avatar = avatar;
        }
        const res = await userService.updateUser(values);

        if (res && res.errCode === 0) {
            dispatch(doUpdateInfoAction({ avatar: avatar, phone: values.phone, fullname: values.fullname }));
            message.success(res.message);

            localStorage.removeItem('access_token');
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.errMessage,
            });
        }
    };

    return (
        <div>
            <Form form={form} layout="vertical" name="update-info-user" onFinish={onFinish}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="fullname"
                            label="Họ tên"
                            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                            hasFeedback
                        >
                            <Input placeholder="Họ tên" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="email"
                            label="E-Mail"
                            rules={[{ required: true, message: 'Vui lòng nhập email' }]}
                            hasFeedback
                        >
                            <Input placeholder="Email" disabled={true} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[{ required: true, message: 'Nhập số điện thoại' }]}
                            hasFeedback
                        >
                            <Input placeholder="Số điện thoại" type="number" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="gender" label="Giới tính" hasFeedback initialValue="">
                            <Select
                                style={{ width: 120 }}
                                options={[
                                    { value: '', label: '--Gới tính--' },
                                    { value: 'Nam', label: 'Nam' },
                                    { value: 'Nữ', label: 'Nữ' },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="address" label="Địa chỉ">
                            <Input.TextArea rows={4} placeholder="Địa chỉ bạn ở hoặc nơi giao hàng" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="avatar" label="Ảnh đại diện" valuePropName="checked">
                            <div>
                                <div style={{ marginBottom: '14px', marginLeft: '10px' }}>
                                    <Avatar size={90} src={<img src={`${dataAvatar[0]?.url}`} alt="avatar" />} />
                                </div>
                                <Upload
                                    name="avatar"
                                    maxCount={1}
                                    multiple={false}
                                    customRequest={handleUploadFileAvatar}
                                    beforeUpload={beforeUpload}
                                    showUploadList={false}
                                >
                                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                                </Upload>
                            </div>
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

export default UpdateInfo;
