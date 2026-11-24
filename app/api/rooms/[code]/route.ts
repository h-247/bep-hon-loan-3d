import { NextResponse } from 'next/server';
import { roomManager } from '@/src/server/multiplayer/RoomManager';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const room = roomManager.getRoom(code);
  if (!room) {
    return NextResponse.json(
      { success: false, error: 'Không tìm thấy phòng chơi.' },
      { status: 404 }
    );
  }

  const snapshot = roomManager.getStateSnapshot(code);

  return NextResponse.json({
    success: true,
    room: room.info,
    snapshot,
  });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const body: any = await req.json();
  const { action, hostId } = body;

  if (action === 'start') {
    const started = roomManager.startGame(code, hostId);
    if (!started) {
      return NextResponse.json(
        { success: false, error: 'Không thể bắt đầu trận đấu. Cần ít nhất 2 đầu bếp.' },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: true, message: 'Trận đấu đã bắt đầu!' });
  }

  if (action === 'add_ai') {
    const added = roomManager.addAIChef(code, hostId);
    return NextResponse.json({ success: added });
  }

  return NextResponse.json({ success: false, error: 'Hành động không hợp lệ' }, { status: 400 });
}
