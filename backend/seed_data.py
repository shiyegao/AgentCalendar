#!/usr/bin/env python3
"""
AgentCalendar 示例数据生成脚本
自动创建一些示例日程数据，便于测试和演示
"""

import asyncio
from datetime import datetime, timedelta
from app.core.database import SessionLocal
from app.models.calendar import CalendarEvent, Category

def create_sample_data():
    """创建示例数据"""
    db = SessionLocal()
    
    try:
        # 检查是否已有数据
        existing_events = db.query(CalendarEvent).count()
        if existing_events > 0:
            print(f"数据库中已有 {existing_events} 个事件，跳过数据创建")
            return
            
        # 创建分类
        categories = [
            Category(name="工作", color="#3B82F6", description="工作相关任务"),
            Category(name="学习", color="#10B981", description="学习和成长"),  
            Category(name="生活", color="#F59E0B", description="日常生活事务"),
            Category(name="健身", color="#EF4444", description="运动和健身"),
        ]
        
        for category in categories:
            db.add(category)
        
        # 创建近一周的示例事件
        base_date = datetime.now().date()
        sample_events = []
        
        for i in range(7):  # 创建7天的数据
            current_date = base_date + timedelta(days=i-3)  # 前3天到后3天
            
            event = CalendarEvent(
                date=datetime.combine(current_date, datetime.min.time()),
                title=f"日程 {current_date.strftime('%m-%d')}",
                category="工作",
                
                # 上午安排
                morning_7_8="早餐 + 新闻阅读",
                morning_8_9="通勤",
                morning_9_10="检查邮件和日程",
                morning_10_11="团队会议",
                morning_11_12="项目开发",
                
                # 下午安排  
                afternoon_12_13="午餐",
                afternoon_13_14="休息",
                afternoon_14_15="代码开发",
                afternoon_15_16="代码审查",
                afternoon_16_17="文档整理",
                afternoon_17_18="数据分析",
                
                # 晚上安排
                evening_18_19="晚餐",
                evening_19_20="散步",
                evening_20_21="阅读学习",
                evening_21_22="个人项目",
                evening_22_23="放松娱乐", 
                evening_23_24="准备就寝",
                
                # 完成状态（随机）
                morning_completed=i % 3 != 0,
                afternoon_completed=i % 2 == 0,
                evening_completed=i % 4 != 0,
                
                # 效率评分
                productivity_score=0.7 + (i * 0.05),
                notes=f"这是第{i+1}天的示例数据"
            )
            
            sample_events.append(event)
        
        # 批量插入
        db.add_all(sample_events)
        db.commit()
        
        print("✅ 示例数据创建成功！")
        print(f"创建了 {len(categories)} 个分类")
        print(f"创建了 {len(sample_events)} 个事件")
        print("\n现在您可以在界面中看到这些示例数据了！")
        
    except Exception as e:
        print(f"❌ 创建示例数据失败: {e}")
        db.rollback()
        
    finally:
        db.close()

if __name__ == "__main__":
    print("🌱 正在创建示例数据...")
    create_sample_data()