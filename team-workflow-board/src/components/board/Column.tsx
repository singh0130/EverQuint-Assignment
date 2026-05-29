import React from 'react';
import { ClipboardList, Play, CheckCircle2 } from 'lucide-react';
import { TaskCard } from './TaskCard';
import type { Task, ColumnStatus } from '../../types';

interface ColumnProps {
  status: ColumnStatus;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onChangeStatus: (id: string, status: ColumnStatus) => void;
}

export const Column: React.FC<ColumnProps> = ({
  status,
  tasks,
  onEdit,
  onDelete,
  onChangeStatus
}) => {
  // Get Column Header Details
  const getHeaderDetails = () => {
    switch (status) {
      case 'Backlog':
        return {
          icon: <ClipboardList size={18} className="column-icon-backlog" />,
          colorClass: 'header-backlog'
        };
      case 'In Progress':
        return {
          icon: <Play size={18} className="column-icon-inprogress" />,
          colorClass: 'header-inprogress'
        };
      case 'Done':
      default:
        return {
          icon: <CheckCircle2 size={18} className="column-icon-done" />,
          colorClass: 'header-done'
        };
    }
  };

  const { icon, colorClass } = getHeaderDetails();

  return (
    <div className="board-column">
      {/* Column Header */}
      <div className={`column-header ${colorClass}`}>
        <div className="column-header-left">
          {icon}
          <h3 className="column-title">{status}</h3>
        </div>
        <span className="column-count">{tasks.length}</span>
      </div>

      {/* Task List Container */}
      <div className="column-task-list">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onChangeStatus={onChangeStatus}
            />
          ))
        ) : (
          <div className="column-empty-state">
            <p>No tasks in this stage</p>
          </div>
        )}
      </div>
    </div>
  );
};
