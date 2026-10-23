import { useState } from 'react';
import { Printer, X } from 'lucide-react';

export interface TaxInvoiceItem {
  id?: string | number;
  productName: string;
  sku?: string;
  hsnCode?: string;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
  unit?: string;
}

export interface TaxInvoiceAddress {
  fullName: string;
  companyName?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  phone?: string;
  email?: string;
  gstin?: string;
  pan?: string;
}

export interface TaxInvoiceProps {
  invoiceNumber?: string;
  invoiceDate?: string | Date;
  poNumber?: string;
  poDate?: string | Date;
  copyType?: string; // 'DUPLICATE FOR TRANSPORTER' | 'ORIGINAL FOR RECIPIENT' | 'TRIPLICATE FOR SUPPLIER'

  // Buyer Info
  buyer?: TaxInvoiceAddress;

  // Items
  items: TaxInvoiceItem[];

  // Financials
  subtotal?: number;
  discountAmount?: number;
  shippingCharges?: number;
  taxAmount?: number;
  totalAmount?: number;

  // Print controls
  showPrintButton?: boolean;
  onClose?: () => void;
}

// ─── Number to Indian Rupees Words Converter ─────────────────────────────────
function numberToWordsINR(amount: number): string {
  if (!amount || isNaN(amount)) return 'ZERO RUPEES ONLY.';

  const singleDigits = [
    '', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE',
    'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN',
    'SEVENTEEN', 'EIGHTEEN', 'NINETEEN',
  ];

  const tensDigits = [
    '', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY',
  ];

  function convertTwoDigits(num: number): string {
    if (num === 0) return '';
    if (num < 20) return singleDigits[num];
    const tens = Math.floor(num / 10);
    const ones = num % 10;
    return (tensDigits[tens] + (ones > 0 ? ' ' + singleDigits[ones] : '')).trim();
  }

  function convertThreeDigits(num: number): string {
    if (num === 0) return '';
    const hundreds = Math.floor(num / 100);
    const rest = num % 100;
    let res = '';
    if (hundreds > 0) {
      res += singleDigits[hundreds] + ' HUNDRED';
      if (rest > 0) res += ' AND ';
    }
    if (rest > 0) {
      res += convertTwoDigits(rest);
    }
    return res.trim();
  }

  const integerPart = Math.floor(Math.abs(amount));
  if (integerPart === 0) return 'ZERO RUPEES ONLY.';

  const crore = Math.floor(integerPart / 10000000);
  const lakh = Math.floor((integerPart % 10000000) / 100000);
  const thousand = Math.floor((integerPart % 100000) / 1000);
  const remainder = integerPart % 1000;

  const parts: string[] = [];

  if (crore > 0) {
    parts.push(convertThreeDigits(crore) + ' CRORE');
  }
  if (lakh > 0) {
    parts.push(convertTwoDigits(lakh) + ' LAKH');
  }
  if (thousand > 0) {
    parts.push(convertTwoDigits(thousand) + ' THOUSAND');
  }
  if (remainder > 0) {
    parts.push(convertThreeDigits(remainder));
  }

  return parts.join(' ').trim() + ' RUPEES ONLY.';
}

