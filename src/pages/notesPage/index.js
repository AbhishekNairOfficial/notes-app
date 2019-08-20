import React, {useState, useEffect} from 'react';
import {
  View,
  Button,
  TextInput,
  StyleSheet,
  Alert,
  ToastAndroid,
  Platform,
  Text,
} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import {TouchableOpacity} from 'react-native-gesture-handler';
import useGlobal from '../../store';
import {secondaryColor} from '../../config';
import debounce from '../../functions';

const NotesPage = props => {
  const [, globalActions] = useGlobal();
  const {navigation} = props;
  const id = navigation.getParam('id');
  const [title, setTitle] = useState(navigation.getParam('title'));
  const [body, setBody] = useState(navigation.getParam('body'));

  useEffect(() => {
    navigation.setParams({
      handleSave: callAddNoteAction,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, body]);
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
      <NavigationEvents onWillBlur={() => callAddNoteAction()} />
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

NotesPage.navigationOptions = ({navigation}) => {
  const {params = {}} = navigation.state;
  console.log(navigation);
  return {
    headerRight: (
      <TouchableOpacity
        onPress={() => {
          params.handleSave();
        }}
      >
        <Text style={styles.saveButton}>Save</Text>
      </TouchableOpacity>
    ),
  };
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
  saveButton: {
    fontSize: 20,
    marginRight: 10,
    color: '#fff',
  },
});

export default NotesPage;
