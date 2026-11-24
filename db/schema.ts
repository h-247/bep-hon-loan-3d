import { sqliteTable, text, integer, index, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  displayName: text('display_name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const playerProfiles = sqliteTable('player_profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  selectedCharacter: text('selected_character').notNull().default('chef_cat'),
  selectedOutfit: text('selected_outfit').notNull().default('classic_white'),
  totalScore: integer('total_score').notNull().default(0),
  totalStars: integer('total_stars').notNull().default(0),
  completedOrders: integer('completed_orders').notNull().default(0),
  failedOrders: integer('failed_orders').notNull().default(0),
  highestCombo: integer('highest_combo').notNull().default(0),
  totalMatches: integer('total_matches').notNull().default(0),
  multiplayerMatches: integer('multiplayer_matches').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('player_profiles_user_id_idx').on(table.userId),
]);

export const characters = sqliteTable('characters', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  modelKey: text('model_key').notNull(),
  unlockCondition: text('unlock_condition').notNull().default('default'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const userCharacters = sqliteTable('user_characters', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  characterId: text('character_id').notNull().references(() => characters.id, { onDelete: 'cascade' }),
  unlockedAt: integer('unlocked_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('user_characters_user_id_idx').on(table.userId),
  uniqueIndex('user_characters_user_char_idx').on(table.userId, table.characterId),
]);

export const levels = sqliteTable('levels', {
  id: text('id').primaryKey(),
  worldId: integer('world_id').notNull(),
  levelNumber: integer('level_number').notNull(),
  name: text('name').notNull(),
  difficulty: text('difficulty').notNull().default('normal'),
  configuration: text('configuration').notNull(), // JSON
  starThresholds: text('star_thresholds').notNull(), // JSON [100, 200, 300]
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('levels_world_number_idx').on(table.worldId, table.levelNumber),
]);

export const levelProgress = sqliteTable('level_progress', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  levelId: text('level_id').notNull().references(() => levels.id, { onDelete: 'cascade' }),
  highestScore: integer('highest_score').notNull().default(0),
  stars: integer('stars').notNull().default(0),
  completed: integer('completed').notNull().default(0), // 0 or 1
  attempts: integer('attempts').notNull().default(0),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('level_progress_user_id_idx').on(table.userId),
  uniqueIndex('level_progress_user_level_idx').on(table.userId, table.levelId),
]);

export const gameSessions = sqliteTable('game_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  levelId: text('level_id').notNull(),
  gameMode: text('game_mode').notNull().default('single'), // 'single' | 'ai' | 'local' | 'practice'
  randomSeed: integer('random_seed').notNull().default(12345),
  status: text('status').notNull().default('active'), // 'active' | 'completed' | 'abandoned'
  score: integer('score').notNull().default(0),
  stars: integer('stars').notNull().default(0),
  completedOrders: integer('completed_orders').notNull().default(0),
  failedOrders: integer('failed_orders').notNull().default(0),
  highestCombo: integer('highest_combo').notNull().default(0),
  startedAt: integer('started_at', { mode: 'timestamp' }).notNull(),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
}, (table) => [
  index('game_sessions_user_id_idx').on(table.userId),
]);

export const multiplayerRooms = sqliteTable('multiplayer_rooms', {
  id: text('id').primaryKey(),
  roomCode: text('room_code').notNull().unique(),
  roomName: text('room_name').notNull(),
  hostIdentityId: text('host_identity_id').notNull(),
  visibility: text('visibility').notNull().default('public'), // 'public' | 'private'
  passwordHash: text('password_hash'),
  maximumPlayers: integer('maximum_players').notNull().default(4),
  selectedLevelId: text('selected_level_id').notNull(),
  difficulty: text('difficulty').notNull().default('normal'),
  status: text('status').notNull().default('waiting'), // 'waiting' | 'in_game' | 'completed' | 'closed'
  configuration: text('configuration'), // JSON string for layout or rules
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('multiplayer_rooms_code_idx').on(table.roomCode),
  index('multiplayer_rooms_status_idx').on(table.status),
  index('multiplayer_rooms_visibility_idx').on(table.visibility),
]);

