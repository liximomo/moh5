import React from 'react';
import { Icon, Popover } from 'antd';
import PluginHub from '../plugins/PluginHub';
import ComponentGallery from './ComponentGallery';
import './ToolbarInsert.scss';

class ToolbarInsert extends React.Component {
  render() {
    return (
      <div className="Insert">
        <Popover
          overlayClassName="ToolbarInsert"
          placement="bottomLeft"
          content={<ComponentGallery items={PluginHub.getComponentSpecs()} />}
          trigger="click"
        >
          <Icon type="appstore-o" />
        </Popover>
      </div>
    );
  }
}

export default ToolbarInsert;
