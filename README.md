# Bếp Hỗn Loạn (Chaos Kitchen 3D)

A polished, playable, browser-based cooperative cooking simulation game inspired by Overcooked, built with Three.js, React Three Fiber, Vinext, Tailwind CSS, and Cloudflare D1/Workers architecture.

The game features original stylized low-poly 3D cartoon graphics, an elevated orthographic camera, real-time multiplayer for 2–8 simultaneous players, 12 original chef characters, 12 recipes, 30 playable levels across 6 distinct kitchen worlds, mobile-first virtual controls, Web Audio API sound effects, and intelligent AI assistant chefs.

---

## 1. Project Overview & Features

- **Genre:** 3D Cooperative Cooking Simulation.
- **Platform:** Modern Web Browsers (Mobile phone, Tablet, Desktop).
- **Graphics:** Stylized low-poly 3D cartoon art with rounded chunky geometry, soft lighting and shadows, particle effects (steam, water splashes, flames, chopping sparks), and miniature diorama presentation.
- **Camera:** Elevated orthographic 3D camera with responsive multi-viewport framing.
- **Frontend Language:** Vietnamese only (Tiếng Việt toàn diện).
- **Display Mode:** Permanent Dark Mode (`#212121`, `#262626`, `#1A1A1A`, `#ECECEC`).
- **Multiplayer:** 2–8 players per room with real-time state synchronization, public & private rooms, unique 6-character room codes, shareable invitation links, quick chat, and kitchen pings.
- **AI Chef Co-op:** Deterministic assistant chefs capable of A* pathfinding, chopping, washing, cooking, assembling dishes, and extinguishing fires.
- **Levels & Worlds:** 30 levels across 6 kitchen environments (Nhà bếp cơ bản, Thức ăn nhanh, Nhà hàng Ý, Nhà hàng châu Á, Nhà bếp di động, Nhà bếp hỗn loạn).
- **Audio:** Web Audio API synthesized procedural sounds and dynamic arcade music.

---

## 2. Technology Stack

- **Framework:** React 19 + TypeScript + Tailwind CSS (via official ChatGPT Sites Vinext starter).
- **3D Engine:** Three.js + React Three Fiber + Drei.
- **Game Engine:** Custom deterministic TypeScript simulation engine decoupled from rendering.
- **Database & ORM:** Cloudflare D1 (SQLite-compatible) + Drizzle ORM.
- **Runtime Target:** Cloudflare Workers / ChatGPT Sites (`.openai/hosting.json`).
- **Testing:** Vitest for unit & integration testing.

---

## 3. Installation & Quick Start

### Prerequisites
- Node.js >= 22.13.0
- npm >= 10.0.0

### Windows Quick Launch
Double-click `Chơi Bếp Hỗn Loạn.bat` in the repository root or use the desktop shortcut in `C:\Users\toanv\OneDrive\Desktop\Shortcut\BepHonLoan.lnk`.
The launcher automatically finds an unused port (avoiding any occupied ports) and opens your default browser at `http://localhost:<PORT>`.

### Manual Commands
```bash
# 1. Clone & install dependencies
npm install

# 2. Generate database migrations
npm run db:generate

# 3. Start local development server
npm run dev

# 4. Run automated test suite
npx vitest run

# 5. Type-check TypeScript
npx tsc --noEmit

# 6. Production build
npm run build
```

---

## 4. Gameplay Controls

### Mobile Touch Controls
- **Virtual Joystick (Bottom-Left):** Drag thumb knob to move chef freely in 360 degrees.
- **Tương tác (F / Interact):** 56px green button to chop ingredients, wash plates, or spray fire extinguisher.
- **Nhặt/Đặt (E / Pick & Drop):** 56px white button to pick up ingredients, plates, and utensils, or place them on counters.
- **Tăng tốc (Space / Dash):** Orange burst button to dash forward.
- **Ném (G / Throw):** Throw compatible ingredients across countertops.
- **💬 Giao tiếp (Quick Chat):** Send 12 predefined Vietnamese cooperative messages.
- **📍 Đánh dấu (Ping):** Ping kitchen stations and fire hazards for teammates.

### Desktop Keyboard Controls

| Action | Player 1 | Player 2 (Local Co-op) |
| --- | --- | --- |
| Movement | W, A, S, D | Arrow Keys |
| Pick up / Drop | E | Enter |
| Interact (Chop/Wash) | F | Right Shift |
| Dash | Space | Right Ctrl |
| Throw | G | Right Alt |
| Quick Chat | Q | P |
| Ping | R | O |
| Pause / Menu | Escape | Escape |

---

