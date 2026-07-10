import React from 'react';

const spacesData = [
  {
    id: 1,
    title: 'Salon',
    // High-quality placeholder video URL
    video: 'https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-sunny-day-51197-large.mp4'
  },
  {
    id: 2,
    title: 'Mutfak',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4'
  },
  {
    id: 3,
    title: 'Banyo',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4'
  },
  {
    id: 4,
    title: 'Tüm Ev',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-curvy-road-on-a-tree-covered-hill-41537-large.mp4'
  }
];

export default function SpaceCategories() {
  return (
    <section className="h-screen w-full flex flex-col overflow-hidden bg-[#1A1A1C]">
      {spacesData.map((space) => (
        <div 
          key={space.id} 
          className="flex-1 relative group overflow-hidden cursor-pointer"
        >
          {/* Background Video */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            src={space.video}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105 z-0"
          />
          
          {/* Dark Overlay to "light up" on hover */}
          <div className="absolute inset-0 bg-black/60 transition-colors duration-700 ease-in-out group-hover:bg-black/30 z-10"></div>
          
          {/* Centered Serif Text */}
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#FAF9F6] uppercase tracking-[0.2em] drop-shadow-2xl transition-transform duration-700 group-hover:scale-105">
              {space.title}
            </h2>
          </div>
        </div>
      ))}
    </section>
  );
}
