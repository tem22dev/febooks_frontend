import { useEffect, useState } from 'react';
import { Tag, Modal, Col, Form, Input, Row, Select, Upload, Image, Switch, Divider, message } from 'antd';
import { PlusOutlined, SaveOutlined, LockOutlined, LoadingOutlined } from '@ant-design/icons';
import { BiSolidLockOpen } from 'react-icons/bi';
import { BiSolidLock } from 'react-icons/bi';
import { v4 as uuidv4 } from 'uuid';

import * as userService from '../../../../services/userService';

const ENV = import.meta.env;

function UpdateUser(props) {
    const [form] = Form.useForm();

    const { openModal, setOpenModel, dataUpdate, setDataUpdate } = props;
    const [isSubmit, setIsSubmit] = useState(false);
    const [isChangePass, setIsChangePass] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const [dataAvatar, setDataAvatar] = useState([]);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [loading, setLoading] = useState(false);

    const [initForm, setInitForm] = useState(null);

    // Handle upload img
    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

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

    const handleChange = (info, type) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done' && info.file.originFileObj) {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (url) => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };

    const handleUploadFileAvatar = async ({ file, onSuccess, onError }) => {
        const res = await userService.uploadAvatarImg(file);
        if (res && res.file) {
            setDataAvatar([
                {
                    name: res.file.filename,
                    uid: file.uid,
                },
            ]);
            onSuccess('ok');
        } else {
            onError('Đã có lỗi khi tải ảnh lên');
        }
    };

    const handleRemoveFile = (file, type) => {
        if (type === 'avatar') {
            setDataAvatar([]);
        }
    };

    const handlePreview = async (file) => {
        if (file.url && !file.originFileObj) {
            setPreviewImage(file.url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        } else {
            getBase64(file.originFileObj, (url) => {
                setPreviewImage(url);
                setPreviewOpen(true);
                setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
            });
        }
    };

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
                gender: dataUpdate.gender,
                role: dataUpdate.role,
                active: dataUpdate.active,
                address: dataUpdate.address,
                avatar: { fileList: arrAvatar },
            };
            setInitForm(init);
            setDataAvatar(arrAvatar);
            form.setFieldsValue(init);
        }
        return () => {
            form.resetFields();
        };
    }, [dataUpdate]);

    // Handle submit form
    const onFinish = async (values) => {
        setIsSubmit(true);
        const avatar = dataAvatar[0]?.name;
        if (!!avatar) {
            values.avatar = avatar;
        }
        const res = await userService.updateUser(values);

        if (res && res.errCode === 0) {
            message.success(res.message);
            setOpenModel(false);
            await props.fetchListUser();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.errMessage,
            });
        }
        setIsSubmit(false);
    };

    return (
        <Modal
            forceRender
            title="Cập nhật người dùng"
            open={openModal}
            onOk={() => {
                form.submit();
            }}
            okButtonProps={{ icon: <SaveOutlined /> }}
            okText="Lưu thay đổi"
            confirmLoading={isSubmit}
            onCancel={() => {
                setDataUpdate(null);
                setIsSubmit(false);
                setOpenModel(false);
                setIsChangePass(false);
                setInitForm(null);
            }}
            cancelText="Trở lại"
            maskClosable={false}
            centered={true}
            width={680}
        >
            <Form form={form} layout="vertical" name="update-user" onFinish={onFinish}>
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
                    <Col span={6}>
                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[{ required: true, message: 'Nhập số điện thoại' }]}
                            hasFeedback
                        >
                            <Input placeholder="Số điện thoại" type="number" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
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
                    <Col span={6}>
                        <Form.Item name="role" label="Vai trò" rules={[{ required: true }]} hasFeedback>
                            <Select
                                style={{ width: 120 }}
                                name="role"
                                options={[
                                    { value: 'user', label: <Tag color="green">Người dùng</Tag> },
                                    { value: 'admin', label: <Tag color="magenta">Quản trị viên</Tag> },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="active" label="Trạng thái" rules={[{ required: true }]} hasFeedback>
                            <Select
                                style={{ width: 120 }}
                                name="active"
                                options={[
                                    { value: true, label: <Tag color="blue">Hoạt động</Tag> },
                                    { value: false, label: <Tag color="red">Dừng</Tag> },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Divider orientation="left">
                    <Switch
                        checked={isChangePass}
                        checkedChildren={<BiSolidLockOpen />}
                        unCheckedChildren={<BiSolidLock />}
                        onChange={() => {
                            setIsChangePass(!isChangePass);
                        }}
                    />
                </Divider>
                {isChangePass && (
                    <Row gutter={16}>
                        <Col span={12}>
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
                                initialValue=""
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    type="password"
                                    placeholder="Password"
                                    disabled={!isChangePass}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
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
                                initialValue=""
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Xác nhận mật khẩu"
                                    type="password"
                                    disabled={!isChangePass}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                )}
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="address" label="Địa chỉ">
                            <Input.TextArea rows={4} placeholder="Địa chỉ bạn ở hoặc nơi giao hàng" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="avatar" label="Ảnh đại diện" valuePropName="checked">
                            <>
                                <Upload
                                    name="avatar"
                                    listType="picture-card"
                                    maxCount={1}
                                    multiple={false}
                                    customRequest={handleUploadFileAvatar}
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                    onRemove={(file) => handleRemoveFile(file, 'avatar')}
                                    onPreview={handlePreview}
                                    valuePropName="fileList"
                                    defaultFileList={initForm?.avatar?.fileList ?? []}
                                >
                                    <div>
                                        {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </>
                        </Form.Item>
                        {previewImage && (
                            <Image
                                wrapperStyle={{ display: 'none' }}
                                preview={{
                                    visible: previewOpen,
                                    onVisibleChange: (visible) => setPreviewOpen(visible),
                                    afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                }}
                                src={previewImage}
                            />
                        )}
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}

export default UpdateUser;
