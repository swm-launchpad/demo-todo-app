from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
from ..models.user import ClassType

class UserStatsBase(BaseModel):
    level: int = 1
    exp: int = 0
    total_exp: int = 0
    class_type: ClassType = ClassType.WARRIOR
    streak_days: int = 0
    quests_completed: int = 0

class UserStats(UserStatsBase):
    id: int
    user_id: int
    last_active: date
    exp_to_next_level: int = 100
    
    class Config:
        from_attributes = True

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    created_at: datetime
    stats: Optional[UserStats] = None
    
    class Config:
        from_attributes = True

class LevelUpResponse(BaseModel):
    new_level: int
    total_exp: int
    unlocked_achievements: List[str] = []