import React from 'react';
import { Calendar, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../design-system/Card';
import { Badge } from '../design-system/Badge';
import type { Task, ColumnStatus } from '../../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onChangeStatus: (id: string, status: ColumnStatus) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onChangeStatus
}) => {
  const { id, title, description, status, priority, assignee, tags, createdAt } = task;

  // Format date nicely
  const formattedDate = new Date(createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Get Priority Badge variant
  const getPriorityVariant = () => {
    switch (priority) {
      case 'High':
        return 'danger';
      case 'Medium':
        return 'warning';
      case 'Low':
      default:
        return 'info';
    }
  };

  // Get initials for assignee
  const getInitials = (name: string) => {
    if (!name) return 'U'; // Unassigned
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // Handle status movements
  const statuses: ColumnStatus[] = ['Backlog', 'In Progress', 'Done'];
  const currentIndex = statuses.indexOf(status);

  const moveLeft = () => {
    if (currentIndex > 0) {
      onChangeStatus(id, statuses[currentIndex - 1]);
    }
  };

  const moveRight = () => {
    if (currentIndex < statuses.length - 1) {
      onChangeStatus(id, statuses[currentIndex + 1]);
    }
  };

  // Truncate description for card body
  const maxDescLength = 120;
  const truncatedDesc =
    description.length > maxDescLength
      ? `${description.substring(0, maxDescLength)}...`
      : description;

  return (
    <Card className="task-card" hoverable>
      {/* Header: Priority and Action Buttons */}
      <div className="task-card-header">
        <Badge variant={getPriorityVariant()} size="sm">
          {priority} Priority
        </Badge>
        <div className="task-card-actions">
          <button
            onClick={() => onEdit(task)}
            className="task-action-btn edit"
            title="Edit Task"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={() => onDelete(id)}
            className="task-action-btn delete"
            title="Delete Task"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Title */}
      <h4 className="task-card-title">{title}</h4>

      {/* Description */}
      <p className="task-card-desc">{truncatedDesc}</p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="task-card-tags">
          {tags.map((tag) => (
            <Badge key={tag} variant="neutral" size="sm">
              #{tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Footer: Date, Assignee, and Navigation Controls */}
      <div className="task-card-footer">
        {/* Assignee Avatar */}
        <div className="task-card-assignee" title={`Assignee: ${assignee || 'Unassigned'}`}>
          <div className={`avatar ${!assignee ? 'unassigned' : ''}`}>
            {getInitials(assignee)}
          </div>
          <span className="assignee-name">{assignee || 'Unassigned'}</span>
        </div>

        {/* Created Date */}
        <div className="task-card-date">
          <Calendar size={12} style={{ marginRight: '4px' }} />
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Status Quick Nav Bar */}
      <div className="task-card-navigation">
        <button
          onClick={moveLeft}
          disabled={currentIndex === 0}
          className="nav-arrow-btn"
          title="Move back"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="nav-status-label">{status}</span>
        <button
          onClick={moveRight}
          disabled={currentIndex === statuses.length - 1}
          className="nav-arrow-btn"
          title="Move forward"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </Card>
  );
};
