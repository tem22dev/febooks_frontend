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
