import * as React from 'react';
import { connect } from 'react-redux';
import SplitLayout from './layout/SplitLayout';
import Toolbar from './views/Toolbar';
import ObjectTree from './views/ObjectTree';
// import Artboard from './views/Artboard';
import Stage from './views/Stage';
import CommonPropertyEditor from './views/PropertyEditor/CommonPropertyEditor';
// import { selectArtBord } from './modules/elements';
import './App.scss';

class App extends React.Component {
  state = {
    size: [240],
    maxSize: [500],
  };

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
      <div className="rightPart">
        <Stage />
        <div className="APP__fixSide">
          <CommonPropertyEditor />
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="App">
        <Toolbar />
        <SplitLayout
          size={this.state.size}
          minSize={this.state.minSize}
          maxSize={this.state.maxSize}
          renders={[this.renderLeft, this.renderRight]}
        />
      </div>
    );
  }
}

function mapStateToProps(_) {
  // 返回一个  component node 对象
  return {
    // rootNodeId: selectArtBord(state).id,
  };
}

export default connect(mapStateToProps)(App);
