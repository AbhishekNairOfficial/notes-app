import React, {useState} from 'react';
import {
  View,
  Button,
  TextInput,
  StyleSheet,
  Alert,
  ToastAndroid,
  Platform,
} from 'react-native';
import useGlobal from '../../store';
import {primaryColor, secondaryColor} from '../../config';
import debounce from '../../functions';

const NotesPage = props => {
  const [, globalActions] = useGlobal();
  const {navigation} = props;
  const id = navigation.getParam('id');
  const [title, setTitle] = useState(navigation.getParam('title'));
  const [body, setBody] = useState(navigation.getParam('body'));

  const inputValidation = () => {
    return title || body;
  };

  const callAddNoteAction = () => {
    if (!inputValidation()) {
      return;
    }
    const newNote = {
      id,
      title,
      body,
    };
    if (!id) {
      globalActions.addNote(newNote);
    } else {
      globalActions.editNote(newNote);
    }
    if (Platform.OS === 'android') {
      ToastAndroid.show('Note Saved!', ToastAndroid.SHORT);
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
        placeholder="Title"
      />
      <TextInput
        multiline
        textAlignVertical="top"
        autoCapitalize="sentences"
        maxLength={200}
        style={styles.body}
        onChangeText={value => debounce(setBody(value), 300)}
        value={body}
        placeholder="Type something Here"
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
        {id && (
          <Button
            onPress={() => {
              Alert.alert(
                'Are you sure?',
                '',
                [
                  {
                    text: 'Delete',
                    onPress: () => {
                      globalActions.deleteNote(id);
                      navigation.goBack();
                    },
                    style: 'destructive',
                  },
                  {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel',
                  },
                ],
                {cancelable: false},
              );
            }}
            style={styles.deleteButton}
            title="Delete"
            color="red"
          />
        )}
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
  deleteButton: {
    margin: 10,
  },
});

export default NotesPage;
