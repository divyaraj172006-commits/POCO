from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.core.database import get_db
from app.models.draft import Draft
from app.models.post import Post
from app.models.user import User
from app.schemas.common import DraftCreate, DraftUpdate, DraftResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/drafts", tags=["Drafts"])


@router.post("/", response_model=DraftResponse, status_code=status.HTTP_201_CREATED)
def save_draft(data: DraftCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    draft = Draft(
        user_id=current_user.id,
        title=data.title,
        caption=data.caption,
        image_url=data.image_url,
        platforms=data.platforms,
        hashtags=data.hashtags,
        cta=data.cta,
    )
    db.add(draft)
    db.commit()
    db.refresh(draft)
    return DraftResponse.model_validate(draft)


@router.get("/", response_model=List[DraftResponse])
def list_drafts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    drafts = db.query(Draft).filter(Draft.user_id == current_user.id).order_by(Draft.updated_at.desc()).all()
    return [DraftResponse.model_validate(d) for d in drafts]


@router.put("/{draft_id}", response_model=DraftResponse)
def update_draft(draft_id: UUID, data: DraftUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    draft = db.query(Draft).filter(Draft.id == draft_id, Draft.user_id == current_user.id).first()
    if not draft:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Draft not found")
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(draft, key, value)
    db.commit()
    db.refresh(draft)
    return DraftResponse.model_validate(draft)


@router.delete("/{draft_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_draft(draft_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    draft = db.query(Draft).filter(Draft.id == draft_id, Draft.user_id == current_user.id).first()
    if not draft:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Draft not found")
    db.delete(draft)
    db.commit()


@router.post("/{draft_id}/duplicate", response_model=DraftResponse)
def duplicate_draft(draft_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    draft = db.query(Draft).filter(Draft.id == draft_id, Draft.user_id == current_user.id).first()
    if not draft:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Draft not found")
    new_draft = Draft(
        user_id=current_user.id,
        title=f"{draft.title} (Copy)" if draft.title else "Untitled (Copy)",
        caption=draft.caption,
        image_url=draft.image_url,
        platforms=draft.platforms,
        hashtags=draft.hashtags,
        cta=draft.cta,
    )
    db.add(new_draft)
    db.commit()
    db.refresh(new_draft)
    return DraftResponse.model_validate(new_draft)


@router.post("/{draft_id}/convert")
def convert_to_post(draft_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    draft = db.query(Draft).filter(Draft.id == draft_id, Draft.user_id == current_user.id).first()
    if not draft:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Draft not found")
    post = Post(
        user_id=current_user.id,
        title=draft.title,
        caption=draft.caption or "",
        image_url=draft.image_url,
        platforms=draft.platforms,
        hashtags=draft.hashtags,
        cta=draft.cta,
        status="draft",
    )
    db.add(post)
    db.delete(draft)
    db.commit()
    db.refresh(post)
    return {"message": "Draft converted to post", "post_id": str(post.id)}
