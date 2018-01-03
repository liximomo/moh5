import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import theme from './style/theme.js';
import SplitLayout from './components/SplitLayout';
import Toolbar from './views/Toolbar';
import ObjectTree from './views/ObjectTree';
// import Artboard from './views/Artboard';
import Stage from './views/Stage';
import DragPreview from './views/DragPreview';
import CommonPropertyEditor from './views/PropertyEditor/CommonPropertyEditor';
import { emitStageResize } from './modules/stage.js';
import './App.scss';

const PropertyPanelWrapper = styled.div`
  position: absolute;
  width: ${theme.propertyPanel.width};
  right: 0;
  height: 100%;
  overflow-y: scroll;
`;

const StageWrapper = styled.div`
  position: absolute;
  left: 0;
  right: ${theme.propertyPanel.width};
  height: 100%;
  overflow-y: scroll;
`;

class App extends React.Component {
  state = {
    size: [240],
    maxSize: [500],
  };

  constructor(props) {
    super(props);
    this.handleLayoutResized = this.handleLayoutResized.bind(this);
  }

  componentDidMount() {}

  renderLeft = () => {
    return (
      <div className="Explorer">
        <ObjectTree id={0} />
      </div>
    );
  };

  onDrop(event, id) {
    console.log(id, event);
  }

  renderRight = () => {
    // const node = createNode('Screen', { width: 414, height: 736 });
    return (
      <Fragment>
        <StageWrapper>
          <Stage />
        </StageWrapper>
        <PropertyPanelWrapper>
          <CommonPropertyEditor />
        </PropertyPanelWrapper>
      </Fragment>
    );
  };

  handleLayoutResized() {
    this.props.emitStageResize();
  }

  render() {
    return (
      <div className="App">
        <DragPreview/>
        <Toolbar />
        <SplitLayout
          style={{ minWidth: 1000 }}
          size={this.state.size}
          minSize={this.state.minSize}
          maxSize={this.state.maxSize}
          renders={[this.renderLeft, this.renderRight]}
          onResized={this.handleLayoutResized}
        />
      </div>
    );
  }
}

// function mapStateToProps(_) {
//   // 返回一个  component node 对象
//   return {
//     // rootNodeId: selectArtBord(state).id,
//   };
// }

export default connect(null, { emitStageResize })(App);
