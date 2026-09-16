export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  const baseUrl = import.meta.env.VITE_R2_PUBLIC_URL || '';
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  return baseUrl ? `${baseUrl}/${cleanPath}` : `/${cleanPath}`;
};
