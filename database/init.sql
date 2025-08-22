-- Create enum types
CREATE TYPE difficulty_type AS ENUM ('EASY', 'NORMAL', 'HARD', 'EPIC', 'LEGENDARY');
CREATE TYPE quest_status AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'ABANDONED');
CREATE TYPE class_type AS ENUM ('WARRIOR', 'MAGE', 'ROGUE');

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User stats table
CREATE TABLE IF NOT EXISTS user_stats (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    level INTEGER DEFAULT 1,
    exp INTEGER DEFAULT 0,
    total_exp INTEGER DEFAULT 0,
    class_type class_type DEFAULT 'WARRIOR',
    streak_days INTEGER DEFAULT 0,
    last_active DATE DEFAULT CURRENT_DATE,
    quests_completed INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quests table
CREATE TABLE IF NOT EXISTS quests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    difficulty difficulty_type DEFAULT 'NORMAL',
    exp_reward INTEGER NOT NULL,
    status quest_status DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    requirement_type VARCHAR(50),
    requirement_value INTEGER,
    exp_reward INTEGER DEFAULT 50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User achievements table (many-to-many)
CREATE TABLE IF NOT EXISTS user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id INTEGER NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_id)
);

-- Daily rewards table
CREATE TABLE IF NOT EXISTS daily_rewards (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    claimed BOOLEAN DEFAULT FALSE,
    exp_reward INTEGER DEFAULT 10,
    streak_bonus INTEGER DEFAULT 0,
    claimed_at TIMESTAMP,
    UNIQUE(user_id, date)
);

-- Create indexes for better performance
CREATE INDEX idx_quests_user_id ON quests(user_id);
CREATE INDEX idx_quests_status ON quests(status);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_daily_rewards_user_date ON daily_rewards(user_id, date);

-- Insert default achievements
INSERT INTO achievements (name, description, icon, requirement_type, requirement_value, exp_reward) VALUES
    ('First Quest', 'Complete your first quest', '🎯', 'quests_completed', 1, 25),
    ('Quest Novice', 'Complete 10 quests', '⚔️', 'quests_completed', 10, 50),
    ('Quest Master', 'Complete 50 quests', '🗡️', 'quests_completed', 50, 100),
    ('Quest Legend', 'Complete 100 quests', '⚡', 'quests_completed', 100, 200),
    ('Week Warrior', 'Maintain a 7-day streak', '🔥', 'streak_days', 7, 75),
    ('Month Master', 'Maintain a 30-day streak', '💎', 'streak_days', 30, 150),
    ('Level 5', 'Reach level 5', '🌟', 'level', 5, 50),
    ('Level 10', 'Reach level 10', '✨', 'level', 10, 100),
    ('Level 25', 'Reach level 25', '👑', 'level', 25, 250),
    ('Epic Victor', 'Complete an Epic quest', '🏆', 'epic_quest', 1, 100),
    ('Legendary Hero', 'Complete a Legendary quest', '🦸', 'legendary_quest', 1, 200);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON user_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quests_updated_at BEFORE UPDATE ON quests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();