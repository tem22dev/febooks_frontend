import axios from 'axios';

const ENV = import.meta.env;

const request = axios.create({
    baseURL: ENV.VITE_BASE_URL_API,
});

// Add a request interceptor
request.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    },
);

// Add a response interceptor
request.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response && response.data ? response.data : response;
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return error?.response?.data ?? Promise.reject(error);
    },
);

export default request;
