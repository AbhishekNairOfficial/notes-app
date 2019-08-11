export const addNote = (store, note) => {
  function dec2hex(dec) {
    return ('0' + dec.toString(16)).substr(-2);
  }
  function generateId(len) {
    var arr = new Uint8Array((len || 20) / 2);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, dec2hex).join('');
  }
  note.id = generateId(20);
  const list = store.state.list.concat(note);
  store.setState({ list });
};

export const editNote = (store, note) => {
  let list = store.state.list;
  const index = list.findIndex(i => i.id === note.id);
  list[index] = note;
  store.setState({ list });
};

export const deleteNote = (store, noteId) => {
  let list = store.state.list;
  const index = list.findIndex(i => i.id === noteId);
  list.splice(index, 1);
  store.setState({ list });
};
