import { useEffect, useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';

import { LockOutlined, MailOutlined } from '@ant-design/icons';

function Login() {
    // const [open, setOpen] = useState(false);
    // const [confirmLoading, setConfirmLoading] = useState(false);
    // const [modalText, setModalText] = useState('Content of the modal');

    // const onFinish = (values) => {
    //     // const fetchApi = async () => {
    //     //     const result = await authServices.register(values);
    //     //     console.log(result);
    //     // };
    //     // fetchApi();
    // };

    // useEffect(() => {
    //     window.addEventListener('load', function () {
    //         setOpen(true);
    //     });
    // });

    // const handleOk = () => {
    //     setModalText('The modal will be closed after two seconds');
    //     setConfirmLoading(true);
    //     setTimeout(() => {
    //         setOpen(false);
    //         setConfirmLoading(false);
    //     }, 2000);
    // };

    // const handleCancel = () => {
    //     console.log('Clicked cancel button');
    //     setOpen(false);
    // };

    return (
        <h1>Error</h1>
        // <>
        //     <Modal
        //         style={{ top: 20 }}
        //         width={360}
        //         title="Đăng nhập"
        //         open={open}
        //         closeIcon={false}
        //         onOk={handleOk}
        //         confirmLoading={confirmLoading}
        //         onCancel={handleCancel}
        //         mask={false}
        //         maskClosable={false}
        //     >
        //         <Form name="register" initialValues={{ remember: true }} onFinish={onFinish} layout="vertical">
        //             <Form.Item
        //                 label="E-mail"
        //                 name="email"
        //                 rules={[
        //                     {
        //                         required: true,
        //                         message: 'Vui lòng nhập email!',
        //                     },
        //                     {
        //                         type: 'email',
        //                         message: 'Không phải email hợp lệ!',
        //                     },
        //                 ]}
        //                 hasFeedback
        //             >
        //                 <Input prefix={<MailOutlined />} type="email" placeholder="Email" />
        //             </Form.Item>
        //             <Form.Item
        //                 label="Mật khẩu"
        //                 name="password"
        //                 rules={[
        //                     {
        //                         required: true,
        //                         message: 'Vui lòng nhập mật khẩu!',
        //                     },
        //                     {
        //                         min: 6,
        //                         max: 32,
        //                         message: 'Độ dài mật khẩu từ 6 đến 32 ký tự!',
        //                     },
        //                 ]}
        //                 hasFeedback
        //             >
        //                 <Input.Password prefix={<LockOutlined />} type="password" placeholder="Password" />
        //             </Form.Item>

        //             <Form.Item>
        //                 <Button type="primary" htmlType="submit">
        //                     Đăng nhập
        //                 </Button>
        //             </Form.Item>
        //         </Form>
        //     </Modal>
        // </>
    );
}

export default Login;
