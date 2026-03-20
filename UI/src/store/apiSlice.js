import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:8080/api/',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  endpoints: (builder) => ({
    getLikedVideos: builder.query({
      query: () => 'youtube/liked-videos',
    }),
    getCurrentUser: builder.query({
      query: () => 'auth/user',
    })
  }),
});

export const { useGetLikedVideosQuery, useGetCurrentUserQuery } = apiSlice;
