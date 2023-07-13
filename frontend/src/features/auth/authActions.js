import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const storeToken = (token) => localStorage.setItem('auth_token', token);
export const removeToken = () => localStorage.removeItem('auth_token');
export const getStoredToken = () => localStorage.getItem('auth_token');


// Set the authorization header with the token value for all axios requests
axios.interceptors.request.use(function (config)
{
    const token = localStorage.getItem('auth_token');
    config.headers.Authorization = 'Bearer ' + token;
    return config;
})


export const userLogin = createAsyncThunk(
    'auth/login',
    async (formData, { rejectWithValue }) =>
    {
        try
        {
            // configure header's Content-Type as JSON
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }

            await axios.get('/sanctum/csrf-cookie')
            const { data } = await axios.post('/api/login', formData, config)

            // store user's token in local storage
            storeToken(data.token)
            console.log('stored user token  -- userLogin success');

            return data
        } catch (error)
        {
            console.log('caught the error in userLogin: ', error);
            // return custom error message from API if any
            if (error.response && error.response.data.message)
            {
                return rejectWithValue(error.response.data.message)
            } else
            {
                return rejectWithValue(error.message)
            }
        }
    }
)



export const authCheck = createAsyncThunk(
    'auth/check',
    async (formData, { rejectWithValue }) =>
    {
        try
        {
            // configure header's Content-Type as JSON
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }

            await axios.get('/sanctum/csrf-cookie')
            const { data } = await axios.get('/api/checkAuth', config)

            // store user's token in local storage
            // storeToken(data.token)
            console.log('user auth check success');

            return data
        } catch (error)
        {
            console.log('caught the error in auth check: ', error);
            // return custom error message from API if any
            if (error.response && error.response.data.message)
            {
                return rejectWithValue(error.response.data.message)
            } else
            {
                return rejectWithValue(error.message)
            }
        }
    }
)



export const userLogout = createAsyncThunk(
    'auth/logout',
    async (formData, { rejectWithValue }) =>
    {
        try
        {
            // configure header's Content-Type as JSON
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }

            await axios.get('/sanctum/csrf-cookie')
            const { data } = await axios.post('/api/logout', formData, config)

            // remove user's token from local storage
            removeToken()
            console.log('userLogout success');

            return data
        } catch (error)
        {
            console.log('caught the error in userLogout: ', error);
            // return custom error message from API if any
            if (error.response && error.response.data.message)
            {
                return rejectWithValue(error.response.data.message)
            } else
            {
                return rejectWithValue(error.message)
            }
        }
    }
)