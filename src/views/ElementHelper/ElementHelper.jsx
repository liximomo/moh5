import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as definedPropTypes from '../../constants/proptypes';
import { EDITOR_NODE_ATTR } from '../../constants';
import Outline from '../../components/Outline';
import ResizeBox from '../../components/ResizeBox';
import {
  selectElementHelper,
  hoverElement,
  unHoverElement,
  activateELement,
} from '../../modules/stage';
import { updateElement } from '../../modules/elements';

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
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    this.props.stageHostNode.addEventListener('mouseover', this.handleTopEvent, false);
    this.props.stageHostNode.addEventListener('mouselout', this.handleTopEvent, false);
    this.props.stageHostNode.addEventListener('click', this.handleTopEvent, false);
  }

  componentWillUnmount() {
    this.props.stageHostNode.removeEventListener('mouseover', this.handleTopEvent, false);
    this.props.stageHostNode.removeEventListener('mouselout', this.handleTopEvent, false);
    this.props.stageHostNode.removeEventListener('click', this.handleTopEvent, false);
  }

  handleTopEvent(event) {
    for (let target = event.target; target && target !== event.currentTarget; target = target.parentNode) {
      if (target.matches && target.matches(`[${EDITOR_NODE_ATTR}]`)) {
        switch (event.type) {
          case 'mouseover':
            this.handleMouseEnter(event);
            break;
          case 'mouselout':
            this.handleMouseLeave(event);
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

  getOffset() {
    const stageArea = this.getStageArea();
    return {
      x: this.props.x - stageArea.x - 1,
      y: this.props.y - stageArea.y - 1,
    };
  }

  handleMouseEnter(event) {
    const id = parseInt(event.target.getAttribute(EDITOR_NODE_ATTR), 10);
    if (id === this.props.activedElementId) {
      return;
    }

    this.props.hoverElement({
      elementId: id,
    });
  }

  handleMouseLeave(event) {
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
    const { width, height, isActiveElement, isHoverElement, activedElementId, hoveredElementId } = this.props;
    const offset = this.getOffset();

    return (
      <div className="StageHelper">
        <Outline
          x={offset.x}
          y={offset.y}
          width={width}
          height={height}
          visible={isHoverElement && activedElementId !== hoveredElementId}
        />
        <ResizeBox
          x={offset.x}
          y={offset.y}
          width={width}
          height={height}
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
