import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/bds.db")
SECRET_KEY = os.getenv("SECRET_KEY", "bds-super-secret-key-change-in-production-2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7

# Mot de passe admin du bureau BDS
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "bds2026")

SCHOOL_NAME = os.getenv("SCHOOL_NAME", "BDS TELECOM Nancy")
