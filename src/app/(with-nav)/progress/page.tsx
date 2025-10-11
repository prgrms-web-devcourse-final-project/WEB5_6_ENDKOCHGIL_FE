'use client';
import ContentWrapper from '@/components/layout/ContentWrapper';
import ProgressCard from './components/ProgressCard';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { fetchMyPartiesWithStatus } from '@/lib/api/parties/parties';

export default function Page() {
  type Party = {
    id: string | number;
    name: string;
    category?: string;
    missionTitle?: string;
    missionIsCompleted?: boolean;
    current?: number;
    currentMembers?: number;
    max?: number;
    maxMembers?: number;
    myStatus?: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'LEFT';
    members?: { id?: number; name?: string; status?: string }[];
  };

  const [myParties, setMyParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'ongoing' | 'done'>('ongoing');

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        // 탭에 따라 서버-결과를 members.status 기준으로 필터한 리스트를 받음
        const list = await fetchMyPartiesWithStatus(tab === 'ongoing' ? 'ongoing' : 'done');
        if (!mounted) return;
        setMyParties(list as unknown as Party[]);
      } catch (e) {
        console.error('내 파티 조회 실패', e);
        if (mounted) setMyParties([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [tab]);

  // 이제 filtered는 이미 탭 기준으로 필터된 myParties 사용
  const filtered = myParties;

  const average = useMemo(() => {
    if (!filtered.length) return 0;
    let sum = 0;
    let count = 0;
    for (const it of filtered) {
      const max = it.max ?? it.maxMembers ?? 100;
      const current = it.current ?? it.currentMembers ?? 0;
      if (max > 0) {
        sum += Math.min(1, Math.max(0, current / max));
        count++;
      }
    }
    return count ? Math.round((sum / count) * 100) : 0;
  }, [filtered]);

  return (
    <ContentWrapper withNav className="relative overflow-hidden z-0">
      <div className="min-h-screen">
        {/* 상단 요약 */}
        <div className="flex justify-center items-center gap-4 relative min-h-[130px]">
          <Image
            src="/images/cheerup.png"
            alt="다람쥐 응원"
            width={120}
            height={120}
            className="object-contain flex-shrink-0"
          />

          {tab === 'ongoing' ? (
            <div className="text-center w-[280px]">
              <p className="text-lg text-basic-black leading-relaxed">
                이번주 평균 달성률은{' '}
                <strong className="text-orange-main">{average}%</strong>
              </p>
              <p className="text-lg text-basic-black leading-relaxed">
                조금만 더 힘내볼까요?🔥
              </p>
            </div>
          ) : (
            <div className="text-center w-[280px]">
              <p className="text-lg text-basic-black leading-relaxed">
                수고하셨습니다! 🎉
              </p>
              <p className="text-lg text-basic-black leading-relaxed">
                완료된 파티들을 확인해보세요.
              </p>
              <p className="text-sm text-text-sub leading-relaxed mt-1">
                다음 목표를 준비해볼까요? 🌱
              </p>
            </div>
          )}
        </div>

        {/* 탭 버튼 */}
        <div className="flex gap-4 relative mt-4">
          <Button
            variant={tab === 'ongoing' ? 'basic' : 'unselected'}
            size="md"
            fullWidth
            onClick={() => setTab('ongoing')}
          >
            진행중
          </Button>
          <Button
            variant={tab === 'done' ? 'basic' : 'unselected'}
            size="md"
            fullWidth
            onClick={() => setTab('done')}
          >
            완료
          </Button>
        </div>

        {/* 리스트 렌더링 */}
        <div className="mt-3 relative flex flex-col gap-y-3 pb-24 z-20">
          {loading ? (
            <div className="text-sm text-text-sub">로딩 중...</div>
          ) : filtered.length === 0 ? (
            <div className="text-sm text-gray-500 text-center">
              {tab === 'ongoing'
                ? '진행 중인 파티가 없습니다.'
                : '완료된 파티가 없습니다.'}
            </div>
          ) : (
            filtered.map(i => (
              <ProgressCard
                key={i.id}
                id={i.id}
                title={i.name}
                tag={i.category}
                subtitle={i.missionTitle ?? ''}
                current={i.current ?? i.currentMembers ?? 0}
                max={i.max ?? i.maxMembers ?? 100}
                compact={tab === 'done'}
              />
            ))
          )}
        </div>
      </div>

      {/* 하단 이미지: 뷰포트 기준으로 고정 */}
      <div className="absolute bottom-0 right-0 pointer-events-none z-0">
        <div
          className="pointer-events-none w-[500px] min-w-[500px] max-w-[600px]"
          style={{ transform: 'translateX(8%)' }}
        >
          <Image
            src="/images/sleep.png"
            alt="다람쥐"
            width={500}
            height={500}
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </ContentWrapper>
  );
}
