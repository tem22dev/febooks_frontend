import request from '../utils/request';

export const placeOrder = async (data) => {
    try {
        const res = await request.post('order', {
            ...data,
        });
        return res;
    } catch (error) {
        throw Error(error);
    }
};

export const getHistoryOrder = async () => {
    try {
        const res = await request.get('order/history');
        return res;
    } catch (error) {
        throw Error(error);
    }
};

export const getAllOrder = async () => {
    try {
        const res = await request.get('order/list-order');
        return res;
    } catch (error) {
        throw Error(error);
    }
};

export const updateStatusOrder = async (data) => {
    try {
        const res = await request.put('order/update', data);
        return res;
    } catch (error) {
        throw Error(error);
    }
};
