"use client";

import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType, EmblaPluginType } from "embla-carousel";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures"; 
import { useCallback, useEffect, useState } from "react";

export const useCustomCarousel = (options?: EmblaOptionsType, plugins: EmblaPluginType[] = []) => {
  // We add the WheelGesturesPlugin to the array. 
  // It handles the "momentum" from your HP mousepad.
  const [emblaRef, embla] = useEmblaCarousel(options, [WheelGesturesPlugin(), ...plugins]);

  const [canScrollNext, setCanScrollNext] = useState(true);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback((index: number) => embla && embla.scrollTo(index), [embla]);
  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);

  useEffect(() => {
    if (!embla) return;

    const onSelect = () => {
      setCanScrollPrev(embla.canScrollPrev());
      setCanScrollNext(embla.canScrollNext());
      setSelectedIndex(embla.selectedScrollSnap());
    };

    embla.on("select", onSelect);
    embla.on("reInit", onSelect);

    return () => {
      embla.off("select", onSelect);
      embla.off("reInit", onSelect);
    };
  }, [embla]);

  return { emblaRef, scrollTo, scrollNext, scrollPrev, selectedIndex, canScrollNext, canScrollPrev };
};