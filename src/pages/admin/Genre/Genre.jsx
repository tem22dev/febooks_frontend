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

import ImportGenre from './ImportGenre';
import styles from './Genre.module.scss';
import * as bookService from '../../../services/bookService';

function Genre() {
    const { Content } = Layout;
    const EditableContext = React.createContext(null);
    const [genres, setGenres] = useState([]);
    const [loadingTable, setLoadingTable] = useState(false);
    const [openImportGenre, setOpenImportGenre] = useState(false);

    // Handle add genre
    const handleAddGenre = async () => {
        setLoadingTable(true);
        const newData = {
            nameGenre: 'Thể loại',
        };

        const res = await bookService.addGenre(newData);
        if (res && res.errCode === 0) {
            fetchListGenre();
            message.success('Thêm thể loại thành công 🎉');
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.errMessage,
            });
        }
        setLoadingTable(false);
    };

    // Handle export data genre
    const handleExportData = () => {
        if (genres.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(genres);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            XLSX.writeFile(workbook, 'ExportGenre.csv');
        }
    };

    // Handle delete genre
    const handleDeleteGenre = async (id) => {
        const res = await bookService.deleteGenre(id);
        if (res && res.errCode === 0) {
            message.success(res.message);
            fetchListGenre();
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
            title: 'Thể loại',
            dataIndex: 'nameGenre',
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
                        title="Xác nhận xoá thể loại"
                        description="Bạn có chắc chắn muốn xoá thể loại này ?"
                        okText="Xác nhận"
                        cancelText="Huỷ"
                        onConfirm={() => handleDeleteGenre(record.id)}
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
        const newData = [...genres];
        const index = newData.findIndex((item) => row.id === item.id);
        if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, { ...item, ...row });
            setGenres(newData);
        } else {
            newData.push(row);
            setGenres(newData);
        }

        const res = await bookService.updateGenre(row);
        if (res && res.errCode === 0) {
            fetchListGenre();
            message.success('Cập nhật thể loại thành công 🎉');
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

    // Get list genre
    const fetchListGenre = async () => {
        setLoadingTable(true);
        const listGenre = await bookService.genreBook();

        if (listGenre && listGenre.errCode === 0) {
            setGenres(listGenre.data);
            setLoadingTable(false);
        }
    };

    useEffect(() => {
        fetchListGenre();
    }, []);

    return (
        <Content className={clsx(styles.wrapper)}>
            <div className={clsx(styles.wrapper_table)}>
                <div className={clsx(styles.heading_table)}>
                    <h1 className={clsx(styles.title_table)}>Danh sách thể loại</h1>
                    <Space className={clsx(styles.wrapper_btn)}>
                        <Button type="primary" icon={<LogoutOutlined />} onClick={handleExportData}>
                            Export
                        </Button>
                        <Button
                            type="primary"
                            icon={<CloudDownloadOutlined />}
                            onClick={() => setOpenImportGenre(true)}
                        >
                            Import
                        </Button>
                        <Button type="primary" icon={<PlusCircleOutlined />} onClick={handleAddGenre}>
                            Thêm mới
                        </Button>
                        <Button type="text" icon={<ReloadOutlined />} loading={loadingTable} onClick={fetchListGenre} />
                    </Space>
                </div>

                <Table
                    components={components}
                    loading={loadingTable}
                    rowClassName={() => clsx(styles.editable_row)}
                    bordered
                    dataSource={genres}
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

                <ImportGenre
                    openImportGenre={openImportGenre}
                    setOpenImportGenre={setOpenImportGenre}
                    fetchListGenre={fetchListGenre}
                />
            </div>
        </Content>
    );
}

export default Genre;
