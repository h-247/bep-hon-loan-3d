import { KitchenLevelConfig, DishType } from '../../types/game';

export interface WorldDefinition {
  id: number;
  nameVi: string;
  theme: 'basic' | 'fast_food' | 'italian' | 'asian' | 'moving' | 'chaotic';
  descriptionVi: string;
  levels: KitchenLevelConfig[];
}

export function generate30Levels(): KitchenLevelConfig[] {
  const allLevels: KitchenLevelConfig[] = [];

  const worldsConfig = [
    {
      worldId: 1,
      theme: 'basic' as const,
      namePrefix: 'Nhà bếp cơ bản',
      recipes: ['salad', 'onion_soup', 'tomato_soup'] as DishType[],
      crates: ['lettuce', 'tomato', 'cucumber', 'onion'] as const,
    },
    {
      worldId: 2,
      theme: 'fast_food' as const,
      namePrefix: 'Thức ăn nhanh',
      recipes: ['hamburger', 'cheeseburger', 'french_fries'] as DishType[],
      crates: ['bun', 'beef', 'cheese', 'lettuce', 'tomato', 'potato'] as const,
    },
    {
      worldId: 3,
      theme: 'italian' as const,
      namePrefix: 'Nhà hàng Ý',
      recipes: ['pizza', 'mushroom_pizza', 'pasta'] as DishType[],
      crates: ['dough', 'tomato', 'cheese', 'mushroom', 'pasta', 'sauce'] as const,
    },
    {
      worldId: 4,
      theme: 'asian' as const,
      namePrefix: 'Nhà hàng châu Á',
      recipes: ['sushi', 'fried_rice', 'grilled_fish'] as DishType[],
      crates: ['rice', 'seaweed', 'fish', 'egg', 'onion'] as const,
    },
    {
      worldId: 5,
      theme: 'moving' as const,
      namePrefix: 'Nhà bếp di động',
      recipes: ['salad', 'hamburger', 'pizza', 'sushi'] as DishType[],
      crates: ['lettuce', 'tomato', 'bun', 'beef', 'dough', 'cheese', 'rice', 'fish'] as const,
    },
    {
      worldId: 6,
      theme: 'chaotic' as const,
      namePrefix: 'Nhà bếp hỗn loạn',
      recipes: [
        'salad',
        'hamburger',
        'cheeseburger',
        'pizza',
        'mushroom_pizza',
        'sushi',
        'fried_rice',
        'pasta',
        'french_fries',
        'grilled_fish',
      ] as DishType[],
      crates: [
        'lettuce',
        'tomato',
        'cucumber',
        'onion',
        'potato',
        'beef',
        'fish',
        'cheese',
        'bun',
        'dough',
      ] as const,
    },
  ];

  for (const w of worldsConfig) {
    for (let lvlNum = 1; lvlNum <= 5; lvlNum++) {
      const levelId = `level_${w.worldId}_${lvlNum}`;
      const width = 8 + (w.worldId >= 5 ? 2 : 0) + (lvlNum >= 4 ? 2 : 0);
      const height = 6 + (lvlNum >= 3 ? 1 : 0);
      const timeLimit = Math.max(90, 150 - (w.worldId - 1) * 8 - (lvlNum - 1) * 5);
      const baseDifficulty: 'easy' | 'normal' | 'hard' | 'extreme' =
        w.worldId <= 2
          ? lvlNum <= 2 ? 'easy' : 'normal'
          : w.worldId <= 4
          ? lvlNum <= 3 ? 'normal' : 'hard'
          : 'extreme';

      // Generate grid tiles: border = 1, interior = 0
      const tiles: number[][] = [];
      for (let y = 0; y < height; y++) {
        const row: number[] = [];
        for (let x = 0; x < width; x++) {
          if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
            row.push(1); // Counter border
          } else {
            row.push(0); // Floor
          }
        }
        tiles.push(row);
      }

      // Add center divider / island counters on higher levels
      if (lvlNum >= 2 && width >= 8) {
        const midY = Math.floor(height / 2);
        for (let mx = 3; mx <= width - 4; mx++) {
          tiles[midY][mx] = 1;
        }
      }

      // Generate Stations around perimeter
      const stations: any[] = [];
      let stationIdx = 0;

      // 1. Crates
      w.crates.forEach((cr, i) => {
        const x = 1 + (i % (width - 2));
        const y = 0;
        stations.push({
          id: `crate_${cr}_${stationIdx++}`,
          type: 'crate',
          x,
          y,
          crateIngredient: cr,
        });
      });

      // 2. Cutting boards
      stations.push({
        id: `cutting_1_${stationIdx++}`,
        type: 'cutting_board',
        x: 0,
        y: 1,
      });
      if (lvlNum >= 3) {
        stations.push({
          id: `cutting_2_${stationIdx++}`,
          type: 'cutting_board',
          x: 0,
          y: 2,
        });
      }

      // 3. Stoves / Ovens / Fryers based on world theme
      const cookType =
        w.theme === 'italian'
          ? 'oven'
          : w.theme === 'fast_food'
          ? 'deep_fryer'
          : 'stove';

      stations.push({
        id: `cook_1_${stationIdx++}`,
        type: cookType,
        x: width - 1,
        y: 1,
      });
      stations.push({
        id: `cook_2_${stationIdx++}`,
        type: 'stove',
        x: width - 1,
        y: 2,
      });

      // 4. Sink & Plate dispenser
      stations.push({
        id: `sink_${stationIdx++}`,
        type: 'sink',
        x: 1,
        y: height - 1,
        dirtyPlateCount: 2,
        cleanPlateCount: 1,
      });
      stations.push({
        id: `plate_dispenser_${stationIdx++}`,
        type: 'plate_dispenser',
        x: 2,
        y: height - 1,
      });

      // 5. Serving Window & Trash Bin
      stations.push({
        id: `serving_${stationIdx++}`,
        type: 'serving_window',
        x: width - 2,
        y: height - 1,
      });
      stations.push({
        id: `trash_${stationIdx++}`,
        type: 'trash',
        x: width - 1,
        y: height - 2,
      });

      // 6. Extinguisher stand for safety
      stations.push({
        id: `extinguisher_${stationIdx++}`,
        type: 'extinguisher_stand',
        x: 0,
        y: height - 2,
      });

      // 7. General prep counters for remaining border positions
      for (let x = 3; x <= width - 3; x++) {
        stations.push({
          id: `counter_${x}_${height - 1}`,
          type: 'counter',
          x,
          y: height - 1,
        });
      }

      // 8. Island counters
      if (lvlNum >= 2 && width >= 8) {
        const midY = Math.floor(height / 2);
        for (let mx = 3; mx <= width - 4; mx++) {
          stations.push({
            id: `counter_island_${mx}_${midY}`,
            type: 'counter',
            x: mx,
            y: midY,
          });
        }
      }

      // Spawn points for up to 8 chefs
      const spawnPoints = [
        { x: 2, y: 2 },
        { x: 3, y: 2 },
        { x: 4, y: 2 },
        { x: 5, y: 2 },
        { x: 2, y: 3 },
        { x: 3, y: 3 },
        { x: 4, y: 3 },
        { x: 5, y: 3 },
      ];

      const starThresholds: [number, number, number] = [
        120 + (lvlNum - 1) * 40,
        240 + (lvlNum - 1) * 60,
        380 + (lvlNum - 1) * 80,
      ];

      allLevels.push({
        id: levelId,
        worldId: w.worldId,
        levelNumber: lvlNum,
        name: `${w.namePrefix} ${w.worldId}-${lvlNum}`,
        descriptionVi: `Cấp độ ${lvlNum} tại ${w.namePrefix}. Hoàn thành các món ăn chuẩn xác trước khi hết giờ!`,
        difficulty: baseDifficulty,
        environmentTheme: w.theme,
        timeLimit,
        starThresholds,
        width,
        height,
        tiles,
        stations,
        spawnPoints,
        availableRecipes: w.recipes,
        orderInterval: Math.max(10, 18 - lvlNum * 1.5),
        maxSimultaneousOrders: Math.min(5, 2 + Math.floor(lvlNum / 2)),
      });
    }
  }

  return allLevels;
}

