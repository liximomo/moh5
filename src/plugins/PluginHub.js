import Plugin from './Plugin';

// 编辑器渲染组件
const pluginMap = new Map();

function register(plugin) {
  pluginMap.set(plugin.type, new Plugin(plugin));
}

function getComponent(type) {
  const plugin = pluginMap.get(type);
  if (!plugin) {
    return null;
  }

  return plugin.getComponent();
}

// 得到所有可以创建的组件
function getComponentSpecs() {
  const plugins = pluginMap.values();
  const specs = [];
  for (const plugin of plugins) {
    if (plugin.getComponentSpec() !== null) {
      specs.push(plugin.getComponentSpec());
    }
  }
  return specs;
}

function getCommonPropertyEditorConfig(type) {
  const plugin = pluginMap.get(type);

  if (!plugin) {
    return {};
  }

  return plugin.getCommonPropertyEditorConfig();
}

function getPropertyEditorComponent(type) {
  const plugin = pluginMap.get(type);

  if (!plugin) {
    return null;
  }

  return plugin.getPropertyEditorComponent();
}
export default {
  // registerComponent,
  register,
  getComponent,
  getComponentSpecs,
  getCommonPropertyEditorConfig,
  getPropertyEditorComponent,
};
