import React, { useState, useEffect } from 'react';
import { Modal } from '../design-system/Modal';
import { TextInput } from '../design-system/TextInput';
import { Select } from '../design-system/Select';
import { Button } from '../design-system/Button';
import type { Task, ColumnStatus, PriorityLevel } from '../../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: {
    title: string;
    description: string;
    status: ColumnStatus;
    priority: PriorityLevel;
    assignee: string;
    tags: string[];
  }) => void;
  initialTask?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTask = null
}) => {
  // --- Form State ---
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ColumnStatus>('Backlog');
  const [priority, setPriority] = useState<PriorityLevel>('Medium');
  const [assignee, setAssignee] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  
  // --- Error State ---
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync state with initialTask (edit mode vs create mode)
  useEffect(() => {
    if (isOpen) {
      if (initialTask) {
        setTitle(initialTask.title);
        setDescription(initialTask.description);
        setStatus(initialTask.status);
        setPriority(initialTask.priority);
        setAssignee(initialTask.assignee);
        setTagsInput(initialTask.tags.join(', '));
      } else {
        // Reset to empty for creation
        setTitle('');
        setDescription('');
        setStatus('Backlog');
        setPriority('Medium');
        setAssignee('');
        setTagsInput('');
      }
      setErrors({});
    }
  }, [isOpen, initialTask]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (title.length > 80) {
      newErrors.title = 'Title must be under 80 characters';
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Process comma-separated tags
    const processedTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t !== '');

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      assignee: assignee.trim(),
      tags: processedTags
    });
    
    onClose();
  };

  // Form options
  const statusOptions = [
    { value: 'Backlog', label: 'Backlog' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Done', label: 'Done' }
  ];

  const priorityOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' }
  ];

  // Title depending on Mode
  const modalTitle = initialTask ? 'Edit Task' : 'Create New Task';
  
  // Footer contents
  const footerActions = (
    <div className="task-modal-footer">
      <Button variant="outline" type="button" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="primary" type="submit" onClick={handleFormSubmit}>
        {initialTask ? 'Save Changes' : 'Create Task'}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      footer={footerActions}
      size="md"
    >
      <form onSubmit={handleFormSubmit} className="task-form">
        {/* Title */}
        <TextInput
          label="Task Title *"
          placeholder="Enter a descriptive title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          autoFocus
        />

        {/* Description */}
        <TextInput
          label="Description *"
          placeholder="Describe the goals, requirements, or steps of this task..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={errors.description}
          multiline
          rows={4}
        />

        {/* Details Row 1: Status & Priority */}
        <div className="form-row-2col">
          <Select
            label="Initial Status"
            options={statusOptions}
            value={status}
            onChange={(e) => setStatus(e.target.value as ColumnStatus)}
          />

          <Select
            label="Priority Level"
            options={priorityOptions}
            value={priority}
            onChange={(e) => setPriority(e.target.value as PriorityLevel)}
          />
        </div>

        {/* Details Row 2: Assignee & Tags */}
        <div className="form-row-2col">
          <TextInput
            label="Assignee Name"
            placeholder="e.g. Mohit Singh"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          />

          <TextInput
            label="Tags (comma-separated)"
            placeholder="e.g. bug, frontend, API"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
};
