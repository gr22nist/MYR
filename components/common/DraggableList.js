import React, { useState, useEffect, memo } from 'react';
import dynamic from 'next/dynamic';

const DragDropContext = dynamic(
  () => import('react-beautiful-dnd').then(mod => mod.DragDropContext),
  { ssr: false }
);
const Droppable = dynamic(
  () => import('react-beautiful-dnd').then(mod => mod.Droppable),
  { ssr: false }
);
const Draggable = dynamic(
  () => import('react-beautiful-dnd').then(mod => mod.Draggable),
  { ssr: false }
);

const containerStyle = {
  width: '100%',
  maxWidth: '1200px', 
  overflowX: 'hidden',
  overflowY: 'auto',
  border: '1px solid lightgray',
  padding: '8px',
  backgroundColor: '#f8f9fa'
};

const DraggableItem = memo(({ item, index, renderItem }) => {
  const itemId = item.id || `item-${index}`;

  return (
    <Draggable draggableId={itemId} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={{
            ...provided.draggableProps.style,
            backgroundColor: snapshot.isDragging ? 'lightblue' : 'white',
            marginBottom: '8px',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        >
          <div {...provided.dragHandleProps}>
            {renderItem(item)}
          </div>
        </div>
      )}
    </Draggable>
  );
});

DraggableItem.displayName = 'DraggableItem';

const DraggableList = memo(({ items, onDragEnd, renderItem }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  // items가 undefined거나 null이 아닌지, 그리고 배열인지 확인
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} style={containerStyle}>
            {safeItems.map((item, index) => (
              <DraggableItem key={item?.id ?? index} item={item} index={index} renderItem={renderItem} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
});

DraggableList.displayName = 'DraggableList';

export default DraggableList;
