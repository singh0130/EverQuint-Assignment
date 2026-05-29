import React from 'react';
import { Column } from './Column';
import type { Task, ColumnStatus } from '../../types';

interface BoardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onChangeStatus: (id: string, status: ColumnStatus) => void;
}

export const Board: React.FC<BoardProps> = ({
  tasks,
  onEdit,
  onDelete,
  onChangeStatus
}) => {
  const columns: ColumnStatus[] = ['Backlog', 'In Progress', 'Done'];

  return (
    <div className="board-grid">
      {columns.map((status) => {
        // Filter tasks belonging to this status column
        const columnTasks = tasks.filter((t) => t.status === status);

        return (
          <Column
            key={status}
            status={status}
            tasks={columnTasks}
            onEdit={onEdit}
            onDelete={onDelete}
            onChangeStatus={onChangeStatus}
          />
        );
      })}
    </div>
  );
};
