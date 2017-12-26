// import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// .attrs({
//   transform: props => `translate3d(${props.x - SIZE}px, ${props.y - SIZE}px, 0) scale3d(${props.width / SIZE}, ${props.height / SIZE}, 1)`,
// })
const Outline = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: ${props => props.height}px;
  width: ${props => props.width}px;
  touch-action: none;
  user-select: none;
  pointer-events: none;
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  opacity: ${props => props.visible ? 1 : 0};
  transform: ${props => `translate3d(${props.x}px, ${props.y}px, 0)`};
  transform-origin: left top;
  transition: 0.2s ease-in-out;
  transition-property: opacity, transform;
  border: 1px dashed green;
`;

Outline.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  visible: PropTypes.bool,
};

Outline.defaultProps = {
  visible: false,
};

// class Outline extends React.PureComponent {
//   static propTypes = {
//     x: PropTypes.number.isRequired,
//     y: PropTypes.number.isRequired,
//     width: PropTypes.number.isRequired,
//     height: PropTypes.number.isRequired,
//     visible: PropTypes.bool,
//   };

//   static defaultProps = {
//     visible: false,
//   }

//   render() {
//     const { x, y, height, width, visible } = this.props;

//     const scaleX = width / SIZE;
//     const scaleY = height / SIZE;
//     const translateX = x - SIZE;
//     const translateY = y - SIZE;

//     return (
//       <div
//         className="Outline"
//         style={{
//           position: 'absolute',
//           left: 0,
//           top: 0,
//           height: SIZE,
//           width: SIZE,
//           touchAction: 'none',
//           userSelect: 'none',
//           visibility: visible ? 'visible' : 'hidden',
//           opacity: visible ? '1' : '0',
//           WebkitTransform: `translate3d(${translateX}px, ${translateY}px, 0) scale3d(${scaleX}, ${scaleY}, 1)`,
//           transform: `translate3d(${translateX}px, ${translateY}px, 0) scale3d(${scaleX}, ${scaleY}, 1)`,
//           WebkitTransformOrigin: 'left top',
//           transformOrigin: 'left top',
//           transition: 'opacity 0.2s ease-in-out',
//         }}
//       />
//     );
//   }
// }

export default Outline;
