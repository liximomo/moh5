import React from 'react';
import PropTypes from 'prop-types';
import EditorNode from './EditorNode';
import './Artboard.scss';

class Artboard extends React.Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
  };

  render() {
    const { childIds, width, height } = this.props;
    return (
      <div
        className="Artboard"
        style={{
          width,
          height,
        }}
      >
        {childIds.map(id => <EditorNode nodeId={id} key={id} />)}
      </div>
    );
  }
}

export default Artboard;
