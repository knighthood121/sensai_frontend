/** Build the initial inquiry draft from a homepage product or catalog link. */
export function getInitialInquiryRequirements(search: string): string {
  const params = new URLSearchParams(search);
  const operation = params.get('operation')?.trim() || '';
  const product = params.get('product')?.trim() || '';
  const isCatalogRequest = params.get('request') === 'catalog';
  const lines: string[] = [];

  if (isCatalogRequest) {
    lines.push('Please send me the latest SANSEI cutting tools catalog.');
  }
  if (operation) {
    lines.push(`Operation: ${operation.charAt(0).toUpperCase()}${operation.slice(1)}`);
  }
  if (product) {
    lines.push(`Product: ${product}`);
  }
  if (operation || product) {
    lines.push('Quantity Needed: ', 'Required Specifications: ', 'Target Delivery Date: ');
  }

  return lines.join('\n');
}
