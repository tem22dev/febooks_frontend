import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Layout, Table, Select, Tag } from 'antd';
import qs from 'qs';
import moment from 'moment';

import styles from './Visits.module.scss';
import * as siteService from '../../../services/siteService';

function Following() {
    const { Content } = Layout;
    const [dataVisits, setDataVisits] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDataVisits = async () => {
            setLoading(true);
            const res = await siteService.getAllVisits();

            if (res && res.data) {
                setDataVisits(res.data);
            }
            setLoading(false);
        };

        fetchDataVisits();
    }, []);

    const columns = [
        {
            title: '#',
            width: '10%',
            dataIndex: '#',
            render: (name, record, index) => index + 1,
        },
        {
            title: 'IP',
            dataIndex: 'ip',
        },
        {
            title: 'Ngày truy cập',
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
                        dataSource={dataVisits}
                        loading={loading}
                        pagination={{
                            showSizeChanger: true,
                            showTotal: (total, range) => (
                                <div>
                                    {range[0]}-{range[1]} trên {total} dòng
                                </div>
                            ),
                        }}
                        title={() => <h1 style={{ fontSize: '1.6rem', margin: 0 }}>Danh sách truy cập Febooks</h1>}
                    />
                </div>
            </Content>
        </>
    );
}

export default Following;
