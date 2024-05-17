import request from '../utils/request';

export const getAllBook = async () => {
    try {
        const res = await request.get('books');
        return res;
    } catch (error) {
        throw Error(error);
    }
};

export const searchBook = async ({ ...values }) => {
    try {
        const res = await request.get('books/search', {
            params: {
                ...values,
            },
        });
        return res;
    } catch (error) {
        throw Error(error);
    }
};

export const createBook = async ({ ...userData }) => {
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

export const importBook = async (data) => {
    try {
        const res = await request.post('users/import/bulk-create', data);
        return res;
    } catch (error) {
        throw error.response.data;
    }
};

export const updateBook = async (data) => {
    try {
        const res = await request.put('users/update', data);
        return res;
    } catch (error) {
        throw error.response.data;
    }
};

export const deleteBook = async (id) => {
    try {
        const res = await request.delete(`users/delete/${id}`);
        return res;
    } catch (error) {
        throw error.response.data;
    }
};
