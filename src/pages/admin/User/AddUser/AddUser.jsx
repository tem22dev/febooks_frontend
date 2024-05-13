import { useEffect, useState } from 'react';
import {
    Col,
    Divider,
    Form,
    Input,
    Image,
    InputNumber,
    message,
    Modal,
    notification,
    Row,
    Select,
    Upload,
    Tag,
} from 'antd';
import {
    PlusOutlined,
    UserOutlined,
    LockOutlined,
    MailOutlined,
    PhoneOutlined,
    LoadingOutlined,
} from '@ant-design/icons';

import * as userService from '../../../../services/userService';

function AddUser(props) {
    const { openModalCreate, setOpenModalCreate } = props;
    const [isSubmit, setIsSubmit] = useState(false);

    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);

    const [imageUrl, setImageUrl] = useState('');

    const [dataAvatar, setDataAvatar] = useState([]);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const onFinish = async (values) => {
        const { fullname, password, email, phone, active, address, gender, role } = values;
        setIsSubmit(true);
        const res = await userService.createUser({
            fullname,
            password,
            email,
            phone,
            active,
            address,
            gender,
            role,
            avatar: dataAvatar[0]?.name,
        });
        if (res && res.errCode === 0) {
            message.success('Tạo mới người dùng thành công');
            form.resetFields();
            setOpenModalCreate(false);
            await props.fetchListUser();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.errMessage,
            });
        }
        setIsSubmit(false);
    };

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
            type ? true : setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (url) => {
                type ? false : setLoading(false);
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
        getBase64(file.originFileObj, (url) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        });
    };

    return (
        <Modal
            title="Thêm người dùng"
            open={openModalCreate}
            onOk={() => {
                form.submit();
            }}
            okButtonProps={{ icon: <PlusOutlined /> }}
            okText="Thêm"
            confirmLoading={isSubmit}
            onCancel={() => {
                form.resetFields();
                setIsSubmit(false);
                setOpenModalCreate(false);
            }}
            cancelText="Huỷ bỏ"
            maskClosable={false}
            centered={true}
            width={680}
        >
            <Divider />
            <Form form={form} layout="vertical" name="add-user" onFinish={onFinish}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="fullname"
                            label="Họ tên"
                            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                            hasFeedback
                        >
                            <Input prefix={<UserOutlined />} placeholder="Họ tên" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="email"
                            label="E-Mail"
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
                            <Input prefix={<MailOutlined />} placeholder="Email" type="email" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
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
                    </Col>
                    <Col span={12}>
                        <Form.Item name="gender" label="Giới tính" hasFeedback initialValue="">
                            <Select
                                style={{ width: 120 }}
                                options={[
                                    { value: '', label: '--Giới tính--' },
                                    { value: 'Nam', label: 'Nam' },
                                    { value: 'Nữ', label: 'Nữ' },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                </Row>
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
                        >
                            <Input.Password prefix={<LockOutlined />} type="password" placeholder="Password" />
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
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" type="password" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="role"
                            label="Vai trò"
                            rules={[{ required: true }]}
                            hasFeedback
                            initialValue="user"
                        >
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
                    <Col span={12}>
                        <Form.Item
                            name="active"
                            label="Trạng thái"
                            rules={[{ required: true }]}
                            hasFeedback
                            initialValue={1}
                        >
                            <Select
                                style={{ width: 120 }}
                                name="active"
                                options={[
                                    { value: 1, label: <Tag color="blue">Hoạt động</Tag> },
                                    { value: 0, label: <Tag color="red">Dừng</Tag> },
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

export default AddUser;
