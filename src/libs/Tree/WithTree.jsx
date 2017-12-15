import React from 'react';
import PropTypes from 'prop-types';

export default function WithTree(WrappedComponent) {
  const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  class Component extends React.Component {
    static WrappedComponent = WrappedComponent;
    static displayName = `TreeNode(${wrappedComponentName})`;

    static contextTypes = {
      tree: PropTypes.shape({
        level: PropTypes.number.isRequired,
      }).isRequired,
    };

    static childContextTypes = {
      tree: PropTypes.shape({
        level: PropTypes.number,
      }),
    };

    constructor(props) {
      super(props);

      this.setWrappedInstance = this.setWrappedInstance.bind(this);
    }

    getChildContext() {
      const { level, ...rest } = this.context.tree;
      return {
        tree: {
          level: level + 1,
          ...rest,
        },
      };
    }

    getWrappedInstance() {
      return this.wrappedInstance;
    }

    setWrappedInstance(ref) {
      this.wrappedInstance = ref;
    }

    getProps() {
      const contextProps = this.context;
      const props = {
        ...contextProps,
        ...this.props,
        ref: this.setWrappedInstance,
      };
      return props;
    }

    render() {
      return React.createElement(WrappedComponent, this.getProps());
    }
  }

  return Component;
}
