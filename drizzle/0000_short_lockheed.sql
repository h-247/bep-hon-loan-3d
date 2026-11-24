CREATE TABLE `achievements` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`condition` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `characters` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`model_key` text NOT NULL,
	`unlock_condition` text DEFAULT 'default' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `game_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`level_id` text NOT NULL,
	`game_mode` text DEFAULT 'single' NOT NULL,
	`random_seed` integer DEFAULT 12345 NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`score` integer DEFAULT 0 NOT NULL,
	`stars` integer DEFAULT 0 NOT NULL,
	`completed_orders` integer DEFAULT 0 NOT NULL,
	`failed_orders` integer DEFAULT 0 NOT NULL,
	`highest_combo` integer DEFAULT 0 NOT NULL,
	`started_at` integer NOT NULL,
	`completed_at` integer
);
--> statement-breakpoint
CREATE INDEX `game_sessions_user_id_idx` ON `game_sessions` (`user_id`);--> statement-breakpoint
CREATE TABLE `level_progress` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`level_id` text NOT NULL,
	`highest_score` integer DEFAULT 0 NOT NULL,
	`stars` integer DEFAULT 0 NOT NULL,
	`completed` integer DEFAULT 0 NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`level_id`) REFERENCES `levels`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `level_progress_user_id_idx` ON `level_progress` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `level_progress_user_level_idx` ON `level_progress` (`user_id`,`level_id`);--> statement-breakpoint
CREATE TABLE `levels` (
	`id` text PRIMARY KEY NOT NULL,
	`world_id` integer NOT NULL,
	`level_number` integer NOT NULL,
	`name` text NOT NULL,
	`difficulty` text DEFAULT 'normal' NOT NULL,
	`configuration` text NOT NULL,
	`star_thresholds` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `levels_world_number_idx` ON `levels` (`world_id`,`level_number`);--> statement-breakpoint
CREATE TABLE `multiplayer_results` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`level_id` text NOT NULL,
	`player_count` integer NOT NULL,
	`team_score` integer NOT NULL,
	`stars` integer NOT NULL,
	`duration` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `multiplayer_sessions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `multiplayer_results_level_idx` ON `multiplayer_results` (`level_id`);--> statement-breakpoint
