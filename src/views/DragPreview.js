import React from 'react';
import PropTypes from 'prop-types';
// import { ELEMENT_NODE, COMPONENT_NODE } from '../constants/TypeOfDragAndDropItem';
import { DragLayer } from 'react-dnd';
import './DragPreview.scss';

function getItemStyles(props) {
  const { offsetX, offsetY } = props;
  if (offsetX === undefined || offsetY === undefined) {
    return { display: 'none' };
  }

  const transform = `translate(${offsetX}px, ${offsetY}px)`;
  return {
    transform: transform,
  };
}

function collect(monitor) {
  const currentOffset = monitor.getClientOffset() || {};
  return {
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    offsetX: currentOffset.x !== undefined ? currentOffset.x + 10 : undefined,
    offsetY: currentOffset.y,
    isDragging: monitor.isDragging(),
  };
}

class DragPreview extends React.PureComponent {
  static propTypes = {
    item: PropTypes.object,
    itemType: PropTypes.string,
    offsetX: PropTypes.number,
    offsetY: PropTypes.number,
    isDragging: PropTypes.bool.isRequired,
  };

  renderItem(type, item) {
    // switch (type) {
    //   // case ELEMENT_NODE:
    //   //   return <div className="previewBox">{item.title}</div>;
    //   // case COMPONENT_NODE:
    //   //   return <div>{item.title}</div>;
    //   default:
    //     return <div className="previewBox">{item.title}</div>;
    // }
    return <div className="previewBox">{item.title}</div>;
  }

  render() {
    const { item, itemType, isDragging } = this.props;
    if (!isDragging) {
      return null;
    }

    return (
      <div className="DragPreview">
        <div style={getItemStyles(this.props)}>{this.renderItem(itemType, item)}</div>
      </div>
    );
  }
}

export default DragLayer(collect)(DragPreview);
