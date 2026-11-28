// Keep older saved content consistent with the current brand spelling.
export function correctBrandSpelling(text: string): string {
  return text.replace(/\bsansai\b/gi, (match) => {
    if (match === match.toUpperCase()) return 'SANSEI';
    if (match === match.toLowerCase()) return 'sansei';
    return 'Sansei';
  });
}
