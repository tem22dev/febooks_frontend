import request from '../utils/request';

export const register = async (values) => {
    try {
        const res = await request.post('auth/register', {
            values,
        });

        return res.data;
    } catch (error) {
        console.log(error);
    }
};
