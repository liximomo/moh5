import React from 'react';
import PropTypes from 'prop-types';

class TreeNode extends React.PureComponent {
  static propTypes = {
    render: PropTypes.func.isRequired,
    children: PropTypes.node,
  };

  static defaultProps = {
    // isLeaf: false,
  };

  static contextTypes = {
    tree: PropTypes.shape({
      intent: PropTypes.number.isRequired,
      level: PropTypes.number.isRequired,
      clsPrefix: PropTypes.string,
    }).isRequired,
  };

  static childContextTypes = {
    tree: PropTypes.shape({
      intent: PropTypes.number,
      level: PropTypes.number,
      clsPrefix: PropTypes.string,
    }),
  };

  getChildContext() {
    const { level, ...rest } = this.context.tree;
    return {
      tree: {
        level: level + 1,
        ...rest,
      },
    };
  }

  clazz(name) {
    const { clsPrefix } = this.context.tree;
    return `${clsPrefix}${name}`;
  }

  render() {
    const { render, children } = this.props;
    const { level } = this.context.tree;

    return render({level, children});
  }
}

export default TreeNode;
