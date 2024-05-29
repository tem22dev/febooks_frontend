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

import ImportPublisher from './ImportPublisher';
import styles from './Publisher.module.scss';
import * as bookService from '../../../services/bookService';

function Publisher() {
    const { Content } = Layout;
    const EditableContext = React.createContext(null);
    const [publisher, setPublisher] = useState([]);
    const [loadingTable, setLoadingTable] = useState(false);
    const [openImportPublisher, setOpenImportPublisher] = useState(false);

    // Handle add language
    const handleAddPublisher = async () => {
        setLoadingTable(true);
        const newData = {
            namePublisher: 'Nhà xuất bản',
        };

        const res = await bookService.addPublisher(newData);
        if (res && res.errCode === 0) {
            fetchListPublisher();
            message.success('Thêm nhà xuất bản thành công 🎉');
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.errMessage,
            });
        }
        setLoadingTable(false);
    };

    // Handle export data publisher
    const handleExportData = () => {
        if (publisher.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(publisher);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            XLSX.writeFile(workbook, 'ExportPublisher.csv');
        }
    };

    // Handle delete publisher
    const handleDeletePublisher = async (id) => {
        const res = await bookService.deletePublisher(id);
        if (res && res.errCode === 0) {
            message.success(res.message);
            fetchListPublisher();
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
            title: 'Nhà xuất bản',
            dataIndex: 'namePublisher',
            width: '40%',
            editable: true,
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
                        title="Xác nhận xoá nhà xuất bản"
                        description="Bạn có chắc chắn muốn xoá nhà xuất bản này ?"
                        okText="Xác nhận"
                        cancelText="Huỷ"
                        onConfirm={() => handleDeletePublisher(record.id)}
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
        const newData = [...publisher];
        const index = newData.findIndex((item) => row.id === item.id);
        if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, { ...item, ...row });
            setPublisher(newData);
        } else {
            newData.push(row);
            setPublisher(newData);
        }

        const res = await bookService.updatePublisher(row);
        if (res && res.errCode === 0) {
            fetchListPublisher();
            message.success('Cập nhật nhà xuất bản thành công 🎉');
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

    // Get list publisher
    const fetchListPublisher = async () => {
        setLoadingTable(true);
        const listPublisher = await bookService.publisherBook();

        if (listPublisher && listPublisher.errCode === 0) {
            setPublisher(listPublisher.data);
            setLoadingTable(false);
        }
    };

    useEffect(() => {
        fetchListPublisher();
    }, []);

    return (
        <Content className={clsx(styles.wrapper)}>
            <div className={clsx(styles.wrapper_table)}>
                <div className={clsx(styles.heading_table)}>
                    <h1 className={clsx(styles.title_table)}>Danh sách nhà xuất bản</h1>
                    <Space className={clsx(styles.wrapper_btn)}>
                        <Button type="primary" icon={<LogoutOutlined />} onClick={handleExportData}>
                            Export
                        </Button>
                        <Button
                            type="primary"
                            icon={<CloudDownloadOutlined />}
                            onClick={() => setOpenImportPublisher(true)}
                        >
                            Import
                        </Button>
                        <Button type="primary" icon={<PlusCircleOutlined />} onClick={handleAddPublisher}>
                            Thêm mới
                        </Button>
                        <Button
                            type="text"
                            icon={<ReloadOutlined />}
                            loading={loadingTable}
                            onClick={fetchListPublisher}
                        />
                    </Space>
                </div>

                <Table
                    components={components}
                    loading={loadingTable}
                    rowClassName={() => clsx(styles.editable_row)}
                    bordered
                    dataSource={publisher}
                    columns={columns}
                    rowKey="id"
                    pagination={{
                        showSizeChanger: true,
                        showTotal: (total, range) => (
                            <div>
                                {range[0]}-{range[1]} trên {total} dòng
                            </div>
                        ),
                    }}
                />

                <ImportPublisher
                    openImportPublisher={openImportPublisher}
                    setOpenImportPublisher={setOpenImportPublisher}
                    fetchListPublisher={fetchListPublisher}
                />
            </div>
        </Content>
    );
}

export default Publisher;
