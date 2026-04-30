from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class DraftCreate(BaseModel):
    title: Optional[str] = None
    caption: Optional[str] = None
    image_url: Optional[str] = None
    platforms: List[str] = []
    hashtags: List[str] = []
    cta: Optional[str] = None


class DraftUpdate(BaseModel):
    title: Optional[str] = None
    caption: Optional[str] = None
    image_url: Optional[str] = None
    platforms: Optional[List[str]] = None
    hashtags: Optional[List[str]] = None
    cta: Optional[str] = None


class DraftResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: Optional[str] = None
    caption: Optional[str] = None
    image_url: Optional[str] = None
    platforms: List[str] = []
    hashtags: List[str] = []
    cta: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ApprovalResponse(BaseModel):
    id: UUID
    post_id: UUID
    submitted_by: UUID
    reviewed_by: Optional[UUID] = None
    status: str
    comment: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ApprovalAction(BaseModel):
    comment: Optional[str] = None


class NotificationResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    message: str
    type: Optional[str] = None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


class AnalyticsOverview(BaseModel):
    total_posts: int = 0
    scheduled_posts: int = 0
    published_posts: int = 0
    failed_posts: int = 0
    draft_posts: int = 0
    pending_approval: int = 0
    total_likes: int = 0
    total_shares: int = 0
    total_comments: int = 0
    total_reach: int = 0
    total_clicks: int = 0


class SocialAccountResponse(BaseModel):
    id: UUID
    platform: str
    profile_name: Optional[str] = None
    profile_image: Optional[str] = None
    is_connected: bool
    connected_at: datetime

    class Config:
        from_attributes = True


class BrandSettingsUpdate(BaseModel):
    logo_url: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    font_family: Optional[str] = None


class BrandSettingsResponse(BaseModel):
    id: UUID
    logo_url: Optional[str] = None
    primary_color: str
    secondary_color: str
    font_family: str

    class Config:
        from_attributes = True


class AIGenerateCaption(BaseModel):
    topic: str
    tone: Optional[str] = "professional"  # professional, marketing, motivational, friendly
    language: Optional[str] = "english"


class AIRewriteContent(BaseModel):
    content: str
    style: str  # professional, friendly, shorter, strong_cta


class AIGenerateHashtags(BaseModel):
    content: str
    count: Optional[int] = 10


class AIGenerateImage(BaseModel):
    prompt: str
    style: Optional[str] = "modern"  # modern, minimal, vibrant
    brand_colors: Optional[List[str]] = None
