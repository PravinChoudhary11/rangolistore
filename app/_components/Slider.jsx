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

const Slider = ({ SliderList = [] }) => {
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
    }, 4000);

    return () => {
      api.off("select", handleSelect);
      clearInterval(intervalRef.current);
    };
  }, [api]);

  if (!SliderList.length) {
    return (
      <div className="w-full h-[200px] md:h-[500px] bg-gray-200 rounded-2xl flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="mt-1 relative border-2 shadow-lg rounded-full block sm:hidden">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {SliderList.map((slider, index) => {
            const imageUrl = slider.image?.[0]?.url;


            return (
              <CarouselItem key={slider.id || index} className="relative">
                {imageUrl ? (
                  <div className="w-full h-[200px] md:h-[500px] relative">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${imageUrl}`}
                      alt={slider.name || `Slider image ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index === 0}
  
                      className="object-cover rounded-2xl transition-transform duration-1000 "
                      quality={90}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAAAASxQAABbvAAAZK1hZWiAAAAAAAAAAAAAAAAAAAAAWY3VydgAAAAAAAAABAjMAAGN1cnYAAAAAAAAAAQIzAABjdXJ2AAAAAAAAAAECMwAAWFlaIAAAAAAAAG+iAAA49QAAA5BYWVogAAAAAAAAJJ4AABevAAAy6FhZWiAAAAAAAAADKwAAAjcAAAK7cHJvZwAAAAAAAAAiAAACYmRzY20AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="
                    />
                  </div>
                ) : (
                  <div className="w-full h-[200px] md:h-[500px] bg-gray-300 rounded-2xl flex items-center justify-center">
                    <p className="text-gray-500">Image not available</p>
                  </div>
                )}
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselPrevious className="hover:scale-105 bg-white/80 backdrop-blur-sm hidden md:flex" />
        <CarouselNext className="hover:scale-105 bg-white/80 backdrop-blur-sm hidden md:flex" />
        
      </Carousel>
    </div>
  );
};

export default Slider;