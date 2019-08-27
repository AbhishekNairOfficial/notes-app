import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ToastAndroid,
  Platform,
  ActivityIndicator,
  Text,
} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import debounce from '../../functions';
import useGlobal from '../../store';
import {secondaryColor} from '../../config';

const NotesPage = props => {
  const [, globalActions] = useGlobal();
  const {navigation} = props;
  const id = navigation.getParam('id');
  const [title, setTitle] = useState(navigation.getParam('title'));
  const [body, setBody] = useState(navigation.getParam('body'));

  useEffect(() => {
    // console.log('UseEffect got called');
    navigation.setParams({
      saving: true,
    });
    setTimeout(() => {
      navigation.setParams({
        saving: false,
      });
    }, 500);
    return () => {
      navigation.setParams({
        saving: false,
      });
    };
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
        onChangeText={value => debounce(setTitle(value), 1000)}
        value={title}
        placeholder="Title"
      />
      <TextInput
        multiline
        textAlignVertical="top"
        autoCapitalize="sentences"
        maxLength={200}
        style={styles.body}
        onChangeText={value => debounce(setBody(value), 1000)}
        value={body}
        placeholder="Type something Here"
      />
    </View>
  );
};

NotesPage.navigationOptions = ({navigation}) => {
  const {params = {}} = navigation.state;
  const {saving} = params;
  return {
    headerRight: (
      <View>
        {saving && (
          <View style={styles.saveHolder}>
            <ActivityIndicator
              size="small"
              animating={saving}
              color={secondaryColor}
            />
            <Text style={styles.saveText}>Saving</Text>
          </View>
        )}
      </View>
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
    height: '100%',
  },
  saveHolder: {
    margin: 15,
    flexDirection: 'row',
  },
  saveText: {
    marginLeft: 5,
    color: secondaryColor,
  },
});

export default NotesPage;
