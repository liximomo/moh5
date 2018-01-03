import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import cn from 'classnames';
// import ResizeBox from '../libs/ResizeBox';
import { EDITOR_DOM_ATTR } from '../constants';
import { selectElements, updateElement } from '../modules/elements';
import { activateELement, elementMounted, selectActivedElementId } from '../modules/stage';
import * as definedPropTypes from '../constants/proptypes';
import PluginHub from '../plugins/PluginHub';
import { ARTBOARD } from '../TypeOfInternalComponent';

import './EditorNode.scss';
// node
// pid: PropTypes.arrayOf([definedPropTypes.Null, PropTypes.number.isRequired]),
// name: PropTypes.string.isRequired,
// type: PropTypes.string.isRequired,
// childIds: PropTypes.arrayOf(PropTypes.number).isRequired

function shouldHaveResizer(element) {
  const { height, width, type } = element;

  if (type === ARTBOARD) {
    return false;
  }

  return height !== undefined || width !== undefined;
}

class EditorNode extends React.PureComponent {
  static propTypes = {
    id: definedPropTypes.Id,
    pid: PropTypes.oneOfType([definedPropTypes.Null, PropTypes.number.isRequired]),
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    childIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  };

  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.getEditorProps = this.getEditorProps.bind(this);
    // this.handleMouseEnter = this.handleMouseEnter.bind(this);
    // this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  componentDidMount() {
    this.props.elementMounted({
      elementId: this.props.id,
    });
  }

  onClick(event) {
    console.log('node click');
    event.stopPropagation();

    const { id, activateELement } = this.props;
    activateELement({
      elementId: id,
    });
  }

  handleResize(event, data) {
    this.props.updateElement(this.props.id, {
      width: data.width,
      height: data.height,
    });
  }

  // handleMouseEnter() {
  //   console.log(1);
  // }

  // handleMouseLeave() {
  //   console.log(1);
  // }

  getEditorProps() {
    return {
      [EDITOR_DOM_ATTR]: this.props.id,
      // onMouseEnter: this.handleMouseEnter,
      // onMouseLeave: this.handleMouseLeave,
    };
  }

  getComponent() {
    const comp = PluginHub.getComponent(this.props.type);

    // if (!comp) {
    //   return null;
    // }

    return comp;
  }

  getProps() {
    const props = { ...this.props };
    delete props.children;
    delete props.dispatch;
    delete props.isActive;

    delete props.activateELement;
    delete props.updateElement;

    props.getEditorProps = this.getEditorProps;
    return props;
  }

  renderComponent() {
    // const { height, width, isActive } = this.props;

    // if (isActive && this.ishaveResizer) {
    //   const resizer = {};

    //   if (height !== undefined) {
    //     resizer[ResizeBox.RESIZER_BOTTOM] = true;
    //   }

    //   if (width !== undefined) {
    //     resizer[ResizeBox.RESIZER_RIGHT] = true;
    //   }

    //   if (height !== undefined && width !== undefined) {
    //     resizer[ResizeBox.RESIZER_BOTTOM_RIGHT] = true;
    //   }

    //   return (
    //     <ResizeBox onResize={this.handleResize} width={width} height={height} resizer={resizer}>
    //       {React.createElement(this.getComponent(), this.getProps())}
    //     </ResizeBox>
    //   );
    // }

    return React.createElement(this.getComponent(), this.getProps());
  }

  getStyle() {
    return {
      width: this.props.width,
      height: this.props.height,
    };
  }

  render() {
    const node = this.props;

    const comp = PluginHub.getComponent(node.type);

    if (!comp) {
      return null;
    }

    // const { isActive, type } = node;
    this.ishaveResizer = shouldHaveResizer(this.props);

    return this.renderComponent();
    // return (
    //   <div
    //     ref={this.setHostNode}
    //     className={cn('EditorNode', {
    //       'ArtboardNode': type === ARTBOARD,
    //       'is-active': isActive,
    //       'has-resizer': this.ishaveResizer,
    //     })}
    //     style={this.getStyle()}
    //     onClick={this.onClick}
    //   >
    //     {this.renderComponent()}
    //   </div>
    // );
  }
}

function mapStateToProps(state, ownProps) {
  // 返回一个  component node 对象
  const element = selectElements(state)[ownProps.id];
  const activeId = selectActivedElementId(state);
  return {
    ...element,
    isActive: ownProps.id === activeId,
  };
}

const Connected = connect(mapStateToProps, {
  elementMounted,
  activateELement,
  updateElement,
})(EditorNode);

export default Connected;
