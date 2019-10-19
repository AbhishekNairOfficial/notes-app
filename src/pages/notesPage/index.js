import React, {useState, useEffect, memo} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ToastAndroid,
  Platform,
  ActivityIndicator,
  Text,
} from 'react-native';
import useDebouncedEffect from 'use-debounced-effect';
import {NavigationEvents} from 'react-navigation';
import debounce from '../../functions';
import useGlobal from '../../store';
import {secondaryColor} from '../../config';

const NotesPage = memo(props => {
  const [globalState, globalActions] = useGlobal();
  const {navigation} = props;
  const id = navigation.getParam('id');
  const [title, setTitle] = useState(navigation.getParam('title'));
  const [body, setBody] = useState(navigation.getParam('body'));
  const [darkMode, setDarkMode] = useState(globalState.darkMode);

  useEffect(() => {
    if (globalState.darkMode !== darkMode) {
      setDarkMode(globalState.darkMode);
    }
  }, [darkMode, globalState.darkMode]);

  // Dark mode effect
  useEffect(() => {
    const firstTimeThisEffectIsFiring = !navigation.state.params;
    if (
      firstTimeThisEffectIsFiring ||
      navigation.state.params.darkMode !== darkMode
    ) {
      navigation.setParams({
        darkMode,
      });
    }
  }, [darkMode, navigation]);

  const styles = StyleSheet.create({
    container: {
      padding: 15,
      height: '100%',
      backgroundColor: darkMode ? '#000' : secondaryColor,
      justifyContent: 'space-between',
    },
    title: {
      fontFamily: 'Product Sans',
      fontSize: 28,
      paddingBottom: 15,
      marginBottom: 10,
      borderBottomColor: '#ccc',
      borderBottomWidth: 1,
      color: darkMode ? '#ccc' : '#000',
    },
    body: {
      fontFamily: 'Product Sans',
      fontSize: 20,
      height: '100%',
      color: darkMode ? '#ccc' : '#000',
    },
  });

  // Effect to show loader on header
  useDebouncedEffect(
    () => {
      navigation.setParams({
        saving: true,
      });
      setTimeout(() => {
        navigation.setParams({
          saving: false,
        });
      }, 500);
    },
    1000,
    [title, body],
  );

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
      ToastAndroid.show('Saved!', ToastAndroid.SHORT);
    }
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <NavigationEvents onWillBlur={() => callAddNoteAction()} />
      <TextInput
        placeholderTextColor={darkMode ? '#555' : '#ccc'}
        style={styles.title}
        autoCapitalize="sentences"
        maxLength={25}
        onChangeText={value => debounce(setTitle(value), 1000)}
        value={title}
        placeholder="Title"
      />
      <TextInput
        placeholderTextColor={darkMode ? '#555' : '#ccc'}
        multiline
        textAlignVertical="top"
        autoCapitalize="sentences"
        maxLength={1000}
        style={styles.body}
        onChangeText={value => debounce(setBody(value), 1000)}
        value={body}
        placeholder="Type something Here"
      />
    </View>
  );
});

NotesPage.navigationOptions = ({navigation}) => {
  const {params = {}} = navigation.state;
  const {saving, darkMode} = params;
  const styles = StyleSheet.create({
    saveHolder: {
      margin: 15,
      flexDirection: 'row',
    },
    saveText: {
      marginLeft: 5,
      color: darkMode ? '#000' : secondaryColor,
    },
  });
  return {
    headerRight: (
      <View>
        {saving && (
          <View style={styles.saveHolder}>
            <ActivityIndicator
              size="small"
              animating={saving}
              color={darkMode ? '#000' : secondaryColor}
            />
            <Text style={styles.saveText}>Saving</Text>
          </View>
        )}
      </View>
    ),
    headerTintColor: darkMode ? '#000' : secondaryColor,
  };
};

export default NotesPage;
