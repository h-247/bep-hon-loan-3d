'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MultiplayerRoomInfo } from '@/src/types/multiplayer';

export default function MultiplayerBrowserPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<MultiplayerRoomInfo[]>([]);
  const [joinCode, setJoinCode] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomName, setRoomName] = useState('Phòng của tôi');
  const [playerName, setPlayerName] = useState('Đầu bếp Việt');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [loading, setLoading] = useState(false);

  const fetchRooms = async () => {
    try {
      const res = await fetch('/api/rooms');
      const data: any = await res.json();
      if (data.success) {
        setRooms(data.rooms || []);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleJoinByCode = async (codeToJoin: string) => {
    if (!codeToJoin.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/rooms/${codeToJoin.toUpperCase()}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `player_${Date.now()}`,
          name: playerName,
          characterId: 'chef_cat',
        }),
      });
      const data: any = await res.json();
      if (data.success) {
        router.push(`/multiplayer/${codeToJoin.toUpperCase()}?playerId=${data.room.members[data.room.members.length - 1].id}`);
      } else {
        alert(data.error || 'Không thể tham gia phòng.');
      }
    } catch {
      alert('Lỗi kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    setLoading(true);
    const hostId = `host_${Date.now()}`;
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomName,
          hostName: playerName,
          hostId,
          visibility,
          maximumPlayers: maxPlayers,
          selectedLevelId: 'level_1_1',
          characterId: 'chef_cat',
        }),
      });
      const data: any = await res.json();
      if (data.success) {
        router.push(`/multiplayer/${data.room.roomCode}?playerId=${hostId}`);
      } else {
        alert(data.error || 'Lỗi tạo phòng.');
      }
    } catch {
      alert('Lỗi kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-lg font-black text-white">Chơi trực tuyến (2–8 người)</h1>
        <div className="w-16" />
      </div>

      {/* Player Display Name Input */}
      <div className="bg-[#262626] border border-[#3a3a3a] rounded-2xl p-4 mb-4 flex flex-col gap-2 shadow">
        <label className="text-xs font-bold text-[#a3a3a3]">Tên đầu bếp của bạn:</label>
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white"
        />
      </div>

      {/* Join by Room Code Section & Create Room Button */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex gap-2 flex-1">
          <input
            type="text"
            placeholder="MÃ PHÒNG (VD: ABC123)"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            maxLength={6}
            className="flex-1 bg-[#1a1a1a] border border-[#3a3a3a] rounded-2xl px-4 py-3 text-sm font-black text-center tracking-widest text-white uppercase focus:outline-none focus:border-white"
          />
          <button
            onClick={() => handleJoinByCode(joinCode)}
            disabled={loading || !joinCode}
            className="px-5 py-3 rounded-2xl bg-white text-black font-black text-sm active:scale-95 disabled:opacity-50 transition shadow"
          >
            Tham gia
          </button>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="py-3 px-6 rounded-2xl bg-[#3b82f6] text-white font-black text-sm active:scale-95 transition shadow hover:bg-blue-600"
        >
          + Tạo phòng mới
        </button>
      </div>

      {/* Public Rooms List */}
      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between items-center text-xs font-bold text-[#a3a3a3]">
          <span>DANH SÁCH PHÒNG CÔNG KHAI</span>
          <button onClick={fetchRooms} className="hover:text-white">
            Làm mới ↻
          </button>
        </div>

        {rooms.length === 0 ? (
          <div className="bg-[#262626] border border-[#3a3a3a] rounded-2xl p-8 text-center text-xs text-[#a3a3a3] shadow">
            Chưa có phòng công khai nào. Hãy là người đầu tiên tạo phòng!
          </div>
        ) : (
          rooms.map((r) => (
            <div
              key={r.id}
              className="bg-[#262626] border border-[#3a3a3a] rounded-2xl p-4 flex justify-between items-center shadow hover:border-neutral-500 transition"
            >
              <div>
                <h3 className="text-sm font-black text-white">{r.roomName}</h3>
                <span className="text-xs text-[#a3a3a3]">
                  Chủ phòng: {r.hostName} • Mã: <b className="text-white">{r.roomCode}</b>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-black bg-[#1a1a1a] px-2.5 py-1 rounded-lg border border-[#3a3a3a] text-[#22c55e]">
                  {r.currentPlayers}/{r.maximumPlayers} người
                </span>
                <button
                  onClick={() => handleJoinByCode(r.roomCode)}
                  className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs shadow active:scale-95 transition"
                >
                  Vào
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#262626] border border-[#3a3a3a] rounded-3xl p-6 w-full max-w-sm shadow-2xl flex flex-col gap-4">
            <h2 className="text-lg font-black text-white">Tạo phòng chơi mới</h2>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#a3a3a3] font-semibold">Tên phòng:</label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#a3a3a3] font-semibold">
                Số người chơi tối đa (2–8): {maxPlayers}
              </label>
              <input
                type="range"
                min={2}
                max={8}
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                className="w-full accent-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#a3a3a3] font-semibold">Chế độ hiển thị:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setVisibility('public')}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${
                    visibility === 'public'
                      ? 'bg-white text-black border-white'
                      : 'bg-[#1a1a1a] text-[#a3a3a3] border-[#3a3a3a]'
                  }`}
                >
                  Công khai
                </button>
                <button
                  onClick={() => setVisibility('private')}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${
                    visibility === 'private'
                      ? 'bg-white text-black border-white'
                      : 'bg-[#1a1a1a] text-[#a3a3a3] border-[#3a3a3a]'
                  }`}
                >
                  Riêng tư
                </button>
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-3 rounded-xl bg-[#303030] text-white font-bold text-xs"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateRoom}
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-white text-black font-black text-xs active:scale-95 transition shadow"
              >
                Tạo phòng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
