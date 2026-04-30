import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.core.database import Base


class Post(Base):
    __tablename__ = "posts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(500), nullable=True)
    caption = Column(Text, nullable=False)
    image_url = Column(Text, nullable=True)
    platforms = Column(JSONB, default=[])
    hashtags = Column(JSONB, default=[])
    cta = Column(String(100), nullable=True)
    status = Column(String(20), default="draft")  # draft, pending_approval, approved, scheduled, processing, published, failed
    published_at = Column(DateTime(timezone=True), nullable=True)
    failure_reason = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="posts")
    scheduled_post = relationship("ScheduledPost", back_populates="post", uselist=False, cascade="all, delete-orphan")
    approval = relationship("Approval", back_populates="post", uselist=False, cascade="all, delete-orphan")
    analytics_data = relationship("Analytics", back_populates="post", cascade="all, delete-orphan")
