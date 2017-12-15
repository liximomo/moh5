import React from 'react';
import { DropTarget, DragSource } from 'react-dnd';
import { ELEMENT_NODE } from '../constants/TypeOfDragAndDropItem';

const Target = {
  drop(props, monitor) {
    // if (monitor.didDrop()) {
    //   // 阻止被嵌套的 drop 事件被父级继续处理
    //   return;
    // }

    const dragItem = monitor.getItem();
    if (props.onDrop) {
      props.onDrop(dragItem, props.id, props.index);
    }
    // moveChildToAnotherBeforeIndex(dragItem.id);
    console.log('move', dragItem.id, 'to', props.id, 'before', props.index);
  },
  hover(props, monitor) {
    // drag 和 drop 对象相同时
    if (monitor.getItem().id === props.id) {
      return;
    }

    if (props.onDragOver) {
      props.onDragOver();
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
  beginDrag(props) {
    if (props.onBeginDrag) {
      props.onBeginDrag();
    }

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

export default function NodeDropAndDrop(WrappedComponent) {
  const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  class Component extends React.Component {
    static WrappedComponent = WrappedComponent;
    static displayName = `NodeDropAndDrop(${wrappedComponentName})`;

    static propTypes = {
      onDrop: PropTypes.func,
    };

    constructor(props) {
      super(props);

      this.setWrappedInstance = this.setWrappedInstance.bind(this);
    }

    getWrappedInstance() {
      return this.wrappedInstance;
    }

    setWrappedInstance(ref) {
      this.wrappedInstance = ref;
    }

    getProps() {
      const contextProps = this.context;
      const props = {
        ...contextProps,
        ...this.props,
        ref: this.setWrappedInstance,
      };
      return props;
    }

    render() {
      return React.createElement(WrappedComponent, this.getProps());
    }
  }

  const WithDrag = DragSource(ELEMENT_NODE, Source, collectSource)(Component);
  const WithDrop = DropTarget(ELEMENT_NODE, Target, collectTarget)(WithDrag);
  return WithDrop;
}
