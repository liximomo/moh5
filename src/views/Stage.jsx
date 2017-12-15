import React from 'react';
import { connect } from 'react-redux';
import { selectArtBord } from '../modules/elements';
import { setActiveNode } from '../modules/editor';
import EditorNode from './EditorNode';

import './Stage.scss';

class Stage extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.setActiveNode(null);
  }

  render() {
    return (
      <div className="Stage" onClick={this.handleClick}>
        <EditorNode id={this.props.rootNodeId} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  // 返回一个  component node 对象
  return {
    rootNodeId: selectArtBord(state).id,
  };
}

export default connect(mapStateToProps, { setActiveNode })(Stage);
