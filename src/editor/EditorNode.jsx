import * as React from 'react';
import PropTypes from 'prop-types';
import PluginHub from './PluginHub';

class EditorNode extends React.Component {
  static propTypes = {
    node: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      children: PropTypes.arrayOf(PropTypes.number).isRequired,
    }).isRequired
  }

  render() {
    const node = this.props;

    const comp = PluginHub.getComponent(node.type);

    const {
      children,
      ...props,
    } = node;
    return React.createElement(comp.component, props, children);
  }
}

export default EditorNode;
