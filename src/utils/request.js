import axios from 'axios';

const ENV = import.meta.env;

const request = axios.create({
    baseURL: ENV.VITE_BASE_URL_API,
    withCredentials: true,
});

request.defaults.headers.common = { Authorization: `Bearer ${localStorage.getItem('access_token')}` };

const handleRefreshToken = async () => {
    const res = await request.get('auth/refresh');

    if (res && res.data) return res.data.accessToken;
    else null;
};

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

const NO_RETRY_HEADER = 'x-no-retry';

// Add a response interceptor
request.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response && response.data ? response.data : response;
    },
    async function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        if (
            error.config &&
            error.response &&
            +error.response.status === 401 &&
            !error.config.headers[NO_RETRY_HEADER]
        ) {
            const access_token = await handleRefreshToken();
            error.config.headers[NO_RETRY_HEADER] = 'true'; // string val only
            if (access_token) {
                error.config.headers['Authorization'] = `Bearer ${access_token}`;
                localStorage.setItem('access_token', access_token);
                return request.request(error.config);
            }
        }

        if (error.config && error.response && +error.response.status === 400 && error.config.url === 'auth/refresh') {
            window.location.href = '/auth';
        }

        return error?.response?.data ?? Promise.reject(error);
    },
);

export default request;
