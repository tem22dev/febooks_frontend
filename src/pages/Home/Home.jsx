import clsx from 'clsx';
import { FilterTwoTone, ReloadOutlined } from '@ant-design/icons';
import { Row, Col, Form, Checkbox, Divider, InputNumber, Button, Rate, Radio, Pagination, Spin } from 'antd';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import React from 'react';

import * as bookService from '../../services/bookService';
import styles from './Home.module.scss';

const ENV = import.meta.env;

function Home() {
    const [listCategory, setListCategory] = useState([]);
    const [listBook, setListBook] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState('');
    const [sortQuery, setSortQuery] = useState('sort=-quantitySold');

    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        const initCategory = async () => {
            const res = await bookService.genreBook();
            if (res && res?.data) {
                const categories = res.data.map((item) => ({ label: item.nameGenre, value: item.id }));
                setListCategory(categories);
            }
        };
        initCategory();
    }, []);

    const fetchBook = useCallback(async () => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) query += `&${filter}`;
        if (sortQuery) query += `&${sortQuery}`;

        const res = await bookService.getAllBookSort(query);
        if (res && res.result) {
            setListBook(res.result);
            setTotal(res.meta.total);
        }
        setIsLoading(false);
    }, [current, pageSize, filter, sortQuery]);

    useEffect(() => {
        fetchBook();
    }, [fetchBook]);

    const handleOnchangePage = (page, pageSize) => {
        setCurrent(page);
        setPageSize(pageSize);
    };

    const handleChangeFilter = (changedValues, values) => {
        // only fire if category changes
        if (changedValues.category) {
            const cate = values.category;
            if (cate && cate.length > 0) {
                const f = cate.join(',');
                setFilter(`category=${f}`);
            } else {
                //reset data -> fetch all
                setFilter('');
            }
        }
    };

    const onFinish = (values) => {
        if (values?.range?.from >= 0 && values?.range?.to >= 0) {
            let f = `priceMin=${values?.range?.from}&priceMax=${values?.range?.to}`;
            if (values?.category?.length) {
                const cate = values?.category?.join(',');
                f += `&category=${cate}`;
            }
            setFilter(f);
        }
    };

    const nonAccentVietnamese = (str) => {
        str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, 'A');
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
        str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, 'E');
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
        str = str.replace(/I|Í|Ì|Ĩ|Ị/g, 'I');
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
        str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, 'O');
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
        str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, 'U');
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
        str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, 'Y');
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
        str = str.replace(/Đ/g, 'D');
        str = str.replace(/đ/g, 'd');
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '');
        str = str.replace(/\u02C6|\u0306|\u031B/g, '');
        return str;
    };

    const convertSlug = (str) => {
        str = nonAccentVietnamese(str);
        str = str.trim().toLowerCase();

        const from =
            'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;';
        const to =
            'AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------';
        for (let i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');

        return str;
    };

    const handleRedirectBook = (book) => {
        const slug = convertSlug(book.title);
        navigate(`/book/${slug}?id=${book.id}`);
    };

    return (
        <div style={{ backgroundColor: '#f0f0f0', padding: '14px 0' }}>
            <div className={clsx(styles.container)}>
                <Row gutter={[16, 16]}>
                    <Col lg={6} sm={0} xs={0}>
                        <div style={{ padding: '14px', background: '#fff', borderRadius: 5 }}>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    paddingBottom: '10px',
                                    borderBottom: '1px solid #eee',
                                }}
                            >
                                <span>
                                    {' '}
                                    <FilterTwoTone />
                                    <span style={{ fontWeight: 500 }}> Bộ lọc tìm kiếm</span>
                                </span>
                                <ReloadOutlined
                                    title="Reset"
                                    onClick={() => {
                                        form.resetFields();
                                        setFilter('');
                                    }}
                                />
                            </div>
                            <Form onFinish={onFinish} form={form} onValuesChange={handleChangeFilter}>
                                <Form.Item name="category" label="Danh mục sản phẩm" labelCol={{ span: 24 }}>
                                    <Checkbox.Group>
                                        <Row>
                                            {listCategory?.map((item, index) => (
                                                <Col span={24} key={`index-${index}`} style={{ padding: '7px 0' }}>
                                                    <Checkbox value={item.value}>{item.label}</Checkbox>
                                                </Col>
                                            ))}
                                        </Row>
                                    </Checkbox.Group>
                                </Form.Item>
                                <Divider />
                                <Form.Item label="Khoảng giá" labelCol={{ span: 24 }}>
                                    <Row gutter={[10, 10]} style={{ width: '100%' }}>
                                        <Col xl={11} md={24}>
                                            <Form.Item name={['range', 'from']}>
                                                <InputNumber
                                                    name="from"
                                                    min={0}
                                                    placeholder="đ TỪ"
                                                    formatter={(value) =>
                                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                    }
                                                    style={{ width: '100%' }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xl={2} md={0}>
                                            <div> - </div>
                                        </Col>
                                        <Col xl={11} md={24}>
                                            <Form.Item name={['range', 'to']}>
                                                <InputNumber
                                                    name="to"
                                                    min={0}
                                                    placeholder="đ ĐẾN"
                                                    formatter={(value) =>
                                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                    }
                                                    style={{ width: '100%' }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <div>
                                        <Button onClick={() => form.submit()} style={{ width: '100%' }} type="primary">
                                            Áp dụng
                                        </Button>
                                    </div>
                                </Form.Item>
                                <Divider />
                                <Form.Item label="Đánh giá" labelCol={{ span: 24 }}>
                                    <div>
                                        <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                        <span className={clsx(styles.ant_rate_text)}></span>
                                    </div>
                                    <div>
                                        <Rate value={4} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                        <span className={clsx(styles.ant_rate_text)}>trở lên</span>
                                    </div>
                                    <div>
                                        <Rate value={3} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                        <span className={clsx(styles.ant_rate_text)}>trở lên</span>
                                    </div>
                                    <div>
                                        <Rate value={2} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                        <span className={clsx(styles.ant_rate_text)}>trở lên</span>
                                    </div>
                                    <div>
                                        <Rate value={1} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                        <span className={clsx(styles.ant_rate_text)}>trở lên</span>
                                    </div>
                                </Form.Item>
                            </Form>
                        </div>
                    </Col>

                    <Col lg={18} xs={24}>
                        <Spin spinning={isLoading} tip="Đang tải...">
                            <div style={{ padding: '2px 14px 14px', background: '#fff', borderRadius: 5 }}>
                                <Row>
                                    <Radio.Group
                                        onChange={(e) => {
                                            setSortQuery(e.target.value);
                                        }}
                                        value={sortQuery}
                                        style={{ padding: '8px 0' }}
                                    >
                                        <Radio.Button value="sort=-quantitySold">Bán chạy</Radio.Button>
                                        <Radio.Button value="sort=-price">Giá cao đến thấp</Radio.Button>
                                        <Radio.Button value="sort=price">Giá thấp đến cao</Radio.Button>
                                        <Radio.Button value="sort=-updatedAt">Mới nhất</Radio.Button>
                                    </Radio.Group>
                                </Row>
                                <Row className={clsx(styles.customize_row)}>
                                    {listBook?.map((item, index) => (
                                        <div className={clsx(styles.column)} key={`book-${index}`}>
                                            <div className={clsx(styles.wrapper)}>
                                                <div
                                                    className={clsx(styles.thumbnail)}
                                                    onClick={() => handleRedirectBook(item)}
                                                >
                                                    <img
                                                        src={`${ENV.VITE_BASE_URL_BACKEND}/images/books/${item.thumbnail}`}
                                                        alt={`${item.title}`}
                                                    />
                                                </div>
                                                <div
                                                    className={clsx(styles.text)}
                                                    title={item.title}
                                                    onClick={() => handleRedirectBook(item)}
                                                >
                                                    {item.title}
                                                </div>
                                                <div className={clsx(styles.price)}>
                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    }).format(item?.price ?? 0)}
                                                </div>
                                                <div className={clsx(styles.rating)}>
                                                    <Rate
                                                        value={5}
                                                        disabled
                                                        style={{ color: '#ffce3d', fontSize: 10 }}
                                                    />
                                                    <span>Đã bán {item.quantitySold}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </Row>
                                <div style={{ marginTop: 30 }}></div>
                                <Row style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Pagination
                                        current={current}
                                        total={total}
                                        pageSize={pageSize}
                                        responsive
                                        onChange={handleOnchangePage}
                                    />
                                </Row>
                            </div>
                        </Spin>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default Home;
