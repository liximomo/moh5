import React from 'react';
import { DEVICE_MAP } from '../../constants';

export default class PropertyEditor extends React.Component {
  state = {
    value: '',
    responsive: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.device,
      responsive: false,
    };
  }

  render() {
    const { value } = this.state;
    const { width, height } = this.props;

    const isEditable = value === DEVICE_MAP.responsive.id;

    return (
      <div className="ArtboardPropertyEditor">
        <div className="Artboard__options">
          <select value={value}>
            {Object.keys(DEVICE_MAP).map(value => {
              const device = DEVICE_MAP[value];
              return (
                <option value={value} key={device.id}>
                  {device.label}
                </option>
              );
            })}
          </select>
        </div>
        <div className="Artboard__show">
          <input type="text" value={width} disabled={!isEditable} />
          x
          <input type="text" value={height} disabled={!isEditable} />
        </div>
      </div>
    );
  }
}
