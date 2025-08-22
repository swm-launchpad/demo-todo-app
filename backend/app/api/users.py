from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models.user import User, UserStats
from ..schemas.user import User as UserSchema, UserCreate

router = APIRouter()

@router.post("/", response_model=UserSchema)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """Create a new user (for demo, no password required)"""
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    new_user = User(
        username=user.username,
        email=f"{user.username}@demo.com",
        password_hash="demo"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create user stats
    user_stats = UserStats(user_id=new_user.id)
    db.add(user_stats)
    db.commit()
    
    return new_user

@router.get("/demo", response_model=UserSchema)
def get_or_create_demo_user(db: Session = Depends(get_db)):
    """Get or create a demo user for quick testing"""
    demo_user = db.query(User).filter(User.username == "바다탐험가").first()
    
    if not demo_user:
        demo_user = User(
            username="바다탐험가",
            email="demo@quest.com",
            password_hash="demo"
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)
        
        # Create user stats with some progress
        user_stats = UserStats(
            user_id=demo_user.id,
            level=5,
            exp=450,
            total_exp=450,
            quests_completed=15,
            streak_days=3
        )
        db.add(user_stats)
        db.commit()
    
    demo_user.stats = db.query(UserStats).filter(UserStats.user_id == demo_user.id).first()
    return demo_user

@router.get("/{user_id}", response_model=UserSchema)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get user by ID"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.stats = db.query(UserStats).filter(UserStats.user_id == user_id).first()
    return user