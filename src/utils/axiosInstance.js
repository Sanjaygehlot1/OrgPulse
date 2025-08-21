import axios from 'axios';

const AxiosInstance = axios.create({
    baseURL : 'https://api.github.com',
    withCredentials : true
})

export {AxiosInstance};