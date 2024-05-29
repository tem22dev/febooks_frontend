import React, { useEffect, useState, useContext, useRef } from 'react';
import clsx from 'clsx';
import * as XLSX from 'xlsx';
import {
    LogoutOutlined,
    CloudDownloadOutlined,
    PlusCircleOutlined,
    ReloadOutlined,
    QuestionCircleOutlined,
} from '@ant-design/icons';
import { Layout, Button, Form, Input, Space, Table, Tag, Popconfirm, message, notification } from 'antd';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import moment from 'moment';

import ImportAuthor from './ImportAuthor';
import styles from './Author.module.scss';
import * as bookService from '../../../services/bookService';

function Author() {
    const { Content } = Layout;
    const EditableContext = React.createContext(null);
    const [authors, setAuthors] = useState([]);
    const [loadingTable, setLoadingTable] = useState(false);
    const [openImportAuthor, setOpenImportAuthor] = useState(false);

    // Handle add author
    const handleAddAuthor = async () => {
        setLoadingTable(true);
        const newData = {
            nameAuthor: 'Tên tác giả',
            biography: 'Tiểu sử của tác giả',
        };

        const res = await bookService.addAuthor(newData);
        if (res && res.errCode === 0) {
            fetchListAuthor();
            message.success('Thêm tác giả thành công 🎉');
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.errMessage,
            });
        }
        setLoadingTable(false);
    };

    // Handle export data author
    const handleExportData = () => {
        if (authors.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(authors);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            XLSX.writeFile(workbook, 'ExportAuthor.csv');
        }
    };

    // Handle delete author
    const handleDeleteAuthor = async (id) => {
        const res = await bookService.deleteAuthor(id);
        if (res && res.errCode === 0) {
            message.success(res.message);
            fetchListAuthor();
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.errMessage,
            });
        }
    };

    // Component EditableRow
    const EditableRow = ({ index, ...props }) => {
        const [form] = Form.useForm();
        return (
            <Form form={form} component={false}>
                <EditableContext.Provider value={form}>
                    <tr {...props} />
                </EditableContext.Provider>
            </Form>
        );
    };

    const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, ...restProps }) => {
        const [editing, setEditing] = useState(false);
        const inputRef = useRef(null);
        const form = useContext(EditableContext);

        useEffect(() => {
            if (editing) {
                inputRef.current?.focus();
            }
        }, [editing]);

        const toggleEdit = () => {
            setEditing(!editing);
            form.setFieldsValue({ [dataIndex]: record[dataIndex] });
        };

        const save = async () => {
            try {
                const values = await form.validateFields();

                toggleEdit();
                handleSave({ ...record, ...values });
            } catch (errInfo) {
                console.log('Save failed:', errInfo);
            }
        };

        let childNode = children;

        if (editable) {
            childNode = editing ? (
                <Form.Item
                    style={{ margin: 0 }}
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `Vui lòng nhập ${title}.`,
                        },
                    ]}
                >
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                </Form.Item>
            ) : (
                <div
                    className={clsx(styles.editable_cell_value_wrap)}
                    style={{ paddingRight: 24 }}
                    onClick={toggleEdit}
                >
                    {children}
                </div>
            );
        }

        return <td {...restProps}>{childNode}</td>;
    };

    // Columns table
    const defaultColumns = [
        {
            title: '#',
            dataIndex: '#',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: 'Tên tác giả',
            dataIndex: 'nameAuthor',
            editable: true,
        },
        {
            title: 'Tiểu sử',
            width: '40%',
            dataIndex: 'biography',
            editable: true, // Thêm thuộc tính này để cột biography có thể chỉnh sửa
            render: (text) => <p className={clsx(styles.hidden_long)}>{text}</p>,
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            width: '15%',
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
            width: '10%',
            render: (_, record) => (
                <Space>
                    <Popconfirm
                        placement="topLeft"
                        title="Xác nhận xoá tác giả"
                        description="Bạn có chắc chắn muốn xoá tác giả này ?"
                        okText="Xác nhận"
                        cancelText="Huỷ"
                        onConfirm={() => handleDeleteAuthor(record.id)}
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

    // Handle regime view and update
    const handleSave = async (row) => {
        const newData = [...authors];
        const index = newData.findIndex((item) => row.id === item.id);
        if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, { ...item, ...row });
            setAuthors(newData);
        } else {
            newData.push(row);
            setAuthors(newData);
        }

        const res = await bookService.updateAuthor(row);
        if (res && res.errCode === 0) {
            fetchListAuthor();
            message.success('Cập nhật tác giả thành công 🎉');
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.errMessage,
            });
        }
    };

    // Handle add attribute cells
    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    // Get list author
    const fetchListAuthor = async () => {
        setLoadingTable(true);
        const listAuthor = await bookService.authorBook();

        if (listAuthor && listAuthor.errCode === 0) {
            setAuthors(listAuthor.data);
            setLoadingTable(false);
        }
    };

    useEffect(() => {
        fetchListAuthor();
    }, []);

    return (
        <Content className={clsx(styles.wrapper)}>
            <div className={clsx(styles.wrapper_table)}>
                <div className={clsx(styles.heading_table)}>
                    <h1 className={clsx(styles.title_table)}>Danh sách tác giả</h1>
                    <Space className={clsx(styles.wrapper_btn)}>
                        <Button type="primary" icon={<LogoutOutlined />} onClick={handleExportData}>
                            Export
                        </Button>
                        <Button
                            type="primary"
                            icon={<CloudDownloadOutlined />}
                            onClick={() => setOpenImportAuthor(true)}
                        >
                            Import
                        </Button>
                        <Button type="primary" icon={<PlusCircleOutlined />} onClick={handleAddAuthor}>
                            Thêm mới
                        </Button>
                        <Button
                            type="text"
                            icon={<ReloadOutlined />}
                            loading={loadingTable}
                            onClick={fetchListAuthor}
                        />
                    </Space>
                </div>

                <Table
                    components={components}
                    loading={loadingTable}
                    rowClassName={() => clsx(styles.editable_row)}
                    bordered
                    dataSource={authors}
                    columns={columns}
                    rowKey="id"
                    expandable={{
                        expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.biography}</p>,
                    }}
                    pagination={{
                        showSizeChanger: true,
                        showTotal: (total, range) => (
                            <div>
                                {range[0]}-{range[1]} trên {total} dòng
                            </div>
                        ),
                    }}
                />

                <ImportAuthor
                    openImportAuthor={openImportAuthor}
                    setOpenImportAuthor={setOpenImportAuthor}
                    fetchListAuthor={fetchListAuthor}
                />
            </div>
        </Content>
    );
}

export default Author;
