import React from 'react';
import { connect } from 'react-redux';
import { selectArtBord } from '../modules/elements';
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
    this.setState({
      hostNode: node,
    });
  }

  render() {
    const { hostNode } = this.state;
    const {
      rootElementId,
    } = this.props;
    return (
      <div className="Stage" ref={this.setNode}>
        <EditorNode id={rootElementId} />
        {hostNode ? <ElementHelper stageHostNode={hostNode} /> : null}
      </div>
    );
  }
}

function mapStateToProps(state) {
  // 返回一个  component node 对象
  const artboard = selectArtBord(state);
  return {
    rootElementId: artboard.id,
  };
}

export default connect(mapStateToProps)(Stage);
