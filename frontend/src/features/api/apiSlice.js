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

    tagTypes: ['Category', 'Product'],

    endpoints: (builder) => ({


        // Categories API
        getNestedCategories: builder.query({
            query: () => ({ url: 'api/nestedcategories', method: 'GET', }),
            providesTags: ['Category']
        }),
        getCategories: builder.query({
            query: () => ({ url: 'api/categories', method: 'GET', }),
            providesTags: ['Category']
        }),
        getCategory: builder.query({
            query: (categoryID) => ({ url: 'api/category/' + categoryID, method: 'GET', }),
            providesTags: ['Category']
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



        // Products API
        getProducts: builder.query({
            query: ({ categoryID, pageNum, pageSize }) => (
                { url: 'api/products/' + categoryID + '?' + 'page=' + pageNum + '&size=' + pageSize, method: 'GET', }
            ),
            providesTags: (result = [], error, arg) => [
                'Product',
                ...result?.data?.map(({ id }) => ({ type: 'Product', id }))
            ]

        }),
        getProduct: builder.query({
            query: (productID) => ({ url: 'api/product/' + productID, method: 'GET', }),
            providesTags: (result, error, productID) => [{ type: 'Product', id: productID }]
        }),
        addProduct: builder.mutation({
            query: (product) => ({ url: 'api/product', method: 'POST', body: product }),
            invalidatesTags: ['Product']
        }),
        updateProduct: builder.mutation({
            query: (product) => ({ url: 'api/product/' + product?.id, method: 'PUT', body: product }),
            invalidatesTags: (result, error, product) => [{ type: 'Product', id: product.id }]
        }),
        deleteProduct: builder.mutation({
            query: (productID) => ({ url: 'api/product/' + productID, method: 'DELETE', }),
            invalidatesTags: ['Product']
        }),
    })
})


// export hooks for usage in functional components, which are   
// auto-generated based on the defined endpoints
export const { useGetCategoriesQuery, useGetNestedCategoriesQuery, useGetCategoryQuery,
    useAddCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation,
    useGetProductsQuery, useGetProductQuery,
    useAddProductMutation, useUpdateProductMutation, useDeleteProductMutation,
} = apiSlice