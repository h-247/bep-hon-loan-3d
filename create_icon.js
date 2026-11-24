import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function makeIco() {
  const svg = `
  <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="14" fill="#f97316"/>
    <circle cx="32" cy="32" r="26" fill="#ea580c"/>
    <!-- Chef Hat Base -->
    <rect x="22" y="38" width="20" height="7" rx="2" fill="#ffffff"/>
    <!-- Chef Hat Puffs -->
    <circle cx="24" cy="30" r="7" fill="#ffffff"/>
    <circle cx="32" cy="26" r="9" fill="#ffffff"/>
    <circle cx="40" cy="30" r="7" fill="#ffffff"/>
    <!-- Frying pan handle -->
    <rect x="36" y="45" width="14" height="3" rx="1" fill="#1e293b" transform="rotate(25 36 45)"/>
  </svg>`;

  const pngBuffer = await sharp(Buffer.from(svg))
    .resize(64, 64)
    .png()
    .toBuffer();

  // Wrap PNG in ICO container format
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // Reserved
  icoHeader.writeUInt16LE(1, 2); // Type 1 = ICO
  icoHeader.writeUInt16LE(1, 4); // 1 Image

  const icoEntry = Buffer.alloc(16);
  icoEntry.writeUInt8(64, 0); // Width
  icoEntry.writeUInt8(64, 1); // Height
  icoEntry.writeUInt8(0, 2);  // Colors
  icoEntry.writeUInt8(0, 3);  // Reserved
  icoEntry.writeUInt16LE(1, 4); // Color planes
  icoEntry.writeUInt16LE(32, 6); // BPP
  icoEntry.writeUInt32LE(pngBuffer.length, 8); // Size
  icoEntry.writeUInt32LE(6 + 16, 12); // Offset (header 6 + entry 16)

  const icoBuffer = Buffer.concat([icoHeader, icoEntry, pngBuffer]);

  fs.writeFileSync('game.ico', icoBuffer);
  fs.writeFileSync('public/favicon.ico', icoBuffer);

  const shortcutDir = 'C:\\Users\\toanv\\OneDrive\\Desktop\\Shortcut';
  if (fs.existsSync(shortcutDir)) {
    fs.writeFileSync(path.join(shortcutDir, 'game.ico'), icoBuffer);
  }

  console.log('✓ Successfully created game.ico');
}

makeIco().catch(console.error);
