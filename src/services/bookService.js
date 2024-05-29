import request from '../utils/request';

export const getAllBook = async () => {
    try {
        const res = await request.get('books');
        return res;
    } catch (error) {
        throw Error(error);
    }
};

export const getAllBookSort = async (query) => {
    try {
        const res = await request.get(`books/sort?${query}`);
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

export const addAuthor = async (data) => {
    try {
        const res = await request.post('books/create/author', data);
        return res;
    } catch (error) {
        throw error.response.data;
    }
};

export const updateAuthor = async (data) => {
    try {
        const res = await request.put('books/update/author', data);
        return res;
    } catch (error) {
        throw error.response.data;
    }
};

export const deleteAuthor = async (id) => {
    try {
        const res = await request.delete(`books/delete/author/${id}`);
        return res;
    } catch (error) {
        throw error.response.data;
    }
};

export const importAuthor = async (data) => {
    try {
        const res = await request.post('books/import/author/bulk', data);
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

export const addGenre = async (data) => {
    try {
        const res = await request.post('books/create/genre', data);
        return res;
    } catch (error) {
        throw error.response.data;
    }
};

export const updateGenre = async (data) => {
    try {
        const res = await request.put('books/update/genre', data);
        return res;
    } catch (error) {
        throw error.response.data;
    }
};

export const deleteGenre = async (id) => {
    try {
        const res = await request.delete(`books/delete/genre/${id}`);
        return res;
    } catch (error) {
        throw error.response.data;
    }
};

export const importGenre = async (data) => {
    try {
        const res = await request.post('books/import/genre/bulk', data);
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

export const addPublisher = async (data) => {
    try {
        const res = await request.post('books/create/publisher', data);
        return res;
    } catch (error) {
        throw error.response.data;
    }
};

export const updatePublisher = async (data) => {
    try {
        const res = await request.put('books/update/publisher', data);
        return res;
    } catch (error) {
        throw error.response.data;
    }
};

export const deletePublisher = async (id) => {
    try {
        const res = await request.delete(`books/delete/publisher/${id}`);
        return res;
    } catch (error) {
        throw error.response.data;
    }
};

export const importPublisher = async (data) => {
    try {
        const res = await request.post('books/import/publisher/bulk', data);
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

export const addSupplier = async (data) => {
    try {
        const res = await request.post('books/create/supplier', data);
        return res;
    } catch (error) {
        throw error.response.data;
    }
};

export const updateSupplier = async (data) => {
    try {
        const res = await request.put('books/update/supplier', data);
        return res;
    } catch (error) {
        throw error.response.data;
    }
};

export const deleteSupplier = async (id) => {
    try {
        const res = await request.delete(`books/delete/supplier/${id}`);
        return res;
    } catch (error) {
        throw error.response.data;
    }
};

export const importSupplier = async (data) => {
    try {
        const res = await request.post('books/import/supplier/bulk', data);
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

export const addLanguage = async (data) => {
    try {
        const res = await request.post('books/create/language', data);
        return res;
    } catch (error) {
        throw error.response.data;
    }
};

export const updateLanguage = async (data) => {
    try {
        const res = await request.put('books/update/language', data);
        return res;
    } catch (error) {
        throw error.response.data;
    }
};

export const deleteLanguage = async (id) => {
    try {
        const res = await request.delete(`books/delete/language/${id}`);
        return res;
    } catch (error) {
        throw error.response.data;
    }
};

export const importLanguage = async (data) => {
    try {
        const res = await request.post('books/import/language/bulk', data);
        return res;
    } catch (error) {
        throw error.response.data;
    }
};
