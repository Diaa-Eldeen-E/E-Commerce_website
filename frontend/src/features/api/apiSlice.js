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


        // Cart API
        getCart: builder.query({
            query: (pageSize = 10) => (
                { url: 'api/cart?' + 'size=' + pageSize, method: 'GET', }
            ),
            providesTags: (result = [], error, arg) => [
                'Cart',
                ...result?.data?.map(({ id }) => ({ type: 'Cart', id }))
            ]

        }),
        getCartCount: builder.query({
            query: () => (
                { url: 'api/cartcount', method: 'GET', }
            ),
            providesTags: ['Cart']

        }),
        isCarted: builder.query({
            query: (productID) => ({ url: 'api/iscarted/' + productID, method: 'GET', }),
            providesTags: (result, error, productID) => [{ type: 'Cart', id: productID }]
        }),
        addToCart: builder.mutation({
            query: (product) => ({ url: 'api/cart', method: 'POST', body: product }),
            invalidatesTags: ['Cart']
        }),
        removeFromCart: builder.mutation({
            query: (productID) => ({ url: 'api/cart/' + productID, method: 'DELETE', }),
            invalidatesTags: ['Cart']
        }),

        // Wishlist API
        getWishlist: builder.query({
            query: () => (
                { url: 'api/wishlist', method: 'GET', }
            ),
            providesTags: ['Wishlist']

        }),
        isListed: builder.query({
            query: (productID) => ({ url: 'api/islisted/' + productID, method: 'GET', }),
            providesTags: ['Wishlist']
        }),
        addToWishlist: builder.mutation({
            query: (product) => ({ url: 'api/wishlist', method: 'POST', body: product }),
            invalidatesTags: ['Wishlist']
        }),
        removeFromWishlist: builder.mutation({
            query: (productID) => ({ url: 'api/wishlist/' + productID, method: 'DELETE', }),
            invalidatesTags: ['Wishlist']
        }),

        // Orders API
        getOrders: builder.query({
            query: () => ({ url: 'api/order/all', method: 'GET', }),
        }),
        getOrder: builder.query({
            query: (orderID) => ({ url: 'api/order/' + orderID, method: 'GET', }),
        }),
        getCheckoutOrder: builder.query({
            query: (sessionID) => ({ url: 'api/order/checkout/' + sessionID, method: 'GET', }),
        }),

        // Reviews API
        getUserReview: builder.query({
            query: (productID) => ({ url: 'api/user-review/' + productID, method: 'GET', }),
            providesTags: ['Review']
        }),
        addReview: builder.mutation({
            query: (product) => ({ url: 'api/review', method: 'POST', body: product }),
            invalidatesTags: (result, error, product) => [{ type: 'Product', id: product.id }, 'Review']
        }),
    })

})


// export hooks for usage in functional components, which are   
// auto-generated based on the defined endpoints
export const { useGetCategoriesQuery, useGetNestedCategoriesQuery, useGetCategoryQuery,
    useAddCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation,
    useGetProductsQuery, useGetProductQuery,
    useAddProductMutation, useUpdateProductMutation, useDeleteProductMutation,
    useGetCartQuery, useGetCartCountQuery, useIsCartedQuery, useAddToCartMutation, useRemoveFromCartMutation,
    useGetWishlistQuery, useIsListedQuery, useAddToWishlistMutation, useRemoveFromWishlistMutation,
    useGetOrdersQuery, useGetOrderQuery, useGetCheckoutOrderQuery,
    useGetUserReviewQuery, useAddReviewMutation,
} = apiSlice