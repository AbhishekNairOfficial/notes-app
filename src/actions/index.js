import SimpleCrypto from 'simple-crypto-js';

import database from '@react-native-firebase/database';

import AsyncStorage from '@react-native-community/async-storage';

// eslint-disable-next-line import/no-cycle
import {debounce} from '../functions';

const updateAsyncStorage = async (list, itemName = 'list') => {
  debounce(
    await AsyncStorage.setItem(
      itemName,
      itemName === 'list' ? JSON.stringify(list) : list,
    ),
    500,
  );
};

export const addAllNotes = async (store, listFromProps) => {
  const uid = await AsyncStorage.getItem('uid');
  // let list = listFromProps;
  // Error Condition
  let list;

  if (listFromProps === null) {
    list = [];
  } else {
    // Decrpyting the encrypted notes.
    list = listFromProps.map(item => {
      if (typeof item === 'string') {
        const simpleCrypto = new SimpleCrypto(uid);
        let decryptedNote = {};

        try {
          decryptedNote = simpleCrypto.decrypt(item, true);
          return decryptedNote;
        } catch (error) {
          console.log(error);
          return;
        }
      }
      return item;
    });
    list = list.filter(el => !!el);
  }
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
  // Encrypting text before sending to DB
  const simpleCrypto = new SimpleCrypto(uid);
  const encryptedNote = simpleCrypto.encrypt(newNote);

  updates[`/users/${uid}/list/${newNoteKey}`] = encryptedNote;
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
  // Enrypting edited note
  const simpleCrypto = new SimpleCrypto(uid);
  const encryptedNote = simpleCrypto.encrypt(note);

  updates[`/users/${uid}/list/${note.id}`] = encryptedNote;
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
  await AsyncStorage.setItem('darkMode', JSON.stringify(darkMode));
  const uid = await AsyncStorage.getItem('uid');
  const updates = {};

  updates[`/users/${uid}/preferences/darkMode`] = darkMode;
  return database()
    .ref()
    .update(updates);
};

export const toggleBiometric = async (store, biometric) => {
  store.setState({biometric});
  await AsyncStorage.setItem('biometric', JSON.stringify(biometric));
  const uid = await AsyncStorage.getItem('uid');
  const updates = {};

  updates[`/users/${uid}/preferences/biometric`] = biometric;
  return database()
    .ref()
    .update(updates);
};

export const logout = store => {
  store.setState({list: [], darkMode: false});
  updateAsyncStorage([], 'list');
};
