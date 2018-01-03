import React from 'react';
import { connect } from 'react-redux';
import Outline from '../../components/Outline';
import {
  selectHelperOutline,
} from '../../modules/stage';

class HelperOutline extends React.PureComponent {

  render() {
    const { x, y, width, height, isHoverElement } = this.props;
    return (
      <Outline
        x={x}
        y={y}
        width={width}
        height={height}
        visible={isHoverElement}
      />
    );
  }
}

function mapStateToProps(state) {
  return selectHelperOutline(state);
}

export default connect(mapStateToProps)(HelperOutline);
