import Artboard from './Artboard';
import PropertyEditor from './PropertyEditor';
import { ARTBOARD } from '../../TypeOfInternalComponent';

const type = ARTBOARD;

export default {
  type,
  name: '画板',
  defaultProps: {},
  component: Artboard,
  propertyEditor: {
    component: PropertyEditor,
    mapProps(props) {
      return {
        width: props.width,
        height: props.height,
      };
    },
  },
  commonPropertyEditor: {
    dimension: false,
  },
};
