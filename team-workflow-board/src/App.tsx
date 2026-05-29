import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Button } from './components/design-system/Button';
import { ToastProvider, useToast } from './components/design-system/Toast';
import { Filters } from './components/board/Filters';
import { Board } from './components/board/Board';
import { TaskModal } from './components/board/TaskModal';
import type { Task, ColumnStatus, PriorityLevel, FilterState, SortState } from './types';

// Mock initial data
const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Set up Project Repository',
    description: 'Initialize the git repository, set up standard directory formats, configure ESLint/Prettier, and verify the main configuration files.',
    status: 'Done',
    priority: 'High',
    assignee: 'Mohit Singh',
    tags: ['setup', 'dev'],
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
  },
  {
    id: 'task-2',
    title: 'Design Component Library',
    description: 'Create visual guidelines and build reusable design system components including Button, TextInput, Select, Modal, Badge, Card, and Toasts.',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Mohit Singh',
    tags: ['design', 'frontend'],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'task-3',
    title: 'Implement Data Persistence',
    description: 'Develop React hooks to synchronize workflow state with localStorage. Populate board with mock items for first-time visits.',
    status: 'Backlog',
    priority: 'Medium',
    assignee: 'Alice Smith',
    tags: ['data', 'storage'],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'task-4',
    title: 'Write Unit Tests',
    description: 'Create comprehensive test cases for task state logic, priority order sorting, text search, and tag filters.',
    status: 'Backlog',
    priority: 'Low',
    assignee: '',
    tags: ['testing'],
    createdAt: new Date(Date.now()).toISOString(), // just now
    updatedAt: new Date(Date.now()).toISOString()
  }
];

const INITIAL_FILTERS: FilterState = {
  search: '',
  assignee: '',
  priority: '',
  tag: ''
};

const INITIAL_SORT: SortState = {
  field: 'createdAt',
  direction: 'desc'
};

// Inner App component that uses Toast hook
const AppContent: React.FC = () => {
  const { addToast } = useToast();

  // --- Persistent State ---
  const [tasks, setTasks] = useLocalStorage<Task[]>('team-workflow-tasks', INITIAL_TASKS);

  // --- UI State ---
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [sort, setSort] = useState<SortState>(INITIAL_SORT);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // --- Dynamic Option Extraction (for filters) ---
  const availableAssignees = useMemo(() => {
    const assignees = new Set<string>();
    tasks.forEach((t) => {
      if (t.assignee) assignees.add(t.assignee);
    });
    return Array.from(assignees).sort();
  }, [tasks]);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    tasks.forEach((t) => {
      t.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [tasks]);

  // --- CRUD Event Handlers ---
  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();

    if (editingTask) {
      // Edit Mode
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id
            ? { ...t, ...taskData, updatedAt: now }
            : t
        )
      );
      addToast(`Task "${taskData.title}" updated successfully!`, 'success');
    } else {
      // Create Mode
      const newTask: Task = {
        id: `task-${Math.random().toString(36).substr(2, 9)}`,
        ...taskData,
        createdAt: now,
        updatedAt: now
      };
      setTasks((prev) => [newTask, ...prev]);
      addToast(`Task "${taskData.title}" created successfully!`, 'success');
    }
    setIsModalOpen(false);
  };

  const handleDeleteTask = (id: string) => {
    const taskToDelete = tasks.find((t) => t.id === id);
    if (!taskToDelete) return;

    if (confirm(`Are you sure you want to delete the task: "${taskToDelete.title}"?`)) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      addToast(`Task "${taskToDelete.title}" deleted.`, 'warning');
    }
  };

  const handleChangeStatus = (id: string, newStatus: ColumnStatus) => {
    const now = new Date().toISOString();
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: newStatus, updatedAt: now }
          : t
      )
    );
    
    const task = tasks.find(t => t.id === id);
    if (task) {
      addToast(`Moved "${task.title}" to ${newStatus}`, 'info');
    }
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  // --- Filter and Sort Core Logic ---
  const filteredAndSortedTasks = useMemo(() => {
    // 1. Filter
    let result = tasks.filter((task) => {
      // Search Title or Description
      const searchMatch =
        !filters.search ||
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.search.toLowerCase());

      // Assignee match
      const assigneeMatch =
        !filters.assignee ||
        task.assignee === filters.assignee;

      // Priority match
      const priorityMatch =
        !filters.priority ||
        task.priority === filters.priority;

      // Tag match
      const tagMatch =
        !filters.tag ||
        task.tags.includes(filters.tag);

      return searchMatch && assigneeMatch && priorityMatch && tagMatch;
    });

    // 2. Sort
    result.sort((a, b) => {
      let comparison = 0;

      if (sort.field === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sort.field === 'priority') {
        const priorityWeights: Record<PriorityLevel, number> = { High: 3, Medium: 2, Low: 1 };
        comparison = priorityWeights[a.priority] - priorityWeights[b.priority];
      }

      return sort.direction === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [tasks, filters, sort]);

  return (
    <div className="app-container">
      {/* App Header */}
      <header className="app-header">
        <div className="app-title-group">
          <h1>Team Workflow Board</h1>
          <p>Collaborate, prioritize, and track team velocity with modular controls.</p>
        </div>
        <Button
          variant="primary"
          onClick={handleOpenCreateModal}
          icon={<Plus size={18} />}
        >
          Create Task
        </Button>
      </header>

      {/* Filters Toolbar */}
      <Filters
        filters={filters}
        onChangeFilters={setFilters}
        sort={sort}
        onChangeSort={setSort}
        availableTags={availableTags}
        availableAssignees={availableAssignees}
        onReset={handleResetFilters}
      />

      {/* Main Kanban Board */}
      <Board
        tasks={filteredAndSortedTasks}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteTask}
        onChangeStatus={handleChangeStatus}
      />

      {/* Editor Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveTask}
        initialTask={editingTask}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;
