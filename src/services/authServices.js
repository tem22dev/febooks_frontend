import request from '../utils/request';

export const register = async ({ ...values }) => {
    try {
        const res = await request.post('auth/register', values);
        return res;
    } catch (error) {
        // throw Error(error)
        console.log(error);
    }
};

export const login = async ({ ...values }) => {
    try {
        const res = await request.post('auth/login', values);
        return res;
    } catch (error) {
        console.log(error);
    }
};
