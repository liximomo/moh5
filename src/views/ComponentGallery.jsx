import React from 'react';
import ComponentItem from '../components/ComponentItem';
import PluginHub from '../plugins/PluginHub';
import './ComponentGallery.scss';

class ComponentGallery extends React.Component {
  items() {
    return PluginHub.getComponentSpecs().map(comp => <ComponentItem key={comp.type} {...comp} />);
  }

  render() {
    return (
      <div className="ComponentGallery">
        {this.items()}
      </div>
    );
  }
}

export default ComponentGallery;
