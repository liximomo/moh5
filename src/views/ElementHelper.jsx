import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as definedPropTypes from '../constants/proptypes';
import { EDITOR_NODE_ATTR } from '../constants';
import Outline from '../components/Outline';
import ResizeBox from '../components/ResizeBox';
import { selectElementHelper, hoverElement, unHoverElement } from '../modules/editor';
import { updateElement } from '../modules/elements';
// import ResizeBox from '../libs/ResizeBox';

class ElementHelper extends React.PureComponent {
  static propTypes = {
    activedElementId: definedPropTypes.Id,
    hoveredElementId: definedPropTypes.Id,
    stageHostNode: PropTypes.instanceOf(HTMLElement).isRequired,
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    outline: PropTypes.bool,
    resizer: PropTypes.bool,
  };

  static defaultProps = {
    outline: false,
    resizer: false,
  };

  constructor(props) {
    super(props);

    this.topEventListener = new Map();
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    this.listenTopEvent('mouseenter', this.handleMouseEnter, true);
    this.listenTopEvent('mouseleave', this.handleMouseLeave, true);
  }

  componentWillUnmount() {
    this.removeTopEvent('mouseenter', this.handleMouseEnter, true);
    this.removeTopEvent('mouseleave', this.handleMouseLeave, true);
  }

  listenTopEvent(eventname, handler, useCapture = false) {
    const listener = function topListener(event) {
      for (let target = event.target; target && target !== this; target = target.parentNode) {
        if (target.matches && target.matches(`[${EDITOR_NODE_ATTR}]`)) {
          handler(event);
          break;
        }
      }
    };
    this.topEventListener.set(handler, listener);
    this.props.stageHostNode.addEventListener(eventname, listener, useCapture);
  }

  removeTopEvent(eventname, handler, useCapture = false) {
    if (!this.props.stageHostNode) {
      return;
    }

    const listener = this.topEventListener.get(handler);
    this.topEventListener.delete(handler);
    this.props.stageHostNode.removeEventListener('mouseenter', listener, useCapture);
  }

  getStageArea() {
    if (this.stageArea) {
      return this.stageArea;
    }

    this.stageArea = this.props.stageHostNode.getBoundingClientRect();
    return this.stageArea;
  }

  getOffset() {
    const stageArea = this.getStageArea();
    return {
      x: this.props.x - stageArea.x - 1,
      y: this.props.y - stageArea.y - 1,
    };
  }

  handleMouseEnter(event) {
    this.props.hoverElement({
      elementId: parseInt(event.target.getAttribute(EDITOR_NODE_ATTR), 10)
    });
  }

  handleMouseLeave() {
    this.props.unHoverElement();
  }

  handleResize(event, data) {
    this.props.updateElement(this.props.activedElementId, {
      width: data.width,
      height: data.height,
    });
  }

  render() {
    const { width, height, isHover, activedElementId, hoveredElementId } = this.props;
    const offset = this.getOffset();

    return (
      <div className="StageHelper">
        <Outline
          x={offset.x}
          y={offset.y}
          width={width}
          height={height}
          visible={isHover && activedElementId !== hoveredElementId}
        />
        <ResizeBox
          x={offset.x}
          y={offset.y}
          width={width}
          height={height}
          onResize={this.handleResize}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return selectElementHelper(state);
}

export default connect(mapStateToProps, { hoverElement, unHoverElement, updateElement })(
  ElementHelper
);
