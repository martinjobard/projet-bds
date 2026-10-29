from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Equipment, EquipmentLoan
from ..schemas import (
    EquipmentOut, EquipmentCreate, EquipmentUpdate,
    LoanOut, LoanCreate, LoanStatusUpdate
)
from ..auth import get_current_admin

router = APIRouter(prefix="/api/equipment", tags=["Matériel & Emprunts"])

# --- PUBLIC ENDPOINTS ---

@router.get("", response_model=List[EquipmentOut])
def list_equipment(
    category: Optional[str] = None,
    search: Optional[str] = None,
    available_only: bool = False,
    db: Session = Depends(get_db)
):
    query = db.query(Equipment)
    if category and category != "Tous":
        query = query.filter(Equipment.category == category)
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(Equipment.name.ilike(search_fmt) | Equipment.description.ilike(search_fmt))
    if available_only:
        query = query.filter(Equipment.available_quantity > 0)
    return query.order_by(Equipment.name.asc()).all()

@router.get("/{equipment_id}", response_model=EquipmentOut)
def get_equipment_detail(equipment_id: int, db: Session = Depends(get_db)):
    eq = db.query(Equipment).filter(Equipment.id == equipment_id).first()
    if not eq:
        raise HTTPException(status_code=404, detail="Matériel non trouvé")
    return eq

@router.post("/loans", response_model=LoanOut, status_code=status.HTTP_201_CREATED)
def request_loan(payload: LoanCreate, db: Session = Depends(get_db)):
    eq = db.query(Equipment).filter(Equipment.id == payload.equipment_id).first()
    if not eq:
        raise HTTPException(status_code=404, detail="Matériel introuvable")
    if not payload.user_email.strip().lower().endswith("@telecomnancy.net"):
        raise HTTPException(
            status_code=400,
            detail="L'adresse email doit obligatoirement se terminer par @telecomnancy.net"
        )
    if payload.quantity <= 0:
        raise HTTPException(status_code=400, detail="La quantité doit être supérieure à 0")
    if payload.quantity > eq.available_quantity:
        raise HTTPException(
            status_code=400,
            detail=f"Quantité demandée ({payload.quantity}) indisponible. Seulement {eq.available_quantity} en stock."
        )

    loan = EquipmentLoan(
        equipment_id=payload.equipment_id,
        user_name=payload.user_name.strip(),
        user_email=payload.user_email.strip().lower(),
        user_phone=payload.user_phone.strip() if payload.user_phone else None,
        quantity=payload.quantity,
        loan_date=payload.loan_date,
        expected_return_date=payload.expected_return_date,
        status="PENDING",
        notes=payload.notes
    )
    db.add(loan)
    db.commit()
    db.refresh(loan)
    return loan

@router.get("/loans/my", response_model=List[LoanOut])
def get_my_loans(email: str = Query(..., description="Email étudiant"), db: Session = Depends(get_db)):
    return db.query(EquipmentLoan).filter(
        EquipmentLoan.user_email == email.strip().lower()
    ).order_by(EquipmentLoan.created_at.desc()).all()


# --- ADMIN ENDPOINTS ---

@router.post("", response_model=EquipmentOut, status_code=status.HTTP_201_CREATED)
def create_equipment(payload: EquipmentCreate, db: Session = Depends(get_db), admin: dict = Depends(get_current_admin)):
    eq = Equipment(**payload.dict())
    db.add(eq)
    db.commit()
    db.refresh(eq)
    return eq

@router.put("/{equipment_id}", response_model=EquipmentOut)
def update_equipment(
    equipment_id: int,
    payload: EquipmentUpdate,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin)
):
    eq = db.query(Equipment).filter(Equipment.id == equipment_id).first()
    if not eq:
        raise HTTPException(status_code=404, detail="Matériel non trouvé")

    update_data = payload.dict(exclude_unset=True)
    for field, val in update_data.items():
        setattr(eq, field, val)

    db.commit()
    db.refresh(eq)
    return eq

@router.delete("/{equipment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_equipment(equipment_id: int, db: Session = Depends(get_db), admin: dict = Depends(get_current_admin)):
    eq = db.query(Equipment).filter(Equipment.id == equipment_id).first()
    if not eq:
        raise HTTPException(status_code=404, detail="Matériel non trouvé")
    db.delete(eq)
    db.commit()
    return None

@router.get("/admin/loans", response_model=List[LoanOut])
def admin_list_loans(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin)
):
    query = db.query(EquipmentLoan)
    if status_filter and status_filter != "ALL":
        query = query.filter(EquipmentLoan.status == status_filter)
    return query.order_by(EquipmentLoan.created_at.desc()).all()

@router.put("/admin/loans/{loan_id}/status", response_model=LoanOut)
def update_loan_status(
    loan_id: int,
    payload: LoanStatusUpdate,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin)
):
    loan = db.query(EquipmentLoan).filter(EquipmentLoan.id == loan_id).first()
    if not loan:
        raise HTTPException(status_code=404, detail="Demande d'emprunt non trouvée")

    old_status = loan.status
    new_status = payload.status
    eq = loan.equipment

    # Logique de gestion du stock selon l'évolution du statut
    if old_status in ["PENDING", "REJECTED"] and new_status == "APPROVED":
        if eq.available_quantity < loan.quantity:
            raise HTTPException(status_code=400, detail="Stock insuffisant pour valider cet emprunt")
        eq.available_quantity = max(0, eq.available_quantity - loan.quantity)

    elif old_status == "APPROVED" and new_status == "RETURNED":
        eq.available_quantity = min(eq.total_quantity, eq.available_quantity + loan.quantity)
        loan.actual_return_date = payload.actual_return_date or datetime.utcnow().strftime("%Y-%m-%d")

    elif old_status == "APPROVED" and new_status in ["REJECTED", "CANCELLED"]:
        eq.available_quantity = min(eq.total_quantity, eq.available_quantity + loan.quantity)

    loan.status = new_status
    if payload.admin_notes is not None:
        loan.admin_notes = payload.admin_notes
    elif new_status == "RETURNED" and (not loan.admin_notes or "récupérer au local" in loan.admin_notes or "Validé par le BDS" in loan.admin_notes):
        loan.admin_notes = "Matériel bien restitué au BDS, tout est bon !"
    elif new_status == "APPROVED" and not loan.admin_notes:
        loan.admin_notes = "Validé par le BDS. Matériel à récupérer au local."
    elif new_status == "REJECTED" and not loan.admin_notes:
        loan.admin_notes = "Demande refusée par le BDS."

    db.commit()
    db.refresh(loan)
    return loan
