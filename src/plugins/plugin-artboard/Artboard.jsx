import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EditorNode from '../../views/EditorNode';
import Droppable from '../../helper/Droppable';
import { selectArtBord, createElementAtArtBorad } from '../../modules/elements';
import { COMPONENT_NODE } from '../../constants/TypeOfDragAndDropItem';
import './Artboard.scss';

class Artboard extends React.Component {
  static propTypes = {
    // width: PropTypes.number,
    // height: PropTypes.number,
  };

  onDrop(dragItem) {
    this.props.createElementAtArtBorad(dragItem.type, dragItem.initProps);
  }

  render() {
    const { connectDropTarget, childIds } = this.props;
    return connectDropTarget(
      <div
        className="Artboard"
      >
        {childIds.map(id => <EditorNode id={id} key={id} />)}
      </div>
    );
  }
}

function mapStateToProps(state) {
  // 返回一个  component node 对象
  return selectArtBord(state);
}

const WithDrop = Droppable({ type: COMPONENT_NODE })(Artboard);
const ConnectedArtboard = connect(mapStateToProps, {
  createElementAtArtBorad,
})(WithDrop);

export default ConnectedArtboard;
