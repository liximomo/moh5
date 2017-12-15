import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { selectElement, updateElement } from '../modules/elements';
import * as definedPropTypes from '../constants/proptypes';

export default function InjectElementProperty({ propertyNames, mapProps }) {
  return function NodeDrop(WrappedComponent) {
    const wrappedComponentName =
      WrappedComponent.displayName || WrappedComponent.name || 'Component';

    class Component extends React.Component {
      static WrappedComponent = WrappedComponent;
      static displayName = `InjectElementProperty(${wrappedComponentName})`;

      static propTypes = {
        elementId: definedPropTypes.Id.isRequired,
        value: PropTypes.any,
        onChange: PropTypes.func,
      };

      constructor(props) {
        super(props);

        this.setWrappedInstance = this.setWrappedInstance.bind(this);
      }

      getWrappedInstance() {
        return this.wrappedInstance;
      }

      setWrappedInstance(ref) {
        this.wrappedInstance = ref;
      }

      getProps() {
        const props = {
          ...this.props,
          ref: this.setWrappedInstance,
        };
        return props;
      }

      render() {
        return React.createElement(WrappedComponent, this.getProps());
      }
    }

    function mapStateToProps(state, ownProps) {
      const element = selectElement(state, ownProps.elementId);
      let props = {};
      if (propertyNames) {
        return [].concat(propertyNames).reduce((obj, name) => {
          obj[name] = element[name];
          return obj;
        }, props);
      }

      return mapProps ? mapProps(props) : props;
    }

    function mapDispatchToProps(dispatch, ownProps) {
      return bindActionCreators(
        {
          update(props) {
            return updateElement(ownProps.elementId, props);
          },
        },
        dispatch
      );
    }

    const Injected = connect(mapStateToProps, mapDispatchToProps)(Component);

    return Injected;
  };
}
