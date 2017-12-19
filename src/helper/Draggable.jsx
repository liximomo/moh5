import React from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

export default function Dragable({ type }) {
  const DragSourceSpec = {
    beginDrag(props, monitor, component) {
      const instance = component.getWrappedInstance();
      if (instance.getDragItem) {
        return instance.getDragItem();
      }

      return {};
    },
  };

  function collectDrag(connect, monitor) {
    return {
      connectDragPreview: connect.dragPreview(),
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    };
  }

  return function NodeDrag(WrappedComponent) {
    const wrappedComponentName =
      WrappedComponent.displayName || WrappedComponent.name || 'Component';

    class Component extends React.PureComponent {
      static WrappedComponent = WrappedComponent;
      static displayName = `NodeDrag(${wrappedComponentName})`;

      static propTypes = { onDrop: PropTypes.func };

      constructor(props) {
        super(props);

        this.setWrappedInstance = this.setWrappedInstance.bind(this);
      }

      componentDidMount() {
        // Use empty image as a drag preview so browsers don't draw it
        // and we can draw whatever we want on the custom drag layer instead.
        this.props.connectDragPreview(getEmptyImage(), { captureDraggingState: false });
      }

      getWrappedInstance() {
        return this.wrappedInstance;
      }

      setWrappedInstance(ref) {
        this.wrappedInstance = ref;
      }

      getProps() {
        const props = { ...this.props, ref: this.setWrappedInstance };
        return props;
      }

      render() {
        return React.createElement(WrappedComponent, this.getProps());
      }
    }

    const WithDrag = DragSource(type, DragSourceSpec, collectDrag)(Component);
    return WithDrag;
  };
}
