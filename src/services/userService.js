import request from '../utils/request';

export const getAllUser = async () => {
    try {
        const res = await request.get('users');
        return res;
    } catch (error) {
        throw Error(error);
    }
};

export const searchUser = async ({ ...values }) => {
    try {
        const res = await request.get('users/search', {
            params: {
                ...values,
            },
        });
        return res;
    } catch (error) {
        throw Error(error);
    }
};

export const createUser = async ({ ...userData }) => {
    try {
        const res = await request.post('users/create', userData);
        return res;
    } catch (error) {
        throw error.response.data;
    }
};

export const uploadAvatarImg = async (file) => {
    try {
        const formData = new FormData();
        formData.append('avatar', file);

        const response = await request.post('users/upload/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        throw error.response.data;
    }
};

export const importUser = async (data) => {
    try {
        const res = await request.post('users/import/bulk-create', data);
        return res;
    } catch (error) {
        throw error.response.data;
    }
};

export const updateUser = async (data) => {
    try {
        console.log(data);
        const res = await request.post('users/update', data);
        return res;
    } catch (error) {
        throw error.response.data;
    }
};
