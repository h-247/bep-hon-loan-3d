import net from 'net';
import http from 'http';
import fs from 'fs';
import { spawn, exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const repoDir = path.dirname(__filename);

// Check if a PID is alive
function isPidRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

// Clean up stale lock files from previous runs
function cleanupStaleLock() {
  const lockPath = path.join(repoDir, '.vinext', 'dev', 'lock.json');
  if (fs.existsSync(lockPath)) {
    try {
      const content = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
      if (content.pid && !isPidRunning(content.pid)) {
        console.log(`🧹 Xóa tệp khóa cũ của tiến trình đã dừng (PID: ${content.pid})`);
        fs.unlinkSync(lockPath);
      } else if (content.pid && isPidRunning(content.pid)) {
        return content;
      }
    } catch {
      try { fs.unlinkSync(lockPath); } catch {}
    }
  }
  return null;
}

// Check if port is in use across IPv4 and IPv6
async function isPortInUse(port) {
  // 1. Try connect IPv4
  const c4 = await new Promise((res) => {
    const s = net.connect({ port, host: '127.0.0.1' }, () => {
      s.destroy();
      res(true);
    });
    s.on('error', () => res(false));
  });
  if (c4) return true;

  // 2. Try connect IPv6
  const c6 = await new Promise((res) => {
    const s = net.connect({ port, host: '::1' }, () => {
      s.destroy();
      res(true);
    });
    s.on('error', () => res(false));
  });
  if (c6) return true;

  // 3. Try binding listener
  const l0 = await new Promise((res) => {
    const s = net.createServer();
    s.unref();
    s.on('error', () => res(false));
    s.listen({ port }, () => {
      s.close(() => res(true));
    });
  });
  return !l0;
}

async function findAvailablePort(startPort = 3000) {
  let port = startPort;
  while (await isPortInUse(port)) {
    console.log(`ℹ Cổng ${port} đang bận, đang thử cổng tiếp theo...`);
    port++;
  }
  return port;
}

function openBrowser(url) {
  console.log(`🌐 Đang mở trình duyệt: ${url}`);
  const isWindows = process.platform === 'win32';
  if (isWindows) {
    exec(`start "" "${url}"`);
  } else if (process.platform === 'darwin') {
    exec(`open "${url}"`);
  } else {
    exec(`xdg-open "${url}"`);
  }
}

async function main() {
  console.log('========================================================');
  console.log('   🍳 BẾP HỖN LOẠN - TRÒ CHƠI NẤU ĂN PHỐI HỢP 3D 🍳');
  console.log('========================================================\n');

  // Check if an existing server is already active for this game
  const activeInstance = cleanupStaleLock();
  if (activeInstance && activeInstance.appUrl) {
    console.log(`✓ Máy chủ đã đang chạy tại: ${activeInstance.appUrl}`);
    openBrowser(activeInstance.appUrl);
    console.log('\nTrò chơi đang hoạt động. Nhấn Ctrl+C để dừng.');
    return;
  }

  console.log('🔍 Đang quét các cổng mạng khả dụng (tránh mọi cổng đang sử dụng)...');
  const availablePort = await findAvailablePort(3001);
  console.log(`✓ Chọn cổng khả dụng: ${availablePort}\n`);

  const gameUrl = `http://localhost:${availablePort}`;
  console.log(`🚀 Đang khởi động máy chủ tại: ${gameUrl}`);

  const isWindows = process.platform === 'win32';
  const npmCmd = isWindows ? 'npx.cmd' : 'npx';

  const child = spawn(npmCmd, ['vinext', 'dev', '--port', availablePort.toString()], {
    cwd: repoDir,
    stdio: 'inherit',
    shell: true,
  });

  let browserOpened = false;
  // Poll until HTTP server responds
  const checkInterval = setInterval(() => {
    http.get(gameUrl, (res) => {
      if (!browserOpened) {
        browserOpened = true;
        clearInterval(checkInterval);
        openBrowser(gameUrl);
      }
    }).on('error', () => {
      // Waiting for server to start
    });
  }, 500);

  // Fallback timeout after 4s
  setTimeout(() => {
    if (!browserOpened) {
      browserOpened = true;
      clearInterval(checkInterval);
      openBrowser(gameUrl);
    }
  }, 4000);

  child.on('exit', (code) => {
    process.exit(code || 0);
  });
}

main().catch((err) => {
  console.error('Lỗi khởi động:', err);
  process.exit(1);
});