export const LEVELS: KitchenLevelConfig[] = generate30Levels();

export const WORLDS: WorldDefinition[] = [
  {
    id: 1,
    nameVi: 'Nhà bếp cơ bản',
    theme: 'basic',
    descriptionVi: 'Làm quen với các thao tác sơ chế nguyên liệu, thái rau củ và phối hợp đồng đội.',
    levels: LEVELS.filter((l) => l.worldId === 1),
  },
  {
    id: 2,
    nameVi: 'Nhà hàng thức ăn nhanh',
    theme: 'fast_food',
    descriptionVi: 'Phục vụ các món Hamburger kẹp thịt, Cheeseburger và Khoai tây chiên ngập dầu giòn rụm.',
    levels: LEVELS.filter((l) => l.worldId === 2),
  },
  {
    id: 3,
    nameVi: 'Nhà hàng Ý',
    theme: 'italian',
    descriptionVi: 'Nướng bánh pizza phô mai thơm phức trong lò nướng và chế biến các đĩa mì Ý sốt cà chua hảo hạng.',
    levels: LEVELS.filter((l) => l.worldId === 3),
  },
  {
    id: 4,
    nameVi: 'Nhà hàng châu Á',
    theme: 'asian',
    descriptionVi: 'Cuốn sushi cá hồi rong biển tươi sống, rang cơm chiên trứng vàng giòn và nướng phi lê cá thơm lừng.',
    levels: LEVELS.filter((l) => l.worldId === 4),
  },
  {
    id: 5,
    nameVi: 'Nhà bếp di động',
    theme: 'moving',
    descriptionVi: 'Gian bếp trên các bệ chuyển động. Lối đi thay đổi liên tục đòi hỏi sự ăn ý tuyệt đối.',
    levels: LEVELS.filter((l) => l.worldId === 5),
  },
  {
    id: 6,
    nameVi: 'Nhà bếp hỗn loạn',
    theme: 'chaotic',
    descriptionVi: 'Áp lực tột độ với nguy cơ cháy nổ liên hoàn, đơn hàng dồn dập cùng lúc cho tối đa 8 đầu bếp.',
    levels: LEVELS.filter((l) => l.worldId === 6),
  },
];
