from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, Float, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base

class CalendarEvent(Base):
    __tablename__ = "calendar_events"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, nullable=False)
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=True)
    
    # 时间段字段
    morning_7_8 = Column(String(255), nullable=True)
    morning_8_9 = Column(String(255), nullable=True) 
    morning_9_10 = Column(String(255), nullable=True)
    morning_10_11 = Column(String(255), nullable=True)
    morning_11_12 = Column(String(255), nullable=True)
    
    afternoon_12_13 = Column(String(255), nullable=True)
    afternoon_13_14 = Column(String(255), nullable=True)
    afternoon_14_15 = Column(String(255), nullable=True)
    afternoon_15_16 = Column(String(255), nullable=True)
    afternoon_16_17 = Column(String(255), nullable=True)
    afternoon_17_18 = Column(String(255), nullable=True)
    
    evening_18_19 = Column(String(255), nullable=True)
    evening_19_20 = Column(String(255), nullable=True)
    evening_20_21 = Column(String(255), nullable=True)
    evening_21_22 = Column(String(255), nullable=True)
    evening_22_23 = Column(String(255), nullable=True)
    evening_23_24 = Column(String(255), nullable=True)
    
    # 完成状态字段
    morning_completed = Column(Boolean, default=False)
    afternoon_completed = Column(Boolean, default=False)
    evening_completed = Column(Boolean, default=False)
    
    # 统计字段
    productivity_score = Column(Float, default=0.0)
    notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=True)
    priority = Column(String(20), default="medium")  # low, medium, high
    status = Column(String(20), default="pending")   # pending, in_progress, completed
    
    due_date = Column(DateTime, nullable=True)
    estimated_hours = Column(Float, nullable=True)
    actual_hours = Column(Float, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    color = Column(String(7), nullable=True)  # hex color
    description = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)