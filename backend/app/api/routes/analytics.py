from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.post import Post
from app.models.draft import Draft
from app.models.analytics import Analytics
from app.models.approval import Approval
from app.models.user import User
from app.schemas.common import AnalyticsOverview
from app.api.deps import get_current_user
import random

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/overview", response_model=AnalyticsOverview)
def get_overview(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    total = db.query(func.count(Post.id)).filter(Post.user_id == current_user.id).scalar() or 0
    scheduled = db.query(func.count(Post.id)).filter(Post.user_id == current_user.id, Post.status == "scheduled").scalar() or 0
    published = db.query(func.count(Post.id)).filter(Post.user_id == current_user.id, Post.status == "published").scalar() or 0
    failed = db.query(func.count(Post.id)).filter(Post.user_id == current_user.id, Post.status == "failed").scalar() or 0
    drafts = db.query(func.count(Draft.id)).filter(Draft.user_id == current_user.id).scalar() or 0
    pending = db.query(func.count(Approval.id)).filter(Approval.submitted_by == current_user.id, Approval.status == "pending").scalar() or 0
    return AnalyticsOverview(total_posts=total, scheduled_posts=scheduled, published_posts=published, failed_posts=failed, draft_posts=drafts, pending_approval=pending)


@router.get("/engagement")
def get_engagement(current_user: User = Depends(get_current_user)):
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    return [{"day": d, "likes": random.randint(50, 500), "shares": random.randint(10, 100), "comments": random.randint(20, 200)} for d in days]


@router.get("/monthly-growth")
def get_monthly_growth(current_user: User = Depends(get_current_user)):
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return [{"month": m, "followers": random.randint(1000, 10000), "reach": random.randint(5000, 50000)} for m in months]


@router.get("/platform-performance")
def get_platform_performance(current_user: User = Depends(get_current_user)):
    return [{"platform": p, "posts": random.randint(10, 100), "engagement": random.randint(500, 5000), "reach": random.randint(2000, 20000)} for p in ["LinkedIn", "Facebook", "Instagram", "X"]]
