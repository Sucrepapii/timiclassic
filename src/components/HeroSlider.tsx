'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from '../app/slider.module.css';
import BookFittingModal from './BookFittingModal';
import ViewDetailsModal from './ViewDetailsModal';

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
    image: '/dresses/couture-1.jpg',
    title: 'COUTURE',
    name: 'ETHEREAL ELEGANCE',
    description: 'A long-sleeve white lace gown featuring delicate floral patterns and a graceful silhouette. Perfect for a breathtaking entrance.'
  },
  {
    id: '2',
    image: '/dresses/couture-2.jpg',
    title: 'GLAMOUR',
    name: 'LUMINOUS GLAMOUR',
    description: 'A stunning sequined evening dress that captures the light, paired with timeless accessories for a sophisticated look.'
  },
  {
    id: '3',
    image: '/dresses/couture-3.jpg',
    title: 'DETAILS',
    name: 'PEARL WHISPERS',
    description: 'Intricate floral lace detailing with subtle beadwork and pearls, exuding timeless sophistication and unmatched craftsmanship.'
  },
  {
    id: '4',
    image: '/dresses/couture-4.jpg',
    title: 'BRIDAL',
    name: 'VEILED MYSTERY',
    description: 'A classic bridal look featuring a delicate tulle veil that emphasizes soft beauty, grace, and eternal elegance.'
  },
  {
    id: '5',
    image: '/dresses/couture-5.jpg',
    title: 'SERENITY',
    name: 'OCEAN SERENADE',
    description: 'A breathtaking lace gown embellished with pearls, perfectly contrasting with the natural coastal backdrop for a dramatic statement.'
  },
  {
    id: '17',
    image: '/dresses/couture-6.jpg',
    title: 'GARDEN',
    name: 'GARDEN OF GRACE',
    description: 'A majestic white satin wedding gown styled against a botanical backdrop. Designed to evoke pure grace, harmony, and timeless bridal majesty.'
  },
  {
    id: '18',
    image: '/dresses/couture-7.jpg',
    title: 'HERITAGE',
    name: 'SAPPHIRE HERITAGE',
    description: 'A stunning royal blue traditional ensemble featuring modern structural lines and rich texture, paired with a matching headtie for ultimate cultural elegance.'
  }
];

export const allSlides: SlideItem[] = [
  ...initialSlides,
  {
    id: '6',
    image: '/dresses/couture-2 (6).jpeg',
    title: 'ROMANCE',
    name: 'MIDNIGHT BLOOM',
    description: 'An enchanting dress with dark floral undertones and sweeping skirts, perfect for an evening of romantic allure.'
  },
  {
    id: '7',
    image: '/dresses/couture-2 (7).jpeg',
    title: 'VINTAGE',
    name: 'ROYAL HERITAGE',
    description: 'Vintage-inspired cuts combined with modern fabric technology to create a gown fit for royalty.'
  },
  {
    id: '8',
    image: '/dresses/couture-2 (8).jpeg',
    title: 'ELEGANCE',
    name: 'SILK ILLUSION',
    description: 'A masterclass in draping and form, this silk masterpiece moves like liquid magic with every step.'
  },
  {
    id: '9',
    image: '/dresses/couture-2 (9).jpeg',
    title: 'MODERN',
    name: 'SCULPTED BEAUTY',
    description: 'Clean lines and architectural structure make this modern gown a striking work of contemporary art.'
  },
  {
    id: '10',
    image: '/dresses/couture-2 (10).jpeg',
    title: 'WHIMSICAL',
    name: 'STARLIGHT DREAMS',
    description: 'Delicate beadwork that mimics a starry night sky, bringing a touch of whimsical magic to couture.'
  },
  {
    id: '11',
    image: '/dresses/couture-2 (11).jpeg',
    title: 'CLASSIC',
    name: 'TIMELESS CHARM',
    description: 'Embracing classic silhouettes with luxurious fabrics, a dress that will be remembered for generations.'
  },
  {
    id: '12',
    image: '/dresses/couture-2 (12).jpeg',
    title: 'BOLD',
    name: 'CRIMSON MAJESTY',
    description: 'A bold statement piece that commands attention, featuring exquisite tailoring and unforgettable details.'
  },
  {
    id: '13',
    image: '/dresses/couture-2 (13).JPEG',
    title: 'DRAMA',
    name: 'OPULENT CASCADE',
    description: 'Cascading layers of premium fabric create dramatic volume and spectacular movement.'
  },
  {
    id: '14',
    image: '/dresses/couture-2 (14).jpeg',
    title: 'ALLURE',
    name: 'WHISPERING SILHOUETTE',
    description: 'A form-fitting masterpiece that celebrates the natural curves with elegant restraint and perfect balance.'
  },
  {
    id: '15',
    image: '/dresses/couture-2 (1).PNG',
    title: 'VISIONARY',
    name: 'CRYSTAL SYMPHONY',
    description: 'A harmonious blend of crystal embellishments and sheer panels for a truly visionary aesthetic.'
  },
  {
    id: '16',
    image: '/dresses/couture-2 (2).PNG',
    title: 'GRACE',
    name: 'FLORAL SYMPHONY',
    description: 'Woven with masterful embroidery, this piece tells a story of grace, beauty, and natural elegance.'
  }
];

export default function HeroSlider({ showText = true }: { showText?: boolean }) {
  const [slides, setSlides] = useState<SlideItem[]>(initialSlides);
  const [animType, setAnimType] = useState<'next' | 'prev' | null>(null);
  const [timeAnimKey, setTimeAnimKey] = useState<number>(0);
  
  const [isBookFittingOpen, setIsBookFittingOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [selectedDress, setSelectedDress] = useState<SlideItem | null>(null);

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
                  <button onClick={() => {
                    setSelectedDress(slide);
                    setIsViewDetailsOpen(true);
                  }}>See More</button>
                  <button onClick={() => {
                    setSelectedDress(slide);
                    setIsBookFittingOpen(true);
                  }}>Book Fitting</button>
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
