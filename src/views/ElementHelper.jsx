import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as definedPropTypes from '../constants/proptypes';
import { EDITOR_NODE_ATTR } from '../constants';
import Outline from '../components/Outline';
import ResizeBox from '../components/ResizeBox';
import {
  selectElementHelper,
  hoverElement,
  unHoverElement,
  activateELement,
} from '../modules/stage';
import { updateElement } from '../modules/elements';
// import ResizeBox from '../libs/ResizeBox';

class ElementHelper extends React.PureComponent {
  static propTypes = {
    stageHostNode: PropTypes.instanceOf(HTMLElement).isRequired,
    activedElementId: definedPropTypes.Id,
    hoveredElementId: definedPropTypes.Id,
    hoverElementRect: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      width: PropTypes.number,
      height: PropTypes.number,
    }),
    activeElementRect: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      width: PropTypes.number,
      height: PropTypes.number,
    }),
    isActiveElement: PropTypes.bool,
    isHoverElement: PropTypes.bool,
  };

  static defaultProps = {
    outline: false,
    resizer: false,
  };

  constructor(props) {
    super(props);

    this.topEventListener = new Map();
    this.handleTopEvent = this.handleTopEvent.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    this.props.stageHostNode.addEventListener('mouseover', this.handleTopEvent, false);
    this.props.stageHostNode.addEventListener('mouseout', this.handleTopEvent, false);
    this.props.stageHostNode.addEventListener('click', this.handleTopEvent, false);
  }

  componentWillUnmount() {
    this.props.stageHostNode.removeEventListener('mouseover', this.handleTopEvent, false);
    this.props.stageHostNode.removeEventListener('mouseout', this.handleTopEvent, false);
    this.props.stageHostNode.removeEventListener('click', this.handleTopEvent, false);
  }

  handleTopEvent(event) {
    for (let target = event.target; target && target !== event.currentTarget; target = target.parentNode) {
      if (target.matches && target.matches(`[${EDITOR_NODE_ATTR}]`)) {
        switch (event.type) {
          case 'mouseover':
            this.handleMouseOver(event);
            break;
          case 'mouseout':
            this.handleMouseOut(event);
            break;
          case 'click':
            this.handleClick(event);
            break;
          default:
            // do nothing
            break;
        }

        // break for
        break;
      }
    }
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

  getOffset(offset) {
    const stageArea = this.getStageArea();
    return {
      x: offset.x - stageArea.x - 1,
      y: offset.y - stageArea.y - 1,
    };
  }

  handleMouseOver(event) {
    const id = parseInt(event.target.getAttribute(EDITOR_NODE_ATTR), 10);
    if (id === this.props.activedElementId) {
      return;
    }

    this.props.hoverElement({
      elementId: id,
    });
  }

  handleMouseOut(event) {
    const id = parseInt(event.target.getAttribute(EDITOR_NODE_ATTR), 10);
    if (id === this.props.activedElementId) {
      return;
    }

    this.props.unHoverElement();
  }

  handleClick(event) {
    const id = parseInt(event.target.getAttribute(EDITOR_NODE_ATTR), 10);
    if (id === this.props.activedElementId) {
      return;
    }

    this.props.activateELement({
      elementId: id,
    });
  }

  handleStageClick() {

  }

  handleResize(event, data) {
    this.props.updateElement(this.props.activedElementId, {
      width: data.width,
      height: data.height,
    });
  }

  render() {
    const { hoverElementRect, activeElementRect, isActiveElement, isHoverElement, activedElementId, hoveredElementId } = this.props;

    return (
      <div className="StageHelper">
        <Outline
          {...this.getOffset(hoverElementRect)}
          width={hoverElementRect.width}
          height={hoverElementRect.height}
          visible={isHoverElement && activedElementId !== hoveredElementId}
        />
        <ResizeBox
          {...this.getOffset(activeElementRect)}
          width={activeElementRect.width}
          height={activeElementRect.height}
          visible={isActiveElement}
          onResize={this.handleResize}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return selectElementHelper(state);
}

export default connect(mapStateToProps, {
  hoverElement,
  unHoverElement,
  updateElement,
  activateELement,
})(ElementHelper);
