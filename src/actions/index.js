import AsyncStorage from '@react-native-community/async-storage';
import debounce from '../functions';

const updateAsyncStorage = list => {
  debounce(AsyncStorage.setItem('list', JSON.stringify(list)), 500);
};

export const addAllNotes = (store, list) => {
  store.setState({list});
  updateAsyncStorage(list);
};

export const addNote = (store, note) => {
  function dec2hex(dec) {
    return `0${dec.toString(16)}`.substr(-2);
  }
  function generateId(len) {
    const arr = new Uint8Array((len || 20) / 2);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, dec2hex).join('');
  }
  const newNote = note;
  newNote.id = generateId(20);
  const list = store.state.list.concat(note);
  store.setState({list});
  updateAsyncStorage(list);
};

export const editNote = (store, note) => {
  const {list} = store.state;
  const index = list.findIndex(i => i.id === note.id);
  list[index] = note;
  store.setState({list});
  updateAsyncStorage(list);
};

export const deleteNote = (store, noteId) => {
  const {list} = store.state;
  const index = list.findIndex(i => i.id === noteId);
  list.splice(index, 1);
  store.setState({list});
  updateAsyncStorage(list);
};
