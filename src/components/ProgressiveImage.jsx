import React, { useState, useEffect } from 'react';
import { getProgressiveUrls } from '../utils/imageUtils';

export default function ProgressiveImage({ bucket, path, src, alt, className, imageClassName = 'object-cover' }) {
  const [isLoaded, setIsLoaded] = useState(false);

  // If a direct src is provided (e.g. static import), use it for both.
  // Otherwise, calculate the progressive URLs.
  let lowResSrc, highResSrc;
  
  if (src) {
    lowResSrc = src;
    highResSrc = src;
  } else if (bucket && path) {
    const urls = getProgressiveUrls(bucket, path);
    lowResSrc = urls.lowRes;
    highResSrc = urls.highRes;
  } else {
    return null;
  }

  useEffect(() => {
    // Reset loaded state when source changes
    setIsLoaded(false);
    
    if (!highResSrc) return;
    
    const img = new window.Image();
    img.src = highResSrc;
    img.onload = () => {
      setIsLoaded(true);
    };
  }, [highResSrc]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Micro-placeholder with heavy blur */}
      <img
        src={lowResSrc}
        alt={alt}
        className={`absolute inset-0 w-full h-full ${imageClassName} blur-[10px] scale-110 transition-opacity duration-500 ease-in-out ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        aria-hidden="true"
      />
      
      {/* High resolution image */}
      <img
        src={highResSrc}
        alt={alt}
        className={`absolute inset-0 w-full h-full ${imageClassName} transition-opacity duration-500 ease-in-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
