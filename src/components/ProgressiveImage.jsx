import React, { useState, useEffect, useRef } from 'react';
import { getProgressiveUrls } from '../utils/imageUtils';

export default function ProgressiveImage({ bucket, path, src, alt, className, imageClassName = 'object-cover', isThumbnail = false }) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const containerRef = useRef(null);
  let finalSrc = src || path;
  
  if (!src && bucket && path && !path.startsWith('http')) {
    const urls = getProgressiveUrls(bucket, path, isThumbnail);
    finalSrc = urls.url;
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  if (!finalSrc) return null;

  return (
    <div ref={containerRef} className={`relative overflow-hidden bg-gray-200 dark:bg-stone-800 flex items-center justify-center ${className} ${!loaded ? 'animate-pulse' : ''}`}>
      {inView && (
        <img
          src={finalSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 w-full h-full ${imageClassName} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  );
}
