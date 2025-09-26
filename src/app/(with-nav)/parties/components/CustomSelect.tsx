'use client';

import React, { useEffect, useRef, useState } from 'react';

type Option = { label: string; value: string };

export default function CustomSelect({
  value,
  onChangeAction,
  options,
  placeholder = ''
}: {
  value: string;
  onChangeAction: (v: string) => void;
  options: Option[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? placeholder;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(s => !s)}
        className="flex items-center justify-between w-28 px-4 py-2 rounded-full bg-basic-white border border-gray-03 shadow-sm text-sm cursor-pointer hover:border-gray-04"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{selectedLabel}</span>
          <svg className="w-4 h-4 ml-2" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden >
            <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          tabIndex={-1}
          className="absolute z-50 mt-2 min-w-26 bg-basic-white rounded-xl shadow-lg border border-gray-03 overflow-hidden"
        >
          {options.map(opt => (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => {
                  onChangeAction(opt.value);
                  setOpen(false);
                }}
                className="w-full text-center px-4 py-3 hover:bg-gray-02 text-sm"
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
