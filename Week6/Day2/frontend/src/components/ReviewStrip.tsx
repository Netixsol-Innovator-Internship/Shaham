"use client";
import React, { FC, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ReviewCard from "./ReviewCard";

const reviews = [
  { name: "Sarah M.", text: "Amazing quality and style!", rating: 5 },
  { name: "Alex K.", text: "Perfect fit for my personal style.", rating: 4 },
  { name: "James L.", text: "Trendy and affordable collection!", rating: 5 },
  { name: "Monica R.", text: "Love the variety they offer!", rating: 4 },
];

const ReviewStrip: FC = () => {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  return (
    <section className="my-12 max-w-7xl mx-auto px-4 pb-0">
      {/* header row: title left, nav buttons right */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">OUR HAPPY CUSTOMERS</h2>
        <div className="flex gap-3">
          <button
            ref={prevRef}
            aria-label="Previous review"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 transition"
          >
            ‹
          </button>
          <button
            ref={nextRef}
            aria-label="Next review"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 transition"
          >
            ›
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation]}
        loop={true}
        spaceBetween={20}
        slidesPerView={1.2}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3.2 },
        }}
        grabCursor
        // ensure swiper picks up the button refs
        onBeforeInit={(swiper) => {
          // assign the refs to swiper navigation params before init
          // TS-ignore because Swiper's types are narrow here
          // @ts-ignore
          swiper.params.navigation.prevEl = prevRef.current;
          // @ts-ignore
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        // still give navigation so Swiper will initialize its navigation module
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
      >
        {reviews.map((r, i) => (
          <SwiperSlide key={i} className="flex items-stretch">
            <div className="h-full">
              <ReviewCard {...r} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default ReviewStrip;
