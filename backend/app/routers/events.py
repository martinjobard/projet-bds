from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import NancyEvent
from ..schemas import NancyEventOut, NancyEventCreate, NancyEventUpdate
from ..auth import get_current_admin

router = APIRouter(prefix="/api/events", tags=["Événements Sportifs Nancy"])

@router.get("", response_model=List[NancyEventOut])
def list_events(
    category: Optional[str] = None,
    featured_only: bool = False,
    db: Session = Depends(get_db)
):
    query = db.query(NancyEvent)
    if category and category != "Tous":
        query = query.filter(NancyEvent.category == category)
    if featured_only:
        query = query.filter(NancyEvent.is_featured == True)

    return query.order_by(NancyEvent.event_date.asc()).all()

@router.get("/{event_id}", response_model=NancyEventOut)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(NancyEvent).filter(NancyEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Événement introuvable")
    return event

# --- ADMIN ---

@router.post("", response_model=NancyEventOut, status_code=status.HTTP_201_CREATED)
def create_event(payload: NancyEventCreate, db: Session = Depends(get_db), admin: dict = Depends(get_current_admin)):
    event = NancyEvent(**payload.dict())
    db.add(event)
    db.commit()
    db.refresh(event)
    return event

@router.put("/{event_id}", response_model=NancyEventOut)
def update_event(
    event_id: int,
    payload: NancyEventUpdate,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin)
):
    event = db.query(NancyEvent).filter(NancyEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Événement introuvable")

    for k, v in payload.dict(exclude_unset=True).items():
        setattr(event, k, v)

    db.commit()
    db.refresh(event)
    return event

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(event_id: int, db: Session = Depends(get_db), admin: dict = Depends(get_current_admin)):
    event = db.query(NancyEvent).filter(NancyEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Événement introuvable")
    db.delete(event)
    db.commit()
    return None
