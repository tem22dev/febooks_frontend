import { useState } from 'react';
import { Tag, Modal, Col, Form, Input, Row, Select, Upload, Image } from 'antd';
import { PlusOutlined, UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

function AddUser({ open, form, handleCancel, handleOk, confirmLoading }) {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);

    // Handle upload img
    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleChangeAvatar = ({ fileList: newFileList }) => setFileList(newFileList);

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    const handleChangeGender = (value) => {
        console.log(`selected ${value}`);
    };

    return (
        <Modal
            title="Thêm người dùng"
            open={open}
            onOk={handleOk}
            okButtonProps={{ icon: <PlusOutlined /> }}
            okText="Thêm"
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            cancelText="Huỷ bỏ"
            maskClosable={false}
            centered={true}
            width={680}
        >
            <Form form={form} layout="vertical" name="add-user">
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
                        <Form.Item name="gender" label="Giới tính" hasFeedback initialValue="1">
                            <Select
                                style={{ width: 120 }}
                                // onChange={handleChangeGender}
                                options={[
                                    { value: '1', label: '--Giới tính--' },
                                    { value: 'male', label: 'Nam' },
                                    { value: 'female', label: 'Nữ' },
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
                                // onChange={handleChangeGender}
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
                            initialValue="1"
                        >
                            <Select
                                style={{ width: 120 }}
                                name="active"
                                // onChange={handleChangeGender}
                                options={[
                                    { value: '1', label: <Tag color="blue">Hoạt động</Tag> },
                                    { value: '0', label: <Tag color="red">Dừng</Tag> },
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
                        <Form.Item name="avatar" label="Ảnh đại diện">
                            <>
                                <Upload
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={handlePreview}
                                    onChange={handleChangeAvatar}
                                    maxCount={1}
                                    multiple={false}
                                >
                                    {fileList.length >= 1 ? null : uploadButton}
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
