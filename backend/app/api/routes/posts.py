from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from datetime import datetime, timezone

from app.core.database import get_db
from app.models.post import Post
from app.models.scheduled_post import ScheduledPost
from app.models.approval import Approval
from app.models.notification import Notification
from app.models.user import User
from app.schemas.post import PostCreate, PostUpdate, PostResponse, SchedulePostRequest, ScheduledPostResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/posts", tags=["Posts"])


@router.post("/", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
def create_post(data: PostCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = Post(
        user_id=current_user.id,
        title=data.title,
        caption=data.caption,
        image_url=data.image_url,
        platforms=data.platforms,
        hashtags=data.hashtags,
        cta=data.cta,
        status="draft",
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return PostResponse.model_validate(post)


@router.get("/", response_model=List[PostResponse])
def list_posts(
    status_filter: Optional[str] = None,
    platform: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Post).filter(Post.user_id == current_user.id)
    if status_filter:
        query = query.filter(Post.status == status_filter)
    posts = query.order_by(Post.created_at.desc()).all()
    return [PostResponse.model_validate(p) for p in posts]


@router.get("/{post_id}", response_model=PostResponse)
def get_post(post_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = db.query(Post).filter(Post.id == post_id, Post.user_id == current_user.id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    return PostResponse.model_validate(post)


@router.put("/{post_id}", response_model=PostResponse)
def update_post(post_id: UUID, data: PostUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = db.query(Post).filter(Post.id == post_id, Post.user_id == current_user.id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(post, key, value)
    db.commit()
    db.refresh(post)
    return PostResponse.model_validate(post)


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(post_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = db.query(Post).filter(Post.id == post_id, Post.user_id == current_user.id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    db.delete(post)
    db.commit()


@router.post("/{post_id}/publish", response_model=PostResponse)
def publish_post(post_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = db.query(Post).filter(Post.id == post_id, Post.user_id == current_user.id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    post.status = "published"
    post.published_at = datetime.now(timezone.utc)
    # Create notification
    notif = Notification(
        user_id=current_user.id,
        title="Post Published",
        message=f"Your post '{post.title or 'Untitled'}' has been published successfully.",
        type="post_published",
    )
    db.add(notif)
    db.commit()
    db.refresh(post)
    return PostResponse.model_validate(post)


@router.post("/{post_id}/schedule", response_model=ScheduledPostResponse)
def schedule_post(
    post_id: UUID,
    data: SchedulePostRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.query(Post).filter(Post.id == post_id, Post.user_id == current_user.id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    post.status = "scheduled"
    scheduled = ScheduledPost(
        post_id=post.id,
        user_id=current_user.id,
        scheduled_at=data.scheduled_at,
        timezone=data.timezone,
        recurrence=data.recurrence,
    )
    db.add(scheduled)
    db.commit()
    db.refresh(scheduled)
    return ScheduledPostResponse.model_validate(scheduled)


@router.post("/{post_id}/send-approval", response_model=PostResponse)
def send_for_approval(post_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = db.query(Post).filter(Post.id == post_id, Post.user_id == current_user.id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    post.status = "pending_approval"
    approval = Approval(
        post_id=post.id,
        submitted_by=current_user.id,
    )
    db.add(approval)
    db.commit()
    db.refresh(post)
    return PostResponse.model_validate(post)
