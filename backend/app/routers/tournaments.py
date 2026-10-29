from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Tournament, TournamentResult
from ..schemas import (
    TournamentOut, TournamentCreate, TournamentUpdate,
    TournamentResultOut, TournamentResultCreate
)
from ..auth import get_current_admin

router = APIRouter(prefix="/api/tournaments", tags=["Tournois & Résultats"])

@router.get("", response_model=List[TournamentOut])
def list_tournaments(db: Session = Depends(get_db)):
    return db.query(Tournament).order_by(Tournament.start_date.desc()).all()

@router.get("/{tournament_id}", response_model=TournamentOut)
def get_tournament(tournament_id: int, db: Session = Depends(get_db)):
    tournament = db.query(Tournament).filter(Tournament.id == tournament_id).first()
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournoi introuvable")
    return tournament

# --- ADMIN ---

@router.post("", response_model=TournamentOut, status_code=status.HTTP_201_CREATED)
def create_tournament(payload: TournamentCreate, db: Session = Depends(get_db), admin: dict = Depends(get_current_admin)):
    t = Tournament(**payload.dict())
    db.add(t)
    db.commit()
    db.refresh(t)
    return t

@router.put("/{tournament_id}", response_model=TournamentOut)
def update_tournament(
    tournament_id: int,
    payload: TournamentUpdate,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin)
):
    t = db.query(Tournament).filter(Tournament.id == tournament_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Tournoi introuvable")

    for k, v in payload.dict(exclude_unset=True).items():
        setattr(t, k, v)

    db.commit()
    db.refresh(t)
    return t

@router.delete("/{tournament_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tournament(tournament_id: int, db: Session = Depends(get_db), admin: dict = Depends(get_current_admin)):
    t = db.query(Tournament).filter(Tournament.id == tournament_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Tournoi introuvable")
    db.delete(t)
    db.commit()
    return None

@router.post("/{tournament_id}/results", response_model=TournamentResultOut, status_code=status.HTTP_201_CREATED)
def add_tournament_result(
    tournament_id: int,
    payload: TournamentResultCreate,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin)
):
    t = db.query(Tournament).filter(Tournament.id == tournament_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Tournoi introuvable")

    res = TournamentResult(
        tournament_id=tournament_id,
        sport=payload.sport.strip(),
        team_name=payload.team_name.strip(),
        ranking_position=payload.ranking_position.strip(),
        medal=payload.medal,
        summary=payload.summary
    )
    db.add(res)
    db.commit()
    db.refresh(res)
    return res

@router.delete("/results/{result_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tournament_result(result_id: int, db: Session = Depends(get_db), admin: dict = Depends(get_current_admin)):
    r = db.query(TournamentResult).filter(TournamentResult.id == result_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Résultat introuvable")
    db.delete(r)
    db.commit()
    return None
