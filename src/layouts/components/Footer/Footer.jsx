import { Row, Col, Form, Input, Button } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import './Footer.scss'; // Create this CSS file to handle custom styling

const Footer = () => {
    const onFinish = (values) => {
        console.log('Success:', values);
    };

    return (
        <div className="footer">
            <div className="newsletter">
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ display: 'flex' }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="ĐĂNG KÝ NHẬN BẢN TIN"
                        name="email"
                        rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                        style={{ margin: 0, fontSize: '18px' }}
                    >
                        <Input placeholder="Nhập địa chỉ email của bạn" className="newsletter-input" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        Đăng ký
                    </Button>
                </Form>
            </div>
            <Row gutter={[16, 16]} className="footer-content">
                <Col span={6}>
                    <h2>Febooks</h2>
                    <p>Lầu 5, 387-389 Hai Bà Trưng Quận 3 TP HCM</p>
                    <p>Công Ty Cổ Phần Phát Hành Sách TP HCM - FAHASA</p>
                    <p>60 - 62 Lê Lợi, Quận 1, TP. HCM, Việt Nam</p>
                    <p>Fahasa.com nhận đặt hàng trực tuyến và giao hàng tận nơi.</p>
                    <p>KHÔNG hỗ trợ đặt mua và nhận hàng trực tiếp tại văn phòng</p>
                </Col>
                <Col span={6}>
                    <h2>DỊCH VỤ</h2>
                    <p>Điều khoản sử dụng</p>
                    <p>Chính sách bảo mật thông tin cá nhân</p>
                    <p>Chính sách bảo mật thanh toán</p>
                    <p>Giới thiệu Febooks</p>
                    <p>Hệ thống trung tâm - nhà sách</p>
                </Col>
                <Col span={6}>
                    <h2>HỖ TRỢ</h2>
                    <p>Chính sách đổi - trả - hoàn tiền</p>
                    <p>Chính sách bảo hành - bồi hoàn</p>
                    <p>Chính sách vận chuyển</p>
                    <p>Chính sách khách sỉ</p>
                    <p>Phương thức thanh toán và xuất HĐ</p>
                </Col>
                <Col span={6}>
                    <h2>TÀI KHOẢN CỦA TÔI</h2>
                    <p>Đăng nhập/Tạo mới tài khoản</p>
                    <p>Thay đổi địa chỉ khách hàng</p>
                    <p>Chi tiết tài khoản</p>
                    <p>Lịch sử mua hàng</p>
                </Col>
            </Row>
        </div>
    );
};

export default Footer;
