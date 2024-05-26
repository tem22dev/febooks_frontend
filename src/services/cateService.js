import request from '../utils/request';

// export const getAllGenre = async () => {
//     try {
//         const res = await request.get('cate/genre');
//         return res;
//     } catch (error) {
//         throw Error(error);
//     }
// };

export const getAllBookSort = async (query) => {
    try {
        const res = await request.get(`books/sort?${query}`);
        return res;
    } catch (error) {
        throw Error(error);
    }
};
