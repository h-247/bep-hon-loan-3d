'use client';

import React from 'react';
import Link from 'next/link';

export default function ProfilePage() {
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
        <h1 className="text-lg font-black text-white">Hồ sơ đầu bếp</h1>
        <div className="w-16" />
      </div>

      {/* Profile Card */}
      <div className="bg-[#262626] border border-[#3a3a3a] rounded-3xl p-6 mb-5 flex flex-col sm:flex-row items-center gap-4 shadow-xl">
        <div className="w-20 h-20 rounded-full bg-[#f97316] border-4 border-white/20 flex items-center justify-center text-4xl shadow">
          🐱
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-black text-white">Đầu Bếp Bạn</h2>
          <span className="text-xs text-[#22c55e] font-semibold">Tài khoản Khách (Lưu trữ cục bộ)</span>
          <p className="text-xs text-[#a3a3a3] mt-1">Cấp độ: Đầu bếp tập sự • Gia nhập hôm nay</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-[#262626] border border-[#3a3a3a] rounded-2xl p-4 shadow">
          <span className="text-xs text-[#a3a3a3] font-semibold">TỔNG ĐIỂM</span>
          <div className="text-2xl font-black text-white mt-1">1,450</div>
        </div>
        <div className="bg-[#262626] border border-[#3a3a3a] rounded-2xl p-4 shadow">
          <span className="text-xs text-[#a3a3a3] font-semibold">SỐ SAO ĐÃ ĐẠT</span>
          <div className="text-2xl font-black text-[#eab308] mt-1">12 ★</div>
        </div>
        <div className="bg-[#262626] border border-[#3a3a3a] rounded-2xl p-4 shadow">
          <span className="text-xs text-[#a3a3a3] font-semibold">ĐƠN GIAO THÀNH CÔNG</span>
          <div className="text-2xl font-black text-white mt-1">28</div>
        </div>
        <div className="bg-[#262626] border border-[#3a3a3a] rounded-2xl p-4 shadow">
          <span className="text-xs text-[#a3a3a3] font-semibold">VÁN TRỰC TUYẾN</span>
          <div className="text-2xl font-black text-white mt-1">5</div>
        </div>
        <div className="bg-[#262626] border border-[#3a3a3a] rounded-2xl p-4 shadow">
          <span className="text-xs text-[#a3a3a3] font-semibold">CHUỖI COMBO CAO NHẤT</span>
          <div className="text-2xl font-black text-[#eab308] mt-1">x4</div>
        </div>
        <div className="bg-[#262626] border border-[#3a3a3a] rounded-2xl p-4 shadow">
          <span className="text-xs text-[#a3a3a3] font-semibold">ĐÃ MỞ KHÓA</span>
          <div className="text-2xl font-black text-white mt-1">12/12 👨‍🍳</div>
        </div>
      </div>
    </div>
  );
}
