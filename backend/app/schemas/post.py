from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class PostCreate(BaseModel):
    title: Optional[str] = None
    caption: str
    image_url: Optional[str] = None
    platforms: List[str] = []
    hashtags: List[str] = []
    cta: Optional[str] = None


class PostUpdate(BaseModel):
    title: Optional[str] = None
    caption: Optional[str] = None
    image_url: Optional[str] = None
    platforms: Optional[List[str]] = None
    hashtags: Optional[List[str]] = None
    cta: Optional[str] = None
    status: Optional[str] = None


class PostResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: Optional[str] = None
    caption: str
    image_url: Optional[str] = None
    platforms: List[str] = []
    hashtags: List[str] = []
    cta: Optional[str] = None
    status: str
    published_at: Optional[datetime] = None
    failure_reason: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SchedulePostRequest(BaseModel):
    scheduled_at: datetime
    timezone: Optional[str] = "UTC"
    recurrence: Optional[str] = None  # daily, weekly, monthly


class ScheduledPostResponse(BaseModel):
    id: UUID
    post_id: UUID
    scheduled_at: datetime
    timezone: str
    recurrence: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
