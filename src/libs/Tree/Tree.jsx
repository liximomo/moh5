import React from 'react';
import PropTypes from 'prop-types';

class Tree extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  };

  static childContextTypes = {
    tree: PropTypes.shape({
      level: PropTypes.number,
    }),
  };

  getChildContext() {
    return {
      tree: {
        level: 1,
      },
    };
  }

  render() {
    return this.props.children;
  }
}

export default Tree;
