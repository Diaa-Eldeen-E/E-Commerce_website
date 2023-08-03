import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseURL } from '../../app/constants';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        // baseUrl: baseURL,
        baseUrl: baseURL,
        prepareHeaders: (headers, { getState }) =>
        {
            const token = getState().auth.userToken;
            if (token)
            {
                headers.set('authorization', 'Bearer ' + token)
                return headers;
            }
        }

    }),

    tagTypes: ['Category'],

    endpoints: (builder) => ({
        getNestedCategories: builder.query({
            query: () => ({ url: 'api/nestedcategories', method: 'GET', }),
            providesTags: ['Category']
        }),
        getCategories: builder.query({
            query: () => ({ url: 'api/categories', method: 'GET', }),
            providesTags: ['Category']
        }),
        getCategory: builder.query({
            query: (categoryID) => ({ url: 'api/category/' + categoryID, method: 'GET', })
        }),
        addCategory: builder.mutation({
            query: (category) => ({ url: 'api/category', method: 'POST', body: category }),
            invalidatesTags: ['Category']
        }),
        updateCategory: builder.mutation({
            query: (category) => ({ url: 'api/category/' + category?.id, method: 'PUT', body: category }),
            invalidatesTags: ['Category']
        }),
        deleteCategory: builder.mutation({
            query: (categoryID) => ({ url: 'api/category/' + categoryID, method: 'DELETE', }),
            invalidatesTags: ['Category']
        }),
    })
})


// export hooks for usage in functional components, which are   
// auto-generated based on the defined endpoints
export const { useGetCategoriesQuery, useGetNestedCategoriesQuery, useGetCategoryQuery,
    useAddCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } = apiSlice