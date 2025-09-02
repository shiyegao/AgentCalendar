import React, { useState, useRef } from 'react';
import { Plus, GripVertical, X, Check, Edit2, Clock, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { useCalendarStore } from '../stores/calendarStore';

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'done';
  tags: string[];
  createdAt: string;
  order: number;
}

interface TaskColumn {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
  order: number;
}

const TaskManager: React.FC = () => {
  const { theme, selectedDate } = useCalendarStore();
  const [columns, setColumns] = useState<TaskColumn[]>([
    {
      id: '1',
      title: '待办',
      color: theme.mode === 'geek' ? '#ff6600' : '#ef4444',
      tasks: [],
      order: 0
    },
    {
      id: '2',
      title: '进行中',
      color: theme.mode === 'geek' ? '#ffff00' : '#f59e0b',
      tasks: [],
      order: 1
    },
    {
      id: '3',
      title: '已完成',
      color: theme.mode === 'geek' ? '#00ff00' : '#10b981',
      tasks: [],
      order: 2
    }
  ]);

  const [showNewColumn, setShowNewColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [showNewTask, setShowNewTask] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [draggedTask, setDraggedTask] = useState<{ task: Task; fromColumn: string } | null>(null);
  const [draggedColumn, setDraggedColumn] = useState<TaskColumn | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      const newColumn: TaskColumn = {
        id: Date.now().toString(),
        title: newColumnTitle,
        color: theme.mode === 'geek' ? '#00ffff' : '#3b82f6',
        tasks: [],
        order: columns.length
      };
      setColumns([...columns, newColumn]);
      setNewColumnTitle('');
      setShowNewColumn(false);
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    setColumns(columns.filter(col => col.id !== columnId));
  };

  const handleAddTask = (columnId: string) => {
    if (newTaskTitle.trim()) {
      const column = columns.find(col => col.id === columnId);
      if (column) {
        const newTask: Task = {
          id: Date.now().toString(),
          title: newTaskTitle,
          priority: 'medium',
          status: 'todo',
          tags: [],
          createdAt: format(new Date(), 'yyyy-MM-dd HH:mm'),
          order: column.tasks.length
        };
        
        const updatedColumns = columns.map(col => 
          col.id === columnId 
            ? { ...col, tasks: [...col.tasks, newTask] }
            : col
        );
        setColumns(updatedColumns);
        setNewTaskTitle('');
        setShowNewTask(null);
      }
    }
  };

  const handleDeleteTask = (columnId: string, taskId: string) => {
    const updatedColumns = columns.map(col => 
      col.id === columnId 
        ? { ...col, tasks: col.tasks.filter(task => task.id !== taskId) }
        : col
    );
    setColumns(updatedColumns);
  };

  const handleTaskDragStart = (task: Task, fromColumn: string) => {
    setDraggedTask({ task, fromColumn });
  };

  const handleTaskDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleTaskDrop = (e: React.DragEvent, toColumnId: string) => {
    e.preventDefault();
    if (draggedTask) {
      const { task, fromColumn } = draggedTask;
      
      const updatedColumns = columns.map(col => {
        if (col.id === fromColumn) {
          return { ...col, tasks: col.tasks.filter(t => t.id !== task.id) };
        }
        if (col.id === toColumnId) {
          return { ...col, tasks: [...col.tasks, task] };
        }
        return col;
      });
      
      setColumns(updatedColumns);
      setDraggedTask(null);
      setDragOverColumn(null);
    }
  };

  const handleColumnDragStart = (column: TaskColumn) => {
    setDraggedColumn(column);
  };

  const handleColumnDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleColumnDrop = (e: React.DragEvent, targetColumn: TaskColumn) => {
    e.preventDefault();
    if (draggedColumn && draggedColumn.id !== targetColumn.id) {
      const draggedIndex = columns.findIndex(col => col.id === draggedColumn.id);
      const targetIndex = columns.findIndex(col => col.id === targetColumn.id);
      
      const newColumns = [...columns];
      newColumns.splice(draggedIndex, 1);
      newColumns.splice(targetIndex, 0, draggedColumn);
      
      setColumns(newColumns.map((col, index) => ({ ...col, order: index })));
      setDraggedColumn(null);
    }
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    if (theme.mode === 'geek') {
      return priority === 'high' ? '#ff0000' : priority === 'medium' ? '#ffff00' : '#00ff00';
    }
    return priority === 'high' ? '#ef4444' : priority === 'medium' ? '#f59e0b' : '#10b981';
  };

  return (
    <div className={`p-4 ${theme.mode === 'geek' ? 'font-mono' : ''}`}>
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl font-bold ${
          theme.mode === 'geek' ? 'text-geek-primary' : 'text-gray-800'
        }`}>
          任务管理 - {format(selectedDate, 'yyyy-MM-dd')}
        </h2>
        <button
          onClick={() => setShowNewColumn(true)}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all ${
            theme.mode === 'geek'
              ? 'bg-geek-primary/20 text-geek-primary hover:bg-geek-primary/30 border border-geek-primary/50'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          <Plus size={16} />
          新增栏目
        </button>
      </div>

      {/* 新增栏目输入框 */}
      {showNewColumn && (
        <div className={`mb-4 p-3 rounded-lg ${
          theme.mode === 'geek'
            ? 'bg-geek-surface border border-geek-primary/30'
            : 'bg-gray-100 border border-gray-300'
        }`}>
          <div className="flex gap-2">
            <input
              type="text"
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddColumn()}
              placeholder="输入栏目名称..."
              className={`flex-1 px-3 py-2 rounded border focus:outline-none focus:ring-2 ${
                theme.mode === 'geek'
                  ? 'bg-geek-bg text-geek-text border-geek-primary/30 focus:ring-geek-primary/50'
                  : 'bg-white text-gray-800 border-gray-300 focus:ring-blue-500'
              }`}
              autoFocus
            />
            <button
              onClick={handleAddColumn}
              className={`px-3 py-2 rounded ${
                theme.mode === 'geek'
                  ? 'bg-geek-primary/20 text-geek-primary hover:bg-geek-primary/30'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <Check size={20} />
            </button>
            <button
              onClick={() => {
                setShowNewColumn(false);
                setNewColumnTitle('');
              }}
              className={`px-3 py-2 rounded ${
                theme.mode === 'geek'
                  ? 'bg-geek-surface text-geek-muted hover:bg-geek-primary/10'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* 任务栏目列表 */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.sort((a, b) => a.order - b.order).map(column => (
          <div
            key={column.id}
            draggable
            onDragStart={() => handleColumnDragStart(column)}
            onDragOver={handleColumnDragOver}
            onDrop={(e) => handleColumnDrop(e, column)}
            className={`min-w-[300px] rounded-lg ${
              theme.mode === 'geek'
                ? 'bg-geek-surface/50 border border-geek-primary/20'
                : 'bg-gray-50 border border-gray-200'
            } ${dragOverColumn === column.id ? 'ring-2 ring-blue-500' : ''}`}
          >
            {/* 栏目标题 */}
            <div 
              className="p-3 border-b flex items-center justify-between"
              style={{ borderColor: column.color + '40' }}
            >
              <div className="flex items-center gap-2">
                <GripVertical 
                  size={16} 
                  className={`cursor-move ${theme.mode === 'geek' ? 'text-geek-muted' : 'text-gray-400'}`}
                />
                <h3 className="font-bold" style={{ color: column.color }}>
                  {column.title}
                </h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  theme.mode === 'geek' 
                    ? 'bg-geek-primary/20 text-geek-muted' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {column.tasks.length}
                </span>
              </div>
              <button
                onClick={() => handleDeleteColumn(column.id)}
                className={`p-1 rounded hover:bg-red-500/20 ${
                  theme.mode === 'geek' ? 'text-geek-muted' : 'text-gray-400'
                }`}
              >
                <X size={16} />
              </button>
            </div>

            {/* 任务列表 */}
            <div
              className="p-3 space-y-2 min-h-[200px]"
              onDragOver={(e) => handleTaskDragOver(e, column.id)}
              onDrop={(e) => handleTaskDrop(e, column.id)}
            >
              {column.tasks.map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleTaskDragStart(task, column.id)}
                  className={`p-3 rounded-lg cursor-move transition-all hover:shadow-md ${
                    theme.mode === 'geek'
                      ? 'bg-geek-surface border border-geek-primary/10 hover:border-geek-primary/30'
                      : 'bg-white border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className={`font-medium ${
                      theme.mode === 'geek' ? 'text-geek-text' : 'text-gray-800'
                    }`}>
                      {task.title}
                    </h4>
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getPriorityColor(task.priority) }}
                      title={`优先级: ${task.priority}`}
                    />
                  </div>
                  
                  {task.dueDate && (
                    <div className={`flex items-center gap-1 text-xs mb-2 ${
                      theme.mode === 'geek' ? 'text-geek-muted' : 'text-gray-500'
                    }`}>
                      <Calendar size={12} />
                      {task.dueDate}
                    </div>
                  )}
                  
                  {task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {task.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`text-xs px-2 py-0.5 rounded ${
                            theme.mode === 'geek'
                              ? 'bg-geek-primary/20 text-geek-secondary'
                              : 'bg-blue-100 text-blue-600'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${
                      theme.mode === 'geek' ? 'text-geek-muted' : 'text-gray-400'
                    }`}>
                      {task.createdAt}
                    </span>
                    <button
                      onClick={() => handleDeleteTask(column.id, task.id)}
                      className={`p-1 rounded hover:bg-red-500/20 ${
                        theme.mode === 'geek' ? 'text-geek-muted' : 'text-gray-400'
                      }`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {/* 添加任务按钮 */}
              {showNewTask === column.id ? (
                <div className={`p-2 rounded-lg ${
                  theme.mode === 'geek'
                    ? 'bg-geek-bg border border-geek-primary/30'
                    : 'bg-white border border-gray-300'
                }`}>
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask(column.id)}
                    placeholder="输入任务名称..."
                    className={`w-full px-2 py-1 rounded border-0 focus:outline-none ${
                      theme.mode === 'geek'
                        ? 'bg-transparent text-geek-text placeholder-geek-muted'
                        : 'bg-transparent text-gray-800 placeholder-gray-400'
                    }`}
                    autoFocus
                  />
                  <div className="flex gap-1 mt-2">
                    <button
                      onClick={() => handleAddTask(column.id)}
                      className={`flex-1 px-2 py-1 rounded text-xs ${
                        theme.mode === 'geek'
                          ? 'bg-geek-primary/20 text-geek-primary hover:bg-geek-primary/30'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      添加
                    </button>
                    <button
                      onClick={() => {
                        setShowNewTask(null);
                        setNewTaskTitle('');
                      }}
                      className={`flex-1 px-2 py-1 rounded text-xs ${
                        theme.mode === 'geek'
                          ? 'bg-geek-surface text-geek-muted hover:bg-geek-primary/10'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowNewTask(column.id)}
                  className={`w-full p-2 rounded-lg border-2 border-dashed transition-all hover:border-solid ${
                    theme.mode === 'geek'
                      ? 'border-geek-primary/20 hover:border-geek-primary/40 text-geek-muted hover:text-geek-primary'
                      : 'border-gray-300 hover:border-gray-400 text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Plus size={16} className="mx-auto" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManager;