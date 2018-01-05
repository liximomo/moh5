import React from 'react';
import { connect } from 'react-redux';
import ResizeBox from '../../components/ResizeBox';
import {
  selectHelperResizer,
  selectActivedElementId,
} from '../../modules/stage';
import {
  updateElement,
} from '../../modules/elements';

class HelperResizer extends React.PureComponent {
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
    const { x, y, width, height, isActiveElement } = this.props;

    return (
      <ResizeBox
        x={x}
        y={y}
        width={width}
        height={height}
        visible={isActiveElement}
        onResize={this.handleResize}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    activedElementId: selectActivedElementId(state),
    ...selectHelperResizer(state),
  };
}

export default connect(mapStateToProps, { updateElement })(HelperResizer);
