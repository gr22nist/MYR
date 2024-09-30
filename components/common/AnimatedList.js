import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const AnimatedList = ({ items, renderItem, keyExtractor, className = '' }) => {
  return (
    <TransitionGroup className={className}>
      {items.map((item) => (
        <CSSTransition
          key={keyExtractor(item)}
          timeout={300}
          classNames={{
            enter: 'item-enter',
            enterActive: 'item-enter-active',
            exit: 'item-exit',
            exitActive: 'item-exit-active',
          }}
        >
          {renderItem(item)}
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
};

export default AnimatedList;
