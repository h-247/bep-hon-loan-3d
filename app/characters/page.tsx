'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CHARACTERS, CharacterDefinition } from '@/src/game/characters/CharacterCatalog';

export default function CharactersPage() {
  const [selectedCharId, setSelectedCharId] = useState<string>('chef_cat');
  const selectedChar = CHARACTERS.find((c) => c.id === selectedCharId) || CHARACTERS[0];

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
        <h1 className="text-lg font-black text-white">Đầu bếp ({CHARACTERS.length})</h1>
        <div className="w-16" />
      </div>

      {/* Selected Character Showcase Card */}
      <div className="bg-[#262626] border border-[#3a3a3a] rounded-3xl p-5 mb-5 flex flex-col sm:flex-row items-center gap-5 shadow-xl">
        {/* Character Visual Avatar */}
        <div
          style={{ backgroundColor: selectedChar.primaryColor }}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white/20 flex items-center justify-center text-4xl sm:text-5xl shadow-inner shrink-0"
        >
          {selectedChar.modelKey.includes('cat') && '🐱'}
          {selectedChar.modelKey.includes('panda') && '🐼'}
          {selectedChar.modelKey.includes('fox') && '🦊'}
          {selectedChar.modelKey.includes('owl') && '🦉'}
          {selectedChar.modelKey.includes('piglet') && '🐷'}
          {selectedChar.modelKey.includes('penguin') && '🐧'}
          {selectedChar.modelKey.includes('dragon') && '🐲'}
          {selectedChar.modelKey.includes('bunny') && '🐰'}
          {selectedChar.modelKey.includes('human') && '👨‍🍳'}
        </div>

        <div className="flex flex-col gap-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-black text-white">{selectedChar.nameVi}</h2>
            <span className="text-[11px] bg-[#1a1a1a] px-2 py-0.5 rounded border border-[#3a3a3a] text-[#a3a3a3]">
              {selectedChar.speciesVi}
            </span>
          </div>
          <p className="text-xs text-[#ececec]">{selectedChar.descriptionVi}</p>
          <div className="text-[11px] text-[#22c55e] font-semibold mt-1">
            Mở khóa: {selectedChar.unlockConditionVi}
          </div>
        </div>
      </div>

      {/* 12 Characters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CHARACTERS.map((char) => {
          const isSelected = char.id === selectedCharId;
          return (
            <button
              key={char.id}
              onClick={() => setSelectedCharId(char.id)}
              className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 text-center transition active:scale-95 shadow ${
                isSelected
                  ? 'bg-white text-black border-white shadow-xl'
                  : 'bg-[#262626] text-[#ececec] border-[#3a3a3a] hover:bg-[#303030]'
              }`}
            >
              <div
                style={{ backgroundColor: char.primaryColor }}
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl border-2 border-white/20 shadow-sm"
              >
                {char.modelKey.includes('cat') && '🐱'}
                {char.modelKey.includes('panda') && '🐼'}
                {char.modelKey.includes('fox') && '🦊'}
                {char.modelKey.includes('owl') && '🦉'}
                {char.modelKey.includes('piglet') && '🐷'}
                {char.modelKey.includes('penguin') && '🐧'}
                {char.modelKey.includes('dragon') && '🐲'}
                {char.modelKey.includes('bunny') && '🐰'}
                {char.modelKey.includes('human') && '👨‍🍳'}
              </div>
              <span className="text-xs font-black truncate w-full">{char.nameVi}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
