from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.core.database import get_db
from app.models.social_account import SocialAccount
from app.models.user import User
from app.schemas.common import SocialAccountResponse
from app.api.deps import get_current_user
import uuid as uuid_mod

router = APIRouter(prefix="/accounts", tags=["Social Accounts"])


@router.get("/", response_model=List[SocialAccountResponse])
def list_accounts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    accounts = db.query(SocialAccount).filter(SocialAccount.user_id == current_user.id).all()
    return [SocialAccountResponse.model_validate(a) for a in accounts]


@router.post("/connect/{platform}", response_model=SocialAccountResponse)
def connect_account(platform: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    valid = ["linkedin", "facebook", "instagram", "x"]
    if platform not in valid:
        raise HTTPException(status_code=400, detail=f"Invalid platform. Must be one of: {valid}")
    existing = db.query(SocialAccount).filter(SocialAccount.user_id == current_user.id, SocialAccount.platform == platform).first()
    if existing:
        existing.is_connected = True
        existing.access_token = f"mock_token_{uuid_mod.uuid4().hex[:8]}"
        db.commit()
        db.refresh(existing)
        return SocialAccountResponse.model_validate(existing)
    account = SocialAccount(
        user_id=current_user.id,
        platform=platform,
        platform_user_id=f"mock_{uuid_mod.uuid4().hex[:8]}",
        access_token=f"mock_token_{uuid_mod.uuid4().hex[:8]}",
        profile_name=f"{current_user.full_name} ({platform.title()})",
        is_connected=True,
    )
    db.add(account)
    db.commit()
    db.refresh(account)
    return SocialAccountResponse.model_validate(account)


@router.delete("/{account_id}", status_code=status.HTTP_204_NO_CONTENT)
def disconnect_account(account_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    account = db.query(SocialAccount).filter(SocialAccount.id == account_id, SocialAccount.user_id == current_user.id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    account.is_connected = False
    db.commit()
