'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { MultiplayerRoomInfo, MultiplayerMemberInfo } from '@/src/types/multiplayer';

export default function MultiplayerLobbyPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const roomCode = ((params?.code as string) || '').toUpperCase();
  const playerId = searchParams.get('playerId') || '';

  const [room, setRoom] = useState<MultiplayerRoomInfo | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchRoomStatus = async () => {
    try {
      const res = await fetch(`/api/rooms/${roomCode}`);
      const data: any = await res.json();
      if (data.success && data.room) {
        setRoom(data.room);
        if (data.room.status === 'in_game') {
          router.push(`/play?mode=online&room=${roomCode}&level=${data.room.selectedLevelId}`);
        }
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchRoomStatus();
    const interval = setInterval(fetchRoomStatus, 1500);
    return () => clearInterval(interval);
  }, [roomCode]);

  const currentMember = room?.members.find((m) => m.id === playerId);
  const isHost = currentMember?.isHost || false;

  const handleToggleReady = async () => {
    try {
      await fetch(`/api/rooms/${roomCode}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'ready',
          payload: { playerId },
        }),
      });
      fetchRoomStatus();
    } catch {
      // Error
    }
  };

  const handleAddAIChef = async () => {
    try {
      await fetch(`/api/rooms/${roomCode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_ai',
          hostId: playerId,
        }),
      });
      fetchRoomStatus();
    } catch {
      // Error
    }
  };

  const handleStartGame = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/rooms/${roomCode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          hostId: playerId,
        }),
      });
      const data: any = await res.json();
      if (data.success) {
        router.push(`/play?mode=online&room=${roomCode}&level=${room?.selectedLevelId || 'level_1_1'}`);
      } else {
        alert(data.error || 'Chưa đủ điều kiện bắt đầu trận đấu.');
      }
    } catch {
      alert('Lỗi bắt đầu trận đấu.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!room) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#212121] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <span className="text-sm font-semibold">Đang kết nối phòng {roomCode}...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full p-4 sm:p-6 text-[#ececec]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#3a3a3a] pb-3 mb-4">
        <Link
          href="/multiplayer"
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#262626] border border-[#3a3a3a] hover:bg-[#303030] text-[#ececec]"
        >
          ← Rời phòng
        </Link>
        <div className="text-center">
          <h1 className="text-base font-black text-white">{room.roomName}</h1>
          <span className="text-[11px] text-[#22c55e]">
            {room.members.length}/{room.maximumPlayers} Đầu bếp trực tuyến
          </span>
        </div>
        <div className="w-16" />
      </div>

      {/* Room Code Card with Copy */}
      <div className="bg-[#262626] border border-[#3a3a3a] rounded-3xl p-5 mb-5 flex flex-col sm:flex-row justify-between items-center gap-3 shadow-xl">
        <div>
          <span className="text-[11px] text-[#a3a3a3] font-bold">MÃ PHÒNG (GỬI BẠN BÈ ĐỂ THAM GIA):</span>
          <div className="text-3xl font-black tracking-widest text-white mt-0.5">{roomCode}</div>
        </div>

        <button
          onClick={handleCopyCode}
          className="px-5 py-2.5 rounded-xl bg-white text-black font-black text-xs active:scale-95 transition shadow"
        >
          {copied ? '✓ Đã sao chép mã!' : 'Sao chép mã phòng'}
        </button>
      </div>

      {/* Player Slots (Up to 8) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {Array.from({ length: room.maximumPlayers }).map((_, idx) => {
          const member: MultiplayerMemberInfo | undefined = room.members[idx];
          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-center shadow transition ${
                member
                  ? 'bg-[#262626] border-[#3a3a3a]'
                  : 'bg-[#1a1a1a]/40 border-dashed border-[#3a3a3a]'
              }`}
            >
              {member ? (
                <>
                  <div
                    style={{ backgroundColor: member.color }}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 border-white/20 shadow"
                  >
                    {member.playerType === 'ai' ? '🤖' : '👨‍🍳'}
                  </div>
                  <span className="text-xs font-black text-white truncate w-full">
                    {member.displayName}
                  </span>
                  <div className="flex gap-1 items-center">
                    {member.isHost && (
                      <span className="text-[9px] bg-[#eab308] text-black font-black px-1.5 py-0.2 rounded">
                        CHỦ PHÒNG
                      </span>
                    )}
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        member.isReady
                          ? 'bg-[#22c55e]/20 text-[#22c55e]'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {member.isReady ? 'SẴN SÀNG' : 'CHƯA'}
                    </span>
                  </div>
                </>
              ) : (
                <div className="h-24 flex items-center justify-center text-[#a3a3a3] text-xs">
                  Vị trí {idx + 1} trống
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Host / Ready Action Controls */}
      <div className="flex flex-col gap-3">
        {isHost ? (
          <div className="flex flex-col sm:flex-row gap-2.5">
            {room.members.length < room.maximumPlayers && (
              <button
                onClick={handleAddAIChef}
                className="flex-1 py-3.5 rounded-2xl bg-[#303030] hover:bg-[#404040] text-white font-bold text-sm border border-[#3a3a3a] transition active:scale-95"
              >
                + Thêm AI Chef
              </button>
            )}
            <button
              onClick={handleStartGame}
              disabled={loading || room.members.length < 2}
              className="flex-1 py-3.5 rounded-2xl bg-white text-black font-black text-sm active:scale-95 transition shadow disabled:opacity-50"
            >
              Bắt đầu trận đấu ➔
            </button>
          </div>
        ) : (
          <button
            onClick={handleToggleReady}
            className={`w-full py-4 rounded-2xl font-black text-sm active:scale-95 transition shadow ${
              currentMember?.isReady
                ? 'bg-[#303030] text-white border border-[#3a3a3a]'
                : 'bg-white text-black'
            }`}
          >
            {currentMember?.isReady ? 'Hủy sẵn sàng' : 'Sẵn sàng'}
          </button>
        )}
      </div>
    </div>
  );
}
