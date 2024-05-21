import request from '../utils/request';

export const getAllBook = async () => {
    try {
        const res = await request.get('books');
        return res;
    } catch (error) {
        throw Error(error);
    }
};

export const getSliderBookById = async (idBook) => {
    try {
        const res = await request.get('books/sliders', {
            params: {
                idBook,
            },
        });
        return res;
    } catch (error) {
        throw Error(error);
    }
};

export const getBookById = async (id) => {
    try {
        const res = await request.get('books/one-book', {
            params: {
                id,
            },
        });
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

export const createBook = async ({ ...bookData }) => {
    try {
        const res = await request.post('books/create', bookData);
        return res;
    } catch (error) {
        throw error.response.data;
    }
};

export const uploadImgBook = async (file) => {
    try {
        const formData = new FormData();
        formData.append('book', file);

        const response = await request.post('books/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        throw error.response.data;
    }
};

// export const importBook = async (data) => {
//     try {
//         const res = await request.post('users/import/bulk-create', data);
//         return res;
//     } catch (error) {
//         throw error.response.data;
//     }
// };

export const updateBook = async (data) => {
    try {
        const res = await request.put('books/update', data);
        return res;
    } catch (error) {
        throw error.response.data;
    }
};

export const deleteBook = async (id) => {
    try {
        const res = await request.delete(`books/delete/${id}`);
        return res;
    } catch (error) {
        throw error.response.data;
    }
};

// Call Fetch Category
export const authorBook = async () => {
    try {
        const res = await request.get('books/cate/author');
        return res;
    } catch (error) {
        throw error.response.data;
    }
};

export const genreBook = async () => {
    try {
        const res = await request.get('books/cate/genre');
        return res;
    } catch (error) {
        throw error.response.data;
    }
};

export const publisherBook = async () => {
    try {
        const res = await request.get('books/cate/publisher');
        return res;
    } catch (error) {
        throw error.response.data;
    }
};

export const supplierBook = async () => {
    try {
        const res = await request.get('books/cate/supplier');
        return res;
    } catch (error) {
        throw error.response.data;
    }
};

export const languageBook = async () => {
    try {
        const res = await request.get('books/cate/language');
        return res;
    } catch (error) {
        throw error.response.data;
    }
};
