import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL('../', import.meta.url));
function setup(relative, mocks = {}, props = {}) {
  const values = []; let cursor = 0;
  const hooks = { ...React, useEffect() {}, useMemo: fn => fn(), useCallback: fn => fn,
    useState(initial) { const key = cursor++; if (!(key in values)) values[key] = typeof initial === 'function' ? initial() : initial; return [values[key], next => { values[key] = typeof next === 'function' ? next(values[key]) : next; }]; },
    useRef(initial) { return this.useState({ current: initial })[0]; },
  };
  // React named hooks are called without a receiver.
  hooks.useRef = initial => hooks.useState({ current: initial })[0];
  const cache = new Map();
  function load(file) {
    if (cache.has(file)) return cache.get(file).exports;
    const module = { exports: {} }; cache.set(file, module);
    const js = ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2023, esModuleInterop: true } }).outputText;
    new Function('require', 'module', 'exports', js)(id => id === 'react' ? hooks : id in mocks ? mocks[id]
      : id.startsWith('.') ? load(resolve(dirname(file), id) + '.ts') : require(id), module, module.exports);
    return module.exports;
  }
  const Screen = load(resolve(root, relative)).default;
  const tree = () => { cursor = 0; return Screen(props); };
  function find(predicate, element) {
    if (arguments.length === 1) element = tree();
    if (!element || typeof element !== 'object') return null;
    if (Array.isArray(element)) return element.map(child => find(predicate, child)).find(Boolean) || null;
    if (predicate(element)) return element;
    return find(predicate, element.props?.children);
  }
  const text = element => element == null || typeof element === 'boolean' ? '' : typeof element === 'string' || typeof element === 'number' ? String(element) : Array.isArray(element) ? element.map(text).join('') : text(element.props?.children);
  return { find, html: () => renderToStaticMarkup(tree()), button: label => find(element => element.type === 'button' && text(element) === label),
    click: async label => { find(element => element.type === 'button' && text(element) === label).props.onClick(); await new Promise(done => setTimeout(done, 0)); },
    fill: (predicate, value) => { const field = find(predicate); assert.ok(field); field.props.onChange({ target: { value } }); },
    submit: () => find(element => element.type === 'form').props.onSubmit({ preventDefault() {} }),
  };
}

const GST = '06AAZCS7666J1ZA';
test('profile shows saved GST and sends an uppercase GST number when saving', async () => {
  const calls = [];
  const screen = setup('src/components/common/CustomerGst.tsx', { '../../service/authApi': {
    useUpdateGstMutation: () => [payload => { calls.push(payload); return { unwrap: async () => ({ success: true }) }; }, {}],
  } }, { gstNumber: GST });
  assert.match(screen.html(), /Saved GST number/); assert.match(screen.html(), new RegExp(GST));
  screen.fill(element => element.props?.name === 'gstNumber', GST.toLowerCase());
  await screen.submit(); assert.deepEqual(calls, [{ gstNumber: GST }]);
  assert.match(screen.html(), /GST number saved/);
});

test('failed GST save preserves the draft and never claims the number was saved', async () => {
  const screen = setup('src/components/common/CustomerGst.tsx', { '../../service/authApi': {
    useUpdateGstMutation: () => [() => ({ unwrap: async () => { throw { data: { message: 'Please retry later.' } }; } }), {}],
  } });
  screen.fill(element => element.props?.name === 'gstNumber', '1234');
  await screen.submit(); assert.match(screen.html(), /15-character/);
  screen.fill(element => element.props?.name === 'gstNumber', GST);
  await screen.submit(); assert.match(screen.html(), /Please retry later/); assert.doesNotMatch(screen.html(), /GST number saved/);
  assert.equal(screen.find(element => element.props?.name === 'gstNumber').props.value, GST);
});

