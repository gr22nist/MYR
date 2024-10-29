import React, { useMemo } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const AnimatedList = ({ items, renderItem, keyExtractor, className = 'cls' }) => {
  const nodeRefs = useMemo(() => items.map(() => React.createRef()), [items]);

  return (
    <TransitionGroup className={className}>
      {items.map((item, index) => (
        <CSSTransition
          key={keyExtractor(item)}
          nodeRef={nodeRefs[index]}
          timeout={300}
          classNames={{
            enter: 'item-enter',
            enterActive: 'item-enter-active',
            exit: 'item-exit',
            exitActive: 'item-exit-active',
          }}
        >
          <div ref={nodeRefs[index]}>
            {renderItem(item)}
          </div>
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
};

export default AnimatedList;
