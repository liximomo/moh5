import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { EDITOR_NODE_ATTR } from '../../constants';
import HelperOutline from './HelperOutline';
import HelperResizer from './HelperResizer';
import {
  hoverElement,
  unHoverElement,
  activateELement,
  clearActivedELement,
} from '../../modules/stage';

class ElementHelper extends React.PureComponent {
  static propTypes = {
    stageHostNode: PropTypes.instanceOf(HTMLElement).isRequired,
  };

  constructor(props) {
    super(props);

    this.topEventListener = new Map();
    this.handleTopEvent = this.handleTopEvent.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.handleClick = this.handleClick.bind(this);
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
    const stageHostNode = this.props.stageHostNode;
    for (let target = event.target; target && target !== stageHostNode.parentNode; target = target.parentNode) {
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
      } else if (target === stageHostNode) {
        switch (event.type) {
          case 'click':
            this.handleStageClick(event);
            break;
          default:
            // do nothing
            break;
        }
      }
    }
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
    this.props.clearActivedELement();
  }

  getStageArea() {
    if (this.stageArea) {
      return this.stageArea;
    }

    this.stageArea = this.props.stageHostNode.getBoundingClientRect();
    return this.stageArea;
  }

  render() {
    const parentReact = this.getStageArea();
    return (
      <div className="StageHelper">
        <HelperOutline
          parentOffsetX={parentReact.x}
          parentOffsetY={parentReact.y}
        />
        <HelperResizer
          parentOffsetX={parentReact.x}
          parentOffsetY={parentReact.y}
        />
      </div>
    );
  }
}

export default connect(null, {
  hoverElement,
  unHoverElement,
  activateELement,
  clearActivedELement,
})(ElementHelper);
