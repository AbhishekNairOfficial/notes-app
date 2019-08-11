import React, { useState } from 'react';
import { View, Button, TextInput, StyleSheet } from 'react-native';
import useGlobal from '../../store';
import { primaryColor, secondaryColor } from '../../config';
import { ScrollView } from 'react-native-gesture-handler';
import { addNote } from '../../actions';

const NotesPage = props => {
  const [globalState, globalActions] = useGlobal();
  const { navigation } = props;

  const [title, setTitle] = useState(navigation.getParam('title'));
  const [body, setBody] = useState(navigation.getParam('body'));
  const callAddNoteAction = () => {
    const newNote = {
      id: 100,
      title: title,
      body: body,
    };
    globalActions.addNote(newNote);
    navigation.navigate('Listing');
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.title}
        autoCapitalize="sentences"
        maxLength={25}
        onChangeText={value => setTitle(value)}
        value={title}
      />
      <TextInput
        multiline
        textAlignVertical="top"
        autoCapitalize="sentences"
        maxLength={200}
        style={styles.body}
        onChangeText={value => setBody(value)}
        value={body}
      />
      <View style={styles.buttonHolder}>
        <Button
          onPress={() => callAddNoteAction()}
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
