import clsx from 'clsx';
import { Button, Col, Form, Input, Row, Space } from 'antd';

import styles from './SearchBook.module.scss';

function SearchBook({ onFinish }) {
    const [form] = Form.useForm();

    return (
        <Form form={form} name="search-book" className={clsx(styles.form)} onFinish={onFinish} layout="vertical">
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item name="name-book" label="Tên sách" hasFeedback>
                        <Input placeholder="Nhập tên sách" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name="author" label="Tác giả" hasFeedback>
                        <Input placeholder="Nhập tác giả" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name="cate" label="Thể loại" hasFeedback>
                        <Input placeholder="Nhập thể loại" />
                    </Form.Item>
                </Col>
            </Row>
            <div className={clsx(styles.action)}>
                <Space size="small">
                    <Button type="primary" htmlType="submit">
                        Tìm kiếm
                    </Button>
                    <Button
                        onClick={() => {
                            form.resetFields();
                        }}
                    >
                        Làm trống
                    </Button>
                </Space>
            </div>
        </Form>
    );
}

export default SearchBook;
