import React from 'react';
import PropTypes from 'prop-types';
import Draggable from '../helper/Draggable';
import { COMPONENT_NODE } from '../constants/TypeOfDragAndDropItem';
import './ComponentItem.scss';

class ComponentItem extends React.Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
  };

  getDragItem() {
    return {
      title: this.props.name,
      type: this.props.type,
      defaultProps: this.props.defaultProps,
    };
  }

  render() {
    const { connectDragSource, name } = this.props;
    return connectDragSource(
      <div className="ComponentItem">
        <span>{name}</span>
      </div>
    );
  }
}

export default Draggable({ type: COMPONENT_NODE })(ComponentItem);
