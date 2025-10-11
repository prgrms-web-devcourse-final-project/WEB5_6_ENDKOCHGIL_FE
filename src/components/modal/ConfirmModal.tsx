'use client';

import BaseModal from './BaseModal';
import Image from 'next/image';
import Button from '../ui/Button';

interface Props {
  open: boolean;
  lines: string[];
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'sad' | 'happy';
  imageSrc?: string;
}

function ConfirmModal({
  open,
  lines = [],
  onConfirm,
  onCancel,
  confirmText = '확인',
  cancelText = '취소',
  variant = 'sad',
  imageSrc
}: Props) {
  const resolvedImage =
    imageSrc ||
    (variant === 'happy' ? '/images/happy-nuts.png' : '/images/sad-nuts.png');

  // 버튼 개수에 따라 그리드 컬럼 조정
  const buttonColClass = cancelText ? 'grid-cols-2' : 'grid-cols-1';

  return (
    <BaseModal isOpen={open} onClose={onCancel}>
      {/* 이미지 */}
      <div className="mx-auto w-[70px] h-[70px] relative">
        <Image
          src={resolvedImage}
          alt=""
          fill
          className="object-contain select-none"
        />
      </div>

      {/* 본문 */}
      {lines.length > 0 && (
        <div className="mt-3 text-center font-semibold leading-normal text-gray-08">
          {lines.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      )}

      {/* 버튼 영역 */}
      <div className={`mt-3 grid ${buttonColClass} gap-5`}>
        {cancelText && (
          <Button
            type="button"
            onClick={onCancel}
            variant="cancel"
            size="md"
            fullWidth
          >
            {cancelText}
          </Button>
        )}

        <Button
          type="button"
          onClick={onConfirm}
          variant="basic"
          size="md"
          fullWidth
        >
          {confirmText}
        </Button>
      </div>
    </BaseModal>
  );
}

export default ConfirmModal;
