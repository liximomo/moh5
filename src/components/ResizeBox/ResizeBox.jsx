import React from 'react';
import PropTypes from 'prop-types';
import PositionBox from '../PositionBox';

import './ResizeBox.scss';

const resizingClass = 'is-resizing';

class ResizeBox extends React.PureComponent {
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
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    minWidth: PropTypes.number,
    minHeight: PropTypes.number,
    maxWidth: PropTypes.number,
    maxHeight: PropTypes.number,
  };

  static defaultProps = {
    x: 0,
    y: 0,
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

    this.state = {
      ...this.getStateFromProps(props),
    };

    this.setDomNode = this.setDomNode.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.getStateFromProps(nextProps));
  }

  getStateFromProps(props) {
    return {
      x: props.x,
      y: props.y,
      width: props.width,
      height: props.height,
    };
  }

  handleMouseMove(event) {
    let horizenOffset = event.clientX - this.startX;
    let verticalOffset = event.clientY - this.startY;

    const config = anchorMap[this.ahchor];
    // horizenOffset *= config.offsetXCoefficient;
    // verticalOffset *= config.offsetYCoefficient;

    let width = Math.max(0, this.props.minWidth, this.width + horizenOffset * config.offsetXCoefficient);

    if (this.props.maxWidth !== undefined) {
      width = Math.min(width, this.props.maxWidth);
    }

    let height = Math.max(0, this.props.minHeight, this.height + verticalOffset * config.offsetYCoefficient);
    if (this.props.maxHeight !== undefined) {
      height = Math.min(height, this.props.maxHeight);
    }

    // horizenOffset *= config.offsetXCoefficient;
    // verticalOffset *= config.offsetYCoefficient;

    let x = this.x;
    if (config.offsetXCoefficient === -1) {
      x += Math.min(this.width, horizenOffset);
    }

    let y = this.y;
    if (config.offsetYCoefficient === -1) {
      y += Math.min(this.height, verticalOffset);
    }

    console.log(horizenOffset, verticalOffset);
    const rect = {
      x,
      y,
      width,
      height,
    };
    this.setState(rect);
    this.props.onResize(event, rect);
  }

  handleMouseUp() {
    const config = anchorMap[this.ahchor];
    this.ahchor = null;
    document.documentElement.classList.remove(resizingClass, config.cursor);

    document.removeEventListener('mousemove', this.handleMouseMove, true);
    document.removeEventListener('mouseup', this.handleMouseUp, true);
  }

  handleMouseDown(event) {
    if (!this.props.width || !this.props.height) {
      return;
    }

    // 记录宽高，防止属性更新影响计算
    this.width = this.props.width;
    this.height = this.props.height;
    this.x = this.props.x;
    this.y = this.props.y;
    this.startX = event.clientX;
    this.startY = event.clientY;

    const config = anchorMap[this.ahchor];

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

  setDomNode(node) {
    this.domNode = node;
  }

  render() {
    const { x, y, width, height } = this.state;
    const { visible, resizer } = this.props;

    return (
      <PositionBox
        className="ResizeBox"
        x={x}
        y={y}
        width={width}
        height={height}
        innerRef={this.setDomNode}
        visible={visible}
      >
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
      </PositionBox>
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
    offsetXCoefficient: -1,
    offsetYCoefficient: -1,
    cursor: 'nwse-resize',
  },
  [ResizeBox.RESIZER_TOP]: {
    offsetXCoefficient: 0, // nerver mind
    offsetYCoefficient: -1,
    cursor: 'ns-resize',
  },
  [ResizeBox.RESIZER_TOP_RIGHT]: {
    offsetXCoefficient: 1,
    offsetYCoefficient: -1,
    cursor: 'nesw-resize',
  },
  [ResizeBox.RESIZER_LEFT]: {
    offsetXCoefficient: -1,
    offsetYCoefficient: 0, // nerver mind
    cursor: 'ew-resize',
  },
  [ResizeBox.RESIZER_RIGHT]: {
    offsetXCoefficient: 1,
    offsetYCoefficient: 0, // nerver mind
    cursor: 'ew-resize',
  },
  [ResizeBox.RESIZER_BOTTOM_LEFT]: {
    offsetXCoefficient: -1,
    offsetYCoefficient: 1,
    cursor: 'nesw-resize',
  },
  [ResizeBox.RESIZER_BOTTOM]: {
    offsetXCoefficient: 0, // nerver mind
    offsetYCoefficient: 1,
    cursor: 'ns-resize',
  },
  [ResizeBox.RESIZER_BOTTOM_RIGHT]: {
    offsetXCoefficient: 1,
    offsetYCoefficient: 1,
    cursor: 'nwse-resize',
  },
};

export default ResizeBox;
