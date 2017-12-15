import React from 'react';
import { DragSource } from 'react-dnd';
import { OBJEC_TTREE_NODE } from '../constants/TypeOfDragAndDropItem';

const Source = {
  beginDrag(props) {
    return {
      id: props.id,
    };
  },
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

// proptyps 与 ObjectTreeNode 相同
class ObjectTreeItem extends React.Component {
  render() {
    const { connectDragSource, isDragging, id, name } = this.props;
    return connectDragSource(
      <div
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: 'move',
        }}
      >
        <span>
          {id} - {name}
        </span>
      </div>
    );
  }
}

export default DragSource(OBJEC_TTREE_NODE, Source, collect)(ObjectTreeItem);
