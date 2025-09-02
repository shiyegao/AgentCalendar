# AgentCalendar - 高密度信息日程管理系统

## 项目概述
基于Excel模板设计理念的高信息密度日程管理应用，支持自定义页面、数据串联统计和多尺度可视化。

![AgentCalendar Preview](https://via.placeholder.com/800x400/0a0a0a/00ff00?text=AgentCalendar+Preview)

## 🎯 核心功能
- ✅ **高信息密度表格** - 类似Excel的时间段网格布局（7:00-24:00精确到小时）
- ✅ **多视图切换** - 日/周/月/年四种时间尺度
- ✅ **双主题系统** - 极客风⚡（暗色科技感）和极简风🎨（明亮简洁）
- ✅ **实时编辑** - 点击单元格直接编辑
- ✅ **智能统计** - 月度/年度数据可视化分析
- ✅ **任务管理** - 看板式任务管理，支持拖拽排序
- ✅ **日期导航** - 快速日期选择器，支持任意日期跳转

## 🚀 快速开始

### 环境要求
- Python 3.8+ 
- Node.js 16+
- uv (推荐) 或 pip

### 安装步骤

1. **克隆项目**
```bash
git clone <repo-url>
cd AgentCalendar
```

2. **安装依赖**
```bash
# 前端依赖
cd frontend && npm install

# 后端依赖（使用uv）
cd ../backend && uv venv && uv pip install -r requirements.txt
```

3. **一键启动**
```bash
# 使用启动脚本（推荐）
chmod +x start.sh
./start.sh

# 或分别启动
# 终端1: cd backend && uv run python run.py
# 终端2: cd frontend && npm run dev
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

## 🆕 最新更新 (v2.0.0)

### 1. 📅 日期选择器功能
- 点击顶部日期弹出选择框
- 支持快速跳转到任意日期
- 添加日历图标提示
- 支持键盘快捷键（Enter确认）

### 2. 📊 统计图表视图
月视图和年视图升级为完整的数据分析页面：
- **关键指标卡片**：总时长、完成任务、效率评分
- **时间段分布图**：早晨/下午/晚上时间利用可视化
- **趋势分析图**：月度/日度使用趋势
- **活动分类饼图**：自动识别活动类型（会议、学习、工作、运动、休息）

### 3. 📝 任务管理系统
全新看板式任务管理：
- **自定义栏目**：创建个性化工作流
- **拖拽操作**：任务和栏目均支持拖拽排序
- **任务属性**：优先级标记、创建时间
- **灵活管理**：完整的增删改功能

## 特色功能
1. **表格式日程管理** - 类似Excel的网格布局，精确到小时的时间管理
2. **智能统计分析** - 自动生成各维度数据报表
3. **双主题系统** - 极客风（Matrix风格）和极简风（清新简约）
4. **任务看板** - Trello风格的任务管理
5. **快速导航** - 高效的日期切换和跳转