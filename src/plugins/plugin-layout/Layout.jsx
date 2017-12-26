import React from 'react';
import styled from 'styled-components';
import EditorNode from '../../views/EditorNode';

const Flex = styled.div`
  display: flex;
  width: 100%;
  height: ${props => props.height}px;
}`;

export default class Layout extends React.PureComponent {
  render() {
    const { id, height, getEditorProps } = this.props;
    return (
      <Flex height={height} {...getEditorProps()}>
        {this.props.childIds.map(childId => <EditorNode key={childId} id={childId} pid={id} />)}
      </Flex>
    );
  }
}
