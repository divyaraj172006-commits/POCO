from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from datetime import datetime, timezone

from app.core.database import get_db
from app.models.approval import Approval
from app.models.post import Post
from app.models.notification import Notification
from app.models.user import User
from app.schemas.common import ApprovalResponse, ApprovalAction
from app.api.deps import get_current_user, require_roles

router = APIRouter(prefix="/approvals", tags=["Approvals"])


@router.get("/", response_model=List[ApprovalResponse])
def list_approvals(
    status_filter: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Approval)
    # Reviewers/admins see all, others see only their own
    if current_user.role not in ("admin", "reviewer"):
        query = query.filter(Approval.submitted_by == current_user.id)
    if status_filter:
        query = query.filter(Approval.status == status_filter)
    approvals = query.order_by(Approval.created_at.desc()).all()
    return [ApprovalResponse.model_validate(a) for a in approvals]


@router.post("/{approval_id}/approve", response_model=ApprovalResponse)
def approve_post(
    approval_id: UUID,
    data: ApprovalAction,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "reviewer"])),
):
    approval = db.query(Approval).filter(Approval.id == approval_id).first()
    if not approval:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Approval not found")
    approval.status = "approved"
    approval.reviewed_by = current_user.id
    approval.reviewed_at = datetime.now(timezone.utc)
    approval.comment = data.comment

    # Update post status
    post = db.query(Post).filter(Post.id == approval.post_id).first()
    if post:
        post.status = "approved"

    # Notify the submitter
    notif = Notification(
        user_id=approval.submitted_by,
        title="Post Approved",
        message=f"Your post has been approved by {current_user.full_name}.",
        type="post_approved",
    )
    db.add(notif)
    db.commit()
    db.refresh(approval)
    return ApprovalResponse.model_validate(approval)


@router.post("/{approval_id}/reject", response_model=ApprovalResponse)
def reject_post(
    approval_id: UUID,
    data: ApprovalAction,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "reviewer"])),
):
    approval = db.query(Approval).filter(Approval.id == approval_id).first()
    if not approval:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Approval not found")
    approval.status = "rejected"
    approval.reviewed_by = current_user.id
    approval.reviewed_at = datetime.now(timezone.utc)
    approval.comment = data.comment

    post = db.query(Post).filter(Post.id == approval.post_id).first()
    if post:
        post.status = "draft"

    notif = Notification(
        user_id=approval.submitted_by,
        title="Post Rejected",
        message=f"Your post was rejected. Reason: {data.comment or 'No comment provided'}",
        type="post_rejected",
    )
    db.add(notif)
    db.commit()
    db.refresh(approval)
    return ApprovalResponse.model_validate(approval)
