import { NextResponse } from 'next/server';
import { roomManager } from '@/src/server/multiplayer/RoomManager';

export async function GET() {
  const rooms = roomManager.getPublicRooms();
  return NextResponse.json({ success: true, rooms });
}

export async function POST(req: Request) {
  try {
    const body: any = await req.json();
    const {
      roomName,
      hostName,
      hostId,
      visibility,
      password,
      maximumPlayers,
      selectedLevelId,
      difficulty,
      characterId,
    } = body;

    if (!roomName || !hostName || !hostId) {
      return NextResponse.json(
        { success: false, error: 'Thiếu thông tin tạo phòng.' },
        { status: 400 }
      );
    }

    const room = roomManager.createRoom({
      roomName,
      hostName,
      hostId,
      visibility: visibility || 'public',
      password,
      maximumPlayers: maximumPlayers || 4,
      selectedLevelId: selectedLevelId || 'level_1_1',
      difficulty: difficulty || 'normal',
      characterId,
    });

    return NextResponse.json({ success: true, room });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Lỗi tạo phòng.' },
      { status: 500 }
    );
  }
}
