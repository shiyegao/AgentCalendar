from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import calendar
from .core.database import engine
from .models.calendar import Base

# 创建数据库表
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AgentCalendar API", version="1.0.0")

# CORS 设置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React 开发服务器
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 包含路由
app.include_router(calendar.router, prefix="/api/v1", tags=["calendar"])

@app.get("/")
def read_root():
    return {"message": "AgentCalendar API is running!"}