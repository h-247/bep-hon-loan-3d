import { NextResponse } from 'next/server';
import { roomManager } from '@/src/server/multiplayer/RoomManager';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const body: any = await req.json();
  const { id, name, characterId, password } = body;

  const result = roomManager.joinRoom(code, {
    id,
    name,
    characterId,
    password,
  });

  return NextResponse.json(result);
}
