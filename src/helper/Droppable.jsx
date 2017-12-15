import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';

export default function Dragable({ type }) {
  const DropTargetSpec = {
    drop(props, monitor, component) {
      const instance = component.getWrappedInstance();
      const dragItem = monitor.getItem();
      if (instance.onDrop) {
        instance.onDrop(dragItem);
      }
    },
    hover(props, monitor, component) {
      // drag 和 drop 对象相同时
      if (monitor.getItem().id === props.id) {
        return;
      }

      if (component.onDragOver) {
        component.onDragOver();
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

  function collectDrop(connect, monitor) {
    return {
      connectDropTarget: connect.dropTarget(),
      isDragOver: monitor.isOver(),
    };
  }

  return function NodeDrop(WrappedComponent) {
    const wrappedComponentName =
      WrappedComponent.displayName || WrappedComponent.name || 'Component';

    class Component extends React.Component {
      static WrappedComponent = WrappedComponent;
      static displayName = `NodeDrop(${wrappedComponentName})`;

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
        // const contextProps = this.context;
        const props = {
          // ...contextProps,
          ...this.props,
          ref: this.setWrappedInstance,
        };
        return props;
      }

      render() {
        return React.createElement(WrappedComponent, this.getProps());
      }
    }

    const WithDrop = DropTarget(type, DropTargetSpec, collectDrop)(Component);
    return WithDrop;
  };
}
