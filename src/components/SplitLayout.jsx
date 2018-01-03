import React from 'react';
import styled, { injectGlobal } from 'styled-components';
import PropTypes from 'prop-types';
import shallowEqual from '../utils/shallowEqual';

injectGlobal`
  html.is-drag {
    cursor: col-resize;
    user-select: none;
    pointer-events: none;
  }
`;

const Wrapper = styled.div`
  position: relative;
  height: 100vh;
`;
const SplitItem = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  height: 100%;

  &:first-of-child {
    left: 0;
  }

  & + & {
    right: 0;
  }
`;
const Sash = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  height: 100%;
  cursor: col-resize;
  width: ${props => props.size}px;
`;

const TValues = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

class SplitLayout extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    size: PropTypes.arrayOf(TValues),
    minSize: PropTypes.arrayOf(TValues),
    maxSize: PropTypes.arrayOf(TValues),
    sashSize: PropTypes.number,
    renders: PropTypes.arrayOf(PropTypes.func).isRequired,
    beginDrag: PropTypes.func,
    onResized: PropTypes.func,
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

  constructor(props) {
    super(props);

    this.state = {
      containerRect: null,
      columnOffsets: this.calculateColumnOffsetsFromProps(props),
    };
    this.sashDoms = [];
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

  shouldComponentUpdate(nextProps, nextState) {
    const propChanged = !shallowEqual(this.props.renders, nextProps.renders);
    const stateChanged = !shallowEqual(this.state, nextState);
    return propChanged || stateChanged;
  }

  componentDidMount() {
    // this.sash.addEventListener('mousedown', this.handleMouseDown, false);
    window.addEventListener('resize', this.handleResize, false);
  }

  componentDidUpdate() {
    if (this.props.onResized) {
      this.props.onResized();
    }
  }

  componentWillReceiveProps(nextProps) {
    this.onProperChange(nextProps);
  }

  componentWillUnmount() {
    this.sash.removeEventListener('mousedown', this.handleMouseDown, false);
    window.removeEventListener('resize', this.handleResize, false);
  }

  calculateColumnOffsetsFromProps(props) {
    const [firstSize, lastSize] = props.size;
    let firstSizePx;
    if (!firstSize) {
      const lastSizePx = this.toPx(lastSize);
      firstSizePx = this.state.containerRect.width - lastSizePx;
    } else {
      firstSizePx = this.toPx(firstSize);
    }

    return [firstSizePx];
  }

  calcItemSpan({ preOffset = 0, offset = this.state.containerRect.width } = {}) {
    const deltaOffset = offset - preOffset;
    return deltaOffset;
  }

  calcSashOffset(columnOffset) {
    const offset = columnOffset - this.props.sashSize / 2;
    return Math.max(0, offset);
  }

  toPx(size) {
    let pxSize;
    if (typeof size === 'number') {
      pxSize = size;
    } else {
      const percentage = parseInt(size.replace(/%$/, ''), 10) / 100;
      pxSize = this.state.containerRect.width * percentage;
    }

    return pxSize;
  }

  setContainerNode = el => {
    this.containerDom = el;
    this.setState({
      containerRect: el.getBoundingClientRect(),
    });
  };

  setSashNode = (el, index) => {
    this.sashDoms[index] = el;
  };

  handleResize = () => {
    this.setState({
      containerRect: this.containerDom.getBoundingClientRect(),
    });
  };

  handleMouseDown = event => {
    if (this.props.beginDrag) {
      this.props.beginDrag(event);
    }

    this.sashIndex = this.sashDoms.indexOf(event.target);
    this.sash = event.target;

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
    this.update(offset, this.sashIndex);
  };

  handleMouseUp = () => {
    document.documentElement.classList.remove('is-drag');
    document.removeEventListener('mousemove', this.handleMouseMove, true);
    document.removeEventListener('mouseup', this.handleMouseUp, false);
  };

  update(offset, index) {
    const sashOffset = this.calcSashOffset(this.state.columnOffsets[index]);
    const delta = offset - sashOffset;
    const firstSize = offset + this.props.sashSize / 2;
    const lastSize = this.state.containerRect.width - firstSize;
    const [firstMin, lastMin] = this.min;
    const [firstMax, lastMax] = this.max;

    let offsets;
    // 向右 drag
    if (delta > 0) {
      if (lastMin && lastSize < lastMin) {
        return;
      }

      if (firstMax && firstSize > firstMax) {
        return;
      }

      offsets = [offset];
    } else {
      if (firstMin && firstSize < firstMin) {
        return;
      }

      if (lastMax && lastSize > lastMax) {
        return;
      }

      offsets = [offset];
    }

    this.setState({
      columnOffsets: offsets
    });
  }

  renderItem(render, index) {
    const { columnOffsets } = this.state;
    const width = this.calcItemSpan({
      preOffset: columnOffsets[index - 1],
      offset: columnOffsets[index],
    });

    return (
      <SplitItem key={index} style={{ width }}>
        {render()}
      </SplitItem>
    );
  }

  render() {
    const { sashSize, renders, style } = this.props;
    const { containerRect, columnOffsets } = this.state;

    return (
      <Wrapper innerRef={this.setContainerNode} style={style}>
        {containerRect ? renders.map((render, index) => this.renderItem(render, index)) : null}
        {columnOffsets.map((offset, index) => (
          <Sash
            key={index}
            onMouseDown={this.handleMouseDown}
            innerRef={el => this.setSashNode(el, index)}
            size={sashSize}
            style={{ left: this.calcSashOffset(offset) }}
          />
        ))}
      </Wrapper>
    );
  }
}

export default SplitLayout;
