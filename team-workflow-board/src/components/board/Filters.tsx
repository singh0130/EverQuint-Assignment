import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { TextInput } from '../design-system/TextInput';
import { Select } from '../design-system/Select';
import { Button } from '../design-system/Button';
import type { FilterState, SortState, SortField, SortDirection } from '../../types';

interface FiltersProps {
  filters: FilterState;
  onChangeFilters: (filters: FilterState) => void;
  sort: SortState;
  onChangeSort: (sort: SortState) => void;
  availableTags: string[];
  availableAssignees: string[];
  onReset: () => void;
}

export const Filters: React.FC<FiltersProps> = ({
  filters,
  onChangeFilters,
  sort,
  onChangeSort,
  availableTags,
  availableAssignees,
  onReset
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeFilters({ ...filters, search: e.target.value });
  };

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeFilters({ ...filters, assignee: e.target.value });
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeFilters({ ...filters, priority: e.target.value });
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeFilters({ ...filters, tag: e.target.value });
  };

  const handleSortFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeSort({ ...sort, field: e.target.value as SortField });
  };

  const handleSortDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeSort({ ...sort, direction: e.target.value as SortDirection });
  };

  // Build options lists
  const assigneeOptions = [
    { value: '', label: 'All Assignees' },
    ...availableAssignees.map(a => ({ value: a, label: a || 'Unassigned' }))
  ];

  const tagOptions = [
    { value: '', label: 'All Tags' },
    ...availableTags.map(t => ({ value: t, label: t }))
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' }
  ];

  const sortFieldOptions = [
    { value: 'createdAt', label: 'Date Created' },
    { value: 'priority', label: 'Priority Level' }
  ];

  const sortDirectionOptions = [
    { value: 'desc', label: 'Descending / Newest' },
    { value: 'asc', label: 'Ascending / Oldest' }
  ];

  const hasActiveFilters = filters.search || filters.assignee || filters.priority || filters.tag;

  return (
    <div className="filters-card card-ds">
      <div className="filters-grid">
        {/* Search */}
        <div className="filter-item-search">
          <TextInput
            placeholder="Search tasks..."
            value={filters.search}
            onChange={handleSearchChange}
            icon={<Search size={16} />}
            label="Search"
          />
        </div>

        {/* Filters */}
        <div className="filter-selects">
          <Select
            label="Assignee"
            options={assigneeOptions}
            value={filters.assignee}
            onChange={handleAssigneeChange}
          />

          <Select
            label="Priority"
            options={priorityOptions}
            value={filters.priority}
            onChange={handlePriorityChange}
          />

          <Select
            label="Tag"
            options={tagOptions}
            value={filters.tag}
            onChange={handleTagChange}
          />
        </div>

        {/* Sorting */}
        <div className="sort-selects">
          <Select
            label="Sort By"
            options={sortFieldOptions}
            value={sort.field}
            onChange={handleSortFieldChange}
          />

          <Select
            label="Order"
            options={sortDirectionOptions}
            value={sort.direction}
            onChange={handleSortDirectionChange}
          />
          
          {hasActiveFilters && (
            <div className="reset-btn-container">
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                icon={<RotateCcw size={14} />}
                className="reset-btn"
              >
                Reset
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
