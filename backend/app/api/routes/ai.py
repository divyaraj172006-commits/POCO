from fastapi import APIRouter, Depends
from app.models.user import User
from app.schemas.common import AIGenerateCaption, AIRewriteContent, AIGenerateHashtags, AIGenerateImage
from app.api.deps import get_current_user
import random

router = APIRouter(prefix="/ai", tags=["AI"])

CAPTION_TEMPLATES = {
    "professional": [
        "🚀 Excited to share our latest update on {topic}. This marks a significant milestone in our journey towards innovation and excellence.",
        "📊 Here's what we've learned about {topic} — and how it's reshaping the industry landscape for professionals everywhere.",
        "💡 {topic} isn't just a trend — it's the future. Here's how forward-thinking companies are leveraging it to drive results.",
    ],
    "marketing": [
        "🔥 BIG NEWS! We're launching something incredible related to {topic}. Are you ready? Stay tuned! 🎯",
        "⚡ Transform your business with {topic}. Limited time offer — don't miss out! Click the link below 👇",
        "🎯 Want to 10x your results with {topic}? Here's the secret strategy top brands are using right now.",
    ],
    "motivational": [
        "✨ Remember: every expert was once a beginner. Keep pushing forward with {topic} and watch the magic happen! 💪",
        "🌟 Success isn't about perfection — it's about progress. Your journey with {topic} starts with a single step.",
        "💫 Dream big, start small, act now. {topic} is your gateway to something extraordinary.",
    ],
    "friendly": [
        "Hey everyone! 👋 Just wanted to chat about {topic} and share some cool insights. What do you think? Let me know below!",
        "So I've been diving deep into {topic} lately, and wow — the things I've discovered are mind-blowing! Here's the scoop 🧵",
        "Happy to share my thoughts on {topic}! This is something I'm genuinely passionate about. Let's discuss! 💬",
    ],
}


@router.post("/generate-caption")
def generate_caption(data: AIGenerateCaption, current_user: User = Depends(get_current_user)):
    tone = data.tone or "professional"
    templates = CAPTION_TEMPLATES.get(tone, CAPTION_TEMPLATES["professional"])
    caption = random.choice(templates).format(topic=data.topic)
    return {"caption": caption, "tone": tone, "language": data.language}


@router.post("/rewrite-content")
def rewrite_content(data: AIRewriteContent, current_user: User = Depends(get_current_user)):
    content = data.content
    style = data.style
    if style == "shorter":
        words = content.split()
        rewritten = " ".join(words[:max(len(words) // 2, 10)])
        if len(words) > 10:
            rewritten += "..."
    elif style == "professional":
        rewritten = f"We are pleased to inform you: {content}"
    elif style == "friendly":
        rewritten = f"Hey! Check this out — {content} 😊"
    elif style == "strong_cta":
        rewritten = f"{content}\n\n👉 Take action NOW! Don't miss this opportunity. Click the link in bio!"
    else:
        rewritten = content
    return {"rewritten": rewritten, "style": style}


@router.post("/generate-hashtags")
def generate_hashtags(data: AIGenerateHashtags, current_user: User = Depends(get_current_user)):
    base_tags = ["marketing", "business", "growth", "digital", "socialmedia", "branding", "startup", "innovation", "AI", "tech", "success", "entrepreneur", "motivation", "leadership", "content", "strategy", "engagement", "trending", "viral", "community"]
    words = data.content.lower().split()
    custom_tags = [w.strip(".,!?#@") for w in words if len(w) > 4][:5]
    selected = random.sample(base_tags, min(data.count - len(custom_tags), len(base_tags)))
    all_tags = [f"#{t}" for t in custom_tags + selected]
    return {"hashtags": all_tags[:data.count]}


@router.post("/generate-image")
def generate_image(data: AIGenerateImage, current_user: User = Depends(get_current_user)):
    return {
        "image_url": f"https://placehold.co/1080x1080/6366f1/ffffff?text={data.prompt.replace(' ', '+')}",
        "prompt": data.prompt,
        "style": data.style,
        "message": "Mock AI image generated. Connect a real AI API for production images.",
    }
