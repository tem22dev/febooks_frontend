import { Modal, message, Upload, Table } from 'antd';
import { CloudUploadOutlined, InboxOutlined } from '@ant-design/icons';

function ImportBook({ open, handleCancel, handleOk, confirmLoading }) {
    const { Dragger } = Upload;

    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess('ok');
        }, 1000);
    };

    const props = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
        customRequest: dummyRequest,
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} tải tài liệu thành công.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} Tải tài liệu thất bại.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    return (
        <Modal
            title="Nhập dữ liệu người dùng"
            open={open}
            onOk={handleOk}
            okButtonProps={{ icon: <CloudUploadOutlined /> }}
            okText="Nhập dữ liệu"
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            cancelText="Huỷ bỏ"
            maskClosable={false}
            centered={true}
            width={680}
        >
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
                <p className="ant-upload-hint">Hỗ trợ tải lên một lần. Chỉ chấp nhận .csv, .xls, .xlsx</p>
            </Dragger>
            <div style={{ paddingTop: 20 }}>
                <Table
                    title={() => <span>Dữ liệu upload:</span>}
                    columns={[
                        { dataIndex: 'fullname', title: 'Tên hiển thị' },
                        { dataIndex: 'email', title: 'Email' },
                        { dataIndex: 'phone', title: 'Số điện thoại' },
                    ]}
                />
            </div>
        </Modal>
    );
}

export default ImportBook;
