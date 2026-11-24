import { NextResponse } from 'next/server';
import { CHARACTERS } from '@/src/game/characters/CharacterCatalog';

export async function GET() {
  return NextResponse.json({
    success: true,
    characters: CHARACTERS,
  });
}
