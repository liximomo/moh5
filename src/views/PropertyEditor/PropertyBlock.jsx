import React from 'react';
import PropTypes from 'prop-types';

import './PropertyBlock.scss';

class PropertyBlock extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    render: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div className="PropertyBlock">
        <div className="PropertyBlock__name u-paddingLeft10">{this.props.name}</div>
        <div className="PropertyBlock__container u-paddingLeft10">{this.props.render()}</div>
      </div>
    );
  }
}

export default PropertyBlock;
