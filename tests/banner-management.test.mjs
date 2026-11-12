import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const componentPath = fileURLToPath(new URL('../src/pages/Admin/Marketing/BannerManagement/BannerManagementScreen.tsx', import.meta.url));
const banner = { id: 1, title: 'Precision tools', description: 'Tools for every operation', imageUrl: '/banner.jpg', linkUrl: '/catalog', isActive: true, displayOrder: 1, startDate: null, endDate: null, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' };

// Run the real component with controlled server boundaries. State survives rerenders;
// event handlers and mutation failures execute without a browser or live account.
function setup(options = {}) {
  const state = [];
  let cursor = 0;
  let response = options.response ?? { success: true, data: [] };
  let query = options.query || {};
  const calls = [];
  const useState = initial => {
    const key = cursor++;
    if (!(key in state)) state[key] = typeof initial === 'function' ? initial() : initial;
    return [state[key], next => { state[key] = typeof next === 'function' ? next(state[key]) : next; }];
  };
  const mutations = Object.fromEntries(['create', 'update', 'delete', 'upload'].map(kind => [kind, payload => {
    calls.push({ kind, payload });
    return { unwrap: async () => {
      if (options[kind]) return options[kind](payload);
      if (kind === 'create') {
        const created = { ...banner, ...payload, id: 3 };
        response = { success: true, data: [...response.data, created] };
        return { success: true, data: created };
      }
      if (kind === 'update') {
        const updated = { ...response.data.find(item => item.id === payload.id), ...payload.data };
        response = { success: true, data: response.data.map(item => item.id === payload.id ? updated : item) };
        return { success: true, data: updated };
      }
      if (kind === 'delete') {
        response = { success: true, data: response.data.filter(item => item.id !== payload) };
        return { success: true };
      }
      return { success: true, data: [{ imageUrl: 'https://example.test/uploaded.webp' }] };
    } };
  }]));
  const mocks = {
    react: { ...React, useState, useRef: value => useState({ current: value })[0], useEffect: () => {}, useId: () => 'banner-editor' },
    'react-router-dom': { useNavigate: () => () => {} },
    '../../../../constant/style': { COLORS: { text: '#111' }, FONTS: { main: 'Arial' } },
    '../../../../components/common/Button': { __esModule: true, default: ({ children, variant: _variant, size: _size, ...props }) => React.createElement('button', props, children) },
    '../../../../service/bannerApi': {
      useGetAdminBannersQuery: () => ({ data: response, refetch: () => { calls.push({ kind: 'refetch' }); return Promise.resolve({ data: response }); }, ...query }),
      useCreateBannerMutation: () => [mutations.create],
      useUpdateBannerMutation: () => [mutations.update],
      useDeleteBannerMutation: () => [mutations.delete],
    },
    '../../../../service/productsApi': { useUploadTempProductImagesMutation: () => [mutations.upload] },
  };
  const module = { exports: {} };
  const { outputText } = ts.transpileModule(readFileSync(componentPath, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2023, esModuleInterop: true } });
  new Function('require', 'module', 'exports', outputText)(id => id in mocks ? mocks[id] : require(id), module, module.exports);
  const Screen = module.exports.default;
  const tree = () => { cursor = 0; return Screen(); };
  function find(predicate, current) {
    if (arguments.length === 1) current = tree();
    if (!current || typeof current !== 'object') return null;
    if (Array.isArray(current)) return current.map(child => find(predicate, child)).find(Boolean) || null;
    if (predicate(current)) return current;
    return find(predicate, current.props?.children ?? null);
  }
  const text = element => {
    if (element == null || typeof element === 'boolean') return '';
    if (typeof element === 'string' || typeof element === 'number') return String(element);
    if (Array.isArray(element)) return element.map(text).join('');
    return text(element.props?.children);
  };
  return {
    calls,
    html: () => renderToStaticMarkup(tree()),
    find,
    button: label => find(element => (element.type === 'button' || typeof element.type === 'function') && text(element) === label),
    fill: (name, value) => {
      const field = find(element => element.props?.name === name);
      assert.ok(field, `Missing field: ${name}`);
      field.props.onChange({ target: { value, valueAsNumber: Number(value), checked: value } });
    },
    submit: () => find(element => element.type === 'form').props.onSubmit({ preventDefault() {} }),
    setResponse: next => { response = next; query = {}; },
  };
}

// Opening the editor captures browser focus; no DOM is needed for these API tests.
globalThis.document = { activeElement: null };
globalThis.HTMLElement = class HTMLElement {};

test('loading and failed server requests do not fall back to browser-stored banners', () => {
  const loading = setup({ query: { isLoading: true } });
  assert.match(loading.html(), /Loading banners/);
  assert.doesNotMatch(loading.html(), /No banner to preview/);
  const failed = setup({ query: { isError: true } });
  assert.match(failed.html(), /Banners could not be loaded from the server/);
  assert.doesNotMatch(failed.html(), /Precision tools/);
});

