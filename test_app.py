#!/usr/bin/env python3
"""
AgentCalendar 应用测试脚本
快速测试前后端服务是否正常工作
"""

import requests
import time
import subprocess
import threading
import sys
from pathlib import Path

def test_backend():
    """测试后端API"""
    try:
        # 测试根路径
        response = requests.get('http://localhost:8000/', timeout=5)
        print(f"✅ 后端根路径: {response.status_code} - {response.json()}")
        
        # 测试API文档
        response = requests.get('http://localhost:8000/docs', timeout=5)
        print(f"✅ API文档: {response.status_code}")
        
        # 测试获取事件
        response = requests.get('http://localhost:8000/api/v1/events', timeout=5)
        print(f"✅ 事件API: {response.status_code} - 数据量: {len(response.json())}")
        
        return True
        
    except Exception as e:
        print(f"❌ 后端测试失败: {e}")
        return False

def test_frontend():
    """测试前端服务"""
    try:
        response = requests.get('http://localhost:3000/', timeout=5)
        print(f"✅ 前端服务: {response.status_code}")
        return True
    except Exception as e:
        print(f"❌ 前端测试失败: {e}")
        return False

def main():
    print("🧪 AgentCalendar 服务测试")
    print("=" * 40)
    
    print("\n1. 测试后端服务 (localhost:8000)...")
    if test_backend():
        print("✅ 后端服务正常")
    else:
        print("❌ 后端服务异常")
        return
    
    print("\n2. 测试前端服务 (localhost:3000)...")  
    if test_frontend():
        print("✅ 前端服务正常")
    else:
        print("❌ 前端服务异常")
        return
        
    print("\n🎉 所有服务运行正常！")
    print("- 前端界面: http://localhost:3000")
    print("- API文档: http://localhost:8000/docs")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--help":
        print("用法:")
        print("  python test_app.py          # 测试服务")
        print("  python test_app.py --help   # 显示帮助")
        sys.exit(0)
        
    main()