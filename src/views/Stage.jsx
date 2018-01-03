import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { selectArtBord } from '../modules/elements';
import { STAGE_DOM_CLASS } from '../constants';
// import { updateStateRect } from '../modules/stage';
import EditorNode from './EditorNode';
import ElementHelper from './ElementHelper';
// import ResizeBox from '../libs/ResizeBox';

const gridCellSize = '4px';
const gridLineWidth = '1px';

const StageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  border-left: 1px #ddd solid;
  border-right: 1px #ddd solid;
  width: 100%;
  height: 100%;

  background:
    linear-gradient(to right, #ddd, #ddd ${gridLineWidth}, transparent 0, transparent),
    linear-gradient(to bottom, #ddd, #ddd ${gridLineWidth}, transparent 0, transparent);
  background-size: ${gridCellSize} 100%, 100% ${gridCellSize};
`;

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
      <StageWrapper innerRef={this.setNode} className={STAGE_DOM_CLASS}>
        <EditorNode id={rootElementId} />
        {hostNode ? <ElementHelper stageHostNode={hostNode} /> : null}
      </StageWrapper>
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
