export const getImageUrl = (path) => {
  if (!path) return '';
  
  const baseUrl = import.meta.env.VITE_R2_PUBLIC_URL || '';
  
  // Handle legacy Supabase full URLs by extracting just the filename
  if (path.startsWith('http')) {
    if (path.includes('supabase.co')) {
      const parts = path.split('/');
      const filename = parts[parts.length - 1];
      return baseUrl ? `${baseUrl}/${filename}` : `/${filename}`;
    }
    return path;
  }
  
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  return baseUrl ? `${baseUrl}/${cleanPath}` : `/${cleanPath}`;
};
