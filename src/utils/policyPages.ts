import type { CmsPage } from './cmsStorage';

export const DEFAULT_PAYMENT_PAGE: CmsPage = {
  slug: 'payment',
  title: 'Secure Payment Methods',
  subtitle: 'Easily complete your payments through our secure gateway. Choose a method that works best for you.',
  lastUpdated: '21 November 2026',
  isActive: true,
  sections: [{
    id: 'bank-transfer',
    heading: 'Bank Transfer',
    content: `Account Name: sansei solutions india private limited
Bank Name: ICICI BANK
Account Number: 777705987051
IFSC Code: ICIC0000358
Branch: IMT Manesar Branch GF, No, 59-61, Eros Corporate Park, Sector 2, IMT , Manesar ,Gurgaon , HR - 122052`,
  }],
};

export const POLICY_PAGE_LINKS = [
  { slug: 'payment-terms-and-conditions', label: 'Payment Terms and Conditions' },
  { slug: 'cancellation-policy', label: 'Cancellation Policy' },
  { slug: 'returns-and-refunds-policy', label: 'Returns and Refunds Policy' },
  { slug: 'shipping-and-delivery-policy', label: 'Shipping and Delivery Policy' },
  { slug: 'cookie-policy', label: 'Cookie Policy' },
  { slug: 'warranty-and-liability-disclaimer', label: 'Warranty and Liability Disclaimer' },
  { slug: 'account-deletion-request', label: 'Account Deletion Request' },
] as const;

const companyDetails = 'Company Name: Sansei Solutions\nAddress: Eros Corporate Park, Office No. 419, Sector-2, IMT Manesar, Gurugram, Haryana - 122052, India';

function policy(slug: string, title: string, subtitle: string, sections: CmsPage['sections'], lastUpdated = '13 December 2025'): CmsPage {
  return { slug, title, subtitle, sections, lastUpdated, isActive: true,
    contactEmail: 'sales.sanseisolutions@gmail.com', contactPhone: '+91 98705 17217' };
}

