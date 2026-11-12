import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

const source = readFileSync(new URL('../src/utils/catalogProduct.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2023 },
});
const exports = {};
new Function('exports', outputText)(exports);
const { getCatalogPrice, getCatalogStock, getVariantStock, getCartUnitPrice, getCatalogImage, makeProductInquiry } = exports;

test('missing or malformed prices stay unavailable, while a published zero price stays zero', () => {
  assert.equal(getCatalogPrice({}), null);
  assert.equal(getCatalogPrice({ sellingPrice: 'unavailable' }), null);
  assert.equal(getCatalogPrice({ sellingPrice: 0, basePrice: 200 }), 0);
  assert.equal(getCatalogPrice({ sellingPrice: '295.50' }), 295.5);
  assert.equal(getCatalogPrice({ discountPrice: 200, basePrice: 250 }), 200);
});

test('cart pricing agrees with backend precedence without inventing a default', () => {
  assert.equal(getCartUnitPrice({ discountPrice: 220, basePrice: 300 }, { price: 250 }), 220);
  assert.equal(getCartUnitPrice({ discountPrice: null, basePrice: 300 }, { price: 250 }), 250);
  assert.equal(getCartUnitPrice({ basePrice: 300 }, { price: null }), 300);
  assert.equal(getCartUnitPrice({}, {}), null);
});

test('sold-out and reserved stock are never replaced with fictional available quantities', () => {
  assert.equal(getCatalogStock({ availableStock: 0, totalStock: 50, totalReservedStock: 50 }), 0);
  assert.equal(getCatalogStock({ totalStock: 8, totalReservedStock: 3 }), 5);
  assert.equal(getCatalogStock({}), null);
  assert.equal(getVariantStock({ stock: 6, reservedStock: 4 }), 2);
  assert.equal(getVariantStock({ stock: 1, reservedStock: 3 }), 0);
  assert.equal(getVariantStock({ stock: 5 }), null);
});

test('variant totals are usable only when the returned stock data is complete', () => {
  assert.equal(getCatalogStock({ variants: [{ stock: 5, reservedStock: 2 }, { stock: 3, reservedStock: 1 }] }), 5);
  assert.equal(getCatalogStock({ variants: [{ stock: 5, reservedStock: 2 }, { stock: 3 }] }), null);
  assert.equal(getCatalogStock({ variants: [] }), null);
});

test('product images always come from the returned product', () => {
  assert.equal(getCatalogImage({ images: [] }), null);
  assert.equal(getCatalogImage({ images: [{ imageUrl: '/secondary.jpg' }, { imageUrl: '/primary.jpg', isPrimary: true }] }), '/primary.jpg');
});

test('quote drafts retain backend product specifications without assuming order quantities or materials', () => {
  const draft = makeProductInquiry({ name: 'M6 Tap', sku: 'TAP-M6', packQuantity: 3, material: 'HSS', dimensions: 'M6' });
  assert.match(draft, /Product: M6 Tap/);
  assert.match(draft, /SKU: TAP-M6/);
  assert.match(draft, /Material: HSS/);
  assert.match(draft, /Quantity Needed: \n/);
  const missing = makeProductInquiry({ name: 'Unspecified tooling' });
  assert.doesNotMatch(missing, /Material:|50 pcs|High Speed|undefined|null/);
});
