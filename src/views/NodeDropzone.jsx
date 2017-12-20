import React from 'react';
// import { DropTarget } from 'react-dnd';
import { connect } from 'react-redux';
import cn from 'classnames';
import { moveChildToAnotherBeforeIndex } from '../modules/elements';
import { ELEMENT_NODE } from '../constants/TypeOfDragAndDropItem';
import Droppable from '../helper/Droppable';

// const Target = {
//   drop(props, monitor) {
//     const dragItem = monitor.getItem();
//     // moveChildToAnotherBeforeIndex(dragItem.id);
//     console.log('move', dragItem.id, 'to', props.id, 'before', props.index);
//   },
// };

// function collect(connect, monitor) {
//   return {
//     connectDropTarget: connect.dropTarget(),
//     isDragOver: monitor.isOver(),
//   };
// }

// class ObjectTreeNodeDropzone extends React.PureComponent {
//   render() {
//     const { connectDropTarget, isDragOver } = this.props;
//     return connectDropTarget(
//       <div className={cn('ObjectTreeNode__dropzone', { 'is-dragOver': isDragOver })} />
//     );
//   }
// }

// const withDrop = DropTarget(OBJEC_TTREE_NODE, Target, collect)(ObjectTreeNodeDropzone);

class ObjectTreeNodeDropzone extends React.PureComponent {
  onDrop(dragItem) {
    const { id, index, moveChildToAnotherBeforeIndex } = this.props;

    if (id !== null) {
      console.log(dragItem.pid, dragItem.id, id, index);
      moveChildToAnotherBeforeIndex(dragItem.pid, dragItem.id, id, index);
    }
  }

  render() {
    const { connectDropTarget, isDragOver, className, style } = this.props;
    return connectDropTarget(<div className={cn(className, { 'is-dragOver': isDragOver })} style={style}/>);
  }
}

const withDrop = Droppable({ type: ELEMENT_NODE })(ObjectTreeNodeDropzone);

const connected = connect(null, {
  moveChildToAnotherBeforeIndex,
})(withDrop);

export default connected;
