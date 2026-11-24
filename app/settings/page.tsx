'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { soundManager } from '@/src/game/audio/SoundManager';

export default function SettingsPage() {
  const [masterVol, setMasterVol] = useState(80);
  const [musicVol, setMusicVol] = useState(60);
  const [sfxVol, setSfxVol] = useState(90);
  const [sensitivity, setSensitivity] = useState(100);
  const [graphicsQuality, setGraphicsQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [leftHanded, setLeftHanded] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    soundManager.setVolumes(masterVol / 100, sfxVol / 100, musicVol / 100);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

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
        <h1 className="text-lg font-black text-white">Cài đặt</h1>
        <div className="w-16" />
      </div>

      <div className="flex flex-col gap-4">
        {/* Audio Settings */}
        <div className="bg-[#262626] border border-[#3a3a3a] rounded-2xl p-4 flex flex-col gap-3 shadow">
          <h2 className="text-sm font-black text-white">ÂM THANH</h2>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs text-[#a3a3a3]">
              <span>Âm lượng tổng</span>
              <span>{masterVol}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={masterVol}
              onChange={(e) => setMasterVol(parseInt(e.target.value))}
              className="w-full accent-white"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs text-[#a3a3a3]">
              <span>Nhạc nền</span>
              <span>{musicVol}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={musicVol}
              onChange={(e) => setMusicVol(parseInt(e.target.value))}
              className="w-full accent-white"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs text-[#a3a3a3]">
              <span>Hiệu ứng âm thanh (SFX)</span>
              <span>{sfxVol}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={sfxVol}
              onChange={(e) => setSfxVol(parseInt(e.target.value))}
              className="w-full accent-white"
            />
          </div>
        </div>

        {/* Graphics Quality Preset */}
        <div className="bg-[#262626] border border-[#3a3a3a] rounded-2xl p-4 flex flex-col gap-3 shadow">
          <h2 className="text-sm font-black text-white">ĐỒ HỌA 3D</h2>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'low', label: 'Thấp' },
              { id: 'medium', label: 'Trung bình' },
              { id: 'high', label: 'Cao' },
            ].map((preset) => (
              <button
                key={preset.id}
                onClick={() => setGraphicsQuality(preset.id as any)}
                className={`py-2.5 rounded-xl text-xs font-bold border transition ${
                  graphicsQuality === preset.id
                    ? 'bg-white text-black border-white shadow'
                    : 'bg-[#1a1a1a] text-[#a3a3a3] border-[#3a3a3a]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Controls Settings */}
        <div className="bg-[#262626] border border-[#3a3a3a] rounded-2xl p-4 flex flex-col gap-3 shadow">
          <h2 className="text-sm font-black text-white">ĐIỀU KHIỂN CẢM ỨNG</h2>

          <div className="flex justify-between items-center py-1">
            <div>
              <div className="text-xs font-bold text-white">Chế độ tay trái</div>
              <div className="text-[11px] text-[#a3a3a3]">Đảo vị trí cần điều khiển sang bên phải</div>
            </div>
            <button
              onClick={() => setLeftHanded(!leftHanded)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                leftHanded ? 'bg-[#22c55e]' : 'bg-[#1a1a1a] border border-[#3a3a3a]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                  leftHanded ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-3.5 rounded-2xl bg-white text-black font-black text-sm active:scale-95 transition shadow hover:bg-neutral-100"
        >
          {saved ? '✓ Đã lưu cài đặt!' : 'Lưu cài đặt'}
        </button>
      </div>
    </div>
  );
}
