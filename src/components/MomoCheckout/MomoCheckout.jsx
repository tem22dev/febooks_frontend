import { useState } from 'react';
import { message, Button } from 'antd';

import * as siteService from '../../services/siteService';

const MomoCheckout = ({ amount }) => {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);

        const orderId = `order_${new Date().getTime()}`;
        const orderInfo = 'Thanh toán đơn hàng';
        const returnUrl = 'http://localhost:5173';
        const notifyUrl = 'http://localhost:8080/api/site/payment/momo';

        const response = await siteService.paymentMomo(amount, orderId, orderInfo, returnUrl, notifyUrl);
        console.log(response);
        // if (response.data.payUrl) {
        //     window.location.href = response.data.payUrl;
        // } else {
        //     message.error('Thanh toán không thành công');
        // }
        // try {
        //     const response = await axios.post('http://localhost:3001/momo', {
        //         amount,
        //         orderId,
        //         orderInfo,
        //         returnUrl,
        //         notifyUrl,
        //     });

        // } catch (error) {
        //     message.error(error.message);
        // }

        setLoading(false);
    };

    return (
        <Button type="primary" onClick={handlePayment} loading={loading}>
            Thanh toán qua Momo
        </Button>
    );
};

export default MomoCheckout;
