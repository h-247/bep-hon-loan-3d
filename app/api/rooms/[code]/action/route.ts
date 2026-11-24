import { NextResponse } from 'next/server';
import { roomManager } from '@/src/server/multiplayer/RoomManager';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const body: any = await req.json();
  const { type, payload } = body;

  if (type === 'input') {
    roomManager.processInput(code, payload);
    return NextResponse.json({ success: true });
  }

  if (type === 'ready') {
    const success = roomManager.toggleReady(code, payload.playerId);
    return NextResponse.json({ success });
  }

  return NextResponse.json({ success: false }, { status: 400 });
}
