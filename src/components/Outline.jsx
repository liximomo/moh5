// import React from 'react';
import PositionBox from './PositionBox';

// .attrs({
//   transform: props => `translate3d(${props.x - SIZE}px, ${props.y - SIZE}px, 0) scale3d(${props.width / SIZE}, ${props.height / SIZE}, 1)`,
// })
const Outline = PositionBox.extend`
  will-change: opacity, transform;
  opacity: ${props => props.visible ? 1 : 0};
  transition: 0.2s ease-in-out;
  transition-property: opacity;
  border: 1px dashed green;
  
`;

export default Outline;
