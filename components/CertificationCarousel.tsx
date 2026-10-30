"use client";

import { useEffect, useRef } from "react";
import CertificationCard from "./CertificationCard";

type Certification = {
  id: string;
  name: string;
  url: string;
};

export default function CertificationCarousel({
  certifications,
}: {
  certifications: Certification[];
}) {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    function handleWheel(event: WheelEvent) {
      if (
        !carousel ||
        Math.abs(event.deltaY) <= Math.abs(event.deltaX) ||
        carousel.scrollWidth <= carousel.clientWidth
      ) {
        return;
      }

      const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
      const canScrollRight =
        event.deltaY > 0 && carousel.scrollLeft < maxScrollLeft - 1;
      const canScrollLeft = event.deltaY < 0 && carousel.scrollLeft > 1;

      if (canScrollRight || canScrollLeft) {
        event.preventDefault();
        carousel.scrollLeft += event.deltaY;
      }
    }

    carousel.addEventListener("wheel", handleWheel, { passive: false });
    return () => carousel.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div
      ref={carouselRef}
      className="certification-grid"
      role="region"
      aria-label="Certifications"
      tabIndex={0}
    >
      {certifications.map((certification) => (
        <CertificationCard
          key={certification.id}
          name={certification.name}
          url={certification.url}
        />
      ))}
    </div>
  );
}