## 5. Recipe Encyclopedia

1. **Salad rau củ (Salad):** Xà lách thái nhỏ + Cà chua thái nhỏ + Dưa leo thái nhỏ.
2. **Bánh hamburger (Hamburger):** Bánh mì + Bò nấu chín + Xà lách thái nhỏ + Cà chua thái nhỏ.
3. **Hamburger phô mai (Cheeseburger):** Bánh mì + Bò nấu chín + Lát phô mai.
4. **Bánh pizza (Pizza):** Đế bánh + Cà chua thái nhỏ + Phô mai nướng lò.
5. **Pizza nấm (Mushroom Pizza):** Đế bánh + Cà chua thái nhỏ + Phô mai + Nấm thái nhỏ nướng lò.
6. **Sushi:** Cơm chín + Rong biển + Cá hồi thái nhỏ.
7. **Cơm chiên (Fried Rice):** Cơm chín + Trứng + Hành tây thái nhỏ xào chảo.
8. **Mì Ý (Pasta):** Mì Ý luộc chín + Sốt cà chua đậm đà.
9. **Súp hành tây (Onion Soup):** 3x Hành tây thái nhỏ ninh trong nồi.
10. **Súp cà chua (Tomato Soup):** 3x Cà chua thái nhỏ ninh trong nồi.
11. **Khoai tây chiên (French Fries):** Khoai tây thái sợi chiên ngập dầu.
12. **Cá nướng (Grilled Fish):** Cá thái lát áp chảo vàng đều.

---

## 6. Architecture & File Structure

```text
src/
├── types/
│   ├── game.ts            # Simulation entities, ingredients, stations, orders
│   └── multiplayer.ts     # Room states, network packets, snapshots, events
├── game/
│   ├── core/
│   │   ├── Vector2D.ts    # 2D math & normalization
│   │   └── PRNG.ts        # Seeded Mulberry32 PRNG
│   ├── simulation/
│   │   ├── SimulationEngine.ts  # Master deterministic game loop
│   │   ├── PlayerSystem.ts      # Movement, dash, input resolution
│   │   ├── StationSystem.ts     # Stations, pick/drop, chopping, washing
│   │   ├── CookingSystem.ts     # Stoves, ovens, fryers, fires
│   │   ├── OrderSystem.ts       # Dynamic order queue, timers, expiration
│   │   └── CollisionSystem.ts   # Grid obstacle & chef collision response
│   ├── recipes/
│   │   ├── RecipeDefinitions.ts # 12 initial recipes
│   │   └── RecipeValidator.ts   # Dish matching & assembly validation
│   ├── levels/
│   │   └── LevelCatalog.ts      # 30 playable levels across 6 worlds
│   ├── characters/
│   │   └── CharacterCatalog.ts  # 12 playable chef characters
│   ├── ai/
│   │   ├── Pathfinding.ts       # A* grid pathfinder
│   │   └── AIChefController.ts  # Assistant chef behavior tree
│   ├── audio/
│   │   └── SoundManager.ts      # Web Audio API procedural sound engine
│   └── rendering/
│       ├── GameCanvas.tsx       # R3F WebGL Canvas wrapper
│       ├── KitchenScene.tsx     # Orthographic 3D kitchen scene
│       ├── ChefMesh.tsx         # 3D cartoon chef model & animations
│       ├── StationMeshes.tsx    # 3D equipment models (stoves, sinks, counters)
│       ├── ItemMeshes.tsx       # 3D ingredients, plates, and dishes
│       ├── ParticleEffects.tsx  # Steam, bubbles, flames, sparks
│       └── CameraController.tsx # Overcooked elevated camera framing
├── server/
│   └── multiplayer/
│       └── RoomManager.ts       # Real-time room lifecycle & simulation
app/
├── layout.tsx                   # Dark theme & viewport configuration
├── page.tsx                     # Home page & mode selection
├── play/page.tsx                # 3D gameplay canvas & HUD
├── levels/page.tsx              # Level selection screen
├── characters/page.tsx          # 12 chef character showcase
├── recipes/page.tsx             # Recipe encyclopedia
├── multiplayer/page.tsx         # Public room browser & create modal
├── multiplayer/[code]/page.tsx  # Multiplayer lobby (2–8 players)
├── leaderboard/page.tsx         # Rankings
├── achievements/page.tsx        # Achievements
├── profile/page.tsx             # Player stats & records
├── settings/page.tsx            # Audio & graphics settings
└── api/...                      # Next.js / Vinext Workers API routes
```

---

## 7. License

MIT License. See [ASSET_LICENSES.md](ASSET_LICENSES.md) for complete details.
