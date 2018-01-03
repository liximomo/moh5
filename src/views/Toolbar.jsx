import React from 'react';
import ComponentGallery from './ComponentGallery';
import './Toolbar.scss';

class Toolbar extends React.PureComponent {
  render() {
    return (
      <div className="Toolbar">
        <div className="Toolbar__area">
          <ComponentGallery />
        </div>
      </div>
    );
  }
}

export default Toolbar;
