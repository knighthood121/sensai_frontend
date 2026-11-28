import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, FileSpreadsheet, Loader2, Upload } from 'lucide-react';
import { useGetCategoriesDropdownQuery } from '../../../../service/dropdownApi';
import { useConfirmProductImportMutation, usePreviewProductImportMutation, type ProductImportReport } from '../../../../service/productImportApi';

export default function BulkUploadScreen() {
  const [file, setFile] = useState<File | null>(null);
  const [report, setReport] = useState<ProductImportReport | null>(null);
  const [error, setError] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const { data: categoryData } = useGetCategoriesDropdownQuery();
  const [preview, { isLoading: previewing }] = usePreviewProductImportMutation();
  const [confirm, { isLoading: importing }] = useConfirmProductImportMutation();
  const busy = previewing || importing;
  const choose = (candidate?: File) => {
    if (busy) return;
    setReport(null); setError(''); setFile(null);
    if (!candidate) return;
    if (!/\.(csv|xlsx)$/i.test(candidate.name)) { setError('Select a .csv or .xlsx file. Save older Excel .xls files as .xlsx first.'); return; }
    if (candidate.size > 5 * 1024 * 1024) { setError('Files must be 5MB or smaller.'); return; }
    setFile(candidate);
  };
  const submit = async (commit: boolean) => {
    if (!file || busy) return;
    setError('');
    const body = new FormData(); body.append('file', file);
    try {
      const result = await (commit ? confirm(body) : preview(body)).unwrap();
      setReport(result.data);
      if (commit) { setFile(null); if (input.current) input.current.value = ''; }
    } catch (caught: unknown) {
      const detail = caught as { data?: { message?: string; details?: ProductImportReport } };
      setReport(detail.data?.details?.errors ? detail.data.details : null);
      setError(detail.data?.message || 'Unable to process this file. Please retry.');
    }
  };
  const template = () => {
    const columns = ['name', 'sku', 'categoryId', 'basePrice', 'stock', 'description', 'subCategoryId', 'variantSku', 'size', 'color', 'variantPrice', 'discountPrice', 'brand', 'material', 'finish', 'dimensions', 'packQuantity', 'unitOfMeasure', 'imageUrl', 'isActive', 'isFeatured', 'isBestSeller', 'isNewArrival'];
    const example: Record<string, string> = { name: 'HSS Drill Bit 6mm', sku: 'DRILL-6MM', categoryId: String(categoryData?.data[0]?.id || ''), basePrice: '250', stock: '20', description: 'Precision HSS drill bit for workshop applications.', variantSku: 'DRILL-6MM-STD', size: '6mm', color: 'Standard', brand: 'Sansei', packQuantity: '1', unitOfMeasure: 'piece', isActive: 'true', isFeatured: 'false', isBestSeller: 'false', isNewArrival: 'false' };
    const csv = [columns.join(','), columns.map(column => '"' + (example[column] || '').replaceAll('"', '""') + '"').join(',')].join('\r\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'sansei-product-import-template.csv'; document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <div className="mx-auto max-w-6xl space-y-6">
    <Link to="/admin/products/add" className="text-sm font-bold text-gray-500 hover:text-red-600">← Add Product</Link>
    <div className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-2xl font-black text-gray-950">Bulk Product Upload</h1><p className="mt-2 text-sm text-gray-500">Import products and variants from CSV or Excel (.xlsx). Review the file before adding products.</p></div>
      <button type="button" onClick={template} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold"><Download size={17} />Download Template</button></div>
    <section className="rounded-2xl border border-gray-200 bg-white p-6">
      <label onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); choose(event.dataTransfer.files[0]); }} className={`flex flex-col items-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center ${busy ? 'opacity-60' : 'cursor-pointer hover:border-red-400'}`}>
        <FileSpreadsheet size={38} className="mb-3 text-red-600" /><span className="font-bold text-gray-900">{file?.name || 'Choose a file or drag it here'}</span><span className="mt-2 text-xs text-gray-500">CSV / XLSX · up to 5MB · up to 500 rows</span>
        <input ref={input} type="file" accept=".csv,.xlsx" disabled={busy} onChange={event => choose(event.target.files?.[0])} aria-label="Product CSV or Excel file" className="mt-5 block w-full max-w-sm text-sm" />
      </label>
      <button type="button" disabled={!file || busy} onClick={() => void submit(false)} className="mt-5 flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{previewing ? <Loader2 size={17} className="animate-spin" /> : <Upload size={17} />}{previewing ? 'Checking file…' : 'Validate & Preview'}</button>
      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    </section>
    {report && <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6">
      {report.imported > 0 ? <p role="status" className="rounded-xl bg-emerald-50 p-4 font-bold text-emerald-800">Successfully added {report.imported} products. <Link to="/admin/products/list" className="underline">View products</Link></p> : <h2 className="text-lg font-bold">{report.rowCount} rows · {report.productCount} products · {report.errors.length} errors</h2>}
      {report.errors.length > 0 && <div role="alert" className="max-h-64 overflow-auto rounded-xl border border-red-200 bg-red-50 p-4"><p className="mb-2 text-sm font-bold text-red-800">Fix these errors and upload the corrected file. No products have been added.</p><ul className="space-y-1 text-xs text-red-700">{report.errors.map((item, index) => <li key={index}>Row {item.row} · {item.field}: {item.message}</li>)}</ul></div>}
      {report.preview.length > 0 && <div className="max-h-96 overflow-auto"><table className="w-full text-left text-xs"><thead className="sticky top-0 bg-gray-50 text-gray-500"><tr>{['Row', 'Product', 'SKU', 'Category ID', 'Price', 'Variants', 'Stock'].map(label => <th key={label} className="p-3">{label}</th>)}</tr></thead><tbody>{report.preview.map(item => <tr key={item.sku} className="border-t border-gray-100"><td className="p-3">{item.row}</td><td className="p-3 font-bold">{item.name}</td><td className="p-3">{item.sku}</td><td className="p-3">{item.categoryId}</td><td className="p-3">₹{item.basePrice.toFixed(2)}</td><td className="p-3">{item.variants}</td><td className="p-3">{item.stock}</td></tr>)}</tbody></table></div>}
      {!report.imported && <button type="button" disabled={!file || !!report.errors.length || !report.productCount || busy} onClick={() => void submit(true)} className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{importing ? 'Importing products…' : `Confirm Import (${report.productCount} products)`}</button>}
    </section>}
    <section className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600"><h2 className="mb-3 font-bold text-gray-950">File Guide</h2><ul className="list-disc space-y-2 pl-5">
      <li>Required columns: name, sku, categoryId (or category name), basePrice, description (at least 10 characters).</li>
      <li>Use existing active categories and subcategories. Optional fields include stock, size, color, variantSku, variantPrice, discountPrice, brand, material, finish, dimensions, packQuantity, unitOfMeasure and imageUrl.</li>
      <li>For multiple variants, repeat the product SKU and product details on each row; change the variant fields. Each variant SKU and size/color combination must be unique.</li>
      <li>Use plain prices and whole-number stock quantities. Boolean columns accept true or false. Image URLs must start with http:// or https://.</li>
      <li>Excel files must contain one populated worksheet. Use values instead of formulas. Existing products are never overwritten; any error cancels the entire import.</li>
    </ul>
      <details className="mt-4"><summary className="cursor-pointer font-bold">Available Category IDs</summary><ul className="mt-2 space-y-1">{categoryData?.data.map(category => <li key={category.id}>{category.id} — {category.name}</li>)}</ul></details>
    </section>
  </div>;
}
