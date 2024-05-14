import { Modal, message, Upload, Table, notification, Tag } from 'antd';
import { CloudUploadOutlined, InboxOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { useState } from 'react';

import * as userService from '../../../../services/userService';

function ImportUser(props) {
    const { openImportUser, setOpenImportUser } = props;
    const { Dragger } = Upload;
    const [dataExcel, setDataExcel] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess('ok');
        }, 1000);
    };

    const propsUpload = {
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
                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj;
                    const reader = new FileReader();
                    reader.readAsArrayBuffer(file);
                    reader.onload = function (e) {
                        const data = new Uint8Array(reader.result);
                        const workbook = XLSX.read(data, { type: 'array' });
                        const sheet = workbook.Sheets[workbook.SheetNames[0]];
                        const json = XLSX.utils.sheet_to_json(sheet, {
                            header: ['fullname', 'email', 'phone', 'role'],
                            range: 1, // skip header row
                        });
                        console.log(json);
                        if (json && json.length > 0) setDataExcel(json);
                    };
                }
                message.success(`${info.file.name} tải tài liệu thành công.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} Tải tài liệu thất bại.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const handleSubmit = async () => {
        const data = dataExcel.map((item) => {
            item.password = '123456';
            return item;
        });
        const res = await userService.importUser(data);
        console.log(res);
        if (res && res.errCode === 0) {
            notification.success({
                message: 'Tải lên thành công',
                description: res.message,
            });
            setDataExcel([]);
            setOpenImportUser(false);
            props.fetchListUser();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: `Số điện thoại hoặc email đã tồn tại trên hệ thống ở dòng ${res.errMessage.join(', ')}`,
            });
        }
    };

    return (
        <Modal
            title="Nhập dữ liệu người dùng"
            open={openImportUser}
            onOk={handleSubmit}
            okButtonProps={{
                icon: <CloudUploadOutlined />,
                disabled: dataExcel.length < 1,
            }}
            okText="Nhập dữ liệu"
            // confirmLoading={isLoading}
            onCancel={() => {
                setOpenImportUser(false);
                setDataExcel([]);
            }}
            cancelText="Huỷ bỏ"
            maskClosable={false}
            centered={true}
            width={700}
        >
            <Dragger {...propsUpload}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
                <p className="ant-upload-hint">Hỗ trợ tải lên một lần. Chỉ chấp nhận .csv, .xls, .xlsx</p>
            </Dragger>
            <div style={{ paddingTop: 20 }}>
                <Table
                    dataSource={dataExcel}
                    title={() => <span>Dữ liệu upload:</span>}
                    rowKey="email"
                    columns={[
                        { dataIndex: 'fullname', title: 'Tên hiển thị' },
                        { dataIndex: 'email', title: 'Email' },
                        { dataIndex: 'phone', title: 'Số điện thoại' },
                        {
                            dataIndex: 'role',
                            title: 'Vai trò',
                            render: (text) => {
                                let color = text === 'admin' ? 'geekblue' : 'green';
                                let name = text === 'admin' ? 'Quản trị viên' : 'Người dùng';
                                return (
                                    <Tag color={color} key={text}>
                                        {name.toUpperCase()}
                                    </Tag>
                                );
                            },
                        },
                    ]}
                />
            </div>
        </Modal>
    );
}

export default ImportUser;
