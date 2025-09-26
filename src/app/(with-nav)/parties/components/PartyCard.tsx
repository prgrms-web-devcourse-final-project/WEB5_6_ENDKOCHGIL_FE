'use client';

import Button from '@/components/ui/Button';
import Tag from '@/components/ui/Tag';
import React from 'react';

export default function PartyCard({
  category,
  title,
  startAt,
  endAt,
  people
}: {
  category?: string;
  isPublic?: boolean;
  title: string;
  startAt?: string;
  endAt?: string;
  people?: string;
}) {
  // Variant 키(study|exercise|habit|care|etc)를 우선 허용하고,
  // 한글/문구가 들어올 경우 기존 매핑으로 처리
  const VALID_VARIANTS = ['care', 'habit', 'study', 'exercise', 'etc'] as const;
  const mapTag = (t?: string) => {
    if (!t) return 'etc' as const;
    const s = t.replace(/\s+/g, '').toLowerCase();
    if ((VALID_VARIANTS as readonly string[]).includes(s)) {
      return s as (typeof VALID_VARIANTS)[number];
    }
    if (s.includes('운동')) return 'exercise' as const;
    if (s.includes('학습')) return 'study' as const;
    if (s.includes('생활')) return 'habit' as const;
    if (s.includes('멘탈') || s.includes('케어')) return 'care' as const;
    return 'etc' as const;
  };

  // variant 키(study/exercise/...)가 들어오면 한글 라벨로 변환해서 보여주기
  const variantToKorean = (t?: string) => {
    if (!t) return '기타';
    const s = t.replace(/\s+/g, '').toLowerCase();
    const map: Record<string, string> = {
      care: '멘탈 케어',
      habit: '생활 습관',
      study: '학습',
      exercise: '운동',
      etc: '기타'
    };
    if ((VALID_VARIANTS as readonly string[]).includes(s)) return map[s];
    // 이미 한글로 온 경우 원본 문자열 그대로 반환
    return t;
  };

  // 시작일 포맷: "2025년 9월 21일"
  const formatKoreanDate = (iso?: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  // 시작/종료일로 총 기간(주) 계산 — inclusive 기준, 7일 = 1주
  const calcWeeks = (sIso?: string, eIso?: string) => {
    if (!sIso || !eIso) return null;
    const s = new Date(sIso);
    const e = new Date(eIso);
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return null;
    const msPerDay = 1000 * 60 * 60 * 24;
    const days = Math.round((e.getTime() - s.getTime()) / msPerDay) + 1;
    return Math.max(1, Math.ceil(days / 7));
  };

  const startText = formatKoreanDate(startAt);
  const weeks = calcWeeks(startAt, endAt);

  return (
    <article className="rounded-2xl bg-bg-card-default p-4 shadow-sm border border-transparent">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-basic-black">
                {title}
              </span>
              {/* Tag 컴포넌트로 카테고리 표시 */}
              <Tag variant={mapTag(category)} size="md">
                {variantToKorean(category)}
              </Tag>
            </div>
            <div className="text-sm text-gray-08">인원 {people} 명</div>
          </div>

          <p className="text-md text-gray-08 mt-2">
            시작일 : {startText || '정보 없음'}
          </p>
          <p className="text-md text-gray-08 mt-1">
            기간 : {weeks}주
          </p>

          <div className="mt-4 flex gap-3">
            <Button variant="detail" size="md">
              자세히
            </Button>
            <Button variant="basic" size="md" className="rounded-full">
              참여하기
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
