import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
    Button,
    Col,
    Divider,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    notification,
    Spin,
    Row,
    Select,
    Upload,
    DatePicker,
    Layout,
    AutoComplete,
} from 'antd';
import { LoadingOutlined, PlusOutlined, RollbackOutlined } from '@ant-design/icons';
import { FaRegEdit } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

import styles from './UpdateBook.module.scss';
import * as bookService from '../../../../services/bookService';
import TextEditor from '../../../../components/TextEditor';

const ENV = import.meta.env;

const UpdateBook = () => {
    const { Content } = Layout;
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);

    const [loading, setLoading] = useState(false);
    const [loadingSlider, setLoadingSlider] = useState(false);

    const [imageUrl, setImageUrl] = useState('');

    const [desc, setDesc] = useState('');
    const [date, setDate] = useState();

    const [dataThumbnail, setDataThumbnail] = useState([]);
    const [dataSlider, setDataSlider] = useState([]);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [initForm, setInitForm] = useState(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    // Category
    const [listCateAuthor, setListCateAuthor] = useState([]);
    const [listCateGenre, setListCateGenre] = useState([]);
    const [listCatePublisher, setListCatePublisher] = useState([]);
    const [listCateSupplier, setListCateSupplier] = useState([]);
    const [listCateLanguage, setListCateLanguage] = useState([]);

    // Get data book update
    const fetchDataBook = async (id) => {
        try {
            const dataUpdate = await bookService.getBookById(id);
            return dataUpdate;
        } catch (error) {
            console.error(error);
        }
    };

    // Get data img slider update
    const fetchSlider = async (id) => {
        try {
            const listSlider = await bookService.getSliderBookById(id);
            return listSlider;
        } catch (error) {
            console.error('>>>> Không thể lấy danh sách slider: ', error);
            return [];
        }
    };

    // Call Fetch Category
    useEffect(() => {
        const fetchCategory = async () => {
            const resAuthor = await bookService.authorBook();
            const resGenre = await bookService.genreBook();
            const resPublisher = await bookService.publisherBook();
            const resSupplier = await bookService.supplierBook();
            const resLanguage = await bookService.languageBook();
            if (resAuthor && resAuthor.errCode === 0) {
                const dataAuthor = resAuthor.data.map((item) => {
                    return { label: item.nameAuthor, value: item.id };
                });
                setListCateAuthor(dataAuthor);
            }
            if (resGenre && resGenre.errCode === 0) {
                const dataGenre = resGenre.data.map((item) => {
                    return { label: item.nameGenre, value: item.id };
                });
                setListCateGenre(dataGenre);
            }
            if (resPublisher && resPublisher.errCode === 0) {
                const dataPublisher = resPublisher.data.map((item) => {
                    return { label: item.namePublisher, value: item.id };
                });
                setListCatePublisher(dataPublisher);
            }
            if (resSupplier && resSupplier.errCode === 0) {
                const dataSupplier = resSupplier.data.map((item) => {
                    return { label: item.nameSupplier, value: item.id };
                });
                setListCateSupplier(dataSupplier);
            }
            if (resLanguage && resLanguage.errCode === 0) {
                const dataLanguage = resLanguage.data.map((item) => {
                    return { label: item.nameLanguage, value: item.id };
                });
                setListCateLanguage(dataLanguage);
            }
        };
        fetchCategory();
    }, []);

    // Set fieldsValue
    useEffect(() => {
        const fetchDataUpdate = async () => {
            let urlString = window.location.href;
            let url = new URL(urlString);
            const id = parseInt(url.searchParams.get('id'));
            let dataBookUpdate = await fetchDataBook(id);
            let dataImgBook = await fetchSlider(id);

            if (dataBookUpdate?.data?.id && dataImgBook?.errCode === 0) {
                const arrThumbnail = [
                    {
                        uid: uuidv4(),
                        name: dataBookUpdate.data.thumbnail,
                        status: 'done',
                        url: `${ENV.VITE_BASE_URL_BACKEND}/images/books/${dataBookUpdate.data.thumbnail}`,
                    },
                ];

                const arrSlider = dataImgBook?.data?.map((item) => ({
                    uid: uuidv4(),
                    name: item.filename,
                    status: 'done',
                    url: `${ENV.VITE_BASE_URL_BACKEND}/images/books/${item.filename}`,
                }));

                const init = {
                    id: dataBookUpdate.data.id,
                    ISBN: dataBookUpdate.data.ISBN,
                    nameGenre: dataBookUpdate.data.genreID,
                    description: dataBookUpdate.data.description,
                    formality: dataBookUpdate.data.formality,
                    nameAuthor: dataBookUpdate.data.authorID,
                    namePublisher: dataBookUpdate.data.publisherID,
                    nameSupplier: dataBookUpdate.data.supplierID,
                    numOfPage: dataBookUpdate.data.numOfPage,
                    price: dataBookUpdate.data.price,
                    publicationYear: dayjs().year(dataBookUpdate.data.publicationYear),
                    quantityAvailable: dataBookUpdate.data.quantityAvailable,
                    quantitySold: dataBookUpdate.data.quantitySold,
                    title: dataBookUpdate.data.title,
                    packagingSize: dataBookUpdate.data.packagingSize,
                    language: dataBookUpdate.data.languageID,
                    thumbnail: { fileList: arrThumbnail },
                    slider: { fileList: arrSlider },
                };

                setInitForm(init);
                setDataThumbnail(arrThumbnail);
                setDataSlider(arrSlider);
                form.setFieldsValue(init);
                setDesc(init.description);
                setIsDataLoaded(true);
            }
            return () => {
                form.resetFields();
            };
        };
        fetchDataUpdate();
    }, [form]);

    const onFinish = async (values) => {
        values.description = desc;
        values.publicationYear = date ?? form.getFieldValue('publicationYear').$y;
        if (dataThumbnail.length === 0) {
            notification.error({
                message: 'Lỗi thumbnail',
                description: 'Vui lòng chọn ảnh thumbnail!',
                duration: 6,
            });
            return;
        }
        if (dataSlider.length === 0) {
            notification.error({
                message: 'Lỗi slider',
                description: 'Vui lòng chọn ảnh slider!',
                duration: 6,
            });
            return;
        }
        const thumbnail = dataThumbnail[0].name;

        const slider = dataSlider.map((item) => item.name);

        const {
            id,
            ISBN,
            nameGenre,
            description,
            formality,
            nameAuthor,
            namePublisher,
            nameSupplier,
            numOfPage,
            price,
            publicationYear,
            quantityAvailable,
            quantitySold,
            title,
            packagingSize,
            language,
        } = values;
        setIsSubmit(true);
        const res = await bookService.updateBook({
            id,
            ISBN,
            nameGenre,
            description,
            formality,
            nameAuthor,
            namePublisher,
            nameSupplier,
            numOfPage,
            price,
            publicationYear,
            quantityAvailable,
            quantitySold,
            title,
            packagingSize,
            language,
            thumbnail,
            slider,
        });

        if (res && res.errCode === 0) {
            message.success('🎉 Cập nhật sách thành công!', 5);
            form.resetFields();
            setDataThumbnail([]);
            setDataSlider([]);
            setDesc('');

            navigate('/admin/dash/books');
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message,
                duration: 6,
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
            message.error('Bạn chỉ có thể tải lên tệp JPG/PNG!', 5);
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Hình ảnh phải nhỏ hơn 2MB!', 5);
        }
        return isJpgOrPng && isLt2M;
    };

    const handleChange = (info, type) => {
        if (info.file.status === 'uploading') {
            type ? setLoadingSlider(true) : setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (url) => {
                type ? setLoadingSlider(false) : setLoading(false);
                setImageUrl(url);
            });
        }
    };

    const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
        try {
            const res = await bookService.uploadImgBook(file);
            if (res && res.file) {
                setDataThumbnail([
                    {
                        name: res.file.filename,
                        uid: file.uid,
                        status: 'done',
                        url: `${ENV.VITE_BASE_URL_BACKEND}/images/books/${res.file.filename}`,
                    },
                ]);
                onSuccess('ok');
            } else {
                onError('Đã có lỗi khi upload file');
            }
        } catch (error) {
            onError('Đã có lỗi khi upload file');
        }
    };

    const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
        const res = await bookService.uploadImgBook(file);
        if (res && res.file) {
            //copy previous state => upload multiple images
            setDataSlider((dataSlider) => [
                ...dataSlider,
                {
                    name: res.file.filename,
                    uid: file.uid,
                },
            ]);
            onSuccess('ok');
        } else {
            onError('Đã có lỗi khi upload file');
        }
    };

    const handleRemoveFile = (file, type) => {
        if (type === 'thumbnail') {
            setDataThumbnail([]);
        }
        if (type === 'slider') {
            const newSlider = dataSlider.filter((x) => x.uid !== file.uid);
            setDataSlider(newSlider);
        }
    };

    const handlePreview = async (file) => {
        if (file.url && !file.originFileObj) {
            setPreviewImage(file.url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
            return;
        }
        getBase64(file.originFileObj, (url) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        });
    };

    return (
        <>
            <Content className={clsx(styles.wrapper)}>
                <div className={clsx(styles.content)}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h1 className={styles.heading}>Cập nhật sách</h1>

                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<RollbackOutlined />}
                            onClick={() => navigate('/admin/dash/books')}
                        >
                            Trở lại
                        </Button>
                    </div>
                    <Form
                        form={form}
                        name="add-book"
                        onFinish={onFinish}
                        autoComplete="off"
                        className={clsx(styles.form)}
                    >
                        <Row gutter={15}>
                            <Col span={12} hidden>
                                <Form.Item hidden labelCol={{ span: 24 }} label="Id" name="id">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Tên sách"
                                    name="title"
                                    rules={[{ required: true, message: 'Vui lòng nhập tên sách!' }]}
                                    hasFeedback
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="ISBN"
                                    name="ISBN"
                                    // rules={[{ required: true, message: 'Vui lòng nhập ISBN sách!' }]}
                                    hasFeedback
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Tác giả"
                                    name="nameAuthor"
                                    rules={[{ required: true, message: 'Vui lòng chọn tác giả!' }]}
                                    hasFeedback
                                >
                                    <Select showSearch allowClear options={listCateAuthor} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Nhà xuất bản"
                                    name="namePublisher"
                                    rules={[{ required: true, message: 'Vui lòng chọn nhà xuất bản!' }]}
                                    hasFeedback
                                >
                                    <Select showSearch allowClear options={listCatePublisher} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Nhà cung cấp"
                                    name="nameSupplier"
                                    rules={[{ required: true, message: 'Vui lòng chọn nhà cung cấp!' }]}
                                    hasFeedback
                                >
                                    <Select showSearch allowClear options={listCateSupplier} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Năm xuất bản"
                                    name="publicationYear"
                                    rules={[{ required: true, message: 'Vui lòng nhập năm xuất bản!' }]}
                                    hasFeedback
                                >
                                    <DatePicker
                                        style={{ width: '100%' }}
                                        onChange={(date, dateString) => setDate(parseInt(dateString))}
                                        picker="year"
                                        placeholder=""
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Ngôn ngữ sách"
                                    name="language"
                                    rules={[{ required: true, message: 'Vui lòng chọn ngôn ngữ của sách!' }]}
                                    hasFeedback
                                >
                                    <Select showSearch allowClear options={listCateLanguage} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Thể loại"
                                    name="nameGenre"
                                    rules={[{ required: true, message: 'Vui lòng chọn thể loại!' }]}
                                    hasFeedback
                                >
                                    <Select showSearch allowClear options={listCateGenre} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Giá tiền"
                                    name="price"
                                    rules={[{ required: true, message: 'Vui lòng nhập giá tiền!' }]}
                                    hasFeedback
                                >
                                    <InputNumber
                                        min={0}
                                        style={{ width: '100%' }}
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        addonAfter="VND"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Số lượng"
                                    name="quantityAvailable"
                                    rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                                    hasFeedback
                                >
                                    <InputNumber min={1} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Đã bán"
                                    name="quantitySold"
                                    rules={[{ required: true, message: 'Vui lòng nhập số lượng đã bán!' }]}
                                    initialValue={0}
                                    hasFeedback
                                >
                                    <InputNumber min={0} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Số trang"
                                    name="numOfPage"
                                    // rules={[{ required: true, message: 'Vui lòng nhập số trang!' }]}
                                    hasFeedback
                                >
                                    <InputNumber min={1} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={3}>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Hình thức bìa"
                                    name="formality"
                                    // rules={[{ required: true, message: 'Vui lòng nhập hình thức!' }]}
                                    hasFeedback
                                >
                                    <AutoComplete
                                        options={[{ value: 'Bìa cứng' }, { value: 'Bìa mềm' }]}
                                        filterOption={(inputValue, option) =>
                                            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                        }
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={3}>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Kích thước"
                                    name="packagingSize"
                                    // rules={[{ required: true, message: 'Vui lòng nhập hình thức!' }]}
                                    hasFeedback
                                >
                                    <AutoComplete
                                        options={[{ value: '14.5 x 20.5' }, { value: '20.5 x 13 x 1.3 cm' }]}
                                        filterOption={(inputValue, option) =>
                                            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                        }
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={6}>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Ảnh Thumbnail"
                                    name="thumbnail"
                                    rules={[{ required: true, message: 'Vui lòng chọn ảnh thumbnail!' }]}
                                    hasFeedback
                                >
                                    {!isDataLoaded ? (
                                        <Spin tip="Đang tải..." size="small">
                                            <div className={clsx(styles.spin)}></div>
                                        </Spin>
                                    ) : (
                                        <Upload
                                            name="thumbnail"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            maxCount={1}
                                            multiple={false}
                                            customRequest={handleUploadFileThumbnail}
                                            beforeUpload={beforeUpload}
                                            onChange={(info) => handleChange(info, false)}
                                            onRemove={(file) => handleRemoveFile(file, 'thumbnail')}
                                            onPreview={handlePreview}
                                            defaultFileList={initForm?.thumbnail?.fileList ?? []}
                                        >
                                            <div>
                                                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                                <div style={{ marginTop: 8 }}>Upload</div>
                                            </div>
                                        </Upload>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Ảnh Slider"
                                    name="slider"
                                    rules={[{ required: true, message: 'Vui lòng ảnh slider đã bán!' }]}
                                    hasFeedback
                                >
                                    {!isDataLoaded ? (
                                        <Spin tip="Đang tải..." size="small">
                                            <div className={clsx(styles.spin)}></div>
                                        </Spin>
                                    ) : (
                                        <Upload
                                            multiple
                                            name="slider"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            customRequest={handleUploadFileSlider}
                                            beforeUpload={beforeUpload}
                                            onChange={(info) => handleChange(info, 'slider')}
                                            onRemove={(file) => handleRemoveFile(file, 'slider')}
                                            onPreview={handlePreview}
                                            defaultFileList={initForm?.slider?.fileList ?? []}
                                        >
                                            <div>
                                                {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                                <div style={{ marginTop: 8 }}>Upload</div>
                                            </div>
                                        </Upload>
                                    )}
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item labelCol={{ span: 24 }} label="Mô tả sách" name="description">
                                    <TextEditor desc={desc} setDesc={setDesc} />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={isSubmit} icon={<FaRegEdit />}>
                                        Cập nhật
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Content>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    );
};

export default UpdateBook;
