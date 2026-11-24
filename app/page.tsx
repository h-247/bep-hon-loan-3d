'use client';

import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col justify-between max-w-2xl mx-auto w-full p-4 sm:p-6 text-[#ececec]">
      {/* Brand Header */}
      <header className="flex flex-col items-center text-center pt-4 sm:pt-8 gap-2">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#f97316] via-[#ef4444] to-[#facc15] flex items-center justify-center text-3xl sm:text-4xl shadow-xl border-2 border-white/20">
          🍳
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
          BẾP HỖN LOẠN
        </h1>
        <p className="text-xs sm:text-sm text-[#a3a3a3] max-w-md font-medium">
          Trò chơi nấu ăn phối hợp 3D vui nhộn dành cho 1-8 người chơi trực tuyến trên điện thoại và máy tính.
        </p>
      </header>

      {/* Main Play CTA & Mode Selection */}
      <section className="flex flex-col gap-3 my-6">
        <Link
          href="/play?mode=single&level=level_1_1"
          className="w-full py-4 rounded-2xl bg-white text-black font-black text-center text-lg shadow-xl active:scale-98 transition hover:bg-neutral-100 flex items-center justify-center gap-2"
        >
          <span>🔥</span> Chơi ngay
        </Link>

        <div className="grid grid-cols-2 gap-2.5">
          <Link
            href="/play?mode=single&level=level_1_1"
            className="p-3.5 rounded-2xl bg-[#262626] border border-[#3a3a3a] hover:bg-[#303030] active:scale-98 transition flex flex-col gap-1 shadow"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">👨‍🍳</span>
              <span className="font-bold text-sm text-white">Chơi đơn</span>
            </div>
            <span className="text-[11px] text-[#a3a3a3]">Tự tay nấu và hoàn thành các đơn hàng</span>
          </Link>

          <Link
            href="/play?mode=ai&level=level_1_1"
            className="p-3.5 rounded-2xl bg-[#262626] border border-[#3a3a3a] hover:bg-[#303030] active:scale-98 transition flex flex-col gap-1 shadow"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <span className="font-bold text-sm text-white">Chơi với AI</span>
            </div>
            <span className="text-[11px] text-[#a3a3a3]">Đồng đội AI thông minh tự động hỗ trợ</span>
          </Link>

          <Link
            href="/play?mode=local&level=level_1_1"
            className="p-3.5 rounded-2xl bg-[#262626] border border-[#3a3a3a] hover:bg-[#303030] active:scale-98 transition flex flex-col gap-1 shadow"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">👥</span>
              <span className="font-bold text-sm text-white">Chơi cùng bạn</span>
            </div>
            <span className="text-[11px] text-[#a3a3a3]">2 người chung 1 bàn phím (WASD & Phím mũi tên)</span>
          </Link>

          <Link
            href="/multiplayer"
            className="p-3.5 rounded-2xl bg-[#262626] border border-[#3a3a3a] hover:bg-[#303030] active:scale-98 transition flex flex-col gap-1 shadow"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">🌐</span>
              <span className="font-bold text-sm text-white">Chơi trực tuyến</span>
            </div>
            <span className="text-[11px] text-[#a3a3a3]">Phòng 2–8 người qua liên kết hoặc mã phòng</span>
          </Link>
        </div>

        <Link
          href="/play?mode=practice&level=level_1_1"
          className="w-full py-2.5 rounded-xl bg-[#303030] hover:bg-[#404040] border border-[#3a3a3a] text-center text-xs font-semibold text-[#ececec] transition active:scale-98"
        >
          📖 Chế độ Luyện tập (Không giới hạn thời gian)
        </Link>
      </section>

      {/* Navigation Grid */}
      <footer className="grid grid-cols-4 sm:grid-cols-6 gap-2 border-t border-[#3a3a3a] pt-4 pb-2 text-center text-xs font-semibold">
        <Link
          href="/levels"
          className="p-2 rounded-xl bg-[#262626] border border-[#3a3a3a] flex flex-col items-center gap-1 hover:bg-[#303030]"
        >
          <span>🗺️</span>
          <span>Cấp độ</span>
        </Link>
        <Link
          href="/characters"
          className="p-2 rounded-xl bg-[#262626] border border-[#3a3a3a] flex flex-col items-center gap-1 hover:bg-[#303030]"
        >
          <span>🦊</span>
          <span>Đầu bếp</span>
        </Link>
        <Link
          href="/recipes"
          className="p-2 rounded-xl bg-[#262626] border border-[#3a3a3a] flex flex-col items-center gap-1 hover:bg-[#303030]"
        >
          <span>📜</span>
          <span>Công thức</span>
        </Link>
        <Link
          href="/leaderboard"
          className="p-2 rounded-xl bg-[#262626] border border-[#3a3a3a] flex flex-col items-center gap-1 hover:bg-[#303030]"
        >
          <span>🏆</span>
          <span>Xếp hạng</span>
        </Link>
        <Link
          href="/achievements"
          className="p-2 rounded-xl bg-[#262626] border border-[#3a3a3a] flex flex-col items-center gap-1 hover:bg-[#303030]"
        >
          <span>⭐</span>
          <span>Thành tích</span>
        </Link>
        <Link
          href="/settings"
          className="p-2 rounded-xl bg-[#262626] border border-[#3a3a3a] flex flex-col items-center gap-1 hover:bg-[#303030]"
        >
          <span>⚙️</span>
          <span>Cài đặt</span>
        </Link>
      </footer>
    </div>
  );
}
