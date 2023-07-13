import React from 'react'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseURL } from './constants';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        // baseUrl: baseURL,
        baseUrl: 'http://127.0.0.1:5000/',
        prepareHeaders: (headers, { getState }) =>
        {
            const token = getState().auth.userToken;
            if (token)
            {
                headers.set('authorization', 'Bearer ${token}')
                return headers;
            }
        }

    }),
    endpoints: (builder) => ({
        loginUser: builder.query({
            query: (body) => ({
                url: 'api/login',
                method: 'POST',
                body,

            })
        }),
        logoutUser: builder.query({
            query: () => ({
                url: 'api/logout',
                method: 'POST',

            })
        }),
        registerUser: builder.query({
            query: (body) => ({
                url: 'api/register',
                method: 'POST',
                body,

            })
        }),
    })
})


// export hooks for usage in functional components, which are   
// auto-generated based on the defined endpoints
export const { useLoginUserQuery, useLogoutUserQuery, useRegisterUserQuery } = authApi