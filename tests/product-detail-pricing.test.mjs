import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const componentPath = fileURLToPath(new URL('../src/pages/User/ProductDetail/ProductDetailScreen.tsx', import.meta.url));
const mocks = {
  react: { ...React, useEffect: () => {} },
  'react-router-dom': {
    useNavigate: () => () => {},
    Link: ({ to, children, ...props }) => React.createElement('a', { href: to, ...props }, children),
  },
  '../../../constant/style': { FONTS: { main: 'Arial' } },
  '../../../components/layout/Navbar': { __esModule: true, default: () => null },
  '../../../components/layout/Footer': { __esModule: true, default: () => null },
  '../../../components/common/ProductImage': { __esModule: true, default: () => null },
};
function load(file) {
  const module = { exports: {} };
  const { outputText } = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2023, esModuleInterop: true },
  });
  const localRequire = (name) => {
    if (name in mocks) return mocks[name];
    if (!name.startsWith('.')) return require(name);
    return load(resolve(dirname(file), name) + '.ts');
  };
  new Function('require', 'module', 'exports', outputText)(localRequire, module, module.exports);
  return module.exports;
}
const Screen = load(componentPath).default;
const variant = { id: 9, size: 'M6', color: 'Bright', price: 250, stock: 7, reservedStock: 2 };
const baseProps = {
  product: { id: 4, name: 'M6 hand tap', basePrice: 300, discountPrice: 220, sellingPrice: 220, description: 'HSS tap', reviewCount: 0, averageRating: 0 },
  variants: [variant], selectedSize: 'M6', selectedColor: 'Bright', selectedImageIdx: 0,
  images: [], videos: [], relatedProducts: [], availableSizes: ['M6'], availableColors: ['Bright'],
  quantity: 1, isAuthenticated: false, reviewsResponse: { data: [] }, isReviewsLoading: false,
  reviewsPage: 1, isReviewDialogOpen: false,
};
const render = (overrides = {}) => renderToStaticMarkup(React.createElement(Screen, { ...baseProps, ...overrides }));

test('detail display uses the backend discount before a selected variant price and subtracts reservations', () => {
  const html = render();
  assert.match(html, /₹220\.00/);
  assert.doesNotMatch(html, /₹250\.00/);
  assert.match(html, /5 Pieces in stock/);
});

test('the canonical variants prop drives availability even when product.variants is absent', () => {
  const html = render({ variants: [{ ...variant, price: 275, stock: 2, reservedStock: 2 }] });
  assert.match(html, /Out of stock/);
  assert.match(html, /<button disabled=""[^>]*>Buy It Now<\/button>/);
});

test('an unavailable option is never silently priced or purchased as the first variant', () => {
  const html = render({ selectedSize: 'M99' });
  assert.match(html, /Price on request/);
  assert.match(html, /Availability on request/);
  assert.match(html, /<button disabled=""[^>]*>Buy It Now<\/button>/);
  assert.doesNotMatch(html, /₹220\.00/);
});

test('missing related-product pricing is shown honestly instead of a zero-price offer', () => {
  const html = render({ relatedProducts: [{ id: 12, name: 'Tooling without a published price', images: [] }] });
  assert.match(html, /Tooling without a published price/);
  assert.match(html, /Price on request/);
  assert.doesNotMatch(html, /₹0\.00/);
});