CREATE INDEX `multiplayer_results_score_idx` ON `multiplayer_results` (`team_score`);--> statement-breakpoint
CREATE TABLE `multiplayer_rooms` (
	`id` text PRIMARY KEY NOT NULL,
	`room_code` text NOT NULL,
	`room_name` text NOT NULL,
	`host_identity_id` text NOT NULL,
	`visibility` text DEFAULT 'public' NOT NULL,
	`password_hash` text,
	`maximum_players` integer DEFAULT 4 NOT NULL,
	`selected_level_id` text NOT NULL,
	`difficulty` text DEFAULT 'normal' NOT NULL,
	`status` text DEFAULT 'waiting' NOT NULL,
	`configuration` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `multiplayer_rooms_room_code_unique` ON `multiplayer_rooms` (`room_code`);--> statement-breakpoint
CREATE INDEX `multiplayer_rooms_code_idx` ON `multiplayer_rooms` (`room_code`);--> statement-breakpoint
CREATE INDEX `multiplayer_rooms_status_idx` ON `multiplayer_rooms` (`status`);--> statement-breakpoint
CREATE INDEX `multiplayer_rooms_visibility_idx` ON `multiplayer_rooms` (`visibility`);--> statement-breakpoint
CREATE TABLE `multiplayer_session_players` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`user_id` text,
	`guest_id` text,
	`display_name` text NOT NULL,
	`character_id` text NOT NULL,
	`player_type` text DEFAULT 'human' NOT NULL,
	`ingredients_prepared` integer DEFAULT 0 NOT NULL,
	`ingredients_cooked` integer DEFAULT 0 NOT NULL,
	`dishes_assembled` integer DEFAULT 0 NOT NULL,
	`orders_delivered` integer DEFAULT 0 NOT NULL,
	`plates_washed` integer DEFAULT 0 NOT NULL,
	`fires_extinguished` integer DEFAULT 0 NOT NULL,
	`disconnected_at` integer,
	`completed_at` integer,
	FOREIGN KEY (`session_id`) REFERENCES `multiplayer_sessions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `session_players_session_id_idx` ON `multiplayer_session_players` (`session_id`);--> statement-breakpoint
CREATE TABLE `multiplayer_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`room_id` text NOT NULL,
	`level_id` text NOT NULL,
	`random_seed` integer DEFAULT 12345 NOT NULL,
	`player_count` integer DEFAULT 2 NOT NULL,
	`human_player_count` integer DEFAULT 2 NOT NULL,
	`ai_player_count` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'in_progress' NOT NULL,
	`team_score` integer DEFAULT 0 NOT NULL,
	`stars` integer DEFAULT 0 NOT NULL,
	`completed_orders` integer DEFAULT 0 NOT NULL,
	`failed_orders` integer DEFAULT 0 NOT NULL,
	`highest_combo` integer DEFAULT 0 NOT NULL,
	`started_at` integer NOT NULL,
	`completed_at` integer,
	FOREIGN KEY (`room_id`) REFERENCES `multiplayer_rooms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `multiplayer_sessions_room_id_idx` ON `multiplayer_sessions` (`room_id`);--> statement-breakpoint
CREATE TABLE `player_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`selected_character` text DEFAULT 'chef_cat' NOT NULL,
	`selected_outfit` text DEFAULT 'classic_white' NOT NULL,
	`total_score` integer DEFAULT 0 NOT NULL,
	`total_stars` integer DEFAULT 0 NOT NULL,
	`completed_orders` integer DEFAULT 0 NOT NULL,
	`failed_orders` integer DEFAULT 0 NOT NULL,
	`highest_combo` integer DEFAULT 0 NOT NULL,
	`total_matches` integer DEFAULT 0 NOT NULL,
	`multiplayer_matches` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `player_profiles_user_id_idx` ON `player_profiles` (`user_id`);--> statement-breakpoint
CREATE TABLE `player_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`master_volume` integer DEFAULT 80 NOT NULL,
	`music_volume` integer DEFAULT 70 NOT NULL,
	`sound_effects_volume` integer DEFAULT 90 NOT NULL,
	`joystick_sensitivity` integer DEFAULT 100 NOT NULL,
	`graphics_quality` text DEFAULT 'medium' NOT NULL,
	`shadow_quality` text DEFAULT 'medium' NOT NULL,
	`rendering_resolution` text DEFAULT '1.0' NOT NULL,
	`vibration_enabled` integer DEFAULT 1 NOT NULL,
	`left_handed_mode` integer DEFAULT 0 NOT NULL,
	`keyboard_configuration` text,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `player_settings_user_id_idx` ON `player_settings` (`user_id`);--> statement-breakpoint
CREATE TABLE `room_members` (
	`id` text PRIMARY KEY NOT NULL,
	`room_id` text NOT NULL,
	`user_id` text,
	`guest_id` text,
	`display_name` text NOT NULL,
	`character_id` text DEFAULT 'chef_cat' NOT NULL,
	`player_type` text DEFAULT 'human' NOT NULL,
	`is_host` integer DEFAULT 0 NOT NULL,
	`is_ready` integer DEFAULT 0 NOT NULL,
	`connection_status` text DEFAULT 'connected' NOT NULL,
	`joined_at` integer NOT NULL,
	`last_seen_at` integer NOT NULL,
	FOREIGN KEY (`room_id`) REFERENCES `multiplayer_rooms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `room_members_room_id_idx` ON `room_members` (`room_id`);--> statement-breakpoint
CREATE INDEX `room_members_guest_id_idx` ON `room_members` (`guest_id`);--> statement-breakpoint
CREATE TABLE `user_achievements` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`achievement_id` text NOT NULL,
	`unlocked_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`achievement_id`) REFERENCES `achievements`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `user_achievements_user_id_idx` ON `user_achievements` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_achievements_unique_idx` ON `user_achievements` (`user_id`,`achievement_id`);--> statement-breakpoint
CREATE TABLE `user_characters` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`character_id` text NOT NULL,
	`unlocked_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `user_characters_user_id_idx` ON `user_characters` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_characters_user_char_idx` ON `user_characters` (`user_id`,`character_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`display_name` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
