import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

function preventDefault(event) {
  event.preventDefault();
}

let isPreventDropOnDocument = false;
let preventDropOnDocumentNum = 0;

class Dropzone extends React.Component {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    children: PropTypes.element,
    onDragEnter: PropTypes.func,
    onDragOver: PropTypes.func,
    onDragLeave: PropTypes.func,
    onDrop: PropTypes.func.isRequired,
  };

  static defaultProps = {
    preventDropOnDocument: true,
    disabled: false,
  };

  state = {
    isDragActive: false,
  };

  componentDidMount() {
    const { preventDropOnDocument } = this.props;

    if (preventDropOnDocument) {
      preventDropOnDocumentNum += 1;
      if (!isPreventDropOnDocument) {
        isPreventDropOnDocument = true;
        document.addEventListener('dragover', preventDefault, false);
        document.addEventListener('drop', preventDefault, false);
      }
    }
  }

  componentWillUnmount() {
    const { preventDropOnDocument } = this.props;
    if (preventDropOnDocument) {
      preventDropOnDocumentNum -= 1;
    }

    // 没有存活的示例了， 可以取消文档的事件监听程序了
    if (isPreventDropOnDocument && preventDropOnDocumentNum <= 0) {
      document.removeEventListener('dragover', preventDefault, false);
      document.removeEventListener('drop', preventDefault, false);
    }
  }

  handleEvent(handler) {
    if (this.props.disabled) {
      return null;
    }

    return handler;
  }

  onDragEnter = this.handleEvent(event => {
    event.preventDefault();

    this.setState({
      isDragActive: true,
    });

    if (this.props.onDragEnter) {
      this.props.onDragEnter.call(event);
    }
  });

  onDragOver = this.handleEvent(event => {
    event.preventDefault();

    try {
      event.dataTransfer.dropEffect = 'copy';
    } catch (err) {
      // continue regardless of error
    }

    if (this.props.onDragOver) {
      this.props.onDragOver.call(event);
    }
  });

  onDragLeave = this.handleEvent(event => {
    event.preventDefault();
    event.stopPropagation();

    this.setState({
      isDragActive: false,
    });

    if (this.props.onDragLeave) {
      this.props.onDragLeave.call(event);
    }
  });

  onDrop = this.handleEvent(event => {
    event.preventDefault();
    event.stopPropagation();
    this.props.onDrop(event, this.props.id);

    this.setState({
      isDragActive: false,
    });
  });

  // onDocumentDrop(evt) {
  //   if (this.node && this.node.contains(evt.target)) {
  //     // if we intercepted an event for our instance, let it propagate down to the instance's onDrop handler
  //     return;
  //   }
  //   evt.preventDefault();
  //   this.dragTargets = [];
  // }

  render() {
    const {
      children,
      disabled,
      className,

      /* eslint-disable no-unused-vars */
      id,
      onDragEnter,
      onDragOver,
      onDragLeave,
      onDrop,
      preventDropOnDocument,
      /* eslint-enable no-unused-vars */
      ...rest
    } = this.props;
    // const element = React.Children.only(children);

    return (
      <div
        className={cn(className, {
          'is-dragDisable': disabled,
          'is-dragActive': this.state.isDragActive,
        })}
        onDragEnter={this.handleEvent(this.onDragEnter)}
        onDragOver={this.handleEvent(this.onDragOver)}
        onDragLeave={this.handleEvent(this.onDragLeave)}
        onDrop={this.handleEvent(this.onDrop)}
        {...rest}
      >
        {children}
      </div>
    );
    // return React.cloneElement(element, {
    //   className: cn(element.props.className, {
    //     'is-dragDisable': disabled,
    //     'is-dragActive': this.state.isDragActive,
    //   }),
    //   onDragEnter: this.handleEvent(this.onDragEnter),
    //   onDragOver: this.handleEvent(this.onDragOver),
    //   onDragLeave: this.handleEvent(this.onDragLeave),
    //   onDrop: this.handleEvent(this.onDrop),
    // });
  }
}

export default Dropzone;