export const roomMembers = sqliteTable('room_members', {
  id: text('id').primaryKey(),
  roomId: text('room_id').notNull().references(() => multiplayerRooms.id, { onDelete: 'cascade' }),
  userId: text('user_id'),
  guestId: text('guest_id'),
  displayName: text('display_name').notNull(),
  characterId: text('character_id').notNull().default('chef_cat'),
  playerType: text('player_type').notNull().default('human'), // 'human' | 'ai'
  isHost: integer('is_host').notNull().default(0),
  isReady: integer('is_ready').notNull().default(0),
  connectionStatus: text('connection_status').notNull().default('connected'), // 'connected' | 'disconnected'
  joinedAt: integer('joined_at', { mode: 'timestamp' }).notNull(),
  lastSeenAt: integer('last_seen_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('room_members_room_id_idx').on(table.roomId),
  index('room_members_guest_id_idx').on(table.guestId),
]);

export const multiplayerSessions = sqliteTable('multiplayer_sessions', {
  id: text('id').primaryKey(),
  roomId: text('room_id').notNull().references(() => multiplayerRooms.id, { onDelete: 'cascade' }),
  levelId: text('level_id').notNull(),
  randomSeed: integer('random_seed').notNull().default(12345),
  playerCount: integer('player_count').notNull().default(2),
  humanPlayerCount: integer('human_player_count').notNull().default(2),
  aiPlayerCount: integer('ai_player_count').notNull().default(0),
  status: text('status').notNull().default('in_progress'), // 'in_progress' | 'completed' | 'aborted'
  teamScore: integer('team_score').notNull().default(0),
  stars: integer('stars').notNull().default(0),
  completedOrders: integer('completed_orders').notNull().default(0),
  failedOrders: integer('failed_orders').notNull().default(0),
  highestCombo: integer('highest_combo').notNull().default(0),
  startedAt: integer('started_at', { mode: 'timestamp' }).notNull(),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
}, (table) => [
  index('multiplayer_sessions_room_id_idx').on(table.roomId),
]);

export const multiplayerSessionPlayers = sqliteTable('multiplayer_session_players', {
  id: text('id').primaryKey(),
  sessionId: text('session_id').notNull().references(() => multiplayerSessions.id, { onDelete: 'cascade' }),
  userId: text('user_id'),
  guestId: text('guest_id'),
  displayName: text('display_name').notNull(),
  characterId: text('character_id').notNull(),
  playerType: text('player_type').notNull().default('human'),
  ingredientsPrepared: integer('ingredients_prepared').notNull().default(0),
  ingredientsCooked: integer('ingredients_cooked').notNull().default(0),
  dishesAssembled: integer('dishes_assembled').notNull().default(0),
  ordersDelivered: integer('orders_delivered').notNull().default(0),
  platesWashed: integer('plates_washed').notNull().default(0),
  firesExtinguished: integer('fires_extinguished').notNull().default(0),
  disconnectedAt: integer('disconnected_at', { mode: 'timestamp' }),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
}, (table) => [
  index('session_players_session_id_idx').on(table.sessionId),
]);

export const multiplayerResults = sqliteTable('multiplayer_results', {
  id: text('id').primaryKey(),
  sessionId: text('session_id').notNull().references(() => multiplayerSessions.id, { onDelete: 'cascade' }),
  levelId: text('level_id').notNull(),
  playerCount: integer('player_count').notNull(),
  teamScore: integer('team_score').notNull(),
  stars: integer('stars').notNull(),
  duration: integer('duration').notNull(), // seconds
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('multiplayer_results_level_idx').on(table.levelId),
  index('multiplayer_results_score_idx').on(table.teamScore),
]);

export const achievements = sqliteTable('achievements', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  condition: text('condition').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const userAchievements = sqliteTable('user_achievements', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  achievementId: text('achievement_id').notNull().references(() => achievements.id, { onDelete: 'cascade' }),
  unlockedAt: integer('unlocked_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('user_achievements_user_id_idx').on(table.userId),
  uniqueIndex('user_achievements_unique_idx').on(table.userId, table.achievementId),
]);

export const playerSettings = sqliteTable('player_settings', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  masterVolume: integer('master_volume').notNull().default(80),
  musicVolume: integer('music_volume').notNull().default(70),
  soundEffectsVolume: integer('sound_effects_volume').notNull().default(90),
  joystickSensitivity: integer('joystick_sensitivity').notNull().default(100),
  graphicsQuality: text('graphics_quality').notNull().default('medium'), // 'low' | 'medium' | 'high'
  shadowQuality: text('shadow_quality').notNull().default('medium'),
  renderingResolution: text('rendering_resolution').notNull().default('1.0'),
  vibrationEnabled: integer('vibration_enabled').notNull().default(1),
  leftHandedMode: integer('left_handed_mode').notNull().default(0),
  keyboardConfiguration: text('keyboard_configuration'), // JSON string
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('player_settings_user_id_idx').on(table.userId),
]);