export const DEFAULT_POLICY_PAGES: Record<string, CmsPage> = {
  'payment-terms-and-conditions': policy('payment-terms-and-conditions', 'Payment Terms and Conditions',
    'At Sansei Solutions, we are committed to providing a smooth and secure payment process for our customers. Please read our Payment Terms and Conditions carefully to understand the terms that apply to your purchases.', [
      { id: 'company', heading: 'Company Details', content: companyDetails },
      { id: 'methods', heading: '1. Accepted Payment Methods', content: `- Wire Transfers: We accept payments through direct bank transfers. Payment details will be provided at checkout or upon request.
- Credit/Debit Cards/Net Banking/UPI: Major credit and debit cards are accepted through our secure online payment gateway.
- Other Methods: For bulk orders or special payment arrangements, please contact our support team.` },
      { id: 'payment', heading: '2. Payment Terms', content: `- Advance Payment: All orders require full payment in advance before the order is processed and shipped.
- Bulk Orders: For large or customized orders, specific payment terms may apply. Please contact us to discuss any special requirements.
- Currency: All payments are processed in INR (Indian Rupees).` },
      { id: 'billing', heading: '3. Invoicing and Billing', content: `- Invoice Issuance: An invoice will be issued for each transaction and sent to your registered email upon confirmation of payment.
- Billing Information: You are responsible for providing accurate and complete billing information. Failure to provide correct billing details may result in order delays or cancellation.
- Tax Information: All prices are inclusive/exclusive of applicable taxes as displayed. GST or other relevant taxes will be calculated at checkout as per Indian tax regulations.` },
      { id: 'security', heading: '4. Payment Security', content: `- Secure Transactions: We prioritize your security by using encrypted payment gateways. Your payment information is handled through a secure and reliable system.
- Fraud Prevention: Any suspicious or fraudulent transactions will be investigated, and we reserve the right to cancel orders if fraud is suspected. If additional verification is required, we may contact you.` },
      { id: 'issues', heading: '5. Payment Issues', content: `- Failed Transactions: If your payment fails, please verify your payment details and try again. Contact your bank or our support team if the issue persists.
- Unprocessed Payments: Orders will not be processed or shipped until payment is successfully received. If payment is not completed within 24 hours, the order may be canceled.` },
      { id: 'cancellation', heading: '6. Cancellations and Refunds', content: `- Order Cancellations: Orders can be canceled prior to dispatch. Please contact us as soon as possible if you wish to cancel an order. Cancellations may not be possible after the product is shipped.
- Refunds: Refunds for cancellations or returns, if applicable, will be processed within 7-10 business days and credited to your original payment method. Please refer to our Cancellation Policy and Returns and Refunds Policy for eligibility and the replacement or store-credit terms for approved returns.` },
      { id: 'late', heading: '7. Late or Missed Payments', content: 'For any special billing arrangements or extended payment terms, if offered for bulk orders, timely payment is required. Late or missed payments may result in penalties or a hold on future orders.' },
      { id: 'contact', heading: '8. Contact Us', content: 'For any questions regarding our Payment Terms and Conditions, please contact us.\n\nBy purchasing from Sansei Solutions, you agree to abide by these Payment Terms and Conditions.\n\nThank you for your business and for choosing us as your carbide cutting tool supplier.' },
    ]),
  'cancellation-policy': policy('cancellation-policy', 'Cancellation Policy',
    'At Sansei Solutions, we aim to provide a smooth and transparent shopping experience for all our customers. Please read our cancellation policy carefully.', [
      { id: 'customer', heading: '1. Order Cancellation by Customer', content: `- Orders can be cancelled before dispatch only.
- Once the order is shipped or out for delivery, it cannot be cancelled.
- To request cancellation, contact our support team immediately with your Order ID.` },
      { id: 'company', heading: '2. Cancellation by Sansei Solutions', content: `We reserve the right to cancel an order under the following circumstances:

- Product is out of stock.
- Pricing or listing errors.
- Payment not received or transaction flagged as high risk.
- Any suspicious or fraudulent order activity.

In such cases, you will be notified, and if payment is already made, a full refund will be processed.` },
      { id: 'refund', heading: '3. Refund for Cancelled Orders', content: `- If your cancellation request is approved, a refund will be initiated within 3-7 working days.
- Refunds will be credited to the original payment method used during purchase.` },
      { id: 'exceptions', heading: '4. Non-Cancellable Items', content: '- Custom-made items, special-order items, or materials purchased specifically on customer request cannot be cancelled.' },
      { id: 'support', heading: '5. Quick Support', content: 'For any cancellation-related queries, please contact our customer support team with your order number.' },
    ], '21 November 2026'),
  'returns-and-refunds-policy': policy('returns-and-refunds-policy', 'Returns, Replacements & Store Credit Policy',
    'At Sansei Solutions, we are committed to supplying the right products and maintaining customer satisfaction. Please read our return and replacement policy before placing an order.', [
      { id: 'eligibility', heading: '1. Return Eligibility', content: `Returns are accepted only in the following situations:

- The customer receives damaged material.
- The customer receives an incorrect item different from the item ordered.

We do not accept returns for change of mind, incorrect product selection by the customer, or products that are no longer required.` },
      { id: 'period', heading: '2. Return Period - Strictly 7 Days', content: `- Customers must inform us about damaged or incorrect material within 7 days from the date of delivery.
- No return or replacement requests will be accepted after 7 days.
- The 7-day period is strictly applicable and cannot be extended.` },
      { id: 'conditions', heading: '3. Return Conditions', content: `- The customer must provide the original purchase invoice or order details.
- Clear photographs or videos of the damaged or incorrect material must be shared with our team.
- The returned material must be sent back in its original packaging.
- Our team will inspect and verify the returned material before approving a replacement or credit.

Sansei Solutions reserves the right to reject requests that do not meet the above conditions.` },
      { id: 'replacement', heading: '4. Replacement Policy', content: `If the returned material is verified as damaged or incorrectly supplied:

- Sansei Solutions will arrange the correct replacement material.
- If the same product is unavailable, the customer may select other available products of equivalent value.
- Replacement will be processed after the returned material is received and inspected by our team.` },
      { id: 'refund', heading: '5. Refund Policy - No Cash Refunds', content: `Sansei Solutions does not offer cash refunds under any circumstances for approved returns.

- Refunds will not be made through bank transfer, UPI, credit/debit card, or any other payment method.
- The approved value of returned material can only be used to purchase other products from Sansei Solutions.
- Customers must select alternative products against the approved return value.
- Any additional amount payable for the new order must be paid by the customer.

The approved return amount will remain available only as a purchase credit with Sansei Solutions and cannot be withdrawn or converted into cash.` },
      { id: 'shipping', heading: '6. Return Shipping Charges', content: `- If material is damaged or incorrectly supplied due to an error by Sansei Solutions, the return shipping and replacement arrangements will be coordinated by us.
- Customers must contact our team before sending any material back.
- Unauthorized returns sent without prior approval may not be accepted.` },
      { id: 'exceptions', heading: '7. Non-Returnable Situations', content: `Returns will not be accepted in the following situations:

- Products received in good condition and as per the original order.
- Products returned due to change of mind or incorrect selection by the customer.
- Used, modified, or damaged products due to customer handling.
- Products reported after the 7-day return period.
- Specially sourced or customized products, unless supplied damaged or incorrectly by Sansei Solutions.` },
      { id: 'request', heading: '8. How to Request a Return', content: 'To report damaged or incorrect material, contact our support team within 7 days of delivery.\n\nPlease share your order number, product details, and clear photographs or videos of the issue. Our team will review your request and guide you through the return and replacement process.' },
      { id: 'final', heading: '9. Final Terms', content: 'By placing an order with Sansei Solutions, customers acknowledge and agree to the above Returns, Replacements & Store Credit Policy.\n\nFor any questions or assistance, please contact our support team.' },
    ], '14 November 2026'),
  'shipping-and-delivery-policy': policy('shipping-and-delivery-policy', 'Shipping and Delivery Policy',
    'At Sansei Solutions, we are committed to ensuring that your orders are processed and delivered efficiently. Please review our Shipping and Delivery Policy for information on shipping times, costs, and tracking.', [
      { id: 'company', heading: 'Company Details', content: companyDetails },
      { id: 'processing', heading: '1. Order Processing', content: `- Processing Time: Orders are processed within 1-2 business days after payment is confirmed. Orders placed on weekends or holidays will be processed on the next business day.
- Warehouse Dispatch: Orders are dispatched from our warehouse to ensure accurate tracking and minimize delivery issues.` },
      { id: 'methods', heading: '2. Shipping Methods and Costs', content: `- Domestic Shipping: We partner with reliable carriers to deliver across India. Shipping fees are calculated based on the weight and dimensions of the package and the delivery location.
- International Shipping: For international orders, please contact us directly for available shipping options and cost estimates.
- Shipping Costs: Any applicable shipping charges will be displayed at checkout. International customers may be responsible for import duties or taxes.` },
      { id: 'times', heading: '3. Delivery Times', content: `- Estimated Delivery: Delivery times vary based on location and shipping method. For most regions in India, delivery typically takes 3-7 business days after dispatch. Remote areas may experience slightly longer delivery times.
- Delays: While we aim for timely delivery, delays may occur due to factors outside our control, such as weather, carrier issues, or holidays. We are not responsible for delivery delays once the order is in transit with the carrier.` },
      { id: 'tracking', heading: '4. Order Tracking', content: `- Once your order is shipped, we will send you a tracking number via WhatsApp, email, or SMS to allow you to track your shipment's progress.
- Tracking updates may take up to 24 hours to reflect the current status. For questions about tracking or delivery, please contact our customer support.` },
      { id: 'undelivered', heading: '5. Undelivered or Returned Packages', content: `- If a package is returned to us due to an incorrect address or if the carrier was unable to deliver the package, we will contact you to arrange re-shipment. Additional shipping charges may apply.
- If you decide not to proceed with re-shipment, we will issue a refund for the product value only, excluding original shipping fees.` },
      { id: 'damage', heading: '6. Damaged or Missing Items', content: `- Damaged Items: If you receive a damaged item, please contact us within 48 hours of delivery. Send photographs of the damaged product and packaging, and we will assist you with a replacement or refund in accordance with the applicable returns policy.
- Missing Items: If any items are missing from your order, please contact us immediately. We will investigate and resolve the issue as quickly as possible.` },
    ]),
  'cookie-policy': policy('cookie-policy', 'Cookie Policy',
    'This policy explains how Sansei Solutions uses cookies and similar browser storage when you visit our website.', [
      { id: 'storage', heading: '1. Cookies and Similar Technologies', content: 'Cookies are small files that websites can store in your browser. Similar technologies, including local storage, keep information on your device so that website features can work across visits.' },
      { id: 'essential', heading: '2. Storage Used by Our Website', content: `Our website uses browser storage for features including:

- Keeping you signed in and managing your account session.
- Remembering your shopping cart while you browse or return to the website.
- Remembering website and interface preferences.

Third-party services, such as payment providers or Google sign-in, may use their own cookies or storage when you use those services. Please review their privacy and cookie information.` },
      { id: 'choices', heading: '3. Managing Your Preferences', content: 'You can review, block, or delete cookies and website storage through your browser settings. Clearing or blocking essential storage may sign you out, remove a saved guest cart, or prevent some website features from working. Browser settings vary by device and browser.' },
      { id: 'privacy', heading: '4. Privacy and Updates', content: 'Please read our Privacy Policy for information about personal data. We may update this Cookie Policy as our website changes. The latest version will appear on this page with its updated date.' },
      { id: 'contact', heading: '5. Contact Us', content: 'For questions about cookies or browser storage on the Sansei Solutions website, please contact our support team.' },
    ], '21 November 2026'),
  'warranty-and-liability-disclaimer': policy('warranty-and-liability-disclaimer', 'Warranty and Liability Disclaimer',
    'Sansei Solutions is committed to providing quality carbide cutting tools. Please review our Warranty and Liability Disclaimer carefully to understand the terms that apply to our products and services.', [
      { id: 'company', heading: 'Company Details', content: companyDetails },
      { id: 'warranty', heading: '1. Limited Product Warranty', content: `- Warranty Coverage: Our carbide cutting tools are warranted to be free from defects in materials and workmanship under normal use and service conditions. This limited warranty is valid for 7 days from the date of purchase.
- Warranty Exclusions: This warranty does not cover damage caused by improper use or handling, normal wear and tear from regular use, alterations or modifications, or incorrect installation or application.
- Claim Process: To file a warranty claim, please contact us. You will be asked to provide proof of purchase and details of the issue. If the product is deemed defective, we will offer a replacement or repair, at our discretion.` },
      { id: 'disclaimer', heading: '2. Disclaimer of Warranties', content: `Except for the limited warranty explicitly stated above, Sansei Solutions makes no other warranties, express or implied, regarding the products sold on this website, including, without limitation, warranties of merchantability, fitness for a particular purpose, or non-infringement.

- Product Suitability: Customers are responsible for ensuring the suitability of our carbide cutting tools for their specific applications. We recommend consulting industry guidelines or contacting our team for any technical inquiries before use.` },
      { id: 'liability', heading: '3. Limitation of Liability', content: `To the fullest extent permitted by law, Sansei Solutions is not liable for any damages, losses, or injuries arising from the use or inability to use our products, including:

- Indirect or Consequential Damages: Loss of profits, revenue, or business opportunities.
- Product Misuse: Damages resulting from improper use, handling, or storage of the products.
- Professional Use: Our carbide cutting tools are intended for professional or industrial use. Improper use, especially in non-professional settings, may lead to injury or damage, for which we accept no liability.` },
      { id: 'indemnity', heading: '4. Indemnity', content: 'By using our products, you agree to indemnify and hold Sansei Solutions harmless from any claims, losses, or damages arising from your improper use or handling of our products.' },
      { id: 'law', heading: '5. Governing Law', content: 'This Warranty and Liability Disclaimer is governed by and construed in accordance with the laws of India. Any disputes arising under this disclaimer shall be subject to the jurisdiction of the competent courts in India.' },
      { id: 'contact', heading: '6. Contact Us', content: 'If you have questions about our Warranty and Liability Disclaimer, please contact us.' },
    ]),
  'account-deletion-request': policy('account-deletion-request', 'Delete Your Account',
    'If you want to delete your account and associated data, please follow the steps below.', [
      { id: 'request', heading: 'How to Request Account Deletion', content: `1. Email our support team using the button below.
2. Use the subject: Account Deletion Request.
3. Mention your registered mobile number or email address.` },
      { id: 'processing', heading: 'Request Processing', content: 'Our team will process your request within 24-48 hours.\n\nYour personal data, orders, and account details will be permanently deleted when your deletion request is completed.\n\nFor any help, contact our support team.' },
    ], '21 November 2026'),
};
