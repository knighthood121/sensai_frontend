import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { configureStore } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const endpoints = {
  home: { base: '/home' },
  products: {
    base: '/products', byId: (id) => `/products/${id}`,
    details: (id) => `/products/${id}`, detailsBySlug: (slug) => `/products/slug/${slug}`,
    imagesUpload: '/products/images', videosUpload: '/products/videos',
    imagesTempUpload: '/products/images/temp', imageUrls: '/products/images/url', imagesDelete: '/products/images',
  },
  variants: {
    base: (id) => `/products/${id}/variants`, byId: (id, variantId) => `/products/${id}/variants/${variantId}`,
    stock: (id, variantId) => `/products/${id}/variants/${variantId}/stock`, bulkStock: (id) => `/products/${id}/variants/stock`,
  },
  adminBanners: { base: '/admin/banners', byId: (id) => `/admin/banners/${id}` },
};

function injectService(name, api) {
  const path = fileURLToPath(new URL(`../src/service/${name}.ts`, import.meta.url));
  const output = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2023 },
  }).outputText;
  const module = { exports: {} };
  const localRequire = (id) => id === './api' ? { api }
    : id === '../constant/urls' ? { ENDPOINTS: endpoints } : require(id);
  new Function('require', 'module', 'exports', output)(localRequire, module, module.exports);
}

test('real RTK subscriptions refresh home and product lists after catalog/stock/banner writes', async (t) => {
  const calls = new Map();
  const api = createApi({
    reducerPath: 'testApi',
    tagTypes: ['Product', 'Variant', 'Category', 'SubCategory', 'Home', 'Banner', 'Dropdown'],
    baseQuery: async (_request, context) => {
      calls.set(context.endpoint, (calls.get(context.endpoint) || 0) + 1);
      if (context.endpoint === 'listProducts') return { data: { success: true, data: [{ id: 1 }] } };
      if (context.endpoint === 'getProductDetailsBySlug') return { data: { success: true, data: { product: { id: 1 } } } };
      if (context.endpoint === 'getHome') return { data: { success: true, data: { banners: [], categories: [], featuredProducts: [], bestSellers: [], newArrivals: [], trendingProducts: [] } } };
      return { data: { success: true, data: [] } };
    },
    endpoints: () => ({}),
  });
  for (const service of ['homeApi', 'productsApi', 'variantApi', 'bannerApi']) injectService(service, api);
  const store = configureStore({
    reducer: { [api.reducerPath]: api.reducer },
    middleware: (getDefault) => getDefault({ serializableCheck: false }).concat(api.middleware),
  });
  const subscriptions = [
    store.dispatch(api.endpoints.getHome.initiate()),
    store.dispatch(api.endpoints.listProducts.initiate({ categoryId: 1 })),
    store.dispatch(api.endpoints.getProductDetailsBySlug.initiate('insert')),
    store.dispatch(api.endpoints.getAdminBanners.initiate()),
  ];
  t.after(() => {
    subscriptions.forEach((subscription) => subscription.unsubscribe());
    store.dispatch(api.util.resetApiState());
  });
  await Promise.all(subscriptions);
  const catalogWrites = [
    ['createProduct', {}], ['updateProduct', { id: 1, data: {} }], ['deleteProduct', 1],
    ['uploadProductImages', new FormData()], ['uploadProductVideos', new FormData()],
    ['addProductImageUrls', { productId: 1, images: [] }], ['deleteProductImages', { publicIds: ['image'] }],
    ['createCategory', {}], ['updateCategory', { id: 1, data: {} }], ['deleteCategory', 1],
    ['createSubCategory', {}], ['updateSubCategory', { id: 1, data: {} }], ['deleteSubCategory', 1],
    ['createVariants', { productId: 1, data: {} }],
    ['updateVariant', { productId: 1, variantId: 1, data: {} }],
    ['deleteVariant', { productId: 1, variantId: 1 }],
    ['updateVariantStock', { productId: 1, variantId: 1, data: {} }],
    ['bulkUpdateStock', { productId: 1, data: {} }],
  ];
  for (const [name, payload] of catalogWrites) {
    const homeBefore = calls.get('getHome');
    const listBefore = calls.get('listProducts');
    const detailsBefore = calls.get('getProductDetailsBySlug');
    await store.dispatch(api.endpoints[name].initiate(payload));
    await Promise.all(store.dispatch(api.util.getRunningQueriesThunk()));
    assert.ok(calls.get('getHome') > homeBefore, `${name} must refresh home data, even when home product lists are empty`);
    assert.ok(calls.get('listProducts') > listBefore, `${name} must refresh filtered products`);
    if (name !== 'addProductImageUrls' || payload.productId === 1) {
      assert.ok(calls.get('getProductDetailsBySlug') > detailsBefore, `${name} must refresh the affected product's slug-based details`);
    }
  }
  for (const [name, payload] of [
    ['createBanner', { title: 'Tools', imageUrl: '/tools.png' }],
    ['updateBanner', { id: 1, data: { isActive: false } }], ['deleteBanner', 1],
  ]) {
    const homeBefore = calls.get('getHome');
    const bannersBefore = calls.get('getAdminBanners');
    await store.dispatch(api.endpoints[name].initiate(payload));
    await Promise.all(store.dispatch(api.util.getRunningQueriesThunk()));
    assert.ok(calls.get('getHome') > homeBefore, `${name} must refresh the storefront banner list`);
    assert.ok(calls.get('getAdminBanners') > bannersBefore, `${name} must refresh the admin banner list`);
  }
});
