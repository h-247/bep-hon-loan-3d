import { NextResponse } from 'next/server';
import { LEVELS, WORLDS } from '@/src/game/levels/LevelCatalog';

export async function GET() {
  return NextResponse.json({
    success: true,
    worlds: WORLDS,
    levels: LEVELS,
  });
}
