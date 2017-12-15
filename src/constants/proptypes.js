import PropTypes from 'prop-types';

export const Id = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

export const Null = (props, propName, componentName) => {
  if (props[propName] !== null) {
    return new Error(
      'Invalid prop `' + propName + '` supplied to' +
      ' `' + componentName + '`. Validation failed.'
    );
  }
};
