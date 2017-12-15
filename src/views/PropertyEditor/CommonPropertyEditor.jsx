import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PropertyBlock from './PropertyBlock';
import DemisionPropertyEditor from './DemisionPropertyEditor';
import { selectActiveElement } from '../../modules/editor';
import * as definedPropTypes from '../../constants/proptypes';
import PluginHub from '../../plugins/PluginHub';

import './CommonPropertyEditor.scss';

const shouldShow = value => (value === undefined ? true : Boolean(value));

class CommonPropertyEditor extends React.Component {
  static propTypes = {
    elementId: definedPropTypes.Id,
  };

  renderEditor = () => {
    if (!this.props.elementId) {
      return null;
    }

    const { elementId } = this.props;
    return <DemisionPropertyEditor elementId={elementId} />;
  };

  renderCustomEditor = () => {
    const { elementType, elementId } = this.props;
    const editorComponent = PluginHub.getPropertyEditorComponent(elementType);
    if (!editorComponent) {
      return null;
    }

    return React.createElement(editorComponent, { elementId });
  };

  render() {
    const { elementType } = this.props;
    const commonEditorConfig = PluginHub.getCommonPropertyEditorConfig(elementType);
    const editorComponent = PluginHub.getPropertyEditorComponent(elementType);

    return (
      <div className="PropertyEditor PropertyEditor--common">
        {editorComponent !== null ? (
          <PropertyBlock name="属性" render={this.renderCustomEditor} />
        ) : null}
        {shouldShow(commonEditorConfig.dimension) ? (
          <PropertyBlock name="基础" render={this.renderEditor} />
        ) : null}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const element = selectActiveElement(state);

  return {
    elementType: element.type,
    elementId: element.id,
  };
}

const ConnectedCommonPropertyEditor = connect(mapStateToProps)(CommonPropertyEditor);

export { CommonPropertyEditor };
export default ConnectedCommonPropertyEditor;
