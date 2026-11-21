import { api } from './api';
import type { CmsPage } from '../utils/cmsStorage';

export const cmsApi = api.injectEndpoints({
  endpoints: builder => ({
    getCmsPages: builder.query<{ success: boolean; data: Record<string, CmsPage> }, void>({
      query: () => '/api/v1/cms/pages',
      providesTags: ['CmsPage'],
    }),
    saveCmsPage: builder.mutation<{ success: boolean; data: CmsPage }, CmsPage>({
      query: ({ slug, ...body }) => ({ url: '/api/v1/admin/cms/pages/' + encodeURIComponent(slug), method: 'PUT', body }),
      async onQueryStarted(_page, { dispatch, queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;
          if (response.success) dispatch(cmsApi.util.updateQueryData('getCmsPages', undefined, cached => {
            cached.data[response.data.slug] = response.data;
          }));
        } catch { /* The editor displays the save error and preserves the draft. */ }
      },
    }),
  }),
});

export const { useGetCmsPagesQuery, useSaveCmsPageMutation } = cmsApi;
