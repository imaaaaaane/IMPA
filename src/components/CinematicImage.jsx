import React, { useState, useEffect, useRef } from 'react';

export default function CinematicImage({ src, alt, className = '', durationClass = 'duration-[10000ms]', finalBrightness = 'brightness-100' }) {
  const [isLit, setIsLit] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the image comes into the viewport
        if (entry.isIntersecting) {
          // Small delay ensures the browser has painted the dark state first
          requestAnimationFrame(() => {
            setIsLit(true);
          });
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.15, // Trigger when 15% of the image is visible
        rootMargin: '50px', // Start slightly before it fully enters the viewport
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(imageRef.current);
      }
    };
  }, []);

  return (
    <div className={`overflow-hidden bg-black ${className}`}>
      <img loading="lazy" width="800" height="600" ref={imageRef}
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        // The transition-all duration class handles the smooth illumination
        // scale-105 to scale-100 adds a very subtle cinematic settle effect
        className={`w-full h-full object-cover transition-all ${durationClass} ease-in-out ${isLit && isLoaded
            ? `${finalBrightness} scale-100 opacity-100`
            : 'brightness-0 scale-105 opacity-0'
          }`}
      />
    </div>
  );
}
