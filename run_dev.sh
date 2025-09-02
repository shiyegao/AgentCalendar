#!/bin/bash

# AgentCalendar 开发环境启动脚本

echo "🎯 AgentCalendar - 智能日程管理系统"
echo "======================================"
echo

# 检查 uv 是否安装
if ! command -v uv &> /dev/null; then
    echo "❌ uv 未安装，请先安装 uv:"
    echo "curl -LsSf https://astral.sh/uv/install.sh | sh"
    exit 1
fi

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

echo "🔧 设置后端环境..."

# 创建Python虚拟环境并安装依赖
cd backend
if [ ! -d ".venv" ]; then
    echo "创建虚拟环境..."
    uv venv
fi

# 激活虚拟环境并安装依赖
source .venv/bin/activate
echo "安装后端依赖..."
uv pip install -r requirements.txt

# 创建示例数据（首次启动）
if [ ! -f "calendar.db" ]; then
    echo "📊 创建示例数据..."
    python seed_data.py
fi

# 启动后端服务（后台）
echo "🚀 启动后端服务 (localhost:8000)..."
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload &
BACKEND_PID=$!

cd ../frontend

# 安装前端依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装前端依赖..."
    npm install
fi

# 启动前端服务
echo "🎨 启动前端服务 (localhost:3000)..."
echo
echo "服务已启动:"
echo "- 后端API: http://localhost:8000"
echo "- 前端界面: http://localhost:3000"
echo
echo "按 Ctrl+C 停止所有服务"
echo "======================================"

# 启动前端（前台）
npm run dev

# 清理后台进程
kill $BACKEND_PID 2>/dev/null