import { apiSlice } from "./api.service";

export const productsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => ({
                url: "/products",
                method: "GET",
            }),
            providesTags: ["products"]
        }),
        getDeleted: builder.query({
            query: () => ({
                url: "/deleted",
                method: "GET",
            }),
            providesTags: ["deleted"]
        }),
        getSoldProducts: builder.query({
            query: () => ({
                url: "/products/sold",
                method: "GET",
            }),
            providesTags: ["products"]
        }),
        addProduct: builder.mutation({
            query: (body) => ({
                url: "/product",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["products"]
        }),
        updateProduct: builder.mutation({
            query: ({ product_id, body }) => ({
                url: `/product/${product_id}`,
                method: 'PUT',
                body: body,
            }),
            invalidatesTags: ['products'],
        }),
        sellProduct: builder.mutation({
            query: ({ product_id }) => ({
                url: `/sell/${product_id}`,
                method: 'POST',
            }),
            invalidatesTags: ['products'],
        }),
        deleteProduct: builder.mutation({
            query: ({ product_id }) => ({
                url: `/product/${product_id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['products'],
        })
    }),
    overrideExisting: false,
});

export const {
    useAddProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useGetSoldProductsQuery,
    useGetProductsQuery,
    useGetDeletedQuery,
    useSellProductMutation,
} = productsApi;