const report = { rowCount: 1, productCount: 1, imported: 0, errors: [], preview: [{ row: 2, name: 'Drill bit', sku: 'DRILL', categoryId: 1, basePrice: 250, variants: 1, stock: 8 }] };
function importScreen({ preview = async () => report, confirm = async () => ({ ...report, imported: 1 }) } = {}) {
  const calls = [];
  const screen = setup('src/pages/Admin/ProductManagement/BulkUpload/BulkUploadScreen.tsx', {
    'react-router-dom': { Link: ({ to, children, ...props }) => React.createElement('a', { href: to, ...props }, children) },
    '../../../../service/dropdownApi': { useGetCategoriesDropdownQuery: () => ({ data: { data: [{ id: 1, name: 'Drill Bits' }] } }) },
    '../../../../service/productImportApi': {
      usePreviewProductImportMutation: () => [body => { calls.push({ kind: 'preview', body }); return { unwrap: async () => ({ success: true, data: await preview() }) }; }, { isLoading: false }],
      useConfirmProductImportMutation: () => [body => { calls.push({ kind: 'confirm', body }); return { unwrap: async () => ({ success: true, data: await confirm() }) }; }, { isLoading: false }],
    },
  });
  const choose = (name = 'products.csv') => screen.find(element => element.props?.type === 'file').props.onChange({ target: { files: [new File(['products'], name, { type: 'text/csv' })] } });
  return { ...screen, calls, choose };
}

test('bulk upload previews a selected file and creates products only after confirmation', async () => {
  const screen = importScreen(); screen.choose();
  await screen.click('Validate & Preview');
  assert.equal(screen.calls.length, 1); assert.equal(screen.calls[0].body.get('file').name, 'products.csv');
  assert.match(screen.html(), /Drill bit/); assert.equal(screen.button('Confirm Import (1 products)').props.disabled, false);
  await screen.click('Confirm Import (1 products)');
  assert.deepEqual(screen.calls.map(call => call.kind), ['preview', 'confirm']);
  assert.match(screen.html(), /Successfully added 1 products/); assert.equal(screen.button('Validate & Preview').props.disabled, true);
});

test('file errors prevent confirmation and a failed confirmation preserves the file', async () => {
  const invalid = importScreen({ preview: async () => ({ ...report, errors: [{ row: 2, field: 'sku', message: 'SKU already exists' }] }) });
  invalid.choose(); await invalid.click('Validate & Preview');
  assert.equal(invalid.button('Confirm Import (1 products)').props.disabled, true); assert.match(invalid.html(), /SKU already exists/);
  const failed = importScreen({ confirm: async () => { throw { data: { message: 'Catalog changed, review again.' } }; } });
  failed.choose(); await failed.click('Validate & Preview'); await failed.click('Confirm Import (1 products)');
  assert.match(failed.html(), /Catalog changed/); assert.doesNotMatch(failed.html(), /Successfully added/); assert.equal(failed.button('Validate & Preview').props.disabled, false);
});

test('bulk uploader rejects unsupported file types before sending a request', () => {
  const screen = importScreen(); screen.choose('products.exe');
  assert.match(screen.html(), /Select a .csv or .xlsx file/); assert.equal(screen.button('Validate & Preview').props.disabled, true); assert.equal(screen.calls.length, 0);
});

const document = { id: 11, orderId: 1, stage: 'CONFIRMED', title: 'Tax invoice', originalName: 'invoice.pdf', mimeType: 'application/pdf', bytes: 100, createdAt: '2026-11-28T10:00:00Z' };
function documentScreen({ admin = false, failUpload = false } = {}) {
  const calls = [];
  let documents = admin ? [] : [document];
  const screen = setup('src/components/common/OrderDocuments.tsx', { '../../service/orderDocumentApi': {
    useGetOrderDocumentsQuery: (key, options) => { assert.equal(key.admin, admin); assert.equal(options.pollingInterval, 15000); return { data: { data: documents }, refetch() {} }; },
    useLazyGetOrderDocumentDownloadQuery: () => [() => ({ unwrap: async () => ({ data: { url: 'https://example.com/private', fileName: 'invoice.pdf' } }) })],
    useUploadOrderDocumentMutation: () => [payload => { calls.push(payload); return { unwrap: async () => {
      if (failUpload) throw { data: { message: 'Storage unavailable' } };
      documents = [document]; return { success: true, data: document };
    } }; }, {}],
  } }, { orderId: 1, admin, stages: ['PENDING', 'CONFIRMED'] });
  return { ...screen, calls };
}

