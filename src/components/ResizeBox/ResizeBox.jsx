import React from 'react';
import PropTypes from 'prop-types';

import './ResizeBox.scss';

const resizingClass = 'is-resizing';

const DIRECTION_LEFT_RIGHT = 'DIRECTION_LEFT_RIGHT';
const DIRECTION_TOP_BOTTOM = 'DIRECTION_TOP_BOTTOM';
const DIRECTION_ALL = 'DIRECTION_ALL';

class ResizeBox extends React.Component {
  static RESIZER_TOP_LEFT = 'topLeft';
  static RESIZER_TOP = 'top';
  static RESIZER_TOP_RIGHT = 'topRight';
  static RESIZER_LEFT = 'left';
  static RESIZER_RIGHT = 'right';
  static RESIZER_BOTTOM_LEFT = 'botLeft';
  static RESIZER_BOTTOM = 'bot';
  static RESIZER_BOTTOM_RIGHT = 'botRight';

  static propTypes = {
    onResize: PropTypes.func.isRequired,
    resizer: PropTypes.shape({
      [ResizeBox.RESIZER_TOP_LEFT]: PropTypes.bool,
      [ResizeBox.RESIZER_TOP]: PropTypes.bool,
      [ResizeBox.RESIZER_TOP_RIGHT]: PropTypes.bool,
      [ResizeBox.RESIZER_LEFT]: PropTypes.bool,
      [ResizeBox.RESIZER_RIGHT]: PropTypes.bool,
      [ResizeBox.RESIZER_BOTTOM_LEFT]: PropTypes.bool,
      [ResizeBox.RESIZER_BOTTOM]: PropTypes.bool,
      [ResizeBox.RESIZER_BOTTOM_RIGHT]: PropTypes.bool,
    }),
    width: PropTypes.number,
    height: PropTypes.number,
    minWidth: PropTypes.number,
    minHeight: PropTypes.number,
    maxWidth: PropTypes.number,
    maxHeight: PropTypes.number,
  };

  static defaultProps = {
    minWidth: 0,
    minHeight: 0,
    resizer: {
      [ResizeBox.RESIZER_TOP_LEFT]: true,
      [ResizeBox.RESIZER_TOP]: true,
      [ResizeBox.RESIZER_TOP_RIGHT]: true,
      [ResizeBox.RESIZER_LEFT]: true,
      [ResizeBox.RESIZER_RIGHT]: true,
      [ResizeBox.RESIZER_BOTTOM_LEFT]: true,
      [ResizeBox.RESIZER_BOTTOM]: true,
      [ResizeBox.RESIZER_BOTTOM_RIGHT]: true,
    },
  };

  constructor(props) {
    super(props);

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  handleMouseMove(event) {
    let horizenOffset = event.clientX - this.startX;
    let verticalOffset = event.clientY - this.startY;

    const config = anchorMap[this.ahchor];
    const direction = config.direction;

    if (direction === DIRECTION_LEFT_RIGHT) {
      verticalOffset = 0;
    } else if (direction === DIRECTION_TOP_BOTTOM) {
      horizenOffset = 0;
    }

    let width;
    if (this.width !== undefined) {
      width = Math.max(0, this.props.minWidth, this.width + horizenOffset);

      if (this.props.maxWidth !== undefined) {
        width = Math.min(width, this.props.maxWidth);
      }
    }

    let height;
    if (this.height !== undefined) {
      height = Math.max(0, this.props.minHeight, this.height + verticalOffset);
      if (this.props.maxHeight !== undefined) {
        height = Math.min(height, this.props.maxHeight);
      }
    }

    this.props.onResize(event, {
      width,
      height,
    });
  }

  handleMouseUp() {
    const config = anchorMap[this.ahchor];
    this.ahchor = null;
    document.documentElement.classList.remove(resizingClass, config.cursor);

    document.removeEventListener('mousemove', this.handleMouseMove, true);
    document.removeEventListener('mouseup', this.handleMouseUp, true);
  }

  handleMouseDown(event) {
    const config = anchorMap[this.ahchor];

    // 记录宽高，防止属性更新影响计算
    this.width = this.props.width;
    this.height = this.props.height;

    this.startX = event.clientX;
    this.startY = event.clientY;
    document.documentElement.classList.add(resizingClass, config.cursor);
    document.addEventListener('mousemove', this.handleMouseMove, true);
    document.addEventListener('mouseup', this.handleMouseUp, true);
  }

  createMouseDownHandle(ahchor) {
    return event => {
      this.ahchor = ahchor;
      this.handleMouseDown(event);
    };
  }

  render() {
    const { width, height, resizer } = this.props;
    if (width === undefined && height === undefined) {
      return null;
    }

    return (
      <div className="ResizeBox">
        {resizerOrders.map(resizerName => {
          if (!resizer[resizerName]) {
            return null;
          }

          return (
            <div
              key={resizerName}
              className={`ResizeBox__anchor ResizeBox__anchor--${resizerName}`}
              onMouseDown={this.createMouseDownHandle(resizerName)}
            />
          );
        })}
      </div>
    );
  }
}

const resizerOrders = [
  ResizeBox.RESIZER_TOP_LEFT,
  ResizeBox.RESIZER_TOP,
  ResizeBox.RESIZER_TOP_RIGHT,
  ResizeBox.RESIZER_LEFT,
  ResizeBox.RESIZER_RIGHT,
  ResizeBox.RESIZER_BOTTOM_LEFT,
  ResizeBox.RESIZER_BOTTOM,
  ResizeBox.RESIZER_BOTTOM_RIGHT,
];
const anchorMap = {
  [ResizeBox.RESIZER_TOP_LEFT]: {
    direction: DIRECTION_ALL,
    cursor: 'nwse-resize',
  },
  [ResizeBox.RESIZER_TOP]: {
    direction: DIRECTION_TOP_BOTTOM,
    cursor: 'ns-resize',
  },
  [ResizeBox.RESIZER_TOP_RIGHT]: {
    direction: DIRECTION_ALL,
    cursor: 'nesw-resize',
  },
  [ResizeBox.RESIZER_LEFT]: {
    direction: DIRECTION_LEFT_RIGHT,
    cursor: 'ew-resize',
  },
  [ResizeBox.RESIZER_RIGHT]: {
    direction: DIRECTION_LEFT_RIGHT,
    cursor: 'ew-resize',
  },
  [ResizeBox.RESIZER_BOTTOM_LEFT]: {
    direction: DIRECTION_ALL,
    cursor: 'nesw-resize',
  },
  [ResizeBox.RESIZER_BOTTOM]: {
    direction: DIRECTION_TOP_BOTTOM,
    cursor: 'ns-resize',
  },
  [ResizeBox.RESIZER_BOTTOM_RIGHT]: {
    direction: DIRECTION_ALL,
    cursor: 'nwse-resize',
  },
};

export default ResizeBox;
