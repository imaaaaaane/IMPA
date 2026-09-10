import { supabase } from './supabase';

export const getOptimizedImageProps = (bucket, path) => {
  if (!path) return {};
  
  // If it's already an external HTTP URL, just return it
  if (path.startsWith('http')) {
    return { 
      src: path,
      loading: 'lazy',
      decoding: 'async'
    };
  }

  // Use webp optimization by default based on legacy code logic
  const optimizedPath = path.replace(/\.(jpg|jpeg|png)$/i, '.webp');

  const getUrl = (w) => supabase.storage.from(bucket).getPublicUrl(optimizedPath, {
    transform: { width: w, quality: 75 }
  }).data.publicUrl;

  const src600 = getUrl(600);
  const src1080 = getUrl(1080);
  const src1920 = getUrl(1920);

  return {
    src: src1080, // fallback
    srcSet: `${src600} 600w, ${src1080} 1080w, ${src1920} 1920w`,
    sizes: "(max-width: 600px) 600px, (max-width: 1080px) 1080px, 1920px",
    loading: "lazy",
    decoding: "async"
  };
};

export const getImageUrl = (bucket, path, width = 1024, quality = 80) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  
  const optimizedPath = path.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  
  return supabase.storage.from(bucket).getPublicUrl(optimizedPath, {
    transform: { width, quality }
  }).data.publicUrl;
};
