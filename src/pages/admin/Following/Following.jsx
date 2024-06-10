import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Layout, Table, Select, Tag } from 'antd';
import qs from 'qs';
import moment from 'moment';

import styles from './Following.module.scss';
import * as siteService from '../../../services/siteService';

function Following() {
    const { Content } = Layout;
    const [dataFollow, setDataFollow] = useState([]);
    const [follow, setFollow] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDataFollow = async () => {
            setLoading(true);
            const res = await siteService.getAllFollowing();

            if (res && res.data) {
                setDataFollow(res.data);
            }
            setLoading(false);
        };

        fetchDataFollow();
    }, []);

    const columns = [
        {
            title: '#',
            width: '10%',
            dataIndex: '#',
            render: (name, record, index) => index + 1,
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Ngày đăng ký',
            width: '30%',
            dataIndex: 'createdAt',
            defaultSortOrder: 'descend',
            sorter: {
                compare: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
                multiple: 1,
            },
            render: (date) => moment(date).format('DD-MM-YYYY hh:mm:ss'),
        },
    ];

    return (
        <>
            <Content className={clsx(styles.wrapper)}>
                <div className={clsx(styles.wrapper_table)}>
                    <Table
                        columns={columns}
                        rowKey={(record) => record.id}
                        dataSource={dataFollow}
                        loading={loading}
                        pagination={{
                            showSizeChanger: true,
                            showTotal: (total, range) => (
                                <div>
                                    {range[0]}-{range[1]} trên {total} dòng
                                </div>
                            ),
                        }}
                        title={() => <h1 style={{ fontSize: '1.6rem', margin: 0 }}>Danh sách theo dõi Febooks</h1>}
                    />
                </div>
            </Content>
        </>
    );
}

export default Following;
