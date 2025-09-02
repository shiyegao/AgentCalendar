# AgentCalendar - 高密度信息日程管理系统

## 项目概述
基于您的Excel模板设计的高信息密度日程管理应用，支持自定义页面、数据串联统计和多尺度可视化。

![AgentCalendar Preview](https://via.placeholder.com/800x400/0a0a0a/00ff00?text=AgentCalendar+Preview)

## 🎯 核心功能
- ✅ **高信息密度表格** - 类似Excel的时间段网格布局
- ✅ **多视图切换** - 日/周/月/年四种时间尺度
- ✅ **双主题系统** - 极客风⚡ 和极简风🎨 
- ✅ **实时编辑** - 点击单元格直接编辑
- ✅ **智能统计** - 自动分析完成率和效率
- ✅ **响应式设计** - 支持桌面/平板/移动端

## 🚀 快速开始

### 环境要求
- Python 3.8+ 
- Node.js 16+
- uv (推荐) 或 pip

### 一键启动
```bash
# 克隆项目
git clone <repo-url>
cd AgentCalendar

# 一键启动（推荐）
./run_dev.sh

# 或使用Python启动脚本
python start.py
```

### 访问应用
- 🎨 前端界面: http://localhost:3000
- 🔧 后端API: http://localhost:8000  
- 📖 API文档: http://localhost:8000/docs

## 🛠️ 技术栈
- **后端**: Python + FastAPI + SQLAlchemy + SQLite
- **前端**: React + TypeScript + Tailwind CSS
- **状态管理**: Zustand
- **构建工具**: Vite + uv
- **数据库**: SQLite (可扩展至PostgreSQL)

## 项目结构
```
AgentCalendar/
├── backend/           # Python FastAPI 后端
│   ├── app/
│   │   ├── models/    # 数据模型
│   │   ├── api/       # API 路由
│   │   ├── core/      # 核心配置
│   │   └── services/  # 业务逻辑
│   └── requirements.txt
├── frontend/          # React 前端
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── stores/
│   │   └── utils/
│   └── package.json
└── README.md
```

## 特色功能
1. **表格式日程管理** - 类似Excel的网格布局，支持复杂的时间段规划
2. **智能统计** - 自动计算工作量、效率指标等
3. **主题切换** - 极客风（深色+代码风格）和极简风（浅色+简洁）
4. **数据导出** - 支持Excel、PDF等格式导出