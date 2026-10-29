from fastapi import APIRouter, HTTPException, status, Depends
from ..schemas import AdminLoginRequest, TokenResponse, TokenVerifyResponse
from ..auth import verify_password, create_access_token, get_current_admin
from ..config import SCHOOL_NAME

router = APIRouter(prefix="/api/auth", tags=["Authentification"])

@router.post("/login", response_model=TokenResponse)
def login_admin(payload: AdminLoginRequest):
    if not verify_password(payload.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Mot de passe administrateur incorrect"
        )
    access_token = create_access_token({"sub": "admin"})
    return TokenResponse(access_token=access_token, school_name=SCHOOL_NAME)

@router.get("/verify", response_model=TokenVerifyResponse)
def verify_admin(current_admin: dict = Depends(get_current_admin)):
    return TokenVerifyResponse(valid=True, role="admin", school_name=SCHOOL_NAME)
