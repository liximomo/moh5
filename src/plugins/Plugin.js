import { ARTBOARD } from '../TypeOfInternalComponent';
import InjectElementProperty from '../helper/InjectElementProperty';

export default class Plugin {
  constructor(option) {
    this.propertyEditorComponent = null;

    this.type = option.type;
    this.name = option.name;
    this.initProps = option.initProps;
    this.component = option.component;
    if (option.propertyEditor && option.propertyEditor.component) {
      this.propertyEditorComponent = InjectElementProperty({
        mapProps: option.propertyEditor.mapProps,
      })(option.propertyEditor.component);
    }

    this.commonPropertyEditor = option.commonPropertyEditor || {};
  }

  getDefaultProperty() {
    return this.initProps;
  }

  getComponent() {
    return this.component;
  }

  getComponentSpec() {
    if (this.type === ARTBOARD) {
      return null;
    }

    return {
      type: this.type,
      name: this.name,
      props: this.getDefaultProperty(),
    };
  }

  getCommonPropertyEditorConfig() {
    return this.commonPropertyEditor;
  }

  getPropertyEditorComponent() {
    return this.propertyEditorComponent;
  }
}
