from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import Equipment, EquipmentLoan, Tournament, NancyEvent, UniversityMatch, Team
from ..schemas import DashboardStatsOut
from ..auth import get_current_admin

router = APIRouter(prefix="/api/stats", tags=["Statistiques & Dashboard"])

@router.get("/dashboard", response_model=DashboardStatsOut)
def get_dashboard_stats(db: Session = Depends(get_db), admin: dict = Depends(get_current_admin)):
    total_eq = db.query(func.sum(Equipment.total_quantity)).scalar() or 0
    available_eq = db.query(func.sum(Equipment.available_quantity)).scalar() or 0
    pending_loans = db.query(EquipmentLoan).filter(EquipmentLoan.status == "PENDING").count()
    active_loans = db.query(EquipmentLoan).filter(EquipmentLoan.status == "APPROVED").count()
    upcoming_matches = db.query(UniversityMatch).filter(UniversityMatch.status == "UPCOMING").count()
    teams_count = db.query(Team).count()
    upcoming_events = db.query(NancyEvent).count()
    tournaments = db.query(Tournament).count()

    return DashboardStatsOut(
        total_equipment=total_eq,
        available_equipment=available_eq,
        pending_loans=pending_loans,
        active_loans=active_loans,
        upcoming_matches_count=upcoming_matches,
        teams_count=teams_count,
        upcoming_events_count=upcoming_events,
        tournaments_count=tournaments
    )
