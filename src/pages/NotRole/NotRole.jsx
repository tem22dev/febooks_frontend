import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

function NotRole() {
    return (
        <Result
            status="403"
            title="403"
            subTitle="Xin lỗi, bạn không được phép truy cập trang này."
            extra={
                <Button type="primary">
                    <Link to="/">Trở lại trang chủ</Link>
                </Button>
            }
        />
    );
}

export default NotRole;
