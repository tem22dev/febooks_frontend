import { useEffect, useState } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import {
    PlusCircleOutlined,
    ReloadOutlined,
    DeleteOutlined,
    EditOutlined,
    QuestionCircleOutlined,
} from '@ant-design/icons';
import { Layout, Button, Form, Space, Table, Tag, Popconfirm, message, notification, Image } from 'antd';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { FaEdit } from 'react-icons/fa';

import UpdateSlider from './UpdateSlider';
import AddSlider from './AddSlider';
import styles from './Slider.module.scss';
import * as siteService from '../../../services/siteService';
import { Link } from 'react-router-dom';

const ENV = import.meta.env;

function Slider() {
    const { Content } = Layout;

    const [openModal, setOpenModel] = useState(false);
    const [dataUpdate, setDataUpdate] = useState({});

    const [openAddSlider, setOpenAddSlider] = useState(false);

    const [sliders, setSliders] = useState([]);
    const [loadingTable, setLoadingTable] = useState(false);

    // Handle delete slider
    const handleDeleteSlider = async (id) => {
        const res = await siteService.deleteSlider(id);
        if (res && res.errCode === 0) {
            message.success(res.message);
            fetchListSlider();
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.errMessage,
            });
        }
    };

    // Columns table
    const columns = [
        {
            title: '#',
            dataIndex: '#',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'filename',
            render: (text, record) => (
                <div className={clsx(styles.review_slider)}>
                    <Image
                        width={80}
                        height={50}
                        src={`${ENV.VITE_BASE_URL_BACKEND}/images/sliders/${record.filename}`}
                    />
                </div>
            ),
        },
        {
            title: 'Vị trí',
            dataIndex: 'position',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (text) => {
                let color = text === false ? 'volcano' : 'green';
                let name = text === false ? 'Dừng' : 'Hoạt động';
                return (
                    <Tag color={color} key={text}>
                        {name.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: 'Liên kết',
            dataIndex: 'url',
            width: '30%',
            render: (text) => (
                <Link to={text} className={clsx(styles.hidden_long)} target="_blank">
                    {text}
                </Link>
            ),
        },
        {
            title: 'Ngày thêm',
            dataIndex: 'createdAt',
            defaultSortOrder: 'descend',
            sorter: {
                compare: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
                multiple: 1,
            },
            render: (date) => moment(date).format('DD-MM-YYYY hh:mm:ss'),
        },
        {
            title: 'Thao tác',
            dataIndex: 'action',
            render: (_, record) => (
                <Space>
                    <Tag
                        color="#2db7f5"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            setOpenModel(true);
                            setDataUpdate(record);
                        }}
                    >
                        <FaEdit />
                    </Tag>
                    <Popconfirm
                        placement="topLeft"
                        title="Xác nhận xoá slider"
                        description="Bạn có chắc chắn muốn xoá slider này ?"
                        okText="Xác nhận"
                        cancelText="Huỷ"
                        onConfirm={() => handleDeleteSlider(record.id)}
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

    // Get list slider
    const fetchListSlider = async () => {
        setLoadingTable(true);
        const listSlider = await siteService.getAllSlider();

        if (listSlider && listSlider.errCode === 0) {
            setSliders(listSlider.data);
            setLoadingTable(false);
        }
    };

    useEffect(() => {
        fetchListSlider();
    }, []);

    return (
        <Content className={clsx(styles.wrapper)}>
            <div className={clsx(styles.wrapper_table)}>
                <div className={clsx(styles.heading_table)}>
                    <h1 className={clsx(styles.title_table)}>Danh sách slider</h1>
                    <Space className={clsx(styles.wrapper_btn)}>
                        <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => setOpenAddSlider(true)}>
                            Thêm mới
                        </Button>
                        <Button type="text" icon={<ReloadOutlined />} onClick={fetchListSlider} />
                    </Space>
                </div>

                <Table
                    columns={columns}
                    dataSource={sliders}
                    loading={loadingTable}
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

                <UpdateSlider
                    openModal={openModal}
                    setOpenModal={setOpenModel}
                    dataUpdate={dataUpdate}
                    setDataUpdate={setDataUpdate}
                    fetchListSlider={fetchListSlider}
                />

                <AddSlider
                    openModalCreate={openAddSlider}
                    setOpenModalCreate={setOpenAddSlider}
                    fetchListSlider={fetchListSlider}
                />
            </div>
        </Content>
    );
}

export default Slider;
