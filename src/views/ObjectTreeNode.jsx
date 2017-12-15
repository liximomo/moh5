import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cn from 'classnames';
import WithTree from '@lib/Tree/WithTree';
import { DropTarget, DragSource } from 'react-dnd';

import { selectElement, moveChildToAnotherBeforeIndex } from '../modules/elements';
import { setActiveNode, selectActiveElementId } from '../modules/editor';

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

    const instance = component.decoratedComponentInstance;
    const dragItem = monitor.getItem();

    console.log('drag', dragItem.id, 'to', props.id);
    if (instance.onDrop) {
      instance.onDrop(dragItem);
    }
  },
  hover(props, monitor, component) {
    // drag 和 drop 对象相同时
    if (monitor.getItem().id === props.id) {
      return;
    }

    // compoent 为connectDragSource返回的高序组件，通过 decoratedComponentInstance 拿到原始组件
    component.decoratedComponentInstance.expand();
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
    return {
      id: props.id,
      pid: props.pid,
    };
  },
};

function collectSource(connect, monitor) {
  return {
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
  };

  constructor(props) {
    super(props);

    this.state = {
      isExpand: !props.isLeaf,
    };
  }

  hasChildren() {
    return !this.props.isLeaf && this.props.childIds.length > 0;
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

  onDrop(dragItem) {
    const { moveChildToAnotherBeforeIndex, id, childIds } = this.props;
    moveChildToAnotherBeforeIndex(dragItem.pid, dragItem.id, id, childIds.length);
  }

  onClick = () => {
    const { id, setActiveNode } = this.props;
    setActiveNode(id);
  };

  render() {
    const {
      isDragOver,
      isDragging,
      connectDropTarget,
      connectDragSource,
      childIds,
      id,
      pid,
      index,
      name,
      tree,
      isActive,
    } = this.props;

    const { isExpand } = this.state;
    // only native element nodes can now be passed to React DnD connectors
    // So wrap it with a div
    return connectDropTarget(
      connectDragSource(
        <div
          className={cn('ObjectTreeNode', {
            'is-dragOver': isDragOver && !isDragging,
            'is-dragging': isDragging,
            'is-active': isActive,
          })}
        >
          <div className="ObjectTreeItem">
            <div
              className="ObjectTreeNode__title"
              style={{ paddingLeft: INTENT * tree.level }}
              onClick={this.onClick}
            >
              {tree.level > 1 ? (
                <NodeDropzone className="ObjectTreeNode__dropzone" id={pid} index={index} />
              ) : null}
              <div>
                <span>{name}</span>
              </div>
              {tree.level > 1 ? (
                <NodeDropzone className="ObjectTreeNode__dropzone" id={pid} index={index + 1} />
              ) : null}
            </div>
            {this.hasChildren() && isExpand ? (
              <div className="ObjectTreeNode__children">
                {childIds.map((childId, index) => (
                  <ConnectedObjectTreeNode key={childId} pid={id} id={childId} index={index} />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )
    );
  }
}

function mapStateToProps(state, ownProps) {
  // 返回一个  component node 对象
  const element = selectElement(state, ownProps.id);
  const activeId = selectActiveElementId(state);
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
  setActiveNode,
})(withTree);

export default ConnectedObjectTreeNode;
