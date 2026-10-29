from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Equipment(Base):
    __tablename__ = "equipment"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    category = Column(String(60), nullable=False, default="Général")
    total_quantity = Column(Integer, default=1)
    available_quantity = Column(Integer, default=1)
    image_url = Column(String(500), nullable=True)
    condition = Column(String(50), default="Bon état")
    replacement_price = Column(Float, default=0.0)  # Prix de rachat en cas de perte / dégradation
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    loans = relationship("EquipmentLoan", back_populates="equipment", cascade="all, delete-orphan")


class EquipmentLoan(Base):
    __tablename__ = "equipment_loans"

    id = Column(Integer, primary_key=True, index=True)
    equipment_id = Column(Integer, ForeignKey("equipment.id", ondelete="CASCADE"), nullable=False)
    user_name = Column(String(100), nullable=False)
    user_email = Column(String(120), nullable=False, index=True)  # Doit se terminer par @telecomnancy.net
    user_phone = Column(String(30), nullable=True)
    quantity = Column(Integer, default=1)
    loan_date = Column(String(50), nullable=False)  # YYYY-MM-DD
    expected_return_date = Column(String(50), nullable=False)
    actual_return_date = Column(String(50), nullable=True)
    status = Column(String(30), default="PENDING")  # PENDING, APPROVED, RETURNED, REJECTED, LATE
    notes = Column(Text, nullable=True)
    admin_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    equipment = relationship("Equipment", back_populates="loans")


class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(80), nullable=False)  # ex: Volley 1, Basket 1, Volley 3, Volley F
    sport = Column(String(60), nullable=False)  # Volley-ball, Basket-ball, Football, etc.
    category = Column(String(30), nullable=False, default="Collectif")  # Collectif / Individuel
    gender = Column(String(20), nullable=False, default="Mixte")  # Mixte / Féminin uniquement !
    captain = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    matches = relationship("UniversityMatch", back_populates="team", cascade="all, delete-orphan")


class UniversityMatch(Base):
    __tablename__ = "university_matches"

    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id", ondelete="SET NULL"), nullable=True)
    sport = Column(String(60), nullable=False)  # Volley-ball, Basket-ball, etc.
    category = Column(String(30), nullable=False, default="Collectif")  # Collectif / Individuel
    gender = Column(String(20), nullable=False, default="Mixte")  # Mixte / Féminin uniquement
    competition = Column(String(120), default="Championnat Académique FFSU Lorraine")
    team_home = Column(String(80), nullable=False)
    team_away = Column(String(80), nullable=False)
    match_date = Column(String(50), nullable=False)  # YYYY-MM-DD HH:MM
    location = Column(String(120), nullable=False)
    status = Column(String(30), default="UPCOMING")  # UPCOMING, LIVE, COMPLETED, POSTPONED
    score_home = Column(Integer, nullable=True)
    score_away = Column(Integer, nullable=True)
    details = Column(String(200), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    team = relationship("Team", back_populates="matches")


class Tournament(Base):
    __tablename__ = "tournaments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    edition = Column(String(50), nullable=True)
    location = Column(String(120), nullable=True)
    start_date = Column(String(50), nullable=False)
    end_date = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)
    overall_ranking = Column(String(100), nullable=True)
    image_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    results = relationship("TournamentResult", back_populates="tournament", cascade="all, delete-orphan")


class TournamentResult(Base):
    __tablename__ = "tournament_results"

    id = Column(Integer, primary_key=True, index=True)
    tournament_id = Column(Integer, ForeignKey("tournaments.id", ondelete="CASCADE"), nullable=False)
    sport = Column(String(80), nullable=False)
    team_name = Column(String(80), nullable=False)
    ranking_position = Column(String(80), nullable=False)
    medal = Column(String(20), default="NONE")  # GOLD, SILVER, BRONZE, NONE
    summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    tournament = relationship("Tournament", back_populates="results")


class NancyEvent(Base):
    __tablename__ = "nancy_events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    category = Column(String(80), nullable=False)
    event_date = Column(String(50), nullable=False)
    location = Column(String(120), nullable=False)
    description = Column(Text, nullable=True)
    bds_participation = Column(Boolean, default=True)
    price_info = Column(String(100), nullable=True)
    registration_link = Column(String(500), nullable=True)
    image_url = Column(String(500), nullable=True)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
