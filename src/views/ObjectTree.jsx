import React from 'react';
import { connect } from 'react-redux';
import Tree from '@lib/Tree';

import { selectArtBord } from '../modules/elements';
import ObjectTreeNode from './ObjectTreeNode';
import './ObjectTree.scss';

class ObjectTree extends React.PureComponent {
  render() {
    return (
      <Tree>
        <ObjectTreeNode id={this.props.id} pid={null} />
      </Tree>
    );
  }
}

function mapStateToProps(state) {
  return {
    id: selectArtBord(state).id,
  };
}

const ConnectedObjectTree = connect(mapStateToProps)(ObjectTree);

export { ObjectTree };

export default ConnectedObjectTree;
