import { useState } from 'react';
import { Tag, Modal, Col, Form, Input, Row, Select, Upload, Image } from 'antd';
import { PlusOutlined, SaveOutlined } from '@ant-design/icons';

function UpdateUser({ open, form, handleCancel, handleOk, confirmLoading }) {
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
            title="Cập nhật người dùng"
            open={open}
            onOk={handleOk}
            okButtonProps={{ icon: <SaveOutlined /> }}
            okText="Lưu thay đổi"
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            cancelText="Trở lại"
            maskClosable={false}
            centered={true}
            width={680}
        >
            <Form form={form} layout="vertical">
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
                    <Col span={6}>
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
                    <Col span={6}>
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

export default UpdateUser;
