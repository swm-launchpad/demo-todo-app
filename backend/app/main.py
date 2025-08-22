from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import users, quests
from .core.database import engine, Base

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="RPG Quest Manager API",
    description="Level up your productivity with gamified task management!",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(quests.router, prefix="/api/quests", tags=["quests"])

@app.get("/")
def read_root():
    return {
        "message": "Welcome to RPG Quest Manager API!",
        "docs": "/docs",
        "health": "OK"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}