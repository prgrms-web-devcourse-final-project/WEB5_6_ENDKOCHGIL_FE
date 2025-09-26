'use client';

import React from 'react';
import Tag, { type Variant as TagVariant } from '@/components/ui/Tag';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

type Item = {
  id: number;
  name: string;
  category?: string;
  startAt?: string;
  endAt?: string;
};

// 백엔드 variant 키를 그대로 쓰는 경우 바로 전달
function mapLabel(cat?: string) {
  if (!cat) return '기타';
  const s = cat.toLowerCase();
  if (s.includes('care')) return '멘탈 케어';
  if (s.includes('habit')) return '생활 습관';
  if (s.includes('study')) return '학습';
  if (s.includes('exercise') || s.includes('activity') || s.includes('exer')) return '운동';
  return '기타';
}

export default function HotCarousel({ items }: { items: Item[] }) {
  if (!items || items.length === 0) return null;

  // 한 슬라이드에 2개씩 보여주기: 슬라이드 내부에 2개 카드 배치
  const itemsPerSlide = 2;
  const slides: Item[][] = [];
  for (let i = 0; i < items.length; i += itemsPerSlide) slides.push(items.slice(i, i + itemsPerSlide));

  return (
    <div className="w-full">
      <Swiper
        modules={[Autoplay]}
        slidesPerView={1}
        pagination={false}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={slides.length > 1}
      >
        {slides.map((group, idx) => (
          <SwiperSlide key={idx}>
            <div className="flex gap-3">
              {group.map(it => (
                <div key={it.id} className="flex-1">
                  <div className="rounded-xl bg-bg-card-default p-4 h-28 flex flex-col justify-between shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <Tag
                        variant={(it.category as TagVariant) ?? 'etc'}
                        size="sm"
                      >
                        {mapLabel(it.category)}
                      </Tag>
                    </div>
                    <h4 className="font-semibold text-base mb-1">{it.name}</h4>
                    <p className="text-sm text-[var(--color-text-sub)]">
                      {it.startAt
                        ? `${new Date(it.startAt).toLocaleDateString()}`
                        : ''}{' '}
                      &nbsp;~&nbsp;
                      {it.endAt
                        ? `${new Date(it.endAt).toLocaleDateString()}`
                        : ''}
                    </p>
                  </div>
                </div>
              ))}
              {group.length < itemsPerSlide && <div className="flex-1" />}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
