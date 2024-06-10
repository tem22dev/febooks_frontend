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
import { PlusOutlined, LoadingOutlined, LinkOutlined } from '@ant-design/icons';

import * as siteService from '../../../../services/siteService';

function AddUser(props) {
    const { openModalCreate, setOpenModalCreate } = props;
    const [isSubmit, setIsSubmit] = useState(false);

    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);

    const [imageUrl, setImageUrl] = useState('');

    const [dataSlider, setDataSlider] = useState([]);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const onFinish = async (values) => {
        const { url, position, status } = values;
        setIsSubmit(true);
        const res = await siteService.createSlider({
            url,
            position,
            status,
            filename: dataSlider[0]?.name,
        });
        if (res && res.errCode === 0) {
            message.success('Tạo mới slider thành công');
            form.resetFields();
            setOpenModalCreate(false);
            await props.fetchListSlider();
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

    const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
        const res = await siteService.uploadSliderImg(file);
        if (res && res.file) {
            setDataSlider([
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
            setDataSlider([]);
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
            title="Thêm slider"
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
            width={600}
        >
            <Divider />
            <Form form={form} layout="vertical" name="add-slider" onFinish={onFinish}>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item name="url" label="Liên kết đến" hasFeedback>
                            <Input prefix={<LinkOutlined />} type="text" placeholder="Liên kết" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item
                            name="position"
                            label="Vị trí"
                            rules={[{ required: true }]}
                            hasFeedback
                            initialValue={1}
                        >
                            <Select
                                style={{ width: 120 }}
                                name="position"
                                options={[
                                    { value: 1, label: 'Vị trí số 1' },
                                    { value: 2, label: 'Vị trí số 2' },
                                    { value: 3, label: 'Vị trí số 3' },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="status"
                            label="Trạng thái"
                            rules={[{ required: true }]}
                            hasFeedback
                            initialValue={1}
                        >
                            <Select
                                style={{ width: 120 }}
                                name="status"
                                options={[
                                    { value: 1, label: <Tag color="blue">Hoạt động</Tag> },
                                    { value: 0, label: <Tag color="red">Dừng</Tag> },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="filename" label="Ảnh slider" valuePropName="checked">
                            <>
                                <Upload
                                    name="filename"
                                    listType="picture-card"
                                    maxCount={1}
                                    multiple={false}
                                    customRequest={handleUploadFileSlider}
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                    onRemove={(file) => handleRemoveFile(file, 'slider')}
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
                <Row gutter={16}></Row>
            </Form>
        </Modal>
    );
}

export default AddUser;
