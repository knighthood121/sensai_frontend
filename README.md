# SANSEI storefront

## GST profiles, product imports and order documents

- Customers save a GST number in **My Profile > GST Details**. A saved GST number
  is required at checkout and is shown on the order and invoice.
- Administrators can open **Add Product > Bulk Upload CSV / Excel** to download
  a template, validate a CSV/XLSX file, review row errors and confirm the import.
  Imports support up to 500 rows and 5 MB. Existing products are not overwritten.
- **Admin > Orders > View details > Order Documents** accepts PDF/JPG/PNG files
  up to 8 MB for each reached order stage. Customers view and download these files
  from **My Orders > View details**.

Deploy the matching backend and apply migration
`20261128000000_customer_gst_order_documents` before deploying this frontend.
Document storage uses the backend's Cloudinary configuration. See the backend
README for endpoint details and rollout instructions.

Run `node --test tests/commerce-features.test.mjs` for focused UI regression checks.

## Email inquiries and blog publishing

The footer sends email-only inquiries to `POST /api/v1/bulk-inquiries/contact`.
Admins can review them alongside full inquiries at `/admin/bulk-inquiries`, which
refreshes automatically every 15 seconds. This records a request; it does not send
an automatic email to the visitor.

Blog management is at `/admin/blogs`. Admins can create, edit, preview, publish,
unpublish, and delete articles. Cover images use the existing authenticated image
upload service (JPG, PNG, WebP, up to 5 MB), or a supplied image URL. Public readers
see published articles at `/blog` and `/blog/:slug`. Drafts remain private. Article
content supports plain text, blank lines between paragraphs, and `#` headings.

### Backend rollout

These features require the updated `SansaiBackend` and the database migration
`20261114000000_add_blogs_and_email_inquiries`. From the backend directory:

```sh
npx prisma migrate deploy
npm run build
node --test tests/contact-blogs.test.cjs
```

Deploy/restart that backend before using the new frontend. The migration adds
`BlogPost` and makes missing contact details nullable on email-only inquiries;
existing inquiry records are retained. No migration is applied by the frontend.

For local development, copy `.env.example` to `.env.local`, set
`VITE_API_BASE_URL` to the running backend, and restart Vite. For production, set
the same variable before building if the API URL differs from the current Render
backend. Image uploads require the backend's existing Cloudinary configuration.

### Starter blog articles

After applying the migration, run `npm run seed:blogs` from `SansaiBackend` to
insert three published starter articles with existing cover images. Fixed slugs
and duplicate skipping preserve existing admin edits on repeated runs. Seeding
never runs during page reads or normal startup.

If blog requests return HTTP 500, check the backend log and run
`npx prisma migrate status`. The `BlogPost` table must exist; apply the pending
migration with `npm run migrate:deploy` before retrying.

## Vite tooling

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
