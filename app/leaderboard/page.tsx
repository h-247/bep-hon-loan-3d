'use client';

import React from 'react';
import Link from 'next/link';

const MOCK_LEADERBOARDS = [
  { rank: 1, name: 'Đội Bếp Thần Tốc', players: 4, score: 3250, stars: 3, level: 'Thế giới 1-5' },
  { rank: 2, name: 'Siêu Cấp Nấu Ăn', players: 2, score: 2980, stars: 3, level: 'Thế giới 1-4' },
  { rank: 3, name: 'Master Chef VN', players: 1, score: 2450, stars: 3, level: 'Thế giới 1-3' },
  { rank: 4, name: 'Biệt Đội Xúc Xích', players: 6, score: 2100, stars: 3, level: 'Thế giới 2-1' },
  { rank: 5, name: 'Bếp Trưởng Mèo', players: 2, score: 1850, stars: 2, level: 'Thế giới 1-2' },
];

export default function LeaderboardPage() {
  return (
    <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full p-4 sm:p-6 text-[#ececec]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#3a3a3a] pb-3 mb-4">
        <Link
          href="/"
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#262626] border border-[#3a3a3a] hover:bg-[#303030] text-[#ececec]"
        >
          ← Về trang chủ
        </Link>
        <h1 className="text-lg font-black text-white">Bảng xếp hạng</h1>
        <div className="w-16" />
      </div>

      <div className="flex flex-col gap-2.5">
        {MOCK_LEADERBOARDS.map((entry) => (
          <div
            key={entry.rank}
            className="bg-[#262626] border border-[#3a3a3a] rounded-2xl p-4 flex items-center justify-between shadow"
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                  entry.rank === 1
                    ? 'bg-[#eab308] text-black'
                    : entry.rank === 2
                    ? 'bg-neutral-300 text-black'
                    : entry.rank === 3
                    ? 'bg-amber-700 text-white'
                    : 'bg-[#1a1a1a] text-[#a3a3a3]'
                }`}
              >
                {entry.rank}
              </span>
              <div>
                <h3 className="text-sm font-black text-white">{entry.name}</h3>
                <span className="text-[11px] text-[#a3a3a3]">
                  {entry.level} • {entry.players} người chơi
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-sm font-black text-white">{entry.score} đ</span>
              <span className="text-xs text-[#eab308]">★★★</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