test('customer documents display their stage and download control without an upload form', () => {
  const screen = documentScreen();
  assert.match(screen.html(), /Tax invoice/); assert.match(screen.html(), /CONFIRMED/); assert.match(screen.html(), /Download/);
  assert.equal(screen.find(element => element.type === 'form'), null);
});

test('admin document upload submits the selected stage and preserves failed drafts', async () => {
  for (const failUpload of [false, true]) {
    const screen = documentScreen({ admin: true, failUpload });
    screen.fill(element => element.props?.placeholder === 'e.g. Invoice, packing list, delivery receipt', 'Invoice');
    screen.find(element => element.props?.type === 'file').props.onChange({ target: { files: [new File(['%PDF-1.4'], 'invoice.pdf', { type: 'application/pdf' })] } });
    await screen.submit(); assert.equal(screen.calls[0].orderId, 1); assert.equal(screen.calls[0].body.get('stage'), 'CONFIRMED');
    if (failUpload) { assert.match(screen.html(), /Storage unavailable/); assert.doesNotMatch(screen.html(), /Document uploaded and/); assert.equal(screen.button('Upload Document').props.disabled, false); }
    else { assert.match(screen.html(), /Document uploaded and available/); assert.match(screen.html(), /Tax invoice/); }
  }
});

test('logout clears private document caches before another customer signs in', async () => {
  const previousStorage = globalThis.localStorage;
  const values = new Map();
  globalThis.localStorage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)), removeItem: key => values.delete(key) };
  const cache = new Map();
  function load(file) {
    if (cache.has(file)) return cache.get(file).exports;
    const module = { exports: {} }; cache.set(file, module);
    const js = ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2023, esModuleInterop: true } }).outputText;
    new Function('require', 'module', 'exports', js)(id => id.startsWith('.') ? load(resolve(dirname(file), id) + '.ts') : require(id), module, module.exports);
    return module.exports;
  }
  const { store } = load(resolve(root, 'src/app/store.ts'));
  const { api } = load(resolve(root, 'src/service/api.ts'));
  const { setCredentials, logOut, updateUser } = load(resolve(root, 'src/Feature/Authentication/Slice.ts'));
  load(resolve(root, 'src/service/orderDocumentApi.ts'));
  const key = { orderId: 1, admin: false };
  try {
    store.dispatch(setCredentials({ user: { id: 7, role: 'CUSTOMER' }, tokens: { accessToken: 'mock-a', refreshToken: 'mock-refresh-a' } }));
    await store.dispatch(api.util.upsertQueryData('getOrderDocuments', key, { success: true, data: [document] }));
    assert.equal(api.endpoints.getOrderDocuments.select(key)(store.getState()).data.data.length, 1);
    store.dispatch(logOut());
    store.dispatch(setCredentials({ user: { id: 8, role: 'CUSTOMER' }, tokens: { accessToken: 'mock-b', refreshToken: 'mock-refresh-b' } }));
    assert.equal(api.endpoints.getOrderDocuments.select(key)(store.getState()).data, undefined);
    store.dispatch(updateUser({ id: 7, role: 'CUSTOMER', customerProfile: { gstNumber: GST } }));
    assert.equal(store.getState().auth.user.id, 8, 'A late profile response must not restore the previous account');
  } finally {
    store.dispatch(api.util.resetApiState());
    if (previousStorage === undefined) delete globalThis.localStorage; else globalThis.localStorage = previousStorage;
  }
});