test('successful server data renders immediately and an empty refresh removes banners', () => {
  const screen = setup({ response: { success: true, data: [banner] } });
  assert.match(screen.html(), /Precision tools/);
  assert.match(screen.html(), /src="\/banner.jpg"/);
  screen.setResponse({ success: true, data: [] });
  assert.match(screen.html(), /No banner to preview/);
  assert.doesNotMatch(screen.html(), /Precision tools/);
});

test('failed create keeps the editor and draft open without claiming success', async () => {
  const screen = setup({ create: async () => { throw { data: { message: 'Server rejected the image' } }; } });
  screen.button('Add New Banner').props.onClick();
  screen.fill('title', 'New tooling');
  screen.fill('imageUrl', '/new-tools.webp');
  await screen.submit();
  assert.match(screen.html(), /Server rejected the image/);
  assert.match(screen.html(), /Create New Banner/);
  assert.match(screen.html(), /New tooling/);
  assert.doesNotMatch(screen.html(), /Banner created successfully/);
});

test('create submits only supported persisted fields and shows server-confirmed data', async () => {
  const screen = setup();
  screen.button('Add New Banner').props.onClick();
  screen.fill('title', '  New tooling  ');
  screen.fill('description', '  Stronger tools  ');
  screen.fill('imageUrl', '/new-tools.webp');
  screen.fill('linkUrl', '/catalog?search=mill');
  screen.fill('startDate', '2027-02-01T09:00');
  screen.fill('endDate', '2027-02-05T18:00');
  await screen.submit();
  const payload = screen.calls.find(call => call.kind === 'create').payload;
  assert.deepEqual(Object.keys(payload).sort(), ['description', 'displayOrder', 'endDate', 'imageUrl', 'isActive', 'linkUrl', 'startDate', 'title']);
  assert.equal(payload.title, 'New tooling');
  assert.equal(payload.description, 'Stronger tools');
  assert.equal(payload.startDate, new Date('2027-02-01T09:00').toISOString());
  assert.match(screen.html(), /Banner created successfully/);
  assert.doesNotMatch(screen.html(), /Create New Banner/);
});

test('invalid schedule blocks the request and explains the correction', async () => {
  const screen = setup();
  screen.button('Add New Banner').props.onClick();
  screen.fill('title', 'New tooling');
  screen.fill('imageUrl', '/new-tools.webp');
  screen.fill('startDate', '2027-02-05T18:00');
  screen.fill('endDate', '2027-02-01T09:00');
  await screen.submit();
  assert.match(screen.html(), /end date must be on or after the start date/);
  assert.equal(screen.calls.filter(call => call.kind === 'create').length, 0);
});

test('failed visibility update leaves the server status intact', async () => {
  const screen = setup({ response: { success: true, data: [banner] }, update: async () => { throw new Error('Connection lost'); } });
  const action = screen.find(element => element.props?.['aria-label'] === 'Disable Precision tools');
  action.props.onClick();
  await new Promise(resolve => setImmediate(resolve));
  assert.ok(screen.find(element => element.props?.['aria-label'] === 'Disable Precision tools'));
  assert.match(screen.html(), /Connection lost/);
  assert.doesNotMatch(screen.html(), /Banner disabled/);
});

test('moving a filtered card persists its position in the full server list', async () => {
  const later = { ...banner, id: 2, title: 'Milling tools', displayOrder: 2 };
  const screen = setup({ response: { success: true, data: [banner, later] } });
  screen.find(element => element.props?.['aria-label'] === 'Search banners').props.onChange({ target: { value: 'Milling' } });
  screen.find(element => element.props?.['aria-label'] === 'Move Milling tools earlier').props.onClick();
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(screen.calls.filter(call => call.kind === 'update').map(call => call.payload), [{ id: 2, data: { displayOrder: 1 } }, { id: 1, data: { displayOrder: 2 } }]);
  assert.match(screen.html(), /Banner order saved/);
});

test('failed delete retains the confirmation and saved banner', async () => {
  const screen = setup({ response: { success: true, data: [banner] }, delete: async () => { throw new Error('Delete failed'); } });
  screen.find(element => element.props?.['aria-label'] === 'Delete Precision tools').props.onClick();
  screen.button('Delete Banner').props.onClick();
  await new Promise(resolve => setImmediate(resolve));
  assert.match(screen.html(), /Delete failed/);
  assert.match(screen.html(), /Delete this banner/);
  assert.match(screen.html(), /Precision tools/);
  assert.doesNotMatch(screen.html(), /Banner deleted successfully/);
});
