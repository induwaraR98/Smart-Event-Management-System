export const getCleanImageUrl = (url: string): string => {
  if (!url) return '';
  
  const trimmedUrl = url.trim();
  
  // Check if it is a standard Unsplash webpage URL
  if (trimmedUrl.includes('unsplash.com/photos/')) {
    try {
      const match = trimmedUrl.match(/\/photos\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        const fullSlug = match[1];
        const parts = fullSlug.split('-');
        const photoId = parts[parts.length - 1];
        return `https://unsplash.com/photos/${photoId}/download?force=true`;
      }
    } catch (e) {
      console.error('Error parsing unsplash URL', e);
    }
  }
  return trimmedUrl;
};
