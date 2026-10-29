from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import UniversityMatch, Team
from ..schemas import (
    UniversityMatchOut, UniversityMatchCreate, UniversityMatchUpdate,
    TeamOut, TeamCreate, TeamUpdate
)
from ..auth import get_current_admin

router = APIRouter(prefix="/api/matches", tags=["Matchs Universitaires & Équipes"])

# --- TEAMS ENDPOINTS ---

@router.get("/teams", response_model=List[TeamOut])
def list_teams(
    sport: Optional[str] = None,
    category: Optional[str] = None,
    gender: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Team)
    if sport and sport != "Tous":
        query = query.filter(Team.sport == sport)
    if category and category != "Tous":
        query = query.filter(Team.category == category)
    if gender and gender != "Tous":
        query = query.filter(Team.gender == gender)

    teams = query.order_by(Team.sport.asc(), Team.name.asc()).all()
    results = []
    for t in teams:
        matches = db.query(UniversityMatch).filter(UniversityMatch.team_id == t.id).all()
        wins = 0
        losses = 0
        for m in matches:
            if m.status == "COMPLETED" and m.score_home is not None and m.score_away is not None:
                # Si notre équipe est à domicile ou à l'extérieur
                if "TELECOM" in m.team_home or t.name in m.team_home:
                    if m.score_home > m.score_away:
                        wins += 1
                    elif m.score_home < m.score_away:
                        losses += 1
                elif "TELECOM" in m.team_away or t.name in m.team_away:
                    if m.score_away > m.score_home:
                        wins += 1
                    elif m.score_away < m.score_home:
                        losses += 1

        team_dict = TeamOut.from_orm(t)
        team_dict.matches_count = len(matches)
        team_dict.wins_count = wins
        team_dict.losses_count = losses
        results.append(team_dict)

    return results

@router.get("/teams/{team_id}", response_model=TeamOut)
def get_team_detail(team_id: int, db: Session = Depends(get_db)):
    t = db.query(Team).filter(Team.id == team_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Équipe introuvable")

    matches = db.query(UniversityMatch).filter(UniversityMatch.team_id == t.id).all()
    wins = sum(1 for m in matches if m.status == "COMPLETED" and m.score_home is not None and m.score_away is not None and ((("TELECOM" in m.team_home or t.name in m.team_home) and m.score_home > m.score_away) or (("TELECOM" in m.team_away or t.name in m.team_away) and m.score_away > m.score_home)))
    losses = sum(1 for m in matches if m.status == "COMPLETED" and m.score_home is not None and m.score_away is not None and ((("TELECOM" in m.team_home or t.name in m.team_home) and m.score_home < m.score_away) or (("TELECOM" in m.team_away or t.name in m.team_away) and m.score_away < m.score_home)))

    team_dict = TeamOut.from_orm(t)
    team_dict.matches_count = len(matches)
    team_dict.wins_count = wins
    team_dict.losses_count = losses
    return team_dict

@router.post("/teams", response_model=TeamOut, status_code=status.HTTP_201_CREATED)
def create_team(payload: TeamCreate, db: Session = Depends(get_db), admin: dict = Depends(get_current_admin)):
    t = Team(**payload.dict())
    db.add(t)
    db.commit()
    db.refresh(t)
    team_dict = TeamOut.from_orm(t)
    team_dict.matches_count = 0
    team_dict.wins_count = 0
    team_dict.losses_count = 0
    return team_dict

@router.put("/teams/{team_id}", response_model=TeamOut)
def update_team(team_id: int, payload: TeamUpdate, db: Session = Depends(get_db), admin: dict = Depends(get_current_admin)):
    t = db.query(Team).filter(Team.id == team_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Équipe introuvable")
    for k, v in payload.dict(exclude_unset=True).items():
        setattr(t, k, v)
    db.commit()
    db.refresh(t)
    return get_team_detail(team_id, db)

@router.delete("/teams/{team_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_team(team_id: int, db: Session = Depends(get_db), admin: dict = Depends(get_current_admin)):
    t = db.query(Team).filter(Team.id == team_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Équipe introuvable")
    db.delete(t)
    db.commit()
    return None


# --- MATCHES ENDPOINTS ---

@router.get("", response_model=List[UniversityMatchOut])
def list_matches(
    sport: Optional[str] = None,
    category: Optional[str] = None,
    gender: Optional[str] = None,
    status_filter: Optional[str] = None,
    team_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(UniversityMatch)
    if sport and sport != "Tous":
        query = query.filter(UniversityMatch.sport == sport)
    if category and category != "Tous":
        query = query.filter(UniversityMatch.category == category)
    if gender and gender != "Tous":
        query = query.filter(UniversityMatch.gender == gender)
    if status_filter and status_filter != "ALL":
        query = query.filter(UniversityMatch.status == status_filter)
    if team_id:
        query = query.filter(UniversityMatch.team_id == team_id)

    return query.order_by(UniversityMatch.match_date.desc()).all()

@router.get("/{match_id}", response_model=UniversityMatchOut)
def get_match(match_id: int, db: Session = Depends(get_db)):
    match = db.query(UniversityMatch).filter(UniversityMatch.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match introuvable")
    return match

@router.post("", response_model=UniversityMatchOut, status_code=status.HTTP_201_CREATED)
def create_match(payload: UniversityMatchCreate, db: Session = Depends(get_db), admin: dict = Depends(get_current_admin)):
    m = UniversityMatch(**payload.dict())
    db.add(m)
    db.commit()
    db.refresh(m)
    return m

@router.put("/{match_id}", response_model=UniversityMatchOut)
def update_match(
    match_id: int,
    payload: UniversityMatchUpdate,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin)
):
    m = db.query(UniversityMatch).filter(UniversityMatch.id == match_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Match introuvable")

    for k, v in payload.dict(exclude_unset=True).items():
        setattr(m, k, v)

    db.commit()
    db.refresh(m)
    return m

@router.delete("/{match_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_match(match_id: int, db: Session = Depends(get_db), admin: dict = Depends(get_current_admin)):
    m = db.query(UniversityMatch).filter(UniversityMatch.id == match_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Match introuvable")
    db.delete(m)
    db.commit()
    return None
