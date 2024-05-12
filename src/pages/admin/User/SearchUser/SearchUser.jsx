import clsx from 'clsx';
import { Button, Col, Form, Input, Row, Space } from 'antd';

import styles from './SearchUser.module.scss';

function SearchUser({ onFinish }) {
    const [form] = Form.useForm();

    return (
        <Form form={form} name="search-user" className={clsx(styles.form)} onFinish={onFinish} layout="vertical">
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item name="fullname" label="Họ tên" hasFeedback>
                        <Input placeholder="Nhập họ tên" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name="email" label="Email" hasFeedback>
                        <Input placeholder="Nhập email" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name="phone" label="Số điện thoại" hasFeedback>
                        <Input placeholder="Nhập số điện thoại" />
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

export default SearchUser;
