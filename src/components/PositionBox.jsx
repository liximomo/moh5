// import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// .attrs({
//   transform: props => `translate3d(${props.x - SIZE}px, ${props.y - SIZE}px, 0) scale3d(${props.width / SIZE}, ${props.height / SIZE}, 1)`,
// })
const PositionBox = styled.div.attrs({
  style: ({ x, y, height, width }) => ({
    height: `${height}px`,
    width: `${width}px`,
    transform: `translate3d(${x}px, ${y}px, 0)`,
  })
})`
  will-change: transform;
  position: absolute;
  left: 0;
  top: 0;
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  transform-origin: left top;
  user-select: none;
  touch-action: none;
  pointer-events: none;
`;

PositionBox.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  visible: PropTypes.bool,
};

PositionBox.defaultProps = {
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

export default PositionBox;
