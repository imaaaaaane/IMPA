import { getImageUrl as getR2ImageUrl } from './image';

export const getOptimizedImageProps = (bucket, path) => {
  if (!path) return {};
  const url = getR2ImageUrl(path);
  return {
    src: url,
    loading: "lazy",
    decoding: "async"
  };
};

export const getOptimizedUrl = (rawUrl) => {
  return getR2ImageUrl(rawUrl);
};

export const getImageUrl = (bucket, path) => {
  // Handle case where old code calls it with (bucket, path, ...)
  const actualPath = path !== undefined ? path : bucket;
  return getR2ImageUrl(actualPath);
};

export const getProgressiveUrls = (bucket, path, isThumbnail = false) => {
  const url = getR2ImageUrl(path !== undefined ? path : bucket);
  return { url };
};

