import { useState, useEffect } from 'react';
import { Badge, Descriptions, Divider, Drawer, Modal, Upload, Tag } from 'antd';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import * as bookService from '../../../../services/bookService';

const ENV = import.meta.env;

function DetailBook(props) {
    const { openDetailBook, setOpenDetailBook, data, setDataDetailBook } = props;
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);

    // Handle close detail
    const handleClose = () => {
        setDataDetailBook(null);
        setOpenDetailBook(false);
    };

    const items = [
        {
            key: '1',
            label: 'Id',
            children: data?.id,
        },
        {
            key: '2',
            span: 2,
            label: 'Tên sách',
            children: data?.title,
        },
        {
            key: '3',
            label: 'ISBN',
            children: data?.ISBN,
        },
        {
            key: '4',
            label: 'Tác giả',
            children: data?.nameAuthor,
        },
        {
            key: '5',
            label: 'Thể loại',
            children: data?.nameGenre,
        },
        {
            key: '6',
            label: 'Nhà xuất bản',
            children: data?.namePublisher,
        },
        {
            key: '7',
            label: 'Nhà cung cấp',
            children: data?.nameSupplier,
        },
        {
            key: '8',
            label: 'Ngôn ngữ',
            children: data?.nameLanguage,
        },
        {
            key: '9',
            label: 'Năm xuất bản',
            children: data?.publicationYear,
        },
        {
            key: '10',
            label: 'Giá tiền',
            children: `${new Intl.NumberFormat().format(data?.price)} đ`,
        },
        {
            key: '11',
            label: 'Số lượng hiện có',
            children: data?.quantityAvailable,
        },
        {
            key: '12',
            label: 'Số lượng đã bán',
            children: data?.quantitySold,
        },
        {
            key: '13',
            label: 'Số trang',
            children: data?.numOfPage,
        },
        {
            key: '14',
            label: 'Hình thức',
            children: data?.formality,
        },
        {
            key: '15',
            label: 'Kích Thước Bao Bì',
            children: data?.packagingSize,
        },
        {
            key: '16',
            label: 'Ngày thêm',
            children: moment(data?.createdAt).format('DD-MM-YYYY hh:mm:ss'),
        },
        {
            key: '17',
            label: 'Ngày cập nhật',
            children: moment(data?.updatedAt).format('DD-MM-YYYY hh:mm:ss'),
        },
        // {
        //     key: '18',
        //     label: 'Mô tả sản phẩm',
        //     children: data?.description,
        //     span: 3,
        // },
        // {
        //     key: '6',
        //     label: 'Trạng thái',
        //     children: data?.active ? (
        //         <Badge status="processing" text="Hoạt động" />
        //     ) : (
        //         <Badge status="error" text="Dừng" />
        //     ),
        // },
    ];

    const fetchSlider = async (id) => {
        try {
            const dataSlider = await bookService.getSliderBookById(id);
            return dataSlider;
        } catch (error) {
            console.error('>>>> Không thể lấy danh sách slider: ', error);
            return [];
        }
    };

    useEffect(() => {
        const fetchBookImages = async () => {
            if (data) {
                let imgThumbnail = {};
                let imgSlider = [];
                if (data.thumbnail) {
                    imgThumbnail = {
                        uid: uuidv4(),
                        name: data?.thumbnail,
                        status: 'done',
                        url: `${ENV.VITE_BASE_URL_BACKEND}/images/books/${data?.thumbnail}`,
                    };
                }

                let sliders = await fetchSlider(data?.id);
                if (sliders && sliders?.data?.length > 0) {
                    sliders.data.map((item) => {
                        imgSlider.push({
                            uid: uuidv4(),
                            name: item?.filename,
                            status: 'done',
                            url: `${ENV.VITE_BASE_URL_BACKEND}/images/books/${item?.filename}`,
                        });
                    });
                }

                setFileList([imgThumbnail, ...imgSlider]);
            }
        };
        fetchBookImages();
    }, [data]);

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
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    return (
        <>
            <Drawer
                title="Xem chi tiết"
                placement="right"
                closable={true}
                onClose={handleClose}
                open={openDetailBook}
                width={'50vw'}
            >
                <Descriptions title="Thông tin sách" layout="vertical" bordered items={items} />

                <Divider orientation="left">Ảnh Sách</Divider>

                <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    showUploadList={{ showRemoveIcon: false }}
                ></Upload>

                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </Drawer>
        </>
    );
}

export default DetailBook;
