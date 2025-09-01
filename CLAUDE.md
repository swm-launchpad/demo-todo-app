# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ocean-themed gamified todo app (RPG Quest Manager) designed for 1-minute demos. Users complete "quests" (todos) to gain XP and level up through ocean depths. Built for quick deployment and presentation.

## Key Commands

### Full Stack Development
```bash
# Start all services (PostgreSQL, FastAPI backend, React frontend)
docker-compose up

# Rebuild and start (after dependency changes)
docker-compose up --build

# Background mode
docker-compose up -d

# View logs
docker-compose logs -f [service_name]  # backend, frontend, or postgres

# Reset database (removes all data)
docker-compose down -v
docker-compose up
```

### Backend Development
```bash
# Access backend container
docker exec -it rpg-quest-manager-backend-1 bash

# API documentation
http://localhost:8000/docs

# Manual database connection
docker exec -it rpg-quest-manager-postgres-1 psql -U quest_user -d quest_db
```

### Frontend Development
```bash
# Access frontend container
docker exec -it rpg-quest-manager-frontend-1 sh

# Frontend URL
http://localhost:5173

# Build for production (inside container)
npm run build

# Configure API URL
# Edit frontend/.env file:
VITE_API_URL=http://your-api-url:8000
```

## Architecture

### Service Communication
- Frontend (React on :5173) → Backend API (:8000) → PostgreSQL (:5432)
- All services run in Docker containers with hot-reload enabled
- CORS configured to allow all origins (development mode)

### Database Schema Critical Points
- PostgreSQL enum types (`difficulty_type`, `quest_status`, `class_type`) MUST match SQLAlchemy model enums exactly
- Enum names are explicitly defined in SQLAlchemy models: `Enum(DifficultyType, name='difficulty_type')`
- Database initialized via `/database/init.sql` on first container start
- Default demo user "바다탐험가" created automatically via `/api/users/demo`

### Frontend State Management
- No Redux/Context - all state in App.jsx
- Demo mode triggers automatic quest creation and completion sequences
- Background depth changes based on user level (shallow → coastal → deep → abyss)
- All API calls use axios with `VITE_API_URL` environment variable (configured in frontend/.env)

### Backend API Structure
- FastAPI with automatic OpenAPI docs
- No actual authentication implemented (demo passwords stored as "demo")
- Routes split into `/api/users` and `/api/quests`
- Experience calculation in `services/exp_calculator.py` uses exponential curve

## Critical Implementation Details

### Experience System Formula
- Level calculation: `1 + floor(log(total_exp / 100) / log(1.5)) + 1`
- Difficulty rewards: EASY=10, NORMAL=25, HARD=50, EPIC=100, LEGENDARY=200
- Ocean depths: Lv1-5 (shallow), Lv6-10 (coastal), Lv11-20 (deep), Lv21+ (abyss)

### Animation Components
- `SeaCreatures.jsx`: Jellyfish and fish schools with timed spawning
- `SunlightEffect.jsx`: Top-down light rays
- `RippleEffect.jsx`: Click-triggered water ripples (z-index must be 0)
- `TreasureChest.jsx`: Level-up reward display
- `Bubbles.jsx`: Rising bubble particles

### Demo Mode Feature
- `/api/quests/demo/generate` creates 10 Korean-language quests
- Auto Demo button sequences: generate → complete all with delays
- Designed for 1-minute presentation showcase

## Common Issues & Solutions

### Database Enum Mismatch Error
If you see `column "difficulty" is of type difficulty_type but expression is of type difficultytype`:
1. Check that SQLAlchemy models specify enum names: `Enum(DifficultyType, name='difficulty_type')`
2. Reset database: `docker-compose down -v && docker-compose up`

### Frontend Not Updating
- Vite HMR may fail in Docker. Restart frontend: `docker-compose restart frontend`
- Check that volumes are mounted correctly in docker-compose.yml

### Demo User Creation Fails
- Database must be healthy before backend starts (healthcheck in docker-compose)
- Demo user "바다탐험가" created on first `/api/users/demo` call

## Language & Localization
- All UI text in Korean
- Demo quests generated with Korean titles/descriptions
- Error messages use Korean (e.g., "앱 초기화 실패")

## Development Workflow

When modifying game mechanics:
1. Update difficulty rewards in both `backend/app/schemas/quest.py` and frontend `QuestCard.jsx`
2. Modify level thresholds in `OceanHeader.jsx` and `App.jsx` background depth logic
3. Test with demo mode to ensure animations sync properly

When adding new animations:
1. Create component in `frontend/src/components/`
2. Import and render in App.jsx (order matters for z-index)
3. Ensure pointer-events handling doesn't block interaction

## Performance Considerations
- Multiple animation layers can impact performance
- Bubble and creature generation use intervals with cleanup
- Docker volumes exclude node_modules to prevent conflicts