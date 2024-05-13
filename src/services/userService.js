import request from '../utils/request';

export const getAllUser = async () => {
    try {
        const res = await request.get('users');
        return res;
    } catch (error) {
        throw Error(error);
    }
};
