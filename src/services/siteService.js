import request from '../utils/request';

export const counterOrder = async () => {
    try {
        const res = await request.get('site/counter/order');
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
