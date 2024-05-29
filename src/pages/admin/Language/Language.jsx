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

import ImportLanguage from './ImportLanguage';
import styles from './Language.module.scss';
import * as bookService from '../../../services/bookService';

function Language() {
    const { Content } = Layout;
    const EditableContext = React.createContext(null);
    const [languages, setLanguages] = useState([]);
    const [loadingTable, setLoadingTable] = useState(false);
    const [openImportLanguage, setOpenImportLanguage] = useState(false);

    // Handle add language
    const handleAddLanguage = async () => {
        setLoadingTable(true);
        const newData = {
            nameLanguage: 'Ngôn ngữ',
        };

        const res = await bookService.addLanguage(newData);
        if (res && res.errCode === 0) {
            fetchListLanguage();
            message.success('Thêm ngôn ngữ thành công 🎉');
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.errMessage,
            });
        }
        setLoadingTable(false);
    };

    // Handle export data language
    const handleExportData = () => {
        if (languages.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(languages);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            XLSX.writeFile(workbook, 'ExportLanguage.csv');
        }
    };

    // Handle delete language
    const handleDeleteLanguage = async (id) => {
        const res = await bookService.deleteLanguage(id);
        if (res && res.errCode === 0) {
            message.success(res.message);
            fetchListLanguage();
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
            title: 'Ngôn ngữ',
            dataIndex: 'nameLanguage',
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
                        title="Xác nhận xoá ngôn ngữ"
                        description="Bạn có chắc chắn muốn xoá ngôn ngữ này ?"
                        okText="Xác nhận"
                        cancelText="Huỷ"
                        onConfirm={() => handleDeleteLanguage(record.id)}
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
        const newData = [...languages];
        const index = newData.findIndex((item) => row.id === item.id);
        if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, { ...item, ...row });
            setLanguages(newData);
        } else {
            newData.push(row);
            setLanguages(newData);
        }

        const res = await bookService.updateLanguage(row);
        if (res && res.errCode === 0) {
            fetchListLanguage();
            message.success('Cập nhật ngôn ngữ thành công 🎉');
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

    // Get list language
    const fetchListLanguage = async () => {
        setLoadingTable(true);
        const listLanguage = await bookService.languageBook();

        if (listLanguage && listLanguage.errCode === 0) {
            setLanguages(listLanguage.data);
            setLoadingTable(false);
        }
    };

    useEffect(() => {
        fetchListLanguage();
    }, []);

    return (
        <Content className={clsx(styles.wrapper)}>
            <div className={clsx(styles.wrapper_table)}>
                <div className={clsx(styles.heading_table)}>
                    <h1 className={clsx(styles.title_table)}>Danh sách ngôn ngữ</h1>
                    <Space className={clsx(styles.wrapper_btn)}>
                        <Button type="primary" icon={<LogoutOutlined />} onClick={handleExportData}>
                            Export
                        </Button>
                        <Button
                            type="primary"
                            icon={<CloudDownloadOutlined />}
                            onClick={() => setOpenImportLanguage(true)}
                        >
                            Import
                        </Button>
                        <Button type="primary" icon={<PlusCircleOutlined />} onClick={handleAddLanguage}>
                            Thêm mới
                        </Button>
                        <Button
                            type="text"
                            icon={<ReloadOutlined />}
                            loading={loadingTable}
                            onClick={fetchListLanguage}
                        />
                    </Space>
                </div>

                <Table
                    components={components}
                    loading={loadingTable}
                    rowClassName={() => clsx(styles.editable_row)}
                    bordered
                    dataSource={languages}
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

                <ImportLanguage
                    openImportLanguage={openImportLanguage}
                    setOpenImportLanguage={setOpenImportLanguage}
                    fetchListLanguage={fetchListLanguage}
                />
            </div>
        </Content>
    );
}

export default Language;
