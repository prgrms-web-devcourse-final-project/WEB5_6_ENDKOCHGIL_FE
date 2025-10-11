'use client';

import React, { useEffect, useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { fetchPartyDetailClient } from '@/lib/api/parties/parties';
import { getMyInfo } from '@/lib/api/member';

type Member = {
  id?: number; // 변경: id를 optional로 허용
  name: string;
  subtitle?: string;
  crowned?: boolean;
};

export default function PartyDetailClient({ partyId }: { partyId: string }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [messages, setMessages] = useState([
    { id: 'm1', author: '성창식', text: '안녕하세요 \\(^o^)/' },
    { id: 'm2', author: '김태은', text: '안녕못해요' },
    { id: 'm3', author: '이성균', text: '메이플 하고싶다' },
    { id: 'm4', author: '이성균', text: '칼바람 하고싶다' },
    { id: 'm5', author: '박철현', text: '핑크빈 귀여워' }
  ]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const [currentUser, setCurrentUser] = useState<string>('');

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      setError(null);

      try {
        const detail = await fetchPartyDetailClient(partyId);
        console.log('파티 상세 응답:', detail); // ← 이 줄 추가

        if (!mounted) return;

        const leaderId = detail.leaderId;
        const rawMembers = detail.members ?? [];

        const mappedMembers: Member[] = rawMembers
          .map((m) => ({
            id: typeof m.id === 'number' ? m.id : undefined,
            name: m.name ?? `회원 ${m.id ?? ''}`,
            subtitle: m.email ?? undefined,
            crowned: leaderId === m.id,
          }))
          // id가 반드시 필요하면 필터 (옵션) — 현재는 optional 허용하므로 필터 안함
          ;

        setMembers(mappedMembers);
      } catch {
        setError('파티 상세 정보를 불러오는 데 실패했습니다.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [partyId]);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight });
  }, []);

  useEffect(() => {
    (async () => {
      // accessToken을 undefined로 명시적으로 전달
      const me = await getMyInfo(undefined);
      setCurrentUser(me?.name ?? me?.email ?? '');
    })();
  }, []);

  const handleSend = () => {
    if (!text.trim()) return;
    setMessages(s => [
      ...s,
      { id: String(Date.now()), author: currentUser, text: text.trim() }
    ]);
    setText('');
    setTimeout(
      () =>
        messagesRef.current?.scrollTo({
          top: messagesRef.current.scrollHeight
        }),
      50
    );
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      {/* 멤버 그리드 */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {members.map((m) => (
          <div
            key={m.id ?? m.name} // id 없을 때는 name으로 대체
            className="relative rounded-lg bg-basic-white p-3 flex flex-col items-center text-center shadow-sm"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center mb-2">
              <span className="text-base font-semibold text-gray-08">
                {(m.name && m.name.length > 0 ? m.name.charAt(0) : '?')}
                <br />(이미지)
              </span>
            </div>
            <div className="text-xs text-gray-05">{m.subtitle}</div>
            <div className="text-sm text-gray-10 font-medium">{m.name}</div>
            {m.crowned && (
              <div className="absolute left-2 top-2">
                <Image src="/crown.svg" alt="왕관" width={28} height={28} />
              </div>
            )}
          </div>
        ))}
        {/* 빈 슬롯 */}
        <div className="rounded-lg bg-basic-white p-3 flex items-center justify-center text-2xl text-gray-300">
          <Image src="/not.svg" alt="빈 슬롯" width={80} height={80} />
        </div>
      </div>

      {/* 파티 계획 버튼 */}
      <div className="mb-4">
        <Button
          variant="basic"
          size="md"
          fullWidth
          onClick={() => alert('파티 계획 클릭')}
        >
          파티 계획
        </Button>
      </div>

      {/* 채팅 박스 */}
      <div className="rounded-xl bg-basic-white p-3">
        <div
          ref={messagesRef}
          className="h-40 overflow-auto p-2 space-y-2 scrollbar scrollbar-thin scrollbar-thumb-orange-nuts scrollbar-track-[rgba(0,0,0,0.04)]"
        >
          {messages.map(m => {
            const isMine = m.author === currentUser;
            return (
              <div key={m.id} className="text-sm">
                <span
                  className={`font-medium ${
                    isMine ? 'text-[#E98E3E]' : 'text-gray-700'
                  }`}
                >
                  {isMine ? '나' : m.author} :{' '}
                </span>
                <span className={isMine ? 'text-[#E98E3E]' : 'text-gray-700'}>
                  {m.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3">
        <div className="relative rounded-xl bg-basic-white focus-within:ring-2 focus-within:ring-orange-nuts">
          <div className="flex items-center gap-2 px-3 py-2">
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="채팅을 입력해 주세요"
              className="flex-1 bg-transparent outline-none"
              onKeyDown={e => {
                if (e.key === 'Enter') handleSend();
              }}
            />
            <button onClick={handleSend} > </button>
          </div>
        </div>
      </div>

      {/* 하단 알림 배너*/}
    </div>
  );
}
