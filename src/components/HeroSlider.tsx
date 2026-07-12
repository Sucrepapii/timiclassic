'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from '../app/slider.module.css';

interface SlideItem {
  id: string;
  image: string;
  title: string;
  name: string;
  description: string;
}

export const initialSlides: SlideItem[] = [
  {
    id: '1',
    image: '/dresses/dress_gold.png',
    title: 'COUTURE',
    name: 'GOLDEN GOWN',
    description: 'A stunning, ultra-realistic high-fashion golden bespoke gown. Crafted with precision for the modern runway.'
  },
  {
    id: '2',
    image: '/dresses/dress_red.png',
    title: 'BESPOKE',
    name: 'RUBY VELVET',
    description: 'Deep ruby red velvet couture dress. Designed with elegant poses and luxurious draping for the ultimate statement.'
  },
  {
    id: '3',
    image: '/dresses/dress_black.png',
    title: 'MODERN',
    name: 'OBSIDIAN',
    description: 'Sleek black obsidian modern dress with diamond accents. Dramatic shadows meet high-end cinematic luxury.'
  },
  {
    id: '4',
    image: '/dresses/dress_emerald.png',
    title: 'ELEGANCE',
    name: 'EMERALD SILK',
    description: 'Emerald green silk dress with flowing fabric. A premium aesthetic with dramatic, fluid lines.'
  }
];

export default function HeroSlider({ showText = true }: { showText?: boolean }) {
  const [slides, setSlides] = useState<SlideItem[]>(initialSlides);
  const [animType, setAnimType] = useState<'next' | 'prev' | null>(null);
  const [timeAnimKey, setTimeAnimKey] = useState<number>(0);
  
  const timeRunning = 3000;
  const timeAutoNext = 7000;
  
  const autoNextTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetAutoNext = useCallback(() => {
    if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
    autoNextTimeoutRef.current = setTimeout(() => {
      handleNext();
    }, timeAutoNext);
  }, []);

  const handleNext = useCallback(() => {
    setSlides((prev) => {
      const newSlides = [...prev];
      const first = newSlides.shift();
      if (first) newSlides.push(first);
      return newSlides;
    });
    setAnimType('next');
    setTimeAnimKey(k => k + 1);

    if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    animTimeoutRef.current = setTimeout(() => {
      setAnimType(null);
    }, timeRunning);

    resetAutoNext();
  }, [resetAutoNext]);

  const handlePrev = useCallback(() => {
    setSlides((prev) => {
      const newSlides = [...prev];
      const last = newSlides.pop();
      if (last) newSlides.unshift(last);
      return newSlides;
    });
    setAnimType('prev');
    setTimeAnimKey(k => k + 1);

    if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    animTimeoutRef.current = setTimeout(() => {
      setAnimType(null);
    }, timeRunning);

    resetAutoNext();
  }, [resetAutoNext]);

  useEffect(() => {
    resetAutoNext();
    return () => {
      if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    };
  }, [resetAutoNext]);

  return (
    <div className={`${styles.carousel} ${animType === 'next' ? styles.next : animType === 'prev' ? styles.prev : ''}`}>
      <div className={styles.list}>
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={styles.item}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            {showText && (
              <div className={styles.content}>
                <div className={styles.title}>{slide.title}</div>
                <div className={styles.name}>{slide.name}</div>
                <div className={styles.des}>{slide.description}</div>
                <div className={styles.btn}>
                  <button>See More</button>
                  <button>Book Fitting</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.arrows}>
        <button className={styles.prev} onClick={handlePrev}>{'<'}</button>
        <button className={styles.next} onClick={handleNext}>{'>'}</button>
      </div>

      <div 
        key={timeAnimKey} 
        className={`${styles.timeRunning} ${styles.active}`} 
        style={{ animationDuration: `${timeAutoNext}ms` }}
      />
    </div>
  );
}
