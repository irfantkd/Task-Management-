import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const REACT_APP_API_URL =
  "https://task-management-backend-orcin.vercel.app/api";
const API_URL = REACT_APP_API_URL;
const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers?.set("Accept", "application/json");
    return headers;
  },
});
// API Slice
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQuery,
  tagTypes: ["KeyName"],

  endpoints: (builder) => ({
    get: builder.query({
      query: ({ path, params }) => {
        const searchParams = new URLSearchParams(params).toString();
        const fullPath = searchParams ? `${path}?${searchParams}` : path;

        return {
          url: fullPath,
          method: "GET",
        };
      },
      providesTags: (result, error, { path }) =>
        result ? [{ type: "KeyName", id: path }] : ["KeyName"],
      transformResponse: async (response, meta) => {
        const contentType = meta.response.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          return response;
        } else {
          throw new Error("Unexpected content type received");
        }
      },
    }),
    // POST endpoint
    post: builder.mutation({
      query: ({ path, body }) => ({
        url: path,
        method: "POST",
        body,
      }),
      invalidatesTags: ["KeyName"],
    }),
    // PUT endpoint
    put: builder.mutation({
      query: ({ path, body }) => ({
        url: path,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["KeyName"],
    }),
    // DELETE endpoint
    delete: builder.mutation({
      query: ({ path }) => ({
        url: path,
        method: "DELETE",
      }),
      invalidatesTags: ["KeyName"],
    }),
  }),
});
export const {
  useGetQuery,
  usePostMutation,
  usePutMutation,
  useDeleteMutation,
} = apiSlice;
export default apiSlice.reducer;
