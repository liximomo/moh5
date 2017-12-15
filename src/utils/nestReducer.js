export default function nestReducer(reducer) {
  return (state, action) => {
    let next = reducer(state, action);
    return next === state ? state : next;
  };
}
