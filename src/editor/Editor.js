import React from 'react';
import ComponentHub from './ComponentHub';
import * as ComponentType from './TypeOfComponent';
import Layout from './Layout';
import Artboard from './Artboard';

ComponentHub.register(ComponentType.LAYOUT, Layout);

export default class Editor extends React.Component {
  static propTypes = {
    node: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      children: PropTypes.arrayOf(PropTypes.number).isRequired,
    }).isRequired
  }

  render() {
    const artbord = this.props;

    return <Artboard {...artbord} />;
  }
}
