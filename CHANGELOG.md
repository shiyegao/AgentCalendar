# Changelog

All notable changes to AgentCalendar will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-01-02

### 🎉 Major Update - Enhanced User Experience

### Added
- **日期选择器功能** 
  - 点击顶部日期可弹出日期选择框进行快速跳转
  - 支持键盘快捷键（Enter键确认选择）
  - 添加日历图标作为可点击提示
  - 改进的用户交互体验

- **统计图表视图**
  - 完全重新设计的月视图和年视图
  - 关键指标卡片展示（总时长、完成任务数、效率评分）
  - 时间段分布柱状图（早晨/下午/晚上）
  - 月度/日度趋势分析图
  - 活动分类饼图（自动识别：会议、学习、工作、运动、休息等）
  - 响应式图表设计，适配不同屏幕尺寸

- **任务管理系统**
  - 全新的看板式任务管理界面
  - 支持自定义任务栏目
  - 任务拖拽功能（在不同栏目间移动）
  - 栏目拖拽排序
  - 任务优先级标记（高/中/低）
  - 任务创建时间记录
  - 完整的CRUD操作支持

### Changed
- 月视图从简单日历改为统计分析页面
- 年视图从网格布局改为年度数据汇总
- 优化了整体UI布局，更好地利用屏幕空间

### Technical Improvements
- 新增组件：
  - `StatsView.tsx` - 统计视图组件
  - `TaskManager.tsx` - 任务管理组件
  - 更新 `DateNavigator.tsx` - 添加日期选择器
- 改进的状态管理
- 优化的渲染性能

## [1.0.0] - 2025-01-01

### Initial Release

### Added
- **核心功能**
  - 高密度信息日程表格（7:00-24:00）
  - 日视图和周视图
  - 实时单元格编辑
  - 数据持久化存储

- **界面设计**
  - 双主题系统（极客风/极简风）
  - 响应式布局
  - 平滑的主题切换动画

- **技术架构**
  - React + TypeScript 前端
  - FastAPI + SQLAlchemy 后端
  - SQLite 数据库
  - RESTful API 设计

### Features
- 时间段管理（精确到小时）
- 自动保存编辑内容
- 快速导航（前一天/后一天/今天）
- 统计面板（基础版）
- 错误处理和加载状态

## [0.1.0] - 2024-12-30

### Pre-release

### Added
- 项目初始化
- 基础架构搭���
- 技术选型确定
- 开发环境配置

---

## Roadmap

### Planned Features
- [ ] 数据导入/导出（Excel, CSV）
- [ ] 多用户支持和协作
- [ ] 移动端优化
- [ ] 提醒和通知系统
- [ ] AI 智能建议
- [ ] 数据备份和恢复
- [ ] 插件系统
- [ ] 国际化支持

### Future Enhancements
- 更多统计维度和报表
- 自定义时间段配置
- 标签和分类系统
- 搜索和过滤功能
- 批量操作支持
- 键盘快捷键系统
- 性能优化（虚拟滚动）
- PWA 支持