import { Modal, message, Upload, Table, notification, Tag } from 'antd';
import { CloudUploadOutlined, InboxOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { useState } from 'react';

import * as bookService from '../../../../services/bookService';
import templateFile from '../../../../assets/uploads/template-author.xlsx?url';

function ImportAuthor(props) {
    const { openImportAuthor, setOpenImportAuthor } = props;
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
                            header: ['nameAuthor', 'biography'],
                            range: 1, // skip header row
                        });

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
        setIsLoading(true);
        const res = await bookService.importAuthor(dataExcel);

        if (res && res.errCode === 0) {
            message.success(res.message);
            setDataExcel([]);
            setOpenImportAuthor(false);
            props.fetchListAuthor();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.errMessage,
            });
        }
        setIsLoading(false);
    };

    return (
        <Modal
            title="Nhập dữ liệu tác giả"
            open={openImportAuthor}
            onOk={handleSubmit}
            okButtonProps={{
                icon: <CloudUploadOutlined />,
                disabled: dataExcel.length < 1,
            }}
            okText="Nhập dữ liệu"
            confirmLoading={isLoading}
            onCancel={() => {
                setOpenImportAuthor(false);
                setDataExcel([]);
            }}
            cancelText="Huỷ bỏ"
            maskClosable={false}
            centered={true}
            width={600}
        >
            <Dragger {...propsUpload}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
                <p className="ant-upload-hint">
                    Hỗ trợ tải lên một lần. Chỉ chấp nhận .csv, .xls, .xlsx, hoặc &nbsp;{' '}
                    <a onClick={(e) => e.stopPropagation()} href={templateFile} download>
                        Tải file mẫu tại đây
                    </a>
                </p>
            </Dragger>
            <div style={{ paddingTop: 20 }}>
                <Table
                    dataSource={dataExcel}
                    title={() => <span>Dữ liệu upload:</span>}
                    rowKey="nameAuthor"
                    columns={[
                        { dataIndex: 'nameAuthor', title: 'Tên tác giả' },
                        { dataIndex: 'biography', title: 'Tiểu sử' },
                    ]}
                />
            </div>
        </Modal>
    );
}

export default ImportAuthor;
