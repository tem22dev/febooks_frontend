import { useState } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import {
    LogoutOutlined,
    CloudDownloadOutlined,
    PlusCircleOutlined,
    ReloadOutlined,
    DeleteOutlined,
    EditOutlined,
    QuestionCircleOutlined,
} from '@ant-design/icons';
import { Layout, Button, Form, Space, Table, Tag, Popconfirm } from 'antd';

import SearchBook from './SearchBook';
import DetailBook from './DetailBook';
import UpdateBook from './UpdateBook';
import AddBook from './AddBook';
import ImportBook from './ImportBook';
import styles from './Book.module.scss';

function Book() {
    const { Content } = Layout;

    const [openDetailBook, setOpenDetailBBook] = useState(false);

    const [formUpdateBook] = Form.useForm();
    const [openUpdateBook, setOpenUpdateBook] = useState(false);
    const [confirmLoadingUpdateBook, setConfirmLoadingUpdateBook] = useState(false);

    const [formAddBook] = Form.useForm();
    const [openAddBook, setOpenAddBook] = useState(false);
    const [confirmLoadingAddBook, setConfirmLoadingAddBook] = useState(false);

    const [openImportBook, setOpenImportBook] = useState(false);
    const [confirmLoadingImportBook, setConfirmLoadingImportBook] = useState(false);

    // Event search
    const onFinishSearch = (values) => {
        console.log('Received values of form: ', values);
    };

    // Handle Detail book
    const showDetailBook = () => {
        setOpenDetailBBook(true);
    };

    const closeDetailBook = () => {
        setOpenDetailBBook(false);
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

    // Handle add book
    const showModalAddBook = () => {
        setOpenAddBook(true);
    };

    const handleCancelAddBook = () => {
        formAddBook.resetFields();
        console.log('Clicked cancel button');
        setOpenAddBook(false);
    };

    const handleOkAddBook = () => {
        setConfirmLoadingAddBook(true);
        setTimeout(() => {
            setOpenAddBook(false);
            setConfirmLoadingAddBook(false);
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

    // Columns table
    const columns = [
        {
            title: 'Id',
            dataIndex: 'key',
            sorter: {
                compare: (a, b) => a.key - b.key,
            },
            sortDirections: ['descend'],
            render: (text) => <a onClick={showDetailBook}>{text}</a>,
        },
        {
            title: 'Tên hiển thị',
            dataIndex: 'bookName',
            sortDirections: ['descend', 'ascend'],
            sorter: {
                compare: (a, b) => a.bookName.length - b.bookName.length,
                multiple: 5,
            },
        },
        {
            title: 'Thể loại',
            dataIndex: 'cate',
            sortDirections: ['descend', 'ascend'],
            sorter: {
                compare: (a, b) => a.cate.length - b.cate.length,
                multiple: 4,
            },
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            sortDirections: ['descend', 'ascend'],
            sorter: {
                compare: (a, b) => a.author.length - b.author.length,
                multiple: 3,
            },
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            sorter: {
                compare: (a, b) => a.price - b.price,
                multiple: 2,
            },
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updateAt',
            sorter: {
                compare: (a, b) => moment(a.updateAt).unix() - moment(b.updateAt).unix(),
                multiple: 1,
            },
        },
        {
            title: 'Thao tác',
            dataIndex: 'action',
            render: () => (
                <Space>
                    <Tag color="warning" style={{ cursor: 'pointer' }} onClick={showModalUpdateBook}>
                        <EditOutlined />
                    </Tag>
                    <Popconfirm
                        placement="topLeft"
                        title="Xác nhận xoá sách"
                        description="Bạn có chắc chắn muốn xoá sách này ?"
                        okText="Xác nhận"
                        cancelText="Huỷ"
                        icon={<QuestionCircleOutlined style={{ color: 'red', cursor: 'pointer' }} />}
                    >
                        <Tag color="error" style={{ cursor: 'pointer' }}>
                            <DeleteOutlined />
                        </Tag>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Data table
    const data = [
        {
            key: '1',
            bookName: '7 Thói Quen Của Bạn Trẻ Thành Đạt',
            cate: 'Tư duy',
            author: 'Sean Covey',
            price: 120000,
            updateAt: '6-5-2024 1:30:00',
        },
        {
            key: '2',
            bookName: 'Tô Bình Yên Vẽ Hạnh Phúc (Tái Bản 2022)',
            cate: 'Văn học',
            author: 'Kulzsc',
            price: 59000,
            updateAt: '4-3-2024 1:30:00',
        },
        {
            key: '3',
            bookName: 'Liễu Phàm Tứ Huấn - Tích Tập Phúc Đức, Cải Tạo Vận Mênh (Tái Bản 2022)',
            cate: 'LỊCH SỬ - ĐỊA LÝ',
            author: 'Liễu Phàm',
            price: 40000,
            updateAt: '2-3-2024 1:30:00',
        },
    ];

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
                        <Button type="primary" icon={<PlusCircleOutlined />} onClick={showModalAddBook}>
                            Thêm mới
                        </Button>
                        <Button type="text" icon={<ReloadOutlined />} />
                    </Space>
                </div>

                <Table columns={columns} dataSource={data} onChange={onChangeTable} />

                <DetailBook show={openDetailBook} onClose={closeDetailBook} />

                <UpdateBook
                    open={openUpdateBook}
                    form={formUpdateBook}
                    handleCancel={handleCancelUpdateBook}
                    handleOk={handleOkUpdateBook}
                    confirmLoading={confirmLoadingUpdateBook}
                />

                <AddBook
                    open={openAddBook}
                    form={formAddBook}
                    handleCancel={handleCancelAddBook}
                    handleOk={handleOkAddBook}
                    confirmLoading={confirmLoadingAddBook}
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
