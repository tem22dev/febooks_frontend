import { useState, useEffect } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import {
    LogoutOutlined,
    CloudDownloadOutlined,
    PlusCircleOutlined,
    ReloadOutlined,
    QuestionCircleOutlined,
} from '@ant-design/icons';
import { Layout, Button, Form, Space, Table, Tag, Popconfirm, Modal, Upload, Image } from 'antd';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { FaEdit } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

import SearchBook from './SearchBook';
import DetailBook from './DetailBook';
import UpdateBook from './UpdateBook';
import ImportBook from './ImportBook';
import styles from './Book.module.scss';
import * as bookService from '../../../services/bookService';
import { Link } from 'react-router-dom';

const ENV = import.meta.env;

function Book() {
    const { Content } = Layout;

    const [openDetailBook, setOpenDetailBook] = useState(false);
    const [dataDetailBook, setDataDetailBook] = useState(null);

    const [formUpdateBook] = Form.useForm();
    const [openUpdateBook, setOpenUpdateBook] = useState(false);
    const [confirmLoadingUpdateBook, setConfirmLoadingUpdateBook] = useState(false);

    const [openImportBook, setOpenImportBook] = useState(false);
    const [confirmLoadingImportBook, setConfirmLoadingImportBook] = useState(false);

    const [books, setBooks] = useState([]);
    const [loadingTable, setLoadingTable] = useState(false);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    // Map data
    const flatBook = (listBook) => {
        return listBook.map((item) => {
            let obj = {
                nameAuthor: item?.Author?.nameAuthor,
                nameLanguage: item?.Language?.nameLanguage,
                nameGenre: item?.Genre?.nameGenre,
                namePublisher: item?.Publisher?.namePublisher,
                nameSupplier: item?.Supplier?.nameSupplier,
                ...item,
            };
            delete obj?.Author;
            delete obj?.Genre;
            delete obj?.Language;
            delete obj?.Publisher;
            delete obj?.Supplier;
            return obj;
        });
    };

    // Handle search book
    const onFinishSearch = async (values) => {
        const { title, nameAuthor, nameGenre } = values;
        let params = {};
        if (title) {
            params = { title, ...params };
        }
        if (nameAuthor) {
            params = { nameAuthor, ...params };
        }
        if (nameGenre) {
            params = { nameGenre, ...params };
        }

        const listBook = await bookService.searchBook(params);
        const flatBookList = flatBook(listBook.data);

        if (flatBookList.length === 0) {
            message.info('Không tìm thấy sách', 3);
            return;
        }
        setBooks(flatBookList);
    };

    // Handle show detail book
    const showDetailBook = (record) => {
        setOpenDetailBook(true);
        setDataDetailBook(record);
    };

    // Handle update book
    const showModalUpdateBook = () => {
        setOpenUpdateBook(true);
    };

    const handleCancelUpdateBook = () => {
        formUpdateBook.resetFields();
        console.log('Clicked cancel button');
        setOpenUpdateBook(false);
    };

    const handleOkUpdateBook = () => {
        setConfirmLoadingUpdateBook(true);
        setTimeout(() => {
            setOpenUpdateBook(false);
            setConfirmLoadingUpdateBook(false);
        }, 1500);
    };

    // Handle import book
    const showModalImportBook = () => {
        setOpenImportBook(true);
    };

    const handleCancelImportBook = () => {
        console.log('Clicked cancel button');
        setOpenImportBook(false);
    };

    const handleOkImportBook = () => {
        setConfirmLoadingImportBook(true);
        setTimeout(() => {
            setOpenImportBook(false);
            setConfirmLoadingImportBook(false);
        }, 1500);
    };

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = ({ fileList: newFileList }, bookId) => {
        setBooks((prevBooks) =>
            prevBooks.map((book) => (book.id === bookId ? { ...book, fileList: newFileList } : book)),
        );
    };

    // Columns table
    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            sorter: {
                compare: (a, b) => a.id - b.id,
            },
            sortDirections: ['descend', 'ascend'],
            render: (text, record) => <a onClick={() => showDetailBook(record)}>{text}</a>,
        },
        {
            title: 'Tên hiển thị',
            width: 320,
            dataIndex: 'title',
            sortDirections: ['descend', 'ascend'],
            sorter: {
                compare: (a, b) => a.title.length - b.title.length,
                multiple: 5,
            },
            render: (text) => <p className={clsx(styles.hidden_long)}>{text}</p>,
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'thumbnail',
            render: (text, record) => (
                <div className={clsx(styles.review_book)}>
                    <Image
                        width={50}
                        height={50}
                        src={`${ENV.VITE_BASE_URL_BACKEND}/images/books/${record.thumbnail}`}
                    />
                </div>
            ),
        },
        {
            title: 'Thể loại',
            dataIndex: 'nameGenre',
            sortDirections: ['descend', 'ascend'],
            sorter: {
                compare: (a, b) => a.nameGenre.length - b.nameGenre.length,
                multiple: 4,
            },
            render: (text) => <p className={clsx(styles.hidden_long)}>{text}</p>,
        },
        {
            title: 'Tác giả',
            dataIndex: 'nameAuthor',
            sortDirections: ['descend', 'ascend'],
            sorter: {
                compare: (a, b) => a.nameAuthor.length - b.nameAuthor.length,
                multiple: 3,
            },
            render: (text) => <p className={clsx(styles.hidden_long)}>{text}</p>,
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            sorter: {
                compare: (a, b) => a.price - b.price,
                multiple: 2,
            },
            render: (price) => `${new Intl.NumberFormat().format(price)} đ`,
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            defaultSortOrder: 'descend',
            sorter: {
                compare: (a, b) => moment(a.updatedAt).unix() - moment(b.updatedAt).unix(),
                multiple: 1,
            },
            render: (date) => moment(date).format('DD-MM-YYYY hh:mm:ss'),
        },
        {
            title: 'Thao tác',
            dataIndex: 'action',
            render: () => (
                <Space>
                    <Tag color="#2db7f5" style={{ cursor: 'pointer' }} onClick={showModalUpdateBook}>
                        <FaEdit />
                    </Tag>
                    <Popconfirm
                        placement="topLeft"
                        title="Xác nhận xoá sách"
                        description="Bạn có chắc chắn muốn xoá sách này ?"
                        okText="Xác nhận"
                        cancelText="Huỷ"
                        icon={<QuestionCircleOutlined style={{ color: 'red', cursor: 'pointer' }} />}
                    >
                        <Tag color="#f50" style={{ cursor: 'pointer' }}>
                            <RiDeleteBin5Fill />
                        </Tag>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Get list books
    const fetchListBook = async () => {
        setLoadingTable(true);
        const listBook = await bookService.getAllBook();

        const flatBookList = flatBook(listBook.data);

        if (listBook && listBook.errCode === 0) {
            setBooks(flatBookList);
            setLoadingTable(false);
        }
    };

    useEffect(() => {
        fetchListBook();
    }, []);

    // Event table
    const onChangeTable = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return (
        <Content className={clsx(styles.wrapper)}>
            <SearchBook onFinish={onFinishSearch} />

            <div className={clsx(styles.wrapper_table)}>
                <div className={clsx(styles.heading_table)}>
                    <h1 className={clsx(styles.title_table)}>Bảng sách</h1>
                    <Space className={clsx(styles.wrapper_btn)}>
                        <Button type="primary" icon={<LogoutOutlined />}>
                            Export
                        </Button>
                        <Button type="primary" icon={<CloudDownloadOutlined />} onClick={showModalImportBook}>
                            Import
                        </Button>
                        <Button type="primary" icon={<PlusCircleOutlined />}>
                            <Link to="add">Thêm mới</Link>
                        </Button>
                        <Button type="text" icon={<ReloadOutlined />} onClick={fetchListBook} />
                    </Space>
                </div>

                <Table
                    columns={columns}
                    rowKey="id"
                    dataSource={books}
                    loading={loadingTable}
                    onChange={onChangeTable}
                    pagination={{
                        showSizeChanger: true,
                        showTotal: (total, range) => (
                            <div>
                                {range[0]}-{range[1]} trên {total} dòng
                            </div>
                        ),
                    }}
                />

                <DetailBook
                    openDetailBook={openDetailBook}
                    setOpenDetailBook={setOpenDetailBook}
                    data={dataDetailBook}
                    setDataDetailBook={setDataDetailBook}
                />

                <UpdateBook
                    open={openUpdateBook}
                    form={formUpdateBook}
                    handleCancel={handleCancelUpdateBook}
                    handleOk={handleOkUpdateBook}
                    confirmLoading={confirmLoadingUpdateBook}
                />

                <ImportBook
                    open={openImportBook}
                    handleCancel={handleCancelImportBook}
                    handleOk={handleOkImportBook}
                    confirmLoading={confirmLoadingImportBook}
                />
            </div>
        </Content>
    );
}

export default Book;
