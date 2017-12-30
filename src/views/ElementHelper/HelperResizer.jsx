import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ResizeBox from '../../components/ResizeBox';
import {
  selectHelperResizer,
} from '../../modules/stage';

class HelperResizer extends React.PureComponent {
  static propTypes = {
    parentOffsetX: PropTypes.number,
    parentOffsetY: PropTypes.number,
  };

  static defaultProps = {
    parentOffsetX: 0,
    parentOffsetY: 0,
  };

  constructor(props) {
    super(props);

    this.handleResize = this.handleResize.bind(this);
  }

  handleResize(event, data) {
    this.props.updateElement(this.props.activedElementId, {
      width: data.width,
      height: data.height,
    });
  }

  render() {
    const { parentOffsetX, parentOffsetY, x, y, width, height, isActiveElement } = this.props;

    return (
      <ResizeBox
        x={x - parentOffsetX - 1}
        y={y - parentOffsetY - 1}
        width={width}
        height={height}
        visible={isActiveElement}
        onResize={this.handleResize}
      />
    );
  }
}

function mapStateToProps(state) {
  return selectHelperResizer(state);
}

export default connect(mapStateToProps)(HelperResizer);
