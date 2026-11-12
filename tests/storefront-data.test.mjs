import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

function load(path) {
  const source = readFileSync(new URL(path, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
  const module = { exports: {} };
  new Function('module', 'exports', outputText)(module, module.exports);
  return module.exports;
}
const { activeBanners, bannerDestination } = load('../src/utils/storefrontData.ts');
const { selectedProductVariant } = load('../src/utils/productSelection.ts');
const now = Date.parse('2026-11-11T12:00:00Z');
const banner = { id: 1, isActive: true, displayOrder: 2, startDate: null, endDate: null, createdAt: '2026-11-01' };

test('only active, currently scheduled banners are eligible; sort is stable without mutating API records', () => {
  const records = [banner, { ...banner, id: 2, displayOrder: 1 }, { ...banner, id: 3, isActive: false },
    { ...banner, id: 4, startDate: '2026-11-12' }, { ...banner, id: 5, endDate: '2026-11-10' },
    { ...banner, id: 6, startDate: 'invalid' }];
  assert.deepEqual(activeBanners(records, now).map((item) => item.id), [2, 1]);
  assert.equal(records[0].id, 1);
  assert.deepEqual(activeBanners([], now), []);
});
test('schedule boundaries are inclusive and expired banners disappear on the next evaluation', () => {
  const scheduled = { ...banner, startDate: new Date(now).toISOString(), endDate: new Date(now).toISOString() };
  assert.equal(activeBanners([scheduled], now).length, 1);
  assert.equal(activeBanners([scheduled], now + 1).length, 0);
});
test('banner destinations allow internal paths and HTTP(S) while rejecting executable and ambiguous links', () => {
  assert.equal(bannerDestination('/catalog?search=drill'), '/catalog?search=drill');
  assert.equal(bannerDestination('https://example.com/catalog'), 'https://example.com/catalog');
  for (const value of [null, '', 'javascript:alert(1)', 'data:text/html,hello', '//example.com', '/\\example.com', 'catalog']) assert.equal(bannerDestination(value), null);
});
test('an unavailable variant combination never silently selects another SKU', () => {
  const variants = [{ id: 1, size: '10mm', color: 'Coated', stock: 4, reservedStock: 2 }];
  assert.equal(selectedProductVariant(variants, '10mm', 'Coated')?.id, 1);
  assert.equal(selectedProductVariant(variants, '12mm', 'Coated'), undefined);
});
