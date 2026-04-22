/**
 * Sanitize user-generated content to prevent XSS attacks.
 * Removes all HTML tags and escapes dangerous characters.
 */
export const sanitizeContent = (content: string): string => {
  if (!content) return '';

  // Remove any HTML tags
  let sanitized = content.replace(/<[^>]*>/g, '');

  // Escape HTML entities
  const entityMap: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  };

  sanitized = sanitized.replace(/[&<>"'\/]/g, char => entityMap[char]);

  return sanitized;
};

/**
 * Safely display text content that may contain special characters.
 * This function ensures the content is safe to display without XSS risks.
 */
export const getSafeTextContent = (content: string): string => {
  return sanitizeContent(content);
};
