'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { WORLDS, WorldDefinition } from '@/src/game/levels/LevelCatalog';

export default function LevelsPage() {
  const [selectedWorldId, setSelectedWorldId] = useState<number>(1);
  const currentWorld = WORLDS.find((w) => w.id === selectedWorldId) || WORLDS[0];

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
        <h1 className="text-lg font-black text-white">Chọn cấp độ</h1>
        <div className="w-16" />
      </div>

      {/* Worlds Horizontal Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar mb-4">
        {WORLDS.map((w) => (
          <button
            key={w.id}
            onClick={() => setSelectedWorldId(w.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
              selectedWorldId === w.id
                ? 'bg-white text-black shadow'
                : 'bg-[#262626] text-[#a3a3a3] hover:text-white border border-[#3a3a3a]'
            }`}
          >
            Thế giới {w.id}
          </button>
        ))}
      </div>

      {/* Current World Info */}
      <div className="bg-[#262626] border border-[#3a3a3a] rounded-2xl p-4 mb-4 shadow">
        <h2 className="text-base font-black text-white">{currentWorld.nameVi}</h2>
        <p className="text-xs text-[#a3a3a3] mt-1">{currentWorld.descriptionVi}</p>
      </div>

      {/* Levels Grid in Current World */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {currentWorld.levels.map((level) => (
          <div
            key={level.id}
            className="bg-[#262626] border border-[#3a3a3a] rounded-2xl p-4 flex flex-col justify-between gap-3 shadow hover:border-neutral-500 transition"
          >
            <div>
              <div className="flex justify-between items-start">
                <span className="text-sm font-black text-white">{level.name}</span>
                <span className="text-[10px] uppercase font-bold bg-[#1a1a1a] px-2 py-0.5 rounded border border-[#3a3a3a] text-[#eab308]">
                  {level.difficulty}
                </span>
              </div>
              <p className="text-xs text-[#a3a3a3] mt-1">{level.descriptionVi}</p>
            </div>

            <div className="flex justify-between items-center border-t border-[#3a3a3a] pt-3">
              <div className="text-xs text-[#eab308] font-bold">★★★</div>
              <Link
                href={`/play?level=${level.id}&mode=single`}
                className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs shadow hover:bg-neutral-100 active:scale-95 transition"
              >
                Chơi ngay
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
