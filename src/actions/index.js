export const addNote = (store, note) => {
  const list = store.state.list.concat(note);
  store.setState({ list });
};

export const deleteNote = (store, noteId) => {
  let list = store.state.list;
  const index = list.findIndex(i => i.id === noteId);
  list.splice((index, 1));
  store.setState({ list });
};
