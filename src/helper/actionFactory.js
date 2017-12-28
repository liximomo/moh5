export function bindActionCreator(actionCreator, dispatch) {
  return function(...args) {
    dispatch(actionCreator.apply(this, args));
  }
}
