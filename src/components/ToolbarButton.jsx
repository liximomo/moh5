import React from 'react';

import './ToolbarButton.scss';

class ToolbarButton extends React.Component {
  button() {
    const { component, render } = this.props;
    if (component) return React.createElement(component);

    return render();
  }

  render() {
    const { label } = this.props;

    return (
      <div className="ToolbarButton">
        <div className="Tb__button">{this.button()}</div>
        <div className="Tb__label">{label}</div>
      </div>
    );
  }
}

export default ToolbarButton;
