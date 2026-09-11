import { supabase } from './supabase';

export const getOptimizedImageProps = (bucket, path) => {
  if (!path) return {};
  
  if (path.startsWith('http')) {
    return { 
      src: path,
      loading: 'lazy',
      decoding: 'async'
    };
  }

  const getUrl = (w, q) => supabase.storage.from(bucket).getPublicUrl(path, {
    transform: { width: w, quality: q, format: 'webp' }
  }).data.publicUrl;

  const src600 = getUrl(600, 60);
  const src1080 = getUrl(1080, 70);

  return {
    src: src1080,
    srcSet: `${src600} 600w, ${src1080} 1080w`,
    sizes: "(max-width: 600px) 600px, 1080px",
    loading: "lazy",
    decoding: "async"
  };
};

export const getOptimizedUrl = (rawUrl) => {
  return rawUrl || '';
};

export const getImageUrl = (bucket, path, width = 1080, quality = 70) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  
  return supabase.storage.from(bucket).getPublicUrl(path, {
    transform: { width, quality, format: 'webp' }
  }).data.publicUrl;
};

export const getProgressiveUrls = (bucket, path, isThumbnail = false) => {
  if (!path) return { url: null };
  if (path.startsWith('http')) return { url: path };

  const width = isThumbnail ? 600 : 1080;
  const quality = isThumbnail ? 60 : 70;

  const url = supabase.storage.from(bucket).getPublicUrl(path, {
    transform: { width, quality, format: 'webp' }
  }).data.publicUrl;

  return { url };
};

