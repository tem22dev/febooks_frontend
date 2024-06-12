import request from '../utils/request';

export const counterOrder = async () => {
    try {
        const res = await request.get('site/counter/order');
        return res;
    } catch (error) {
        throw Error(error);
    }
};

export const getRevenue = async () => {
    try {
        const res = await request.get('site/revenue');
        return res;
    } catch (error) {
        throw Error(error);
    }
};

export const counterGenre = async () => {
    try {
        const res = await request.get('site/counter/genre');
        return res;
    } catch (error) {
        throw Error(error);
    }
};

export const counterFollow = async () => {
    try {
        const res = await request.get('site/counter/follow');
        return res;
    } catch (error) {
        throw Error(error);
    }
};

export const counterUser = async () => {
    try {
        const res = await request.get('site/counter/user');
        return res;
    } catch (error) {
        throw Error(error);
    }
};

export const payment = async (amount, id) => {
    try {
        const res = await request.post('site/payment', {
            amount: amount, // Số tiền cần thanh toán (đơn vị là cents)
            id,
        });
        return res;
    } catch (error) {
        throw Error(error);
    }
};

export const paymentMomo = async (amount, orderId, orderInfo, returnUrl, notifyUrl) => {
    try {
        const res = await request.post('site/payment/momo', {
            amount,
            orderId,
            orderInfo,
            returnUrl,
            notifyUrl,
        });
        return res;
    } catch (error) {
        throw Error(error);
    }
};

export const getAllFollowing = async () => {
    try {
        const res = await request.get('site/following');
        return res;
    } catch (error) {
        throw Error(error);
    }
};

export const getAllVisits = async () => {
    try {
        const res = await request.get('site/visits-all');
        return res;
    } catch (error) {
        throw Error(error);
    }
};

export const createFollowing = async (email) => {
    try {
        const res = await request.post('site/following/create', email);
        return res;
    } catch (error) {
        throw error.response.data;
    }
};

export const getAllSlider = async () => {
    try {
        const res = await request.get('site/slider');
        return res;
    } catch (error) {
        throw Error(error);
    }
};

export const createSlider = async ({ ...slider }) => {
    try {
        const res = await request.post('site/slider/create', slider);
        return res;
    } catch (error) {
        throw error.response.data;
    }
};

export const updateSlider = async (data) => {
    try {
        const res = await request.put('site/slider/update', data);
        return res;
    } catch (error) {
        throw error.response.data;
    }
};

export const deleteSlider = async (id) => {
    try {
        const res = await request.delete(`site/slider/delete/${id}`);
        return res;
    } catch (error) {
        throw error.response.data;
    }
};

export const uploadSliderImg = async (file) => {
    try {
        const formData = new FormData();
        formData.append('slider', file);

        const response = await request.post('site/upload/slider', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        throw error.response.data;
    }
};

export const createVisit = async (data) => {
    try {
        const response = await request.post('site/visits', data);
        return response;
    } catch (error) {
        throw error.response.data;
    }
};
