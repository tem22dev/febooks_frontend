import axios from 'axios';

const ENV = import.meta.env;

const request = axios.create({
    baseURL: ENV.VITE_BASE_URL_API,
});

export default request;
