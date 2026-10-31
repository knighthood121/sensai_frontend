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
const componentPath = fileURLToPath(new URL(
  '../src/pages/Admin/Marketing/BannerManagement/BannerManagementScreen.tsx', import.meta.url,
));
const banner = {
  id: '1', title: 'Precision tools', subtitle: 'Shop tools', ctaText: 'Shop',
  ctaLink: '/shop', image: '/banner.jpg', location: 'Homepage Hero',
  status: 'Active', order: 1, createdAt: '', updatedAt: '',
};

// Render the real component with controlled API/cache boundaries, without a browser or network.
function setup(initialBanners, response) {
  let banners = initialBanners;
  const effects = [];
  const mocks = {
    react: { ...React, useEffect: (effect) => effects.push(effect) },
    'react-router-dom': { useNavigate: () => () => {} },
    '../../../../utils/bannerStorage': {
      useBanners: () => ({ banners }),
      saveStoredBanners: (updated) => { banners = updated; },
    },
    '../../../../service/bannerApi': {
      useGetAdminBannersQuery: () => ({ data: response }),
      useCreateBannerMutation: () => [() => {}],
      useUpdateBannerMutation: () => [() => {}],
      useDeleteBannerMutation: () => [() => {}],
    },
  };

  function load(file) {
    const module = { exports: {} };
    const { outputText } = ts.transpileModule(readFileSync(file, 'utf8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX,
        target: ts.ScriptTarget.ES2023, esModuleInterop: true,
      },
    });
    const localRequire = (id) => {
      if (id in mocks) return mocks[id];
      if (!id.startsWith('.')) return require(id);
      const path = resolve(dirname(file), id);
      return load(path + (id.endsWith('/Button') ? '.tsx' : '.ts'));
    };
    new Function('require', 'module', 'exports', outputText)(localRequire, module, module.exports);
    return module.exports;
  }

  const Screen = load(componentPath).default;
  return {
    render: () => renderToStaticMarkup(React.createElement(Screen)),
    flushEffects: () => effects.splice(0).forEach((effect) => effect()),
  };
}

test('empty cache renders an empty preview before the API responds', () => {
  const screen = setup([], undefined);
  const html = screen.render();
  assert.match(html, /No banner to preview/);
  assert.match(html, /Add New Banner/);
  assert.doesNotMatch(html, /Select to preview:/);
});

test('an existing banner renders its title and image', () => {
  const screen = setup([banner], undefined);
  const html = screen.render();
  assert.match(html, /Precision tools/);
  assert.match(html, /src="\/banner.jpg"/);
  assert.doesNotMatch(html, /No banner to preview/);
});

test('banners arriving from the API replace the initial empty preview', () => {
  const screen = setup([], {
    success: true,
    data: [{
      id: 1, title: banner.title, description: banner.subtitle,
      imageUrl: banner.image, isActive: true, displayOrder: 1,
    }],
  });
  assert.match(screen.render(), /No banner to preview/);
  screen.flushEffects();
  const html = screen.render();
  assert.match(html, /Precision tools/);
  assert.doesNotMatch(html, /No banner to preview/);
});

test('a successful empty response clears stale cached banners safely', () => {
  const screen = setup([banner], { success: true, data: [] });
  screen.render();
  screen.flushEffects();
  const html = screen.render();
  assert.match(html, /No banner to preview/);
  assert.doesNotMatch(html, /Precision tools/);
});

test('an unavailable API preserves cached banners', () => {
  const screen = setup([banner], undefined);
  screen.render();
  screen.flushEffects();
  assert.match(screen.render(), /Precision tools/);
});
