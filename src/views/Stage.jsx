import React from 'react';
import { connect } from 'react-redux';
import { EDITOR_NODE_ATTR } from '../constants';
import Outline from '../components/Outline';
import { selectArtBord } from '../modules/elements';
import { setActiveNode, selectNodeOutline, showNodeOutline, hideNodeOutline } from '../modules/editor';
import EditorNode from './EditorNode';
// import ResizeBox from '../libs/ResizeBox';

import './Stage.scss';

class Stage extends React.Component {
  constructor(props) {
    super(props);

    this.topEventListener = new Map();

    this.handleClick = this.handleClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.setNode = this.setNode.bind(this);
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
    this.node.addEventListener(eventname, listener, useCapture);
  }

  removeTopEvent(eventname, handler, useCapture = false) {
    const listener = this.topEventListener.get(handler);
    this.topEventListener.delete(handler);
    this.node.removeEventListener('mouseenter', listener, useCapture);
  }

  getStageArea() {
    if (this.stageArea) {
      return this.stageArea;
    }

    this.stageArea = this.node.getBoundingClientRect();
    return this.stageArea;
  }

  handleMouseEnter(event) {
    const area = event.target.getBoundingClientRect();
    const stageArea = this.getStageArea();
    this.props.showNodeOutline({
      x: area.x - stageArea.x - 1,
      y: area.y - stageArea.y - 1,
      width: area.width,
      height: area.height,
    })
  }

  handleMouseLeave() {
    this.props.hideNodeOutline();
  }

  handleClick() {
    this.props.setActiveNode(null);
  }

  setNode(node) {
    this.node = node;
  }

  render() {
    const {
      nodeOutline
    } = this.props;

    return (
      <div className="Stage" onClick={this.handleClick} ref={this.setNode}>
        <EditorNode id={this.props.rootNodeId} />
        <Outline {...nodeOutline} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  // 返回一个  component node 对象
  return {
    nodeOutline: selectNodeOutline(state),
    rootNodeId: selectArtBord(state).id,
  };
}

export default connect(mapStateToProps, { setActiveNode, showNodeOutline, hideNodeOutline })(Stage);
