import { apiSlice } from "./api.service";

export const parametersApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getParameters: builder.query({
            query: () => ({
                url: "/parameters",
                method: "GET",
            }),
            providesTags: ["parameters"]
        }),
        createParameter: builder.mutation({
            query: ({ body, path }) => ({
                url: `/${path}`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["parameters"]
        }),
        updateParameter: builder.mutation({
            query: ({ body, path, id }) => ({
                url: `/${path}/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["parameters"]
        }),
        deleteParameter: builder.mutation({
            query: ({ path, id }) => ({
                url: `/${path}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["parameters"]
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetParametersQuery,
    useCreateParameterMutation,
    useUpdateParameterMutation,
    useDeleteParameterMutation,
} = parametersApi;