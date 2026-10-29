from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, field_validator

# --- Auth ---
class AdminLoginRequest(BaseModel):
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    school_name: str

class TokenVerifyResponse(BaseModel):
    valid: bool
    role: str = "admin"
    school_name: str

# --- Equipment ---
class EquipmentBase(BaseModel):
    name: str
    category: str = "Général"
    total_quantity: int = 1
    available_quantity: int = 1
    image_url: Optional[str] = None
    condition: str = "Bon état"
    replacement_price: float = 0.0  # Prix de rachat en cas de perte
    description: Optional[str] = None

class EquipmentCreate(EquipmentBase):
    pass

class EquipmentUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    total_quantity: Optional[int] = None
    available_quantity: Optional[int] = None
    image_url: Optional[str] = None
    condition: Optional[str] = None
    replacement_price: Optional[float] = None
    description: Optional[str] = None

class EquipmentOut(EquipmentBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Loans ---
class LoanCreate(BaseModel):
    equipment_id: int
    user_name: str
    user_email: str
    user_phone: Optional[str] = None
    quantity: int = 1
    loan_date: str
    expected_return_date: str
    notes: Optional[str] = None

    @field_validator("user_email")
    def validate_telecomnancy_email(cls, v: str) -> str:
        clean = v.strip().lower()
        if not clean.endswith("@telecomnancy.net"):
            raise ValueError("L'adresse email doit obligatoirement être une adresse @telecomnancy.net")
        return clean

class LoanStatusUpdate(BaseModel):
    status: str  # APPROVED, RETURNED, REJECTED, LATE
    admin_notes: Optional[str] = None
    actual_return_date: Optional[str] = None

class LoanOut(BaseModel):
    id: int
    equipment_id: int
    user_name: str
    user_email: str
    user_phone: Optional[str] = None
    quantity: int
    loan_date: str
    expected_return_date: str
    actual_return_date: Optional[str] = None
    status: str
    notes: Optional[str] = None
    admin_notes: Optional[str] = None
    created_at: Optional[datetime] = None
    equipment: Optional[EquipmentOut] = None

    class Config:
        from_attributes = True

# --- Teams ---
class TeamBase(BaseModel):
    name: str  # ex: Volley 1, Basket 1, Volley 3, Volley F
    sport: str  # Volley-ball, Basket-ball, etc.
    category: str = "Collectif"  # Collectif / Individuel
    gender: str = "Mixte"  # Mixte / Féminin
    captain: Optional[str] = None
    description: Optional[str] = None

class TeamCreate(TeamBase):
    pass

class TeamUpdate(BaseModel):
    name: Optional[str] = None
    sport: Optional[str] = None
    category: Optional[str] = None
    gender: Optional[str] = None
    captain: Optional[str] = None
    description: Optional[str] = None

class TeamOut(TeamBase):
    id: int
    created_at: Optional[datetime] = None
    matches_count: int = 0
    wins_count: int = 0
    losses_count: int = 0

    class Config:
        from_attributes = True

# --- University Matches ---
class UniversityMatchBase(BaseModel):
    team_id: Optional[int] = None
    sport: str
    category: str = "Collectif"  # Collectif / Individuel
    gender: str = "Mixte"  # Mixte / Féminin
    competition: str = "Championnat Académique FFSU Lorraine"
    team_home: str
    team_away: str
    match_date: str
    location: str
    status: str = "UPCOMING"
    score_home: Optional[int] = None
    score_away: Optional[int] = None
    details: Optional[str] = None

class UniversityMatchCreate(UniversityMatchBase):
    pass

class UniversityMatchUpdate(BaseModel):
    team_id: Optional[int] = None
    sport: Optional[str] = None
    category: Optional[str] = None
    gender: Optional[str] = None
    competition: Optional[str] = None
    team_home: Optional[str] = None
    team_away: Optional[str] = None
    match_date: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = None
    score_home: Optional[int] = None
    score_away: Optional[int] = None
    details: Optional[str] = None

class UniversityMatchOut(UniversityMatchBase):
    id: int
    created_at: Optional[datetime] = None
    team: Optional[TeamBase] = None

    class Config:
        from_attributes = True

# --- Tournaments ---
class TournamentResultBase(BaseModel):
    sport: str
    team_name: str
    ranking_position: str
    medal: str = "NONE"  # GOLD, SILVER, BRONZE, NONE
    summary: Optional[str] = None

class TournamentResultCreate(TournamentResultBase):
    tournament_id: int

class TournamentResultOut(TournamentResultBase):
    id: int
    tournament_id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TournamentBase(BaseModel):
    name: str
    edition: Optional[str] = None
    location: Optional[str] = None
    start_date: str
    end_date: str
    description: Optional[str] = None
    overall_ranking: Optional[str] = None
    image_url: Optional[str] = None

class TournamentCreate(TournamentBase):
    pass

class TournamentUpdate(BaseModel):
    name: Optional[str] = None
    edition: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None
    overall_ranking: Optional[str] = None
    image_url: Optional[str] = None

class TournamentOut(TournamentBase):
    id: int
    created_at: Optional[datetime] = None
    results: List[TournamentResultOut] = []

    class Config:
        from_attributes = True

# --- Nancy Events ---
class NancyEventBase(BaseModel):
    title: str
    category: str
    event_date: str
    location: str
    description: Optional[str] = None
    bds_participation: bool = True
    price_info: Optional[str] = None
    registration_link: Optional[str] = None
    image_url: Optional[str] = None
    is_featured: bool = False

class NancyEventCreate(NancyEventBase):
    pass

class NancyEventUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    event_date: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    bds_participation: Optional[bool] = None
    price_info: Optional[str] = None
    registration_link: Optional[str] = None
    image_url: Optional[str] = None
    is_featured: Optional[bool] = None

class NancyEventOut(NancyEventBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Dashboard Stats ---
class DashboardStatsOut(BaseModel):
    total_equipment: int
    available_equipment: int
    pending_loans: int
    active_loans: int
    upcoming_matches_count: int
    teams_count: int
    upcoming_events_count: int
    tournaments_count: int
