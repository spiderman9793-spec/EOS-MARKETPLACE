import { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, GraduationCap } from 'lucide-react';

export default function ListingCard({ item, onClick }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef(null);
  const images = item.images || [item.gradient];

  const startCycle = useCallback(() => {
    if (images.length <= 1) return;
    setIsHovering(true);
    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 800);
  }, [images.length]);

  const stopCycle = useCallback(() => {
    setIsHovering(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrentImageIndex(0);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div
      onClick={onClick}
      onMouseEnter={startCycle}
      onMouseLeave={stopCycle}
      className="group p-4 rounded-2xl bg-white/80 border border-slate-200/60 hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer hover:shadow-lg"
    >
      <div className="aspect-[4/3] rounded-2xl bg-slate-100 relative overflow-hidden mb-3">
        <img
          src={images[currentImageIndex]}
          alt={item.title}
          className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105"
        />

        {/* Progress dots */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1.5">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentImageIndex
                    ? 'bg-white w-4'
                    : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-[#0066FF]">
          {item.category}
        </span>
        <span className="text-xs text-slate-400">{item.condition}</span>
      </div>

      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-slate-900 text-sm leading-tight transition-all duration-200 ease-out group-hover:text-slate-700 truncate pr-2">
          {item.title}
        </h3>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-[#0066FF] transition-all duration-200 ease-out group-hover:scale-105">
          ${item.price}
        </span>
      </div>

      <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {item.pickupSpot}
        </span>
      </div>

      <div className="flex items-center justify-between mt-1 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1">
          <GraduationCap className="w-3 h-3" />
          {item.campus}
        </span>
        <span>{item.distance}</span>
      </div>
    </div>
  );
}
