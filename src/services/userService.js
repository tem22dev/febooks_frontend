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

export const getUserById = async (id) => {
    try {
        const res = await request.get('users/get-one', {
            params: {
                id,
            },
        });
        return res;
    } catch (error) {
        throw Error(error);
    }
};

export const updatePassUser = async (id) => {
    try {
        const res = await request.post('users/change-pass', id);
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
        const res = await request.put('users/update', data);
        return res;
    } catch (error) {
        throw error.response.data;
    }
};

export const deleteUser = async (id) => {
    try {
        const res = await request.delete(`users/delete/${id}`);
        return res;
    } catch (error) {
        throw error.response.data;
    }
};
