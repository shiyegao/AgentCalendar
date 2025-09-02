#!/usr/bin/env python3
"""
AgentCalendar 启动脚本
快速启动前后端服务
"""

import os
import sys
import subprocess
import time
import threading
from pathlib import Path

def run_backend():
    """启动后端服务"""
    print("🚀 启动后端服务...")
    backend_dir = Path(__file__).parent / "backend"
    os.chdir(backend_dir)
    
    # 安装依赖
    subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], check=True)
    
    # 启动 FastAPI 服务
    subprocess.run([
        "uvicorn", 
        "app.main:app", 
        "--host", "0.0.0.0", 
        "--port", "8000",
        "--reload"
    ])

def run_frontend():
    """启动前端服务"""
    print("🎨 启动前端服务...")
    frontend_dir = Path(__file__).parent / "frontend"
    os.chdir(frontend_dir)
    
    # 安装依赖
    if not (frontend_dir / "node_modules").exists():
        print("📦 安装前端依赖...")
        subprocess.run(["npm", "install"], check=True)
    
    # 启动 Vite 开发服务器
    subprocess.run(["npm", "run", "dev"])

def main():
    """主函数"""
    print("=" * 60)
    print("🎯 AgentCalendar - 智能日程管理系统")
    print("=" * 60)
    print()
    print("正在启动服务...")
    print("- 后端API: http://localhost:8000")
    print("- 前端界面: http://localhost:3000")
    print()
    print("按 Ctrl+C 停止服务")
    print("=" * 60)
    
    try:
        # 在后台启动后端
        backend_thread = threading.Thread(target=run_backend)
        backend_thread.daemon = True
        backend_thread.start()
        
        # 等待后端启动
        time.sleep(3)
        
        # 启动前端（主线程）
        run_frontend()
        
    except KeyboardInterrupt:
        print("\n\n👋 正在停止服务...")
        sys.exit(0)

if __name__ == "__main__":
    main()