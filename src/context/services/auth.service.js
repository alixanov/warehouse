import { apiSlice } from "./api.service";

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        signUp: builder.mutation({
            query: (body) => ({
                url: "/signup",
                method: "POST",
                body: body
            })
        }),
        signIn: builder.mutation({
            query: (body) => ({
                url: "/signin",
                method: "POST",
                body: body,
            })
        })
    }),
    overrideExisting: false,
});

export const {
    useSignUpMutation,
    useSignInMutation,
} = authApi;
