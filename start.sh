#!/bin/bash

echo "🚀 启动 AgentCalendar..."

# 启动后端服务器
echo "📦 启动后端服务器..."
cd backend
uv run python run.py &
BACKEND_PID=$!
cd ..

# 等待后端启动
sleep 2

# 启动前端服务器
echo "🎨 启动前端服务器..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ AgentCalendar 已启动！"
echo "   前端: http://localhost:3000"
echo "   后端: http://localhost:8000"
echo ""
echo "按 Ctrl+C 停止服务器..."

# 捕获 Ctrl+C 信号
trap "echo '正在停止服务器...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT

# 等待进程
wait $BACKEND_PID $FRONTEND_PID