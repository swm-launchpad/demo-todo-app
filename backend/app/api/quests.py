from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from ..core.database import get_db
from ..models.quest import Quest, QuestStatus
from ..models.user import User, UserStats
from ..models.achievement import UserAchievement, Achievement
from ..schemas.quest import Quest as QuestSchema, QuestCreate, QuestUpdate, EXP_REWARDS
from ..schemas.user import LevelUpResponse
from ..services.exp_calculator import add_experience, calculate_exp_to_next_level

router = APIRouter()

@router.get("", response_model=List[QuestSchema])
def get_quests(user_id: int = 1, db: Session = Depends(get_db)):
    """Get all quests for a user"""
    quests = db.query(Quest).filter(Quest.user_id == user_id).order_by(Quest.created_at.desc()).all()
    return quests

@router.post("", response_model=QuestSchema)
def create_quest(quest: QuestCreate, user_id: int = 1, db: Session = Depends(get_db)):
    """Create a new quest"""
    exp_reward = EXP_REWARDS[quest.difficulty]
    
    db_quest = Quest(
        user_id=user_id,
        title=quest.title,
        description=quest.description,
        difficulty=quest.difficulty,
        exp_reward=exp_reward
    )
    db.add(db_quest)
    db.commit()
    db.refresh(db_quest)
    return db_quest

@router.put("/{quest_id}", response_model=QuestSchema)
def update_quest(quest_id: int, quest_update: QuestUpdate, db: Session = Depends(get_db)):
    """Update a quest"""
    quest = db.query(Quest).filter(Quest.id == quest_id).first()
    if not quest:
        raise HTTPException(status_code=404, detail="Quest not found")
    
    update_data = quest_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(quest, field, value)
    
    if "difficulty" in update_data:
        quest.exp_reward = EXP_REWARDS[quest.difficulty]
    
    db.commit()
    db.refresh(quest)
    return quest

@router.post("/{quest_id}/complete", response_model=LevelUpResponse)
def complete_quest(quest_id: int, db: Session = Depends(get_db)):
    """Complete a quest and gain experience"""
    quest = db.query(Quest).filter(Quest.id == quest_id).first()
    if not quest:
        raise HTTPException(status_code=404, detail="Quest not found")
    
    if quest.status == QuestStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Quest already completed")
    
    # Update quest status
    quest.status = QuestStatus.COMPLETED
    quest.completed_at = datetime.utcnow()
    
    # Get user stats
    user_stats = db.query(UserStats).filter(UserStats.user_id == quest.user_id).first()
    if not user_stats:
        user_stats = UserStats(user_id=quest.user_id)
        db.add(user_stats)
    
    # Add experience
    old_level = user_stats.level
    new_exp, new_level, leveled_up = add_experience(
        user_stats.total_exp, 
        user_stats.level, 
        quest.exp_reward
    )
    
    user_stats.total_exp = new_exp
    user_stats.exp = new_exp
    user_stats.level = new_level
    user_stats.quests_completed += 1
    
    # Check achievements
    unlocked_achievements = []
    achievements = db.query(Achievement).all()
    
    for achievement in achievements:
        # Check if already unlocked
        existing = db.query(UserAchievement).filter(
            UserAchievement.user_id == quest.user_id,
            UserAchievement.achievement_id == achievement.id
        ).first()
        
        if not existing:
            unlocked = False
            
            if achievement.requirement_type == "quests_completed":
                if user_stats.quests_completed >= achievement.requirement_value:
                    unlocked = True
            elif achievement.requirement_type == "level":
                if user_stats.level >= achievement.requirement_value:
                    unlocked = True
            elif achievement.requirement_type == "epic_quest" and quest.difficulty == "EPIC":
                unlocked = True
            elif achievement.requirement_type == "legendary_quest" and quest.difficulty == "LEGENDARY":
                unlocked = True
            
            if unlocked:
                user_achievement = UserAchievement(
                    user_id=quest.user_id,
                    achievement_id=achievement.id
                )
                db.add(user_achievement)
                unlocked_achievements.append(f"{achievement.icon} {achievement.name}")
                
                # Add achievement exp bonus
                user_stats.total_exp += achievement.exp_reward
                user_stats.exp += achievement.exp_reward
    
    db.commit()
    
    return LevelUpResponse(
        new_level=new_level,
        total_exp=new_exp,
        unlocked_achievements=unlocked_achievements
    )

@router.delete("/{quest_id}")
def delete_quest(quest_id: int, db: Session = Depends(get_db)):
    """Delete a quest"""
    quest = db.query(Quest).filter(Quest.id == quest_id).first()
    if not quest:
        raise HTTPException(status_code=404, detail="Quest not found")
    
    db.delete(quest)
    db.commit()
    return {"message": "Quest deleted"}

@router.post("/demo/generate")
def generate_demo_quests(user_id: int = 1, db: Session = Depends(get_db)):
    """Generate demo quests for testing"""
    demo_quests = [
        {"title": "Docker 컨테이너 배포하기", "description": "도커로 앱 배포", "difficulty": "EPIC"},
        {"title": "API 엔드포인트 작성", "description": "RESTful API 구현", "difficulty": "HARD"},
        {"title": "데이터베이스 설계", "description": "PostgreSQL 테이블 설계", "difficulty": "HARD"},
        {"title": "애니메이션 추가", "description": "Framer Motion 효과", "difficulty": "NORMAL"},
        {"title": "UI 컴포넌트 만들기", "description": "React 컴포넌트", "difficulty": "NORMAL"},
        {"title": "버그 수정하기", "description": "레벨 시스템 디버깅", "difficulty": "EASY"},
        {"title": "문서 작성", "description": "README 업데이트", "difficulty": "EASY"},
        {"title": "성능 최적화", "description": "로딩 속도 개선", "difficulty": "HARD"},
        {"title": "사운드 효과 추가", "description": "오디오 피드백", "difficulty": "NORMAL"},
        {"title": "데모 모드 구현", "description": "빠른 시연 기능", "difficulty": "LEGENDARY"}
    ]
    
    created_quests = []
    for quest_data in demo_quests:
        exp_reward = EXP_REWARDS[quest_data["difficulty"]]
        quest = Quest(
            user_id=user_id,
            title=quest_data["title"],
            description=quest_data["description"],
            difficulty=quest_data["difficulty"],
            exp_reward=exp_reward
        )
        db.add(quest)
        created_quests.append(quest)
    
    db.commit()
    return {"message": f"Created {len(created_quests)} demo quests"}