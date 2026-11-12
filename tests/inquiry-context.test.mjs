import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

const source = readFileSync(new URL('../src/utils/inquiryContext.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2023 },
});
const exports = {};
new Function('exports', outputText)(exports);
const { getInitialInquiryRequirements } = exports;

test('ordinary visits and unrelated parameters leave the inquiry blank', () => {
  for (const search of ['', '?utm_source=homepage', '?operation=%20&product=%20', '?request=unknown']) {
    assert.equal(getInitialInquiryRequirements(search), '');
  }
});

test('product links decode names and retain the selected operation in the draft', () => {
  const params = new URLSearchParams({ operation: 'turning', product: 'Inserts Range & Tool Holders' });
  const draft = getInitialInquiryRequirements(`?${params}`);
  assert.match(draft, /^Operation: Turning\nProduct: Inserts Range & Tool Holders\n/);
  assert.match(draft, /Quantity Needed:/);
  assert.match(draft, /Required Specifications:/);
});

test('catalog links ask for a catalog without adding an unrelated order quantity', () => {
  const draft = getInitialInquiryRequirements('?request=catalog');
  assert.match(draft, /SANSEI cutting tools catalog/);
  assert.doesNotMatch(draft, /Quantity|undefined|null/);
});

test('catalog requests retain optional operation and product context', () => {
  const draft = getInitialInquiryRequirements('?request=catalog&operation=milling&product=End+Mills');
  assert.match(draft, /catalog/);
  assert.match(draft, /Operation: Milling/);
  assert.match(draft, /Product: End Mills/);
});
