import React from 'react';
import { connect } from 'react-redux';
import { selectArtBord } from '../modules/elements';
import { activateELement } from '../modules/stage';
import EditorNode from './EditorNode';
import ElementHelper from './ElementHelper';
// import ResizeBox from '../libs/ResizeBox';

import './Stage.scss';

class Stage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hostNode: null,
    };
    this.setNode = this.setNode.bind(this);
  }

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  setNode(node) {
    this.node = node;
    this.setState({
      hostNode: node,
    });
  }

  render() {
    const { hostNode } = this.state;
    return (
      <div className="Stage" ref={this.setNode}>
        <EditorNode id={this.props.rootNodeId} />
        {hostNode ? <ElementHelper stageHostNode={hostNode} /> : null}
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

export default connect(mapStateToProps, { activateELement })(Stage);
