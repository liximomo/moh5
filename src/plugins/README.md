## 定义
```js
{
  type: 'Layout',
  initProps: {},
  name: '流布局',
  component: React.Component,  // 在编辑区域展示组件
  propertyComponent: React.Component, // 用来编辑组件属性
  render: () => htlm markup, // 最终 output
  propertyEditor: {
    component: 1,
    mapProps(props) {
      return {
        width: props.width,
        height: props.height,
      };
    }
  },
  commonPropertyEditor: {
    dimension: false,
  },
}
```
