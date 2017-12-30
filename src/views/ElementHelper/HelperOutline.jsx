import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Outline from '../../components/Outline';
import {
  selectHelperOutline,
} from '../../modules/stage';

class HelperOutline extends React.PureComponent {
  static propTypes = {
    parentOffsetX: PropTypes.number,
    parentOffsetY: PropTypes.number,
  };

  static defaultProps = {
    parentOffsetX: 0,
    parentOffsetY: 0,
  };

  render() {
    const { parentOffsetX, parentOffsetY, x, y, width, height, isHoverElement } = this.props;

    return (
      <Outline
        x={x - parentOffsetX - 1}
        y={y - parentOffsetY - 1}
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
