import React from 'react';

interface PriorityBadgeProps {
  priority: 'high' | 'medium' | 'low';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const colorClasses = {
    high: 'priority-high text-white',
    medium: 'priority-medium text-white',
    low: 'priority-low text-white'
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full transition-all hover-lift ${colorClasses[priority]}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
};