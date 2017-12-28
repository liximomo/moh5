import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { connect } from 'react-redux';
import cn from 'classnames';
import WithTree from '@lib/Tree/WithTree';
import { DropTarget, DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { selectElement, moveChildToAnotherBeforeIndex } from '../modules/elements';
import { activateELement, selectActivedElementId, hoverElement, unHoverElement } from '../modules/editor';

import * as definedPropTypes from '../constants/proptypes';
import { ELEMENT_NODE } from '../constants/TypeOfDragAndDropItem';
import NodeDropzone from './NodeDropzone';

const INTENT = 12;

const NodeDropTarget = {
  drop(props, monitor, component) {
    // if (monitor.didDrop()) {
    //   // 阻止被嵌套的 drop 事件被父级继续处理
    //   return;
    // }

    const dragItem = monitor.getItem();

    if (component.onDrop) {
      component.onDrop(dragItem);
    } else {
      const instance = component.getDecoratedComponentInstance();
      if (instance.onDrop) {
        instance.onDrop(dragItem);
      }
    }
  },
  hover(props, monitor, component) {
    // drag 和 drop 对象相同时
    if (monitor.getItem().id === props.id) {
      return;
    }

    if (component.onDragOver) {
      component.onDragOver();
    } else {
      const instance = component.getDecoratedComponentInstance();
      if (instance.onDragOver) {
        instance.onDragOver();
      }
    }
  },
  canDrop(props, monitor) {
    // drag 和 drop 对象相同时
    if (monitor.getItem().id === props.id) {
      return false;
    }

    const isHover = monitor.isOver({ shallow: true }); // 只有最上层的对象可以处理 drop 事件
    return isHover;
  },
};

const Source = {
  beginDrag(props, monitor, component) {
    component.collapse();
    return { id: props.id, pid: props.pid, title: props.name };
  },
};

function collectSource(connect, monitor) {
  return {
    connectDragPreview: connect.dragPreview(),
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

function collectTarget(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isDragOver: monitor.isOver({ shallow: true }), // 不允许嵌套的 hover
  };
}

// $todo 增加 isLeaf 属性
class ObjectTreeNode extends React.PureComponent {
  static propTypes = {
    index: PropTypes.number,
    pid: PropTypes.oneOfType([definedPropTypes.Null, definedPropTypes.Id.isRequired]),
    id: definedPropTypes.Id.isRequired,
    isLeaf: PropTypes.bool,
    childIds: PropTypes.arrayOf(definedPropTypes.Id),
  };

  static defaultProps = {
    index: 0,
    isLeaf: false,
    childIds: [],
    isDragOver: false,
    isDragging: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      isExpand: true,
    };

    this.toggleChildren = this.toggleChildren.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  componentDidMount() {
    // Use empty image as a drag preview so browsers don't draw it
    // and we can draw whatever we want on the custom drag layer instead.
    this.props.connectDragPreview(getEmptyImage(), {
      captureDraggingState: false,
    });
  }

  hasChildren() {
    return !this.props.isLeaf && this.props.childIds.length > 0;
  }

  handleClick(event) {
    event.stopPropagation();
    const { id, activateELement } = this.props;
    activateELement({
      elementId: id,
    });
  }

  onMouseEnter() {
    this.props.hoverElement({
      elementId: this.props.id,
    });
  }

  onMouseLeave() {
    this.props.unHoverElement();
  }

  onDrop(dragItem) {
    const { moveChildToAnotherBeforeIndex, id, childIds } = this.props;
    moveChildToAnotherBeforeIndex(dragItem.pid, dragItem.id, id, childIds.length);
  }

  onDragOver() {
    this.expand();
  }

  toggleChildren() {
    this.setState(state => {
      return {
        isExpand: !state.isExpand,
      };
    });
  }

  expand() {
    if (!this.hasChildren() || this.state.isExpand) {
      return;
    }

    this.setState({
      isExpand: true,
    });
  }

  collapse() {
    if (!this.hasChildren() || !this.state.isExpand) {
      return;
    }

    this.setState({
      isExpand: false,
    });
  }

  getIntent() {
    return INTENT * this.props.tree.level + 4;
  }

  renderChildren() {
    const { childIds, id } = this.props;
    const { isExpand } = this.state;
    if (this.hasChildren() && isExpand) {
      return (
        <div className="ObjectTreeNode__children">
          {childIds.map((childId, index) => (
            <ConnectedObjectTreeNode key={childId} pid={id} id={childId} index={index} />
          ))}
        </div>
      );
    }

    return null;
  }

  renderNode() {
    const { isDragOver, isDragging, pid, index, name, tree, isActive } = this.props;

    const { isExpand } = this.state;

    // only native element nodes can now be passed to React DnD connectors
    return (
      <div className={cn('ObjectTreeNodeWrapper')}>
        <div
          className={cn('ObjectTreeNode', {
            'is-dragOver': isDragOver && !isDragging,
            'is-dragging': isDragging,
            'is-active': isActive,
            'is-expand': isExpand,
          })}
          onClick={this.handleClick}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <div className="ObjectTreeItemWrapper" style={{ marginLeft: this.getIntent() }}>
            {tree.level > 1 ? (
              <Fragment>
                <NodeDropzone className="ObjectTreeNode__dropzone" id={pid} index={index} />
                <NodeDropzone className="ObjectTreeNode__dropzone" id={pid} index={index + 1} />
              </Fragment>
            ) : null}
            <div className="ObjectTreeItem">
              <div className="ObjectTreeItem__expandToggle"  onClick={this.toggleChildren}>
                {this.hasChildren() ? (
                  <Icon type="caret-right" className="Icon-toggle" />
                ) : null}
              </div>
              <div className="ObjectTreeItem__title">{name}</div>
              <div className="ObjectTreeItem__indicators">
                <Icon type="plus" className="Icon-add" />
              </div>
            </div>
          </div>
        </div>
        {this.renderChildren()}
      </div>
    );
  }

  render() {
    const { connectDropTarget, connectDragSource, tree } = this.props;

    if (tree.level === 1) {
      return connectDropTarget(this.renderNode());
    }

    // So wrap it with a div
    return connectDropTarget(connectDragSource(this.renderNode()));
  }
}

function mapStateToProps(state, ownProps) {
  // 返回一个  component node 对象
  const element = selectElement(state, ownProps.id);
  const activeId = selectActivedElementId(state);
  return {
    id: element.id,
    name: element.name,
    childIds: element.childIds,
    isActive: ownProps.id === activeId,
  };
}

const WithDrag = DragSource(ELEMENT_NODE, Source, collectSource)(ObjectTreeNode);
const WithDrop = DropTarget(ELEMENT_NODE, NodeDropTarget, collectTarget)(WithDrag);
const withTree = WithTree(WithDrop);
const ConnectedObjectTreeNode = connect(mapStateToProps, {
  moveChildToAnotherBeforeIndex,
  activateELement,
  hoverElement,
  unHoverElement,
})(withTree);

export default ConnectedObjectTreeNode;
