import * as React from 'react';
import PropTypes from 'prop-types';
import './SplitLayout.scss';

const TValues = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

class SplitLayout extends React.Component {
  static propTypes = {
    size: PropTypes.arrayOf(TValues),
    minSize: PropTypes.arrayOf(TValues),
    maxSize: PropTypes.arrayOf(TValues),
    sashSize: PropTypes.number,
    renders: PropTypes.arrayOf(PropTypes.func).isRequired,
    beginDrag: PropTypes.func,
  };

  static defaultProps = {
    size: ['50%', '50%'],
    minSize: [],
    maxSize: [],
    sashSize: 6,
  };

  // container: HTMLElement;
  // left: HTMLElement;
  // right: HTMLElement;
  // sash: HTMLElement;
  // sashSize: PropTypes.number;
  // sashOffset: number;
  // containerBox: ClientRect;
  // offset: {
  //   x: number,
  //   y: number,
  // };

  items = [];

  constructor(props) {
    super(props);
    this.onProperChange(props);
  }

  onProperChange(props) {
    this.min = [];
    this.max = [];

    const [firstMinSize, lastMinSize] = props.minSize;
    const [firstMaxSize, lastMaxSize] = props.maxSize;

    if (firstMinSize) {
      this.min[0] = this.toPx(firstMinSize);
    }

    if (lastMinSize) {
      this.min[1] = this.toPx(lastMinSize);
    }

    if (firstMaxSize) {
      this.max[0] = this.toPx(firstMaxSize);
    }

    if (lastMaxSize) {
      this.max[1] = this.toPx(lastMaxSize);
    }
  }

  shouldComponentUpdate(nextProps) {
    return !(
      this.props.renders === nextProps.renders ||
      (this.props.renders[0] === nextProps.renders[0] &&
        this.props.renders[1] === nextProps.renders[1])
    );
  }

  componentDidMount() {
    this.containerBox = this.container.getBoundingClientRect();
    this.setUp(this.props);

    this.sash.addEventListener('mousedown', this.handleMouseDown, false);
    window.addEventListener('resize', this.handleResize, false);
  }

  componentWillReceiveProps(nextProps) {
    this.onProperChange(nextProps);
    this.setUp(nextProps);
  }

  componentWillUnmount() {
    this.sash.removeEventListener('mousedown', this.handleMouseDown, false);
    window.removeEventListener('resize', this.handleResize, false);
  }

  setUp(props) {
    const { sashSize } = props;
    const [firstSize, lastSize] = props.size;
    let firstSizePx;
    if (!firstSize) {
      const lastSizePx = this.toPx(lastSize);
      firstSizePx = this.containerBox.width - lastSizePx;
    } else {
      firstSizePx = this.toPx(firstSize);
    }

    this.sashSize = sashSize;
    const sashOffset = firstSizePx - this.sashSize / 2;
    this.updateSize(sashOffset);
  }

  update(offset) {
    const delta = offset - this.sashOffset;
    const firstSize = offset + this.sashSize / 2;
    const lastSize = this.containerBox.width - firstSize;
    const [firstMin, lastMin] = this.min;
    const [firstMax, lastMax] = this.max;

    // 向右 drag
    if (delta > 0) {
      if (lastMin && lastSize < lastMin) {
        return;
      }

      if (firstMax && firstSize > firstMax) {
        return;
      }

      this.updateSize(offset);
    } else {
      if (firstMin && firstSize < firstMin) {
        return;
      }

      if (lastMax && lastSize > lastMax) {
        return;
      }

      this.updateSize(offset);
    }
  }

  updateSize(offset) {
    this.sashOffset = offset;
    let normalizedOffset = offset;
    let first = normalizedOffset + this.sashSize / 2;

    if (offset <= 0) {
      this.sashOffset = -this.sashSize / 2;
      normalizedOffset = 0;
      first = 0;
    }

    this.items[0].style.width = `${first}px`;
    this.items[1].style.left = `${first}px`;
    this.sash.style.left = `${normalizedOffset}px`;
  }

  toPx(size) {
    let pxSize;
    if (typeof size === 'number') {
      pxSize = size;
    } else {
      const percentage = parseInt(size.replace(/%$/, ''), 10) / 100;
      pxSize = this.containerBox.width * percentage;
    }

    return pxSize;
  }

  setContainerNode = el => {
    this.container = el;
  };

  setItemNode = (index, el) => {
    this.items[index] = el;
  };

  setSashNode = el => {
    this.sash = el;
  };

  handleResize = () => {
    this.containerBox = this.container.getBoundingClientRect();
  };

  handleMouseDown = event => {
    if (this.props.beginDrag) {
      this.props.beginDrag(event);
    }

    this.offset = {
      x: this.sash.offsetLeft - event.clientX,
      y: this.sash.offsetTop - event.clientY,
    };

    document.documentElement.classList.add('is-drag');
    document.addEventListener('mousemove', this.handleMouseMove, true);
    document.addEventListener('mouseup', this.handleMouseUp, false);
  };

  handleMouseMove = event => {
    const offset = event.clientX + this.offset.x;
    this.update(offset);
  };

  handleMouseUp = () => {
    document.documentElement.classList.remove('is-drag');
    document.removeEventListener('mousemove', this.handleMouseMove, true);
    document.removeEventListener('mouseup', this.handleMouseUp, false);
  };

  render() {
    const { sashSize, renders } = this.props;
    return (
      <div className="SplitLayout" ref={this.setContainerNode}>
        {renders.map((render, index) => (
          <div key={index} className="SplitLayout__item" ref={el => this.setItemNode(index, el)}>
            {render()}
          </div>
        ))}
        <div
          ref={this.setSashNode}
          className="SplitLayout__sash"
          style={{ width: `${sashSize}px` }}
        />
      </div>
    );
  }
}

export default SplitLayout;
