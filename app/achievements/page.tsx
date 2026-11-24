'use client';

import React from 'react';
import Link from 'next/link';

const ACHIEVEMENTS_LIST = [
  { id: '1', title: 'Đầu bếp tập sự', desc: 'Hoàn thành cấp độ đầu tiên trong game.', icon: '🎓', unlocked: true },
  { id: '2', title: 'Đơn hàng đầu tiên', desc: 'Giao thành công 1 đơn hàng khách gọi.', icon: '📦', unlocked: true },
  { id: '3', title: 'Đầu bếp tốc độ', desc: 'Giao món ăn khi thời gian còn trên 80%.', icon: '⚡', unlocked: false },
  { id: '4', title: 'Bậc thầy phối hợp', desc: 'Đạt chuỗi combo x4 cùng đồng đội.', icon: '🤝', unlocked: false },
  { id: '5', title: 'Không để món cháy', desc: 'Hoàn thành màn chơi mà không làm cháy bếp.', icon: '🧯', unlocked: true },
  { id: '6', title: 'Vua tiền thưởng', desc: 'Thu về hơn 200 điểm tiền tip trong 1 ván.', icon: '💰', unlocked: false },
  { id: '7', title: 'Đầu bếp hoàn hảo', desc: 'Đạt 3 sao tuyệt đối ở bất kỳ màn chơi nào.', icon: '🌟', unlocked: false },
  { id: '8', title: 'Bậc thầy nhà bếp', desc: 'Mở khóa tất cả 6 thế giới ẩm thực.', icon: '👑', unlocked: false },
  { id: '9', title: 'Bộ đôi hoàn hảo', desc: 'Chơi cùng 1 bạn qua chế độ 2 người chơi.', icon: '👫', unlocked: false },
  { id: '10', title: 'Đội hình tám đầu bếp', desc: 'Tham gia ván đấu trực tuyến đủ 8 người.', icon: '🎪', unlocked: false },
];

export default function AchievementsPage() {
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
        <h1 className="text-lg font-black text-white">Thành tích (3/10)</h1>
        <div className="w-16" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ACHIEVEMENTS_LIST.map((ach) => (
          <div
            key={ach.id}
            className={`p-4 rounded-2xl border flex items-center gap-3.5 shadow transition ${
              ach.unlocked
                ? 'bg-[#262626] border-[#3a3a3a]'
                : 'bg-[#1a1a1a]/60 border-neutral-800 opacity-60'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] flex items-center justify-center text-2xl shrink-0">
              {ach.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white">{ach.title}</h3>
                {ach.unlocked && (
                  <span className="text-[10px] text-[#22c55e] font-bold">✓ Đã đạt</span>
                )}
              </div>
              <p className="text-xs text-[#a3a3a3] mt-0.5">{ach.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
