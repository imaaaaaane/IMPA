export const getImageUrl = (path) => {
  if (!path) return '';
  
  const baseUrl = 'https://pub-5b549fafc8324f1c8474829ef742174b.r2.dev';
  
  // Handle legacy Supabase full URLs by extracting just the filename
  if (path.startsWith('http')) {
    if (path.includes('supabase.co')) {
      const parts = path.split('/');
      const filename = parts[parts.length - 1];
      return `${baseUrl}/${filename}`;
    }
    return path;
  }
  
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  return `${baseUrl}/${cleanPath}`;
};
