'use client';

import ExperienceBar from '@/components/ui/ExperienceBar';
import React, { useRef, useState, useEffect } from 'react';
import Tag from '@/components/ui/Tag';
import { mapTag, variantToKorean } from '@/lib/tag';
import { useRouter } from 'next/navigation';

export default function ProgressCard({
  id,
  title,
  tag,
  subtitle,
  current = 0,
  max = 100,
  compact = false
}: {
  id?: number | string;
  title: string;
  tag?: string;
  subtitle?: string;
  current?: number;
  max?: number;
  compact?: boolean;
}) {
  const variant = mapTag(tag);
  const label = variantToKorean(tag);

  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const navTimer = useRef<number | null>(null);

  const handleClick = () => {
    if (id == null || String(id).trim() === '') return;
    // 시각적 반응을 위해 active 상태 잠깐 보여주고 이동
    setIsActive(true);
    if (navTimer.current) window.clearTimeout(navTimer.current);
    navTimer.current = window.setTimeout(() => {
      router.push(`/partydetail/${encodeURIComponent(String(id))}`);
    }, 120);
  };

  useEffect(() => {
    return () => {
      if (navTimer.current) window.clearTimeout(navTimer.current);
    };
  }, []);

  const handleCancelActive = () => setIsActive(false);

  // compact 모드: 제목 + 태그만 표시
  if (compact) {
    return (
      <article
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={e => {
          if ((e as React.KeyboardEvent).key === 'Enter') handleClick();
        }}
        onMouseDown={() => setIsActive(true)}
        onMouseUp={handleCancelActive}
        onMouseLeave={handleCancelActive}
        onTouchStart={() => setIsActive(true)}
        onTouchEnd={handleCancelActive}
        className="rounded-2xl bg-bg-card-default p-3 shadow-sm border border-transparent cursor-pointer focus:outline-none"
        style={{ backgroundColor: isActive ? 'var(--color-bg-card-active)' : undefined }}
      >
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-medium text-basic-black">{title}</h3>
          {tag && (
            <div>
              <Tag variant={variant} size="sm">
                {label}
              </Tag>
            </div>
          )}
        </div>
      </article>
    );
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={e => {
        if ((e as React.KeyboardEvent).key === 'Enter') handleClick();
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={handleCancelActive}
      onMouseLeave={handleCancelActive}
      onTouchStart={() => setIsActive(true)}
      onTouchEnd={handleCancelActive}
      className="rounded-2xl bg-bg-card-default p-4 shadow-md border border-transparent cursor-pointer focus:outline-none"
      style={{ backgroundColor: isActive ? 'bg-bg-card-active' : undefined }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-basic-black">{title}</h3>
        </div>
        {tag && (
          <div className="ml-auto">
            <Tag variant={variant} size="md">
              {label}
            </Tag>
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-md text-test-sub mb-2">
          {Math.round((current / Math.max(1, max)) * 100)}% 완료
        </div>
        <ExperienceBar current={current} max={max} height={8} />
      </div>

      <div className="mt-3">
          <div className="text-md text-test-sub mt-1">
            오늘의 미션 : {subtitle}
          </div>
      </div>
    </article>
  );
}
