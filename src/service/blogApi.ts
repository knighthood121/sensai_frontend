import { api } from './api';

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  imageAlt: string;
  authorName: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
export type BlogSummary = Omit<BlogPost, 'content'>;
export type BlogInput = Pick<BlogPost, 'title' | 'excerpt' | 'content' | 'imageUrl' | 'imageAlt' | 'authorName' | 'isPublished'> & { slug?: string };
export type BlogFilters = { page?: number; limit?: number; search?: string; status?: 'all' | 'published' | 'draft' };
export interface BlogListResponse {
  success: boolean;
  data: BlogSummary[];
  pagination: { page: number; limit: number; total: number; totalPages: number; hasPreviousPage: boolean; hasNextPage: boolean };
}
const blogApi = api.injectEndpoints({
  endpoints: builder => ({
    getBlogs: builder.query<BlogListResponse, Omit<BlogFilters, 'status'>>({
      query: params => ({ url: '/api/v1/blogs', params }), providesTags: ['Blog'],
    }),
    getBlog: builder.query<{ success: boolean; data: BlogPost }, string>({
      query: slug => '/api/v1/blogs/' + encodeURIComponent(slug), providesTags: ['Blog'],
    }),
    getAdminBlogs: builder.query<BlogListResponse, BlogFilters>({
      query: params => ({ url: '/api/v1/admin/blogs', params }), providesTags: ['Blog'],
    }),
    getAdminBlog: builder.query<{ success: boolean; data: BlogPost }, number>({
      query: id => '/api/v1/admin/blogs/' + id, providesTags: ['Blog'],
    }),
    createBlog: builder.mutation<{ success: boolean; data: BlogPost }, BlogInput>({
      query: body => ({ url: '/api/v1/admin/blogs', method: 'POST', body }),
      invalidatesTags: result => result?.success ? ['Blog'] : [],
    }),
    updateBlog: builder.mutation<{ success: boolean; data: BlogPost }, { id: number; data: BlogInput }>({
      query: ({ id, data }) => ({ url: '/api/v1/admin/blogs/' + id, method: 'PUT', body: data }),
      invalidatesTags: result => result?.success ? ['Blog'] : [],
    }),
    deleteBlog: builder.mutation<{ success: boolean }, number>({
      query: id => ({ url: '/api/v1/admin/blogs/' + id, method: 'DELETE' }),
      invalidatesTags: result => result?.success ? ['Blog'] : [],
    }),
  }),
});
export const { useGetBlogsQuery, useGetBlogQuery, useGetAdminBlogsQuery, useGetAdminBlogQuery,
  useCreateBlogMutation, useUpdateBlogMutation, useDeleteBlogMutation } = blogApi;
