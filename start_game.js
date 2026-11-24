import net from 'net';
import { spawn, exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to find an unused port starting from preferredPort
function findAvailablePort(startPort) {
  return new Promise((resolve) => {
    function testPort(port) {
      const server = net.createServer();
      server.unref();
      server.on('error', () => {
        // Port is in use, try next
        testPort(port + 1);
      });
      server.listen({ port, host: '127.0.0.1' }, () => {
        server.close(() => {
          resolve(port);
        });
      });
    }
    testPort(startPort);
  });
}

async function main() {
  console.log('🔍 Đang kiểm tra cổng khả dụng (tránh các cổng đang được sử dụng)...');
  const availablePort = await findAvailablePort(3000);
  console.log(`✓ Tìm thấy cổng khả dụng: ${availablePort}`);

  const gameUrl = `http://localhost:${availablePort}`;
  console.log(`🚀 Đang khởi động Bếp Hỗn Loạn tại: ${gameUrl}`);

  // Run dev server on the found unused port
  const isWindows = process.platform === 'win32';
  const npmCmd = isWindows ? 'npx.cmd' : 'npx';

  const child = spawn(npmCmd, ['vinext', 'dev', '--port', availablePort.toString()], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true,
  });

  // Open browser after 2 seconds
  setTimeout(() => {
    console.log(`🌐 Đang mở trình duyệt: ${gameUrl}`);
    if (isWindows) {
      exec(`start ${gameUrl}`);
    } else if (process.platform === 'darwin') {
      exec(`open ${gameUrl}`);
    } else {
      exec(`xdg-open ${gameUrl}`);
    }
  }, 2200);

  child.on('exit', (code) => {
    process.exit(code || 0);
  });
}

main().catch((err) => {
  console.error('Lỗi khởi động:', err);
  process.exit(1);
});
