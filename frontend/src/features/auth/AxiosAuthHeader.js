import axios from "axios";


// Set the authorization header with the token value for all axios requests
axios.interceptors.request.use(function (config)
{
    const token = localStorage.getItem('auth_token');
    config.headers.Authorization = 'Bearer ' + token;
    return config;
})