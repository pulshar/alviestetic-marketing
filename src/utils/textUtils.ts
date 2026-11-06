/**
 * Utility functions for sanitizing and decoding HTML text from WordPress REST APIs (Tutor LMS)
 */

/**
 * Decodes HTML entities (decimal &#8211;, hexadecimal, and named &ndash; / &amp;)
 * into proper UTF-8 characters.
 * Handles single or double-encoded entities safely in browser and node environments.
 */
export function decodeHtmlEntities(text: string): string {
  if (!text || typeof text !== 'string') return '';

  let result = text;

  // Use the browser's native DOMParser when available for comprehensive HTML entity decoding
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    try {
      const parser = new DOMParser();
      // First pass
      const doc = parser.parseFromString(result, 'text/html');
      result = doc.body.textContent || result;

      // Handle double-escaped entities (e.g., &amp;#8211; -> &#8211; -> –)
      if (result.includes('&') && (result.includes('&#') || /&[a-z0-9#]+;/i.test(result))) {
        const doc2 = parser.parseFromString(result, 'text/html');
        result = doc2.body.textContent || result;
      }
    } catch {
      // Fallback to manual dictionary below if DOMParser throws
    }
  }

  // Fallback and safety dictionary for common WordPress / Tutor LMS wptexturize entities
  return result
    // Typography dashes & quotes
    .replace(/&#8211;|&ndash;/g, '–')
    .replace(/&#8212;|&mdash;/g, '—')
    .replace(/&#8216;|&lsquo;/g, '‘')
    .replace(/&#8217;|&rsquo;/g, '’')
    .replace(/&#8218;|&sbquo;/g, '‚')
    .replace(/&#8220;|&ldquo;/g, '“')
    .replace(/&#8221;|&rdquo;/g, '”')
    .replace(/&#8222;|&bdquo;/g, '„')
    .replace(/&#8230;|&hellip;/g, '…')
    .replace(/&#8242;|&prime;/g, '′')
    .replace(/&#8243;|&Prime;/g, '″')
    // Standard punctuation & symbols
    .replace(/&#038;|&amp;/g, '&')
    .replace(/&#039;|&#39;|&apos;/g, "'")
    .replace(/&#034;|&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;|&#160;/g, ' ')
    // Common accented vowels in Spanish
    .replace(/&aacute;/g, 'á')
    .replace(/&eacute;/g, 'é')
    .replace(/&iacute;/g, 'í')
    .replace(/&oacute;/g, 'ó')
    .replace(/&uacute;/g, 'ú')
    .replace(/&ntilde;/g, 'ñ')
    .replace(/&Aacute;/g, 'Á')
    .replace(/&Eacute;/g, 'É')
    .replace(/&Iacute;/g, 'Í')
    .replace(/&Oacute;/g, 'Ó')
    .replace(/&Uacute;/g, 'Ú')
    .replace(/&Ntilde;/g, 'Ñ');
}

/**
 * Strips HTML tags, decodes HTML entities, and normalizes excessive whitespace.
 */
export function cleanHtmlText(text?: string | null): string {
  if (!text || typeof text !== 'string') return '';
  // 1. Remove HTML tags
  const stripped = text.replace(/<[^>]*>?/gm, ' ');
  // 2. Decode entities
  const decoded = decodeHtmlEntities(stripped);
  // 3. Normalize whitespace and trim
  return decoded.replace(/\s+/g, ' ').trim();
}
