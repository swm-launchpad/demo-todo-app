from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from ..models.quest import DifficultyType, QuestStatus

EXP_REWARDS = {
    DifficultyType.EASY: 10,
    DifficultyType.NORMAL: 25,
    DifficultyType.HARD: 50,
    DifficultyType.EPIC: 100,
    DifficultyType.LEGENDARY: 200
}

class QuestBase(BaseModel):
    title: str
    description: Optional[str] = None
    difficulty: DifficultyType = DifficultyType.NORMAL

class QuestCreate(QuestBase):
    pass

class QuestUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    difficulty: Optional[DifficultyType] = None
    status: Optional[QuestStatus] = None

class Quest(QuestBase):
    id: int
    user_id: int
    exp_reward: int
    status: QuestStatus
    created_at: datetime
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True