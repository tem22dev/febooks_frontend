import { useEffect, useState } from 'react';
import { Modal, Col, Form, Input, Row, Select, Upload, Image, Tag, Divider, message, notification } from 'antd';
import { PlusOutlined, SaveOutlined, LoadingOutlined, LinkOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import * as siteService from '../../../../services/siteService';

const ENV = import.meta.env;

function UpdateSlider(props) {
    const [form] = Form.useForm();
    const { openModal, setOpenModal, dataUpdate, setDataUpdate } = props;
    const [isSubmit, setIsSubmit] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [dataSlider, setDataSlider] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [initForm, setInitForm] = useState(null);

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

    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done' && info.file.originFileObj) {
            getBase64(info.file.originFileObj, (url) => {
                setLoading(false);
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

    const handleRemoveFile = () => {
        setDataSlider([]);
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

    useEffect(() => {
        if (dataUpdate?.id) {
            const arrSlider = [
                {
                    uid: uuidv4(),
                    name: dataUpdate.filename,
                    status: 'done',
                    url: `${ENV.VITE_BASE_URL_BACKEND}/images/sliders/${dataUpdate.filename}`,
                },
            ];

            const init = {
                id: dataUpdate.id,
                url: dataUpdate.url ?? '',
                position: dataUpdate.position,
                status: dataUpdate.status === true ? 1 : 0,
                filename: { fileList: arrSlider },
            };
            setInitForm(init);
            setDataSlider(arrSlider);
            form.setFieldsValue(init);
        }
        return () => {
            form.resetFields();
        };
    }, [dataUpdate]);

    const onFinish = async (values) => {
        setIsSubmit(true);
        const filename = dataSlider[0]?.name;
        if (!!filename) {
            values.filename = filename;
        }
        const res = await siteService.updateSlider(values);
        if (res && res.errCode === 0) {
            message.success(res.message);
            setOpenModal(false);
            await props.fetchListSlider();
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
            title="Cập nhật slider"
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
                setOpenModal(false);
                setInitForm(null);
            }}
            cancelText="Trở lại"
            maskClosable={false}
            centered={true}
            width={600}
        >
            <Form form={form} layout="vertical" name="update-slider" onFinish={onFinish}>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item name="url" label="Liên kết đến" hasFeedback>
                            <Input prefix={<LinkOutlined />} type="text" placeholder="Liên kết" />
                        </Form.Item>
                    </Col>
                    <Col span={0}>
                        <Form.Item name="id" label="Id" hasFeedback hidden>
                            <Input type="text" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item name="position" label="Vị trí" rules={[{ required: true }]} hasFeedback>
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
                        <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]} hasFeedback>
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
                        <Form.Item name="filename" label="Ảnh slider">
                            <Upload
                                name="filename"
                                listType="picture-card"
                                maxCount={1}
                                multiple={false}
                                customRequest={handleUploadFileSlider}
                                beforeUpload={beforeUpload}
                                onChange={handleChange}
                                onRemove={handleRemoveFile}
                                onPreview={handlePreview}
                                valuePropName="fileList"
                                defaultFileList={initForm?.filename?.fileList ?? []}
                            >
                                <div>
                                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            </Upload>
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
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}

export default UpdateSlider;
