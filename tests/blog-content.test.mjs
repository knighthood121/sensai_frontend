import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const source = readFileSync(new URL('../src/components/common/BlogContent.tsx', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } });
const module = { exports: {} };
new Function('require', 'module', 'exports', outputText)(require, module, module.exports);

test('pasted article HTML remains readable text and cannot become executable markup', () => {
  const content = '# Tooling guide\n\n<script>alert("test")</script>\n\n<img src=x onerror=alert(1)>';
  const html = renderToStaticMarkup(React.createElement(module.exports.default, { content }));
  assert.ok(html.includes('<h2>Tooling guide</h2>'));
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(html.includes('&lt;img'));
  assert.equal(/<(script|img)\b/.test(html), false);
});
