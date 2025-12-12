// src/components/Carousel/Carousel.jsx
import React, { useRef, useState, useEffect } from "react";
import styles from "./Carousel.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import NavLeft from "./NavLeft";
import NavRight from "./NavRight";

export default function Carousel({ items = [], renderItem, className = "" }) {
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const breakpoints = {
    1200: { slidesPerView: 4, spaceBetween: 20 },
    900: { slidesPerView: 3, spaceBetween: 18 },
    600: { slidesPerView: 2, spaceBetween: 16 },
    0: { slidesPerView: 1, spaceBetween: 12 },
  };

  useEffect(() => {
    setIsBeginning(true);
    setIsEnd(items.length === 0);
  }, [items]);

  if (!renderItem) return null;

  return (
    <div className={`${styles.carouselWrapper} ${className}`}>
      {!isBeginning && (
        <div className={styles.navLeft}>
          <NavLeft onClick={() => swiperRef.current?.slidePrev()} />
        </div>
      )}

      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={() => {
          if (!swiperRef.current) return;
          setIsBeginning(swiperRef.current.isBeginning);
          setIsEnd(swiperRef.current.isEnd);
        }}
        breakpoints={breakpoints}
        slidesPerView={1}
        spaceBetween={12}
      >
        {items.map((item, idx) => (
          <SwiperSlide key={item.id ?? idx} className={styles.slide}>
            {renderItem(item, idx)}
          </SwiperSlide>
        ))}
      </Swiper>

      {!isEnd && (
        <div className={styles.navRight}>
          <NavRight onClick={() => swiperRef.current?.slideNext()} />
        </div>
      )}
    </div>
  );
}
