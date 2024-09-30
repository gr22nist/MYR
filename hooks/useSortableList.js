import { useCallback } from 'react';
import { useSensors, useSensor, PointerSensor } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

export const useSortableList = (items, reorderItems, restrictVertical = true) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      reorderItems(oldIndex, newIndex);
    }
  }, [items, reorderItems]);

  const modifiers = restrictVertical ? [restrictToVerticalAxis] : [];

  return { sensors, handleDragEnd, modifiers };
};
