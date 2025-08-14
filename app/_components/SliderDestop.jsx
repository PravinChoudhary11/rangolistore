"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const SliderDesktop = ({ SliderDesktopList = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState(null);
  const intervalRef = React.useRef(null);

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };

    api.on("select", handleSelect);

    // Auto-play setup
    intervalRef.current = setInterval(() => {
      api.scrollNext();
    }, 6000);

    return () => {
      api.off("select", handleSelect);
      clearInterval(intervalRef.current);
    };
  }, [api]);

  if (!SliderDesktopList.length) {
    return (
      <div className="hidden md:flex h-[500px] w-full items-center justify-center rounded-2xl bg-slate-100">
        <p className="text-slate-400">No images available</p>
      </div>
    );
  }

  return (
    <div className="mt-1  relative border-2 shadow-lg rounded-2xl hidden md:block overflow-hidden">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {SliderDesktopList.map((slider, index) => {
            const imageUrl = slider.img?.[0]?.url;
            const altText = slider.Name || `Featured content ${index + 1}`;

            return (
              <CarouselItem key={slider.id || index} className="relative h-[500px]">
                {imageUrl ? (
                  <picture>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${imageUrl}`}
                      alt={altText}
                      fill
                      sizes="(min-width: 1024px) 100vw, 50vw"
                      priority={index === 0}
                      className="object-cover transition-transform duration-1000"
                      quality={90}
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
                    />
                  </picture>
                ) : (
                  <div className="flex h-full items-center justify-center bg-slate-200">
                    <p className="text-slate-400">Image unavailable</p>
                  </div>
                )}
                
                {/* Optional caption overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    {/* <h3 className="text-xl font-bold">{slider.Name || "Featured Content"}</h3> */}
                    {slider.description && (
                      <p className="text-sm text-white/90">{slider.description}</p>
                    )}
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        
        <CarouselPrevious className="hover:scale-105 bg-white/80 backdrop-blur-sm" />
        <CarouselNext className="hover:scale-105 bg-white/80 backdrop-blur-sm" />
        
        {/* Indicator dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {SliderDesktopList.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? "bg-white w-4" 
                  : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
};

export default SliderDesktop;