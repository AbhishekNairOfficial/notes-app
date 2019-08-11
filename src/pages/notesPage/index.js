import React, { useState } from 'react';
import { View, Button, TextInput, StyleSheet } from 'react-native';
import useGlobal from '../../store';
import { primaryColor, secondaryColor } from '../../config';
import { NavigationEvents } from 'react-navigation';

const NotesPage = props => {
  const [, globalActions] = useGlobal();
  const { navigation } = props;
  const id = navigation.getParam('id');
  const [title, setTitle] = useState(navigation.getParam('title'));
  const [body, setBody] = useState(navigation.getParam('body'));

  const inputValidation = () => {
    return title || body;
  };

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  };

  const callAddNoteAction = () => {
    if (!inputValidation()) {
      return;
    }
    const newNote = {
      id: id,
      title: title,
      body: body,
    };
    if (!id) {
      globalActions.addNote(newNote);
    } else {
      globalActions.editNote(newNote);
    }
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.title}
        autoCapitalize="sentences"
        maxLength={25}
        onChangeText={value => debounce(setTitle(value), 300)}
        value={title}
      />
      <TextInput
        multiline
        textAlignVertical="top"
        autoCapitalize="sentences"
        maxLength={200}
        style={styles.body}
        onChangeText={value => debounce(setBody(value), 300)}
        value={body}
      />
      <View style={styles.buttonHolder}>
        <Button
          onPress={() => {
            callAddNoteAction(navigation);
          }}
          style={styles.button}
          title="Save"
          color={primaryColor}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    height: '100%',
    backgroundColor: secondaryColor,
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: 'Product Sans',
    fontSize: 28,
    paddingBottom: 15,
    marginBottom: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  body: {
    fontFamily: 'Product Sans',
    fontSize: 20,
    height: '80%',
  },
  buttonHolder: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36,
  },
  button: {
    position: 'absolute',
    bottom: 0,
  },
});

export default NotesPage;
