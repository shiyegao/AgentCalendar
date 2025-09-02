#!/usr/bin/env python3
"""
连接测试工具 - 检查前后端连接状态
"""

import requests
import json
from datetime import datetime

def test_backend_connection():
    """测试后端连接"""
    try:
        print("🔍 测试后端连接...")
        
        # 测试根路径
        response = requests.get('http://127.0.0.1:8000/', timeout=3)
        print(f"✅ 根路径: {response.status_code} - {response.json()['message']}")
        
        # 测试事件API
        response = requests.get('http://127.0.0.1:8000/api/v1/events', timeout=3)
        events = response.json()
        print(f"✅ 事件API: {response.status_code} - 找到 {len(events)} 个事件")
        
        # 显示第一个事件的详细信息（如果存在）
        if events:
            first_event = events[0]
            print(f"   📅 示例事件: {first_event.get('title')} ({first_event.get('date', 'N/A')[:10]})")
            print(f"   ⏰ 上午7-8: {first_event.get('morning_7_8', '空')[:20]}...")
        
        return True
        
    except requests.exceptions.ConnectionError:
        print("❌ 无法连接到后端服务 (http://127.0.0.1:8000)")
        print("   请确保运行了: ./run_dev.sh")
        return False
    except Exception as e:
        print(f"❌ 连接测试失败: {e}")
        return False

def test_frontend_connection():
    """测试前端连接"""
    try:
        print("\n🔍 测试前端连接...")
        response = requests.get('http://127.0.0.1:3000/', timeout=3)
        print(f"✅ 前端服务: {response.status_code}")
        return True
    except requests.exceptions.ConnectionError:
        print("❌ 无法连接到前端服务 (http://127.0.0.1:3000)")
        print("   请确保运行了: npm run dev")
        return False
    except Exception as e:
        print(f"❌ 前端连接测试失败: {e}")
        return False

def create_test_event():
    """创建测试事件"""
    try:
        print("\n🧪 创建测试事件...")
        test_event = {
            "date": datetime.now().isoformat(),
            "title": "测试事件",
            "morning_7_8": "测试内容：早餐",
            "morning_8_9": "测试内容：通勤",
            "afternoon_12_13": "测试内容：午餐",
            "evening_18_19": "测试内容：晚餐"
        }
        
        response = requests.post(
            'http://127.0.0.1:8000/api/v1/events',
            json=test_event,
            timeout=5
        )
        
        if response.status_code == 200:
            created_event = response.json()
            print(f"✅ 测试事件创建成功: ID {created_event.get('id')}")
            return True
        else:
            print(f"❌ 创建测试事件失败: {response.status_code}")
            print(f"   响应: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ 创建测试事件时出错: {e}")
        return False

def main():
    """主测试函数"""
    print("🧪 AgentCalendar 连接诊断工具")
    print("=" * 40)
    
    # 测试后端
    backend_ok = test_backend_connection()
    
    # 测试前端
    frontend_ok = test_frontend_connection()
    
    # 如果后端正常，创建测试事件
    if backend_ok:
        create_test_event()
    
    print("\n" + "=" * 40)
    if backend_ok and frontend_ok:
        print("🎉 所有服务运行正常！")
        print("   前端: http://127.0.0.1:3000")
        print("   后端: http://127.0.0.1:8000/docs")
    else:
        print("⚠️  部分服务存在问题，请检查:")
        if not backend_ok:
            print("   - 后端服务未启动或端口被占用")
        if not frontend_ok:
            print("   - 前端服务未启动或端口被占用")
        print("   建议重新运行: ./run_dev.sh")

if __name__ == "__main__":
    main()