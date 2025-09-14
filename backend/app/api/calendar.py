from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date, timedelta
from pydantic import BaseModel

from ..core.database import get_db
from ..models.calendar import CalendarEvent

router = APIRouter()


# Pydantic 模型
class CalendarEventCreate(BaseModel):
    date: datetime
    title: str
    category: Optional[str] = None
    morning_7_8: Optional[str] = None
    morning_8_9: Optional[str] = None
    morning_9_10: Optional[str] = None
    morning_10_11: Optional[str] = None
    morning_11_12: Optional[str] = None
    afternoon_12_13: Optional[str] = None
    afternoon_13_14: Optional[str] = None
    afternoon_14_15: Optional[str] = None
    afternoon_15_16: Optional[str] = None
    afternoon_16_17: Optional[str] = None
    afternoon_17_18: Optional[str] = None
    evening_18_19: Optional[str] = None
    evening_19_20: Optional[str] = None
    evening_20_21: Optional[str] = None
    evening_21_22: Optional[str] = None
    evening_22_23: Optional[str] = None
    evening_23_24: Optional[str] = None
    notes: Optional[str] = None


class CalendarEventResponse(BaseModel):
    id: int
    date: datetime
    title: str
    category: Optional[str]
    morning_7_8: Optional[str]
    morning_8_9: Optional[str]
    morning_9_10: Optional[str]
    morning_10_11: Optional[str]
    morning_11_12: Optional[str]
    afternoon_12_13: Optional[str]
    afternoon_13_14: Optional[str]
    afternoon_14_15: Optional[str]
    afternoon_15_16: Optional[str]
    afternoon_16_17: Optional[str]
    afternoon_17_18: Optional[str]
    evening_18_19: Optional[str]
    evening_19_20: Optional[str]
    evening_20_21: Optional[str]
    evening_21_22: Optional[str]
    evening_22_23: Optional[str]
    evening_23_24: Optional[str]
    morning_completed: bool
    afternoon_completed: bool
    evening_completed: bool
    productivity_score: float
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


@router.get("/events", response_model=List[CalendarEventResponse])
def get_events(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(CalendarEvent)

    if start_date:
        query = query.filter(CalendarEvent.date >= start_date)
    if end_date:
        query = query.filter(CalendarEvent.date <= end_date)
    if category:
        query = query.filter(CalendarEvent.category == category)

    events = query.order_by(CalendarEvent.date).all()
    return events


@router.post("/events", response_model=CalendarEventResponse)
def create_event(event: CalendarEventCreate, db: Session = Depends(get_db)):
    db_event = CalendarEvent(**event.dict())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


@router.get("/events/{event_id}", response_model=CalendarEventResponse)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(CalendarEvent).filter(CalendarEvent.id == event_id).first()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.put("/events/{event_id}", response_model=CalendarEventResponse)
def update_event(
    event_id: int, event: CalendarEventCreate, db: Session = Depends(get_db)
):
    db_event = db.query(CalendarEvent).filter(CalendarEvent.id == event_id).first()
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")

    for field, value in event.dict().items():
        setattr(db_event, field, value)

    db_event.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_event)
    return db_event


@router.delete("/events/{event_id}")
def delete_event(event_id: int, db: Session = Depends(get_db)):
    db_event = db.query(CalendarEvent).filter(CalendarEvent.id == event_id).first()
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")

    db.delete(db_event)
    db.commit()
    return {"message": "Event deleted successfully"}


# 获取周视图数据
@router.get("/week/{year}/{week}")
def get_week_view(year: int, week: int, db: Session = Depends(get_db)):
    # 计算周的开始和结束日期
    start_date = datetime.strptime(f"{year}-W{week:02d}-1", "%Y-W%W-%w").date()
    end_date = start_date + timedelta(days=6)

    events = (
        db.query(CalendarEvent)
        .filter(CalendarEvent.date >= start_date, CalendarEvent.date <= end_date)
        .order_by(CalendarEvent.date)
        .all()
    )

    return {"start_date": start_date, "end_date": end_date, "events": events}


# 获取统计数据
@router.get("/stats/{year}/{month}")
def get_monthly_stats(year: int, month: int, db: Session = Depends(get_db)):
    start_date = datetime(year, month, 1)
    if month == 12:
        end_date = datetime(year + 1, 1, 1)
    else:
        end_date = datetime(year, month + 1, 1)

    events = (
        db.query(CalendarEvent)
        .filter(CalendarEvent.date >= start_date, CalendarEvent.date < end_date)
        .all()
    )

    total_events = len(events)
    completed_morning = sum(1 for event in events if event.morning_completed)
    completed_afternoon = sum(1 for event in events if event.afternoon_completed)
    completed_evening = sum(1 for event in events if event.evening_completed)

    avg_productivity = (
        sum(event.productivity_score for event in events) / total_events
        if total_events > 0
        else 0
    )

    return {
        "total_events": total_events,
        "completed_sessions": {
            "morning": completed_morning,
            "afternoon": completed_afternoon,
            "evening": completed_evening,
        },
        "average_productivity": avg_productivity,
    }
