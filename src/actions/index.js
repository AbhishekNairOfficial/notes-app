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
  const times = x => f => {
    if (x > 0) {
      f();
      times(x - 1)(f);
    }
  };
  const makeId = length => {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    times(length)(() => {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    });
    return result;
  };
  const newNote = note;
  newNote.id = makeId(20);
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

export const toggleDarkMode = (store, darkMode) => {
  store.setState({darkMode});
  AsyncStorage.setItem('darkMode', JSON.stringify(darkMode));
};
