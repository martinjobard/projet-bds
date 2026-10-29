from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal
from .seed_data import seed_database
from .config import SCHOOL_NAME
from .routers import auth, equipment, tournaments, events, matches, stats

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Création des tables
    Base.metadata.create_all(bind=engine)
    # Seed de données réalistes au premier démarrage
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title=f"API {SCHOOL_NAME}",
    description="Backend API pour le Bureau des Sports - Gestion des emprunts, tournois, événements et championnats universitaires",
    version="1.0.0",
    lifespan=lifespan
)

# Configuration CORS pour autoriser le frontend Vite
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusion des routers
app.include_router(auth.router)
app.include_router(equipment.router)
app.include_router(tournaments.router)
app.include_router(events.router)
app.include_router(matches.router)
app.include_router(stats.router)

@app.get("/api/health", tags=["Santé"])
def health_check():
    return {
        "status": "healthy",
        "school": SCHOOL_NAME,
        "message": "API BDS Nancy opérationnelle"
    }
