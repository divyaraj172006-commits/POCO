from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.api.routes import auth, posts, drafts, approvals, analytics, accounts, ai, notifications, settings as settings_routes

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="POCO - AI Social Media Platform",
    description="AI-Powered Social Media Auto Posting Platform",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(auth.router, prefix="/api")
app.include_router(posts.router, prefix="/api")
app.include_router(drafts.router, prefix="/api")
app.include_router(approvals.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(accounts.router, prefix="/api")
app.include_router(ai.router, prefix="/api")
app.include_router(notifications.router, prefix="/api")
app.include_router(settings_routes.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "POCO API is running", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "healthy"}
