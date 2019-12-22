import React, {useState, useCallback, useEffect, memo} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Text,
  AppState,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Share,
  TouchableOpacity,
  Alert,
  Keyboard,
  SafeAreaView,
} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import useDebouncedEffect from 'use-debounced-effect';
import {NavigationEvents} from 'react-navigation';
import debounce from '../../functions';
import useGlobal from '../../store';
import {
  secondaryColor,
  black,
  placeHolderColorDark,
  placeHolderColor,
  primaryColor,
  white,
} from '../../config';

const shareIconDark = require('../../../assets/share_icon.svg');
const shareIcon = require('../../../assets/share_icon_dark.svg');

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

  // Sending data to header for share
  // Also, sending dark mode
  useEffect(() => {
    if (!title || !body) {
      return;
    }
    if (
      (navigation.state.params.title &&
        navigation.state.params.title === title) ||
      (navigation.state.params.body && navigation.state.params.body === body) ||
      navigation.state.params.darkMode === undefined ||
      navigation.state.params.darkMode !== darkMode
    ) {
      return;
    }
    navigation.setParams({title, body, darkMode});
  }, [title, body, navigation, darkMode]);

  const styles = StyleSheet.create({
    flex: {
      flex: 1,
    },
    safeAreaView: {
      flex: 1,
      position: 'relative',
      backgroundColor: darkMode ? black : white,
    },
    container: {
      padding: 15,
      backgroundColor: darkMode ? black : secondaryColor,
      height: '100%',
    },
    scrollView: {
      paddingBottom: 20,
      justifyContent: 'space-between',
    },
    title: {
      fontFamily: 'Product Sans',
      fontSize: 28,
      paddingBottom: 15,
      marginBottom: 10,
      borderBottomColor: placeHolderColor,
      borderBottomWidth: 1,
      color: darkMode ? placeHolderColor : black,
    },
    body: {
      fontFamily: 'Product Sans',
      fontSize: 20,
      height: '100%',
      color: darkMode ? placeHolderColor : black,
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

  const callAddNoteAction = useCallback(
    nextAppState => {
      const appIsActive = nextAppState === 'active';
      if (appIsActive) {
        // When you return from multi tasking, back to the app.
        // No need to save again.
        return;
      }
      const inputValidation = () => {
        return title || body;
      };
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
        // ToastAndroid.show('Saved!', ToastAndroid.SHORT);
      }
      if (!nextAppState) {
        // Only navigate back when this event is caused by navigation, not by multitasking
        navigation.goBack();
      }
    },
    [body, globalActions, id, navigation, title],
  );

  useEffect(() => {
    AppState.addEventListener('change', callAddNoteAction);
    return () => AppState.removeEventListener('change', callAddNoteAction);
  }, [callAddNoteAction]);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={styles.flex}
      >
        <ScrollView
          onScrollEndDrag={() => Keyboard.dismiss()}
          keyboardDismissMode="on-drag"
          style={styles.container}
          contentContainerStyle={styles.scrollView}
        >
          <NavigationEvents onWillBlur={() => callAddNoteAction()} />
          <TextInput
            placeholderTextColor={
              darkMode ? placeHolderColorDark : placeHolderColor
            }
            style={styles.title}
            autoCorrect={false}
            autoCapitalize="sentences"
            maxLength={25}
            onChangeText={value => debounce(setTitle(value), 1000)}
            value={title}
            placeholder="Title"
          />
          <TextInput
            placeholderTextColor={
              darkMode ? placeHolderColorDark : placeHolderColor
            }
            autoFocus={!id}
            multiline
            textAlignVertical="top"
            autoCapitalize="sentences"
            autoCorrect={false}
            maxLength={1000}
            style={styles.body}
            onChangeText={value => debounce(setBody(value), 1000)}
            value={body}
            placeholder="Type something Here"
          />
          <View style={styles.flex} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});

NotesPage.navigationOptions = ({navigation}) => {
  const {params = {}} = navigation.state;
  const {saving, darkMode, title, body} = params;
  const firstTime = darkMode === undefined;

  const headerTintColor = () => {
    if (firstTime) {
      return primaryColor;
    }
    if (darkMode) {
      return black;
    }
    return secondaryColor;
  };
  const onShare = async () => {
    try {
      const result = await Share.share(
        {
          message: body,
          title,
        },
        {
          // Android only:
          dialogTitle: title,
        },
      );

      if (result.action === Share.sharedAction) {
        await analytics().logEvent('shared_a_note');
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  const styles = StyleSheet.create({
    saveHolder: {
      margin: 15,
      flexDirection: 'row',
    },
    saveText: {
      marginLeft: 5,
      color: darkMode ? black : secondaryColor,
    },
    shareIcon: {
      width: 30,
      height: 30,
    },
    shareHolder: {
      padding: 15,
      alignItems: 'center',
    },
  });
  return {
    headerRight: (
      <>
        {saving && (
          <View style={styles.saveHolder}>
            <ActivityIndicator
              size="small"
              animating={saving}
              color={darkMode ? black : secondaryColor}
            />
            <Text style={styles.saveText}>Saved</Text>
          </View>
        )}
        {!saving && (
          <TouchableOpacity onPress={onShare} style={styles.shareHolder}>
            {!firstTime && (
              <Image
                resizeMode="contain"
                style={styles.shareIcon}
                source={darkMode ? shareIconDark : shareIcon}
              />
            )}
          </TouchableOpacity>
        )}
      </>
    ),
    headerTintColor: headerTintColor(),
  };
};

export default NotesPage;
