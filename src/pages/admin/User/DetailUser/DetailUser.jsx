import { useEffect, useState } from 'react';
import { Tag, Badge, Descriptions, Divider, Drawer, Modal, Upload } from 'antd';
import moment from 'moment/moment';
import { v4 as uuidv4 } from 'uuid';

const ENV = import.meta.env;

function DetailUser({ show, onClose, data }) {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState({});
    useEffect(() => {
        if (data) {
            let imgAvatar = {};
            if (data.avatar) {
                imgAvatar = {
                    uid: uuidv4(),
                    name: data?.avatar,
                    status: 'done',
                    url: `${ENV.VITE_BASE_URL_BACKEND}/images/accounts/${data?.avatar}`,
                };
            }
            setFileList([imgAvatar]);
        }
    }, [data]);

    const items = [
        {
            key: '1',
            label: 'Id',
            children: data?.id,
        },
        {
            key: '2',
            span: 2,
            label: 'Họ Tên',
            children: data?.fullname,
        },
        {
            key: '3',
            label: 'E-Mail',
            children: data?.email,
        },
        {
            key: '4',
            label: 'Số điện thoại',
            children: data?.phone,
        },
        {
            key: '5',
            label: 'Giới Tính',
            children: data?.gender,
        },
        {
            key: '6',
            label: 'Trạng thái',
            children: data?.active ? (
                <Badge status="processing" text="Hoạt động" />
            ) : (
                <Badge status="error" text="Dừng" />
            ),
        },
        {
            key: '7',
            label: 'Vai trò',
            span: 2,
            children:
                data?.role === 'admin' ? (
                    <Tag color="geekblue">{'Quản trị viên'.toUpperCase()}</Tag>
                ) : (
                    <Tag color="green">{'Người dùng'.toUpperCase()}</Tag>
                ),
        },
        {
            key: '8',
            label: 'Tạo tại',
            children: moment(data?.createdAt).format('DD-MM-YYYY hh:mm:ss'),
        },
        {
            key: '9',
            label: 'Cập nhật',
            span: 2,
            children: moment(data?.updatedAt).format('DD-MM-YYYY hh:mm:ss'),
        },
        {
            key: '11',
            label: 'Địa chỉ',
            children: data?.address,
        },
    ];

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    return (
        <>
            <Drawer title="Xem chi tiết" placement="right" closable={true} onClose={onClose} open={show} width={540}>
                <Descriptions title="Thông tin người dùng" layout="vertical" bordered items={items} />
                <Divider orientation="left">Ảnh đại diện</Divider>
                <Upload
                    // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    showUploadList={{ showRemoveIcon: false }}
                ></Upload>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img alt="avatar" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </Drawer>
        </>
    );
}

export default DetailUser;
