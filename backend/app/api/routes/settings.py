from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash
from app.models.user import User
from app.models.brand_settings import BrandSettings
from app.schemas.auth import ProfileUpdate, ChangePasswordRequest, UserResponse
from app.schemas.common import BrandSettingsUpdate, BrandSettingsResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/settings", tags=["Settings"])


@router.get("/profile", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)


@router.put("/profile", response_model=UserResponse)
def update_profile(data: ProfileUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if data.full_name:
        current_user.full_name = data.full_name
    if data.avatar_url is not None:
        current_user.avatar_url = data.avatar_url
    db.commit()
    db.refresh(current_user)
    return UserResponse.model_validate(current_user)


@router.put("/password")
def change_password(data: ChangePasswordRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not verify_password(data.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    current_user.password_hash = get_password_hash(data.new_password)
    db.commit()
    return {"message": "Password changed successfully"}


@router.get("/brand", response_model=BrandSettingsResponse)
def get_brand(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    brand = db.query(BrandSettings).filter(BrandSettings.user_id == current_user.id).first()
    if not brand:
        brand = BrandSettings(user_id=current_user.id)
        db.add(brand)
        db.commit()
        db.refresh(brand)
    return BrandSettingsResponse.model_validate(brand)


@router.put("/brand", response_model=BrandSettingsResponse)
def update_brand(data: BrandSettingsUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    brand = db.query(BrandSettings).filter(BrandSettings.user_id == current_user.id).first()
    if not brand:
        brand = BrandSettings(user_id=current_user.id)
        db.add(brand)
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(brand, key, value)
    db.commit()
    db.refresh(brand)
    return BrandSettingsResponse.model_validate(brand)
