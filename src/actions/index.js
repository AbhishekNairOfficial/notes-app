import AsyncStorage from '@react-native-community/async-storage';
import database from '@react-native-firebase/database';
import debounce from '../functions';

const updateAsyncStorage = (list, itemName = 'list') => {
  debounce(
    AsyncStorage.setItem(
      itemName,
      itemName === 'list' ? JSON.stringify(list) : list,
    ),
    500,
  );
};

export const addAllNotes = (store, list) => {
  store.setState({list});
  updateAsyncStorage(list);
};

export const updateUid = (store, uid) => {
  store.setState({uid});
  updateAsyncStorage(uid, 'uid');
};

export const addNote = async (store, note) => {
  const uid = await AsyncStorage.getItem('uid');
  const newNote = note;
  // Get a key for a new Post.
  const newNoteKey = database()
    .ref()
    .child(`users/${uid}/list/`)
    .push().key;
  newNote.id = newNoteKey;
  const list = store.state.list.concat(note);
  store.setState({list});
  updateAsyncStorage(list);
  const updates = {};
  updates[`/users/${uid}/list/${newNoteKey}`] = newNote;
  return database()
    .ref()
    .update(updates);
};

export const editNote = async (store, note) => {
  const {list} = store.state;
  const index = list.findIndex(i => i.id === note.id);
  list[index] = note;
  store.setState({list});
  updateAsyncStorage(list);
  // Updating the post in firebase
  const uid = await AsyncStorage.getItem('uid');
  const updates = {};
  updates[`/users/${uid}/list/${note.id}`] = note;
  return database()
    .ref()
    .update(updates);
};

export const deleteNote = async (store, noteId) => {
  const {list} = store.state;
  const index = list.findIndex(i => i.id === noteId);
  list.splice(index, 1);
  store.setState({list});
  updateAsyncStorage(list);
  // Updating the post in firebase
  const uid = await AsyncStorage.getItem('uid');
  const updates = {};
  updates[`/users/${uid}/list/${noteId}`] = null;
  return database()
    .ref()
    .update(updates);
};

export const toggleDarkMode = async (store, darkMode) => {
  store.setState({darkMode});
  AsyncStorage.setItem('darkMode', JSON.stringify(darkMode));
  const uid = await AsyncStorage.getItem('uid');
  const updates = {};
  updates[`/users/${uid}/preferences/`] = {
    darkMode,
  };
  return database()
    .ref()
    .update(updates);
};