export function printInvoiceElement(elementId = 'printable-tax-invoice', title = 'Tax Invoice') {
  const element = document.getElementById(elementId);
  if (!element) {
    window.print();
    return;
  }

  // Remove existing print iframe if any
  const existingFrame = document.getElementById('tax-invoice-print-frame');
  if (existingFrame) {
    existingFrame.remove();
  }

  const iframe = document.createElement('iframe');
  iframe.id = 'tax-invoice-print-frame';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.visibility = 'hidden';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    window.print();
    return;
  }

  // Extract all inline and linked styles from main document
  let headStyles = '';
  document.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
    headStyles += node.outerHTML + '\n';
  });

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        ${headStyles}
        <style>
          @page {
            size: A4 portrait;
            margin: 6mm 4mm;
          }
          *, *::before, *::after {
            box-sizing: border-box !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            font-family: Arial, Helvetica, sans-serif !important;
          }
          .print-hidden, .print\\:hidden {
            display: none !important;
          }
          #printable-tax-invoice {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 2mm !important;
            box-shadow: none !important;
            border: none !important;
            background: #ffffff !important;
          }
        </style>
      </head>
      <body>
        <div style="width: 100%; max-width: 100%; margin: 0 auto;">
          ${element.outerHTML}
        </div>
      </body>
    </html>
  `);
  doc.close();

  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch {
      window.print();
    } finally {
      setTimeout(() => {
        iframe.remove();
      }, 2000);
    }
  }, 350);
}

export default function TaxInvoice({
  invoiceNumber = 'INV/26-27/496',
  invoiceDate = new Date(),
  poNumber = 'PO-PC/26-27/118',
  poDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  copyType = 'DUPLICATE FOR TRANSPORTER',
  buyer,
  items = [],
  subtotal,
  totalAmount,
  showPrintButton = true,
  onClose,
}: TaxInvoiceProps) {
  const [selectedCopy, setSelectedCopy] = useState(copyType);

  // Normalize dates
  const formattedInvoiceDate = invoiceDate instanceof Date
    ? invoiceDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : String(invoiceDate);

  const formattedPoDate = poDate instanceof Date
    ? poDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : String(poDate);

  // Default / Normalized Items
  const normalizedItems = items.length > 0 ? items : [
    {
      id: 1,
      productName: 'Bi-champ Bend Saw Blade 4440*34*1.1mm ( M42)',
      sku: 'ZOMM-LC-TL-0144',
      hsnCode: '82079090',
      quantity: 5,
      unitPrice: 2730,
      unit: 'NOS',
    },
  ];

  // Calculate totals
  const calculatedTaxableAmount = subtotal ?? normalizedItems.reduce(
    (sum, item) => sum + (item.totalPrice ?? (item.quantity * item.unitPrice)),
    0
  );

  const totalQty = normalizedItems.reduce((sum, item) => sum + item.quantity, 0);

  // 18% GST (9% CGST + 9% SGST for intrastate Haryana, or 18% IGST)
  const isInterState = buyer?.state && !buyer.state.toLowerCase().includes('haryana');
  const cgstRate = isInterState ? 0 : 9.0;
  const sgstRate = isInterState ? 0 : 9.0;
  const igstRate = isInterState ? 18.0 : 0;

  const cgstAmount = isInterState ? 0 : Math.round(calculatedTaxableAmount * 0.09 * 100) / 100;
  const sgstAmount = isInterState ? 0 : Math.round(calculatedTaxableAmount * 0.09 * 100) / 100;
  const igstAmount = isInterState ? Math.round(calculatedTaxableAmount * 0.18 * 100) / 100 : 0;
  const totalTaxAmount = cgstAmount + sgstAmount + igstAmount;

  const grandTotal = totalAmount ?? (calculatedTaxableAmount + totalTaxAmount);
  const amountInWords = numberToWordsINR(grandTotal);

  const handlePrint = () => {
    printInvoiceElement('printable-tax-invoice', `Tax Invoice - ${invoiceNumber}`);
  };

  return (
    <div className="w-full bg-white text-gray-900 font-sans text-xs">
      {/* Top Action Bar (hidden on print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-gray-50 border-b border-gray-200 print:hidden">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-600">Copy Type:</span>
          {['DUPLICATE FOR TRANSPORTER', 'ORIGINAL FOR RECIPIENT', 'TRIPLICATE FOR SUPPLIER'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedCopy(type)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCopy === type
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {type.split(' ')[0]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {showPrintButton && (
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Printer size={15} />
              <span>Print / Download PDF</span>
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
              title="Close Invoice"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* ─── PHYSICAL INVOICE SHEET (MATCHING EXACT IMAGE) ────────────────── */}
      <div
        id="printable-tax-invoice"
        className="max-w-[850px] mx-auto p-6 sm:p-8 bg-white print:p-0 print:max-w-none print:w-full print:m-0"
        style={{ color: '#111827', fontFamily: 'Arial, Helvetica, sans-serif' }}
      >
        {/* Header Title & Copy Type */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-wide text-gray-950 uppercase leading-none mb-1">
              TAX INVOICE
            </h1>
            <h2 className="text-sm sm:text-base font-extrabold text-gray-950">
              SMN Solutions
            </h2>
            <p className="font-bold text-xs mt-0.5">
              GSTIN 06AEWPY5179G1ZJ
            </p>
            <p className="text-[11px] text-gray-700 leading-tight mt-0.5">
              Tower C1 Flat No 102<br />
              Sare Homes, Sector 92<br />
              Gurugram, Haryana - 122505
            </p>
            <p className="text-[11px] font-bold text-gray-800 mt-1">
              Phone: +91-9870517217
            </p>
            <p className="text-[11px] text-gray-800">
              Email: Sitender.yadav@smnsolutions.in
            </p>
          </div>

          <div className="text-right flex flex-col items-end">
            <span className="text-[11px] font-bold tracking-wider text-gray-900 uppercase">
              {selectedCopy}
            </span>

            {/* SMN Solutions Logo matching photo */}
            <div className="mt-3 flex flex-col items-center">
              <div className="flex items-center gap-1 font-black text-2xl tracking-tighter text-[#4a5568]">
                <span>SM</span>
                <div className="w-7 h-7 rounded-full border-2 border-[#4a5568] flex items-center justify-center text-xs font-bold relative overflow-hidden">
                  <span className="relative z-10 text-[11px]">N</span>
                  <div className="absolute inset-0 bg-[#cbd5e1]/30 transform -rotate-45" />
                </div>
              </div>
              <span className="text-[10px] font-black tracking-[0.25em] text-gray-800 uppercase mt-0.5">
                SOLUTIONS
              </span>
              <span className="text-[8px] font-medium text-gray-500 tracking-wide mt-0.5">
                Engineering Trust
              </span>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <hr className="my-2.5 border-t-2 border-gray-900" />

        {/* Dispatch From Info */}
        <div className="text-[11px] leading-snug space-y-0.5 text-gray-900">
          <p>
            <strong>Dispatch From:</strong> Smn Solutions
          </p>
          <p>
            <strong>GSTIN :</strong> 06AEWPY5179G1ZJ
          </p>
          <p>
            Eros corporate park, 419 , 4th Floor Manesar, Haryana, India - 122052
          </p>
          <p>
            <strong>Additional Place of Business:- :</strong> tech.smnsolutions@gmail.com
          </p>
        </div>

        {/* Divider Line */}
        <hr className="my-2.5 border-t-2 border-gray-900" />

        {/* Details of Buyer | Billed to & Invoice Meta (2 Columns) */}
        <div className="grid grid-cols-2 gap-4 pb-2 text-[11px]">
          {/* Buyer Details (Left) */}
          <div className="space-y-0.5 text-gray-900 leading-tight">
            <p className="text-gray-700 font-semibold mb-1">
              Details of Buyer | Billed to :
            </p>
            <p className="font-extrabold text-xs text-gray-950 uppercase">
              {buyer?.companyName || buyer?.fullName || 'Shigan Industries Private Limited'}
            </p>
            <p className="text-gray-800">
              {buyer?.addressLine1 || 'Shyam Udyog Parisar, , Alier'}
            </p>
            <p className="text-gray-800">
              {buyer?.addressLine2 || 'Bhangrola Road, Manesar, Gurugram,'}
            </p>
            <p className="text-gray-800">
              {buyer ? `${buyer.city}, ${buyer.state} - ${buyer.postalCode}` : 'Haryana - 122052'}
            </p>
            <p className="font-bold pt-1 text-gray-900">
              GSTIN: {buyer?.gstin || '06AAZCS7666J1ZA'}
            </p>
            <p className="font-bold text-gray-900">
              PAN: {buyer?.pan || 'AAZCS7666J'}
            </p>
            <p className="font-bold text-gray-900">
              State: {buyer?.state ? `${buyer.state} ( 06 )` : 'Haryana ( 06 )'}
            </p>
            <p className="font-bold text-gray-900">
              Place of Supply: {buyer?.state ? `${buyer.state} ( 06 )` : 'Haryana ( 06 )'}
            </p>
          </div>

          {/* Invoice Meta (Right) */}
          <div className="flex flex-col justify-start items-end text-right">
            <table className="text-[11px] text-right font-medium">
              <tbody>
                <tr>
                  <td className="pr-4 py-0.5 font-bold text-gray-900">Invoice #:</td>
                  <td className="font-bold text-gray-950 text-left pl-2">{invoiceNumber}</td>
                </tr>
                <tr>
                  <td className="pr-4 py-0.5 font-bold text-gray-900">Invoice Date:</td>
                  <td className="font-bold text-gray-950 text-left pl-2">{formattedInvoiceDate}</td>
                </tr>
                <tr>
                  <td className="pr-4 py-0.5 font-bold text-gray-900">P.O. No.:</td>
                  <td className="font-bold text-gray-950 text-left pl-2">{poNumber}</td>
                </tr>
                <tr>
                  <td className="pr-4 py-0.5 font-bold text-gray-900">P.O. Date:</td>
                  <td className="font-bold text-gray-950 text-left pl-2">{formattedPoDate}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ─── ITEMS TABLE (Dark Grey Header) ─────────────────────────────── */}
        <div className="mt-2 border-t border-b border-gray-400">
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="bg-[#595959] text-white">
                <th className="py-2 px-2 text-left font-bold w-10">Sr. No.</th>
                <th className="py-2 px-2 text-left font-bold">Name of Product / Service</th>
                <th className="py-2 px-2 text-left font-bold w-24">End Customer code</th>
                <th className="py-2 px-2 text-center font-bold w-20">HSN / SAC</th>
                <th className="py-2 px-2 text-right font-bold w-20">Qty</th>
                <th className="py-2 px-2 text-right font-bold w-24">Rate</th>
                <th className="py-2 px-2 text-right font-bold w-24">Taxable Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {normalizedItems.map((item, idx) => {
                const itemTotal = item.totalPrice ?? (item.quantity * item.unitPrice);
                return (
                  <tr key={item.id || idx} className="text-gray-900">
                    <td className="py-2.5 px-2 align-top text-left font-medium">{idx + 1}</td>
                    <td className="py-2.5 px-2 align-top text-left font-bold">{item.productName}</td>
                    <td className="py-2.5 px-2 align-top text-left font-mono text-[10px] text-gray-700 leading-tight">
                      {item.sku || 'ZOMM-LC-TL-0144'}
                    </td>
                    <td className="py-2.5 px-2 align-top text-center font-mono text-[10px] text-gray-700">
                      {item.hsnCode || '82079090'}
                    </td>
                    <td className="py-2.5 px-2 align-top text-right font-semibold">
                      {item.quantity.toFixed(2)} {item.unit || 'NOS'}
                    </td>
                    <td className="py-2.5 px-2 align-top text-right font-semibold">
                      {item.unitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-2 align-top text-right font-bold">
                      {itemTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ─── SUMMARY RIGHT ALIGNED BELOW ITEMS ───────────────────────────── */}
        <div className="flex justify-end pt-2 pb-3">
          <div className="w-72 text-[11px] font-medium space-y-1">
            <div className="flex justify-between text-gray-900">
              <span className="font-bold">Taxable Amount</span>
              <span className="font-bold">
                {calculatedTaxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            {!isInterState ? (
              <>
                <div className="flex justify-between text-gray-900">
                  <span>CGST ({cgstRate.toFixed(2)} %)</span>
                  <span>{cgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gray-900">
                  <span>SGST ({sgstRate.toFixed(2)} %)</span>
                  <span>{sgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between text-gray-900">
                <span>IGST ({igstRate.toFixed(2)} %)</span>
                <span>{igstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            )}

            <div className="flex justify-between text-xs font-black text-gray-950 pt-1.5 border-t border-gray-400">
              <span className="uppercase">Total Amount</span>
              <span>
                ₹ {grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Total Items / Qty & Amount in words */}
        <div className="text-[11px] space-y-1 border-t border-gray-300 pt-2 pb-3 text-gray-900">
          <p className="font-bold">
            Total Items / Qty : {normalizedItems.length} / {totalQty.toFixed(2)}
          </p>
          <p className="font-bold tracking-tight">
            Total amount (in words): {amountInWords}
          </p>
        </div>

        {/* ─── GST BREAKDOWN TABLE (Dark Grey Header) ──────────────────────── */}
        <div className="border border-gray-400">
          <table className="w-full text-[10px] border-collapse">
            <thead>
              <tr className="bg-[#595959] text-white">
                <th className="py-1.5 px-2 text-center font-bold" rowSpan={2}>HSN / SAC</th>
                <th className="py-1.5 px-2 text-right font-bold" rowSpan={2}>Taxable Value</th>
                {!isInterState ? (
                  <>
                    <th className="py-1 px-2 text-center font-bold border-b border-gray-400" colSpan={2}>CGST</th>
                    <th className="py-1 px-2 text-center font-bold border-b border-gray-400" colSpan={2}>SGST</th>
                  </>
                ) : (
                  <th className="py-1 px-2 text-center font-bold border-b border-gray-400" colSpan={2}>IGST</th>
                )}
                <th className="py-1.5 px-2 text-right font-bold" rowSpan={2}>Total Tax Amount</th>
              </tr>
              <tr className="bg-[#595959] text-white text-[9px]">
                <th className="py-1 px-1 text-center font-bold w-12">%</th>
                <th className="py-1 px-2 text-right font-bold w-20">Amount</th>
                <th className="py-1 px-1 text-center font-bold w-12">%</th>
                <th className="py-1 px-2 text-right font-bold w-20">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-900 font-medium">
              <tr>
                <td className="py-1.5 px-2 text-center font-mono">
                  {normalizedItems[0]?.hsnCode || '82079090'}
                </td>
                <td className="py-1.5 px-2 text-right">
                  {calculatedTaxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                {!isInterState ? (
                  <>
                    <td className="py-1.5 px-1 text-center">{cgstRate.toFixed(2)}</td>
                    <td className="py-1.5 px-2 text-right">
                      {cgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-1.5 px-1 text-center">{sgstRate.toFixed(2)}</td>
                    <td className="py-1.5 px-2 text-right">
                      {sgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-1.5 px-1 text-center">{igstRate.toFixed(2)}</td>
                    <td className="py-1.5 px-2 text-right">
                      {igstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-1.5 px-1 text-center">-</td>
                    <td className="py-1.5 px-2 text-right">-</td>
                  </>
                )}
                <td className="py-1.5 px-2 text-right font-bold">
                  {totalTaxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
              {/* Total Footer Row */}
              <tr className="font-bold border-t border-gray-400 bg-gray-50/50">
                <td className="py-1.5 px-2 text-center">Total</td>
                <td className="py-1.5 px-2 text-right">
                  {calculatedTaxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                {!isInterState ? (
                  <>
                    <td className="py-1.5 px-1 text-center"></td>
                    <td className="py-1.5 px-2 text-right">
                      {cgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-1.5 px-1 text-center"></td>
                    <td className="py-1.5 px-2 text-right">
                      {sgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-1.5 px-1 text-center"></td>
                    <td className="py-1.5 px-2 text-right">
                      {igstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-1.5 px-1 text-center"></td>
                    <td className="py-1.5 px-2 text-right">-</td>
                  </>
                )}
                <td className="py-1.5 px-2 text-right font-bold">
                  {totalTaxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ─── BOTTOM SECTION: BANK DETAILS, TERMS & SIGNATURE STAMP ────── */}
        <div className="grid grid-cols-5 gap-4 pt-4 mt-2">
          {/* Left: Bank Details & Terms (col-span-3) */}
          <div className="col-span-3 text-[11px] leading-snug space-y-3">
            <div>
              <p className="font-bold text-gray-950 mb-1">Bank Details:</p>
              <table className="text-[10px]">
                <tbody>
                  <tr>
                    <td className="pr-3 text-gray-700">Name:</td>
                    <td className="font-semibold text-gray-950">IDBI Bank Manesar</td>
                  </tr>
                  <tr>
                    <td className="pr-3 text-gray-700">Branch:</td>
                    <td className="font-semibold text-gray-950">Manesar</td>
                  </tr>
                  <tr>
                    <td className="pr-3 text-gray-700">Acc. Name:</td>
                    <td className="font-semibold text-gray-950">M/s SMN SOLUTIONS</td>
                  </tr>
                  <tr>
                    <td className="pr-3 text-gray-700">Acc. Number:</td>
                    <td className="font-semibold text-gray-950">0198102000008778</td>
                  </tr>
                  <tr>
                    <td className="pr-3 text-gray-700">IFSC:</td>
                    <td className="font-semibold text-gray-950">IBKL0000198</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-1">
              <p className="font-bold text-gray-950 mb-1">Terms and Conditions:</p>
              <ol className="list-decimal list-outside pl-4 space-y-0.5 text-[10px] text-gray-700">
                <li>All prices are exclusive of applicable taxes unless stated otherwise.</li>
                <li>Payment is due within 30 days from the date of invoice, unless otherwise agreed in writing.</li>
                <li>Goods once sold will not be taken back unless found defective. Any issues must be reported within 7 days of delivery.</li>
                <li>All disputes are subject to the jurisdiction of Gurugram.</li>
              </ol>
            </div>
          </div>

          {/* Right: Authorized Signatory Stamp (col-span-2) */}
          <div className="col-span-2 flex flex-col justify-between items-end text-right">
            <p className="font-bold text-[11px] text-gray-950">
              For SMN Solutions
            </p>

            {/* Official Stamp & Signature Area matching image */}
            <div className="my-2 relative flex items-center justify-center p-2">
              {/* Circular Stamp Graphic */}
              <div className="w-24 h-24 rounded-full border-2 border-indigo-700/80 flex flex-col items-center justify-center p-1 text-center transform -rotate-6">
                <span className="text-[8px] font-black uppercase text-indigo-900 leading-tight">
                  ★ SMN SOLUTIONS ★
                </span>
                <span className="text-[7px] text-indigo-800 font-semibold leading-none my-0.5">
                  Sector-92, Gurugram
                </span>
                <div className="w-full border-t border-indigo-700/60 my-0.5" />
                <span className="text-[8px] font-bold text-indigo-900">
                  Auth. Signatory
                </span>
              </div>

              {/* Stamp Received Gate Entry Overlay */}
              <div className="absolute -left-6 top-1 border border-indigo-800/70 p-1.5 rounded text-[8px] font-bold text-indigo-900 bg-white/70 shadow-xs transform rotate-3">
                <div className="text-[7px] font-black uppercase border-b border-indigo-600 pb-0.5">
                  SHIGAN INDUSTRIES PVT. LTD.
                </div>
                <div className="mt-0.5 space-y-0.5 text-left text-[7px]">
                  <p>GATE ENTRY NO.: .........</p>
                  <p>DATE: 16/10/26</p>
                  <p>TIME: .........</p>
                  <p>SIGN: .........</p>
                </div>
              </div>
            </div>

            <div className="text-center w-36 pt-1 border-t border-gray-400">
              <span className="text-[10px] font-bold text-gray-800 block">
                Auth. Signatory
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Safe print styles scoped to tax invoice */}
      <style>{`
        @media print {
          .print-hidden, .print\\:hidden {
            display: none !important;
          }
          #printable-invoice {
            display: block !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          #printable-tax-invoice {
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 2mm !important;
            margin: 0 auto !important;
            box-shadow: none !important;
            border: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 6mm 4mm;
          }
        }
      `}</style>
    </div>
  );
}
