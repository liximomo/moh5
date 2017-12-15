import React from 'react';
import PropTypes from 'prop-types';
import * as definedPropTypes from '../../constants/proptypes';
import * as MO from '../../mo';
import InjectElementProperty from '../../helper/InjectElementProperty';

const getNumber = value => {
  return value !== '' ? parseInt(value, 10) : undefined;
};

const getDefaultNumber = value => {
  // eslint-disable-next-line eqeqeq
  return value != undefined ? value : '';
};

class BoxProperty extends React.Component {
  static propTypes = {
    elementId: definedPropTypes.Id.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    update: PropTypes.func,
  };

  render() {
    const { width, height } = this.props;

    if (!this.updateX) {
      this.updateWidth = event => this.props.update({ width: getNumber(event.target.value, 10) });
      this.updateHeight = event => this.props.update({ height: getNumber(event.target.value, 10) });
    }

    return (
      <div className="BoxProperty">
        <div className="u-flex u-marginTop10">
          <div className="ControlItem">
            <div className="Inputlabel">width</div>
            <div className="InputControl">
              <input type="number" value={getDefaultNumber(width)} onChange={this.updateWidth} />
            </div>
          </div>
          <div className="ControlItem">
            <div className="Inputlabel">height</div>
            <div className="InputControl">
              <input type="number" value={getDefaultNumber(height)} onChange={this.updateHeight} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default InjectElementProperty({ propertyNames: MO.getDemisioinPropertyNames() })(BoxProperty);
