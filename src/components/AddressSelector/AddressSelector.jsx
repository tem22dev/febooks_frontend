import React, { useState, useEffect } from 'react';
import { Select, Form, Input } from 'antd';
import axios from 'axios';

const { Option } = Select;

const AddressSelector = ({ form }) => {
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedCityName, setSelectedCityName] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedDistrictName, setSelectedDistrictName] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [selectedWardName, setSelectedWardName] = useState('');

    useEffect(() => {
        // Fetch city data
        axios
            .get('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json')
            .then((response) => {
                setCities(response.data);
            })
            .catch((error) => {
                console.error('Error fetching city data:', error);
            });
    }, []);

    const handleCityChange = (value, option) => {
        setSelectedCity(value);
        setSelectedCityName(option.children);
        setDistricts([]);
        setWards([]);
        form.setFieldsValue({ city: option.children, district: undefined, ward: undefined });
        if (value !== '') {
            const selectedCityData = cities.find((city) => city.Id === value);
            setDistricts(selectedCityData.Districts);
        }
    };

    const handleDistrictChange = (value, option) => {
        setSelectedDistrict(value);
        setSelectedDistrictName(option.children);
        setWards([]);
        form.setFieldsValue({ district: option.children, ward: undefined });
        if (value !== '') {
            const selectedDistrictData = districts.find((district) => district.Id === value);
            setWards(selectedDistrictData.Wards);
        }
    };

    const handleWardChange = (value, option) => {
        setSelectedWard(value);
        setSelectedWardName(option.children);
        form.setFieldsValue({ ward: option.children });
    };

    useEffect(() => {
        form.setFieldsValue({
            fullAddress: `${selectedWardName ? selectedWardName + ', ' : ''}${
                selectedDistrictName ? selectedDistrictName + ', ' : ''
            }${selectedCityName}`,
        });
    }, [selectedCityName, selectedDistrictName, selectedWardName]);

    return (
        <div>
            <Form.Item name="city" rules={[{ required: true, message: 'Vui lòng chọn tỉnh thành!' }]}>
                <Select placeholder="Chọn tỉnh thành" onChange={handleCityChange}>
                    {cities.map((city) => (
                        <Option key={city.Id} value={city.Id}>
                            {city.Name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item name="district" rules={[{ required: true, message: 'Vui lòng chọn quận huyện!' }]}>
                <Select placeholder="Chọn quận huyện" onChange={handleDistrictChange} disabled={!selectedCity}>
                    {districts.map((district) => (
                        <Option key={district.Id} value={district.Id}>
                            {district.Name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item name="ward" rules={[{ required: true, message: 'Vui lòng chọn phường xã!' }]}>
                <Select placeholder="Chọn phường xã" onChange={handleWardChange} disabled={!selectedDistrict}>
                    {wards.map((ward) => (
                        <Option key={ward.Id} value={ward.Id}>
                            {ward.Name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                name="fullAddress"
                style={{ display: 'none' }}
                rules={[{ required: true, message: 'Vui lòng nhập đầy đủ địa chỉ!' }]}
            >
                <Input />
            </Form.Item>
        </div>
    );
};

export default AddressSelector;